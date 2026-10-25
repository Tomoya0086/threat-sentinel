"""
ThreatSentinel Scanner Core Engine
A modular, thread-safe web vulnerability scanner with callbacks, cancellation,
and automatic API key/secret scrubbing to prevent credential leakage.
"""

import sys
import re
import ssl
import json
import socket
import queue
import threading
from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional, Callable, List, Dict
from urllib.parse import urlparse, urljoin, urlencode, parse_qs, urlunparse

import requests
from requests.packages.urllib3.exceptions import InsecureRequestWarning
requests.packages.urllib3.disable_warnings(InsecureRequestWarning)
from bs4 import BeautifulSoup

# Secret redaction patterns to hide any exposed API keys or sensitive credentials
SECRET_PATTERNS = [
    (re.compile(r"sk-[a-zA-Z0-9_-]{20,}", re.IGNORECASE), "[REDACTED_OPENAI_KEY]"),
    (re.compile(r"sk-ant-[a-zA-Z0-9_-]{20,}", re.IGNORECASE), "[REDACTED_ANTHROPIC_KEY]"),
    (re.compile(r"AIza[0-9A-Za-z-_]{35}", re.IGNORECASE), "[REDACTED_GOOGLE_KEY]"),
    (re.compile(r"AKIA[0-9A-Z]{16}", re.IGNORECASE), "[REDACTED_AWS_KEY]"),
    (re.compile(r"gh[pousr]_[a-zA-Z0-9]{36,}", re.IGNORECASE), "[REDACTED_GITHUB_KEY]"),
    (re.compile(r"eyJ[a-zA-Z0-9_-]{10,}\.eyJ[a-zA-Z0-9_-]{10,}\.[a-zA-Z0-9_-]{10,}", re.IGNORECASE), "[REDACTED_JWT]"),
    (re.compile(r"(password|passwd|secret|api_key|apikey|access_token)\s*[:=]\s*['\"][^'\"]{4,}['\"]", re.IGNORECASE), r"\1: '***REDACTED***'"),
]

def mask_secrets(text: str) -> str:
    """Mask any detected API keys, tokens, or credentials in evidence/logs."""
    if not text:
        return ""
    masked = text
    for pattern, replacement in SECRET_PATTERNS:
        masked = pattern.sub(replacement, masked)
    return masked

@dataclass
class Finding:
    severity: str    # CRITICAL, HIGH, MEDIUM, LOW, INFO
    check: str
    url: str
    detail: str
    evidence: str = ""
    timestamp: str = field(default_factory=lambda: datetime.utcnow().isoformat() + "Z")

    def to_dict(self) -> Dict:
        return {
            "severity": self.severity,
            "check": self.check,
            "url": self.url,
            "detail": mask_secrets(self.detail),
            "evidence": mask_secrets(self.evidence),
            "timestamp": self.timestamp,
        }

SEV_ORDER = {"CRITICAL": 0, "HIGH": 1, "MEDIUM": 2, "LOW": 3, "INFO": 4}

SEC_HEADERS = {
    "Strict-Transport-Security": ("MEDIUM", "HSTS missing — MITM downgrade attack possible"),
    "Content-Security-Policy":   ("MEDIUM", "CSP missing — Reflected/Stored XSS cannot be contained"),
    "X-Frame-Options":           ("LOW",    "Clickjacking protection header absent"),
    "X-Content-Type-Options":    ("LOW",    "MIME-sniffing protection absent (nosniff)"),
    "Referrer-Policy":           ("INFO",   "Referrer-Policy header not set"),
    "Permissions-Policy":        ("INFO",   "Permissions-Policy header not configured"),
}

SENSITIVE_PATHS = [
    ("/.git/HEAD",         "CRITICAL", "Git repository exposed — full source code may be extracted"),
    ("/.env",              "CRITICAL", ".env file exposed — active database & API credentials at risk"),
    ("/wp-config.php.bak", "CRITICAL", "WordPress configuration backup leaked"),
    ("/.htpasswd",         "HIGH",     "Apache htpasswd credentials file exposed"),
    ("/backup.zip",        "HIGH",     "Site backup archive directly accessible"),
    ("/dump.sql",          "HIGH",     "Raw database SQL dump file exposed"),
    ("/phpinfo.php",       "HIGH",     "phpinfo() diagnostic leaks entire server configuration"),
    ("/admin",             "MEDIUM",   "Administrative console reachable without perimeter auth"),
    ("/phpmyadmin",        "MEDIUM",   "phpMyAdmin portal exposed to public internet"),
    ("/wp-admin",          "MEDIUM",   "WordPress administrative portal exposed"),
    ("/server-status",     "HIGH",     "Apache server-status internal monitoring panel exposed"),
    ("/.DS_Store",         "LOW",      "macOS .DS_Store metadata file exposes directory tree"),
    ("/robots.txt",        "INFO",     "robots.txt may disclose hidden or sensitive endpoints"),
    ("/crossdomain.xml",   "LOW",      "Flash crossdomain policy file detected — verify domain whitelist"),
]

REDIR_PARAMS = ["redirect", "url", "next", "return", "returnUrl", "goto", "dest", "r", "u"]
REDIR_PAYLOAD = "https://evil.example.com"

XSS_PAYLOADS = [
    '<script>alert(1)</script>',
    '"><script>alert(1)</script>',
    "'><img src=x onerror=alert(1)>",
    '<svg onload=alert(1)>',
]

SQLI_ERRORS = [
    "you have an error in your sql syntax",
    "unclosed quotation mark",
    "quoted string not properly terminated",
    "pg_query(): query failed",
    "warning: mysql",
    "sqlstate",
    "ora-01756",
    "sqlite_error",
    "microsoft sql native client",
    "odbc driver",
]
SQLI_PAYLOADS = ["'", '"', "' OR '1'='1", "' OR 1=1--"]

LFI_PAYLOADS = [
    "../../../etc/passwd",
    "..%2F..%2F..%2Fetc%2Fpasswd",
    "....//....//....//etc/passwd"
]

class VulnerabilityScanner:
    """
    Modular Vulnerability Scanner with live event callbacks.
    """
    def __init__(
        self,
        target: str,
        depth: int = 2,
        threads: int = 10,
        timeout: int = 8,
        on_log: Optional[Callable[[str], None]] = None,
        on_finding: Optional[Callable[[Finding], None]] = None,
        on_progress: Optional[Callable[[int, int], None]] = None,
    ):
        target = target.strip().rstrip("/")
        if not target.startswith(("http://", "https://")):
            target = "https://" + target
        self.target = target
        parsed = urlparse(target)
        self.origin = f"{parsed.scheme}://{parsed.netloc}"
        self.depth = depth
        self.threads = threads
        self.timeout = timeout

        self.on_log = on_log or (lambda msg: None)
        self.on_finding = on_finding or (lambda f: None)
        self.on_progress = on_progress or (lambda cur, tot: None)

        self.findings: List[Finding] = []
        self._stop_event = threading.Event()
        self._lock = threading.Lock()

        self.session = requests.Session()
        self.session.headers["User-Agent"] = "Mozilla/5.0 (compatible; ThreatSentinel/1.0; +https://threatsentinel.io)"

    def log(self, message: str):
        self.on_log(message)

    def add_finding(self, finding: Finding):
        finding.detail = mask_secrets(finding.detail)
        finding.evidence = mask_secrets(finding.evidence)
        with self._lock:
            self.findings.append(finding)
        self.on_finding(finding)

    def stop(self):
        """Signals the scan to terminate gracefully."""
        self._stop_event.set()
        self.log("[!] Scan cancellation requested.")

    def is_stopped(self) -> bool:
        return self._stop_event.is_set()

    def get(self, url: str, **kwargs) -> Optional[requests.Response]:
        if self.is_stopped():
            return None
        try:
            return self.session.get(
                url,
                timeout=self.timeout,
                verify=False,
                allow_redirects=kwargs.pop("allow_redirects", True),
                **kwargs
            )
        except Exception:
            return None

    def crawl(self) -> List[str]:
        self.log(f"[*] Crawling target: {self.origin}")
        visited = set()
        q = queue.Queue()
        q.put((self.target, 0))
        pages = []

        while not q.empty() and len(pages) < 150 and not self.is_stopped():
            url, depth = q.get()
            if url in visited or depth > self.depth:
                continue
            visited.add(url)
            r = self.get(url)
            if not r or "text/html" not in r.headers.get("Content-Type", ""):
                continue
            pages.append(url)
            self.log(f"[+] Discovered page: {url}")

            if depth < self.depth:
                try:
                    soup = BeautifulSoup(r.text, "html.parser")
                    for tag in soup.find_all(["a", "form"]):
                        href = tag.get("href") or tag.get("action") or ""
                        abs_url = urljoin(url, href).split("#")[0].split("?")[0]
                        if abs_url.startswith(self.origin) and abs_url not in visited:
                            q.put((abs_url, depth + 1))
                except Exception:
                    pass

        self.log(f"[*] Crawl complete. Found {len(pages)} unique pages.")
        return pages

    def check_ssl(self):
        parsed = urlparse(self.target)
        if parsed.scheme != "https":
            self.add_finding(Finding("HIGH", "Insecure Transport", self.target, "Site is served over plain unencrypted HTTP"))
            return

        try:
            ctx = ssl.create_default_context()
            port = parsed.port or 443
            with socket.create_connection((parsed.hostname, port), self.timeout) as s:
                with ctx.wrap_socket(s, server_hostname=parsed.hostname) as ss:
                    cert = ss.getpeercert()
                    exp_date = datetime.strptime(cert["notAfter"], "%b %d %H:%M:%S %Y %Z")
                    days_left = (exp_date - datetime.utcnow()).days
                    if days_left < 0:
                        self.add_finding(Finding("CRITICAL", "SSL Certificate Expired", self.target, f"Certificate expired {-days_left} days ago"))
                    elif days_left < 30:
                        self.add_finding(Finding("MEDIUM", "SSL Certificate Expiring", self.target, f"Certificate expires in {days_left} days"))
                    else:
                        self.add_finding(Finding("INFO", "SSL Certificate Valid", self.target, f"Valid for {days_left} more days"))
        except ssl.SSLCertVerificationError as e:
            self.add_finding(Finding("HIGH", "SSL Certificate Invalid", self.target, str(e)))
        except Exception:
            pass

    def check_sensitive_paths(self):
        self.log("[*] Probing sensitive server paths...")
        def probe(path, sev, msg):
            if self.is_stopped():
                return
            target_url = self.origin + path
            r = self.get(target_url, allow_redirects=False)
            if r and r.status_code in (200, 301, 302, 403):
                # Verify that 200 is not a custom SPA 404 page
                if r.status_code == 200 and "html" in r.headers.get("Content-Type", "").lower() and path.endswith((".env", ".sql", ".zip", "/HEAD")):
                    if "<!doctype html" in r.text.lower() or "<html" in r.text.lower():
                        return # Soft 404 SPA fallback
                self.add_finding(Finding(sev, "Sensitive Path Exposed", target_url, f"{msg} (HTTP {r.status_code})"))

        threads = [threading.Thread(target=probe, args=p) for p in SENSITIVE_PATHS]
        for t in threads:
            t.start()
        for t in threads:
            t.join()

    def check_headers(self, url: str, r: requests.Response):
        for header, (sev, msg) in SEC_HEADERS.items():
            if header not in r.headers:
                self.add_finding(Finding(sev, "Missing Security Header", url, f"{header}: {msg}"))

        if server := r.headers.get("Server", ""):
            self.add_finding(Finding("INFO", "Server Banner Disclosed", url, f"Server banner leaks: {mask_secrets(server)}"))
        if powered := r.headers.get("X-Powered-By", ""):
            self.add_finding(Finding("LOW", "Technology Disclosure", url, f"X-Powered-By leaks framework: {mask_secrets(powered)}"))

    def check_cors(self, url: str):
        r = self.get(url, headers={"Origin": "https://evil-attacker.example.com"})
        if not r:
            return
        acao = r.headers.get("Access-Control-Allow-Origin", "")
        acac = r.headers.get("Access-Control-Allow-Credentials", "").lower()
        if acao == "*":
            self.add_finding(Finding("MEDIUM", "Overly Permissive CORS", url, "Wildcard Access-Control-Allow-Origin: * allows any domain to read responses"))
        elif acao == "https://evil-attacker.example.com":
            sev = "HIGH" if acac == "true" else "MEDIUM"
            self.add_finding(Finding(sev, "CORS Origin Reflection", url, f"Server echoes arbitrary Origin headers ({acao})" + (" with credentials allowed" if sev == "HIGH" else "")))

    def check_open_redirect(self, url: str):
        parsed = urlparse(url)
        params = parse_qs(parsed.query)
        for p in REDIR_PARAMS:
            if p not in params:
                continue
            test_url = urlunparse(parsed._replace(
                query=urlencode({**params, p: [REDIR_PAYLOAD]}, doseq=True)
            ))
            r = self.get(test_url, allow_redirects=False)
            if r and r.status_code in (301, 302, 307, 308):
                if "evil.example.com" in r.headers.get("Location", ""):
                    self.add_finding(Finding("MEDIUM", "Open Redirect", url, f"Query parameter '{p}' causes unvalidated redirection to an external URL", evidence=r.headers.get("Location", "")))

    def check_xss(self, url: str):
        parsed = urlparse(url)
        params = parse_qs(parsed.query)
        if not params:
            return
        for param in params:
            for payload in XSS_PAYLOADS:
                if self.is_stopped():
                    return
                test_url = urlunparse(parsed._replace(
                    query=urlencode({**params, param: [payload]}, doseq=True)
                ))
                r = self.get(test_url)
                if r and payload in r.text:
                    self.add_finding(Finding("HIGH", "Reflected XSS", test_url, f"Parameter '{param}' echoes unsanitized markup directly into response", evidence=payload))
                    break

    def check_sqli(self, url: str):
        parsed = urlparse(url)
        params = parse_qs(parsed.query)
        if not params:
            return
        baseline_res = self.get(url)
        baseline = baseline_res.text.lower() if baseline_res else ""
        for param in params:
            for payload in SQLI_PAYLOADS:
                if self.is_stopped():
                    return
                test_url = urlunparse(parsed._replace(
                    query=urlencode({**params, param: [payload]}, doseq=True)
                ))
                r = self.get(test_url)
                if not r:
                    continue
                body = r.text.lower()
                for err in SQLI_ERRORS:
                    if err in body and err not in baseline:
                        self.add_finding(Finding("CRITICAL", "SQL Injection", test_url, f"Parameter '{param}' triggered database exception syntax error: {err}", evidence=payload))
                        return

    def check_lfi(self, url: str):
        parsed = urlparse(url)
        params = parse_qs(parsed.query)
        if not params:
            return
        for param in list(params)[:3]:
            for payload in LFI_PAYLOADS:
                if self.is_stopped():
                    return
                test_url = urlunparse(parsed._replace(
                    query=urlencode({**params, param: [payload]}, doseq=True)
                ))
                r = self.get(test_url)
                if r and "root:x:0:0" in r.text:
                    self.add_finding(Finding("CRITICAL", "Local File Inclusion (LFI)", test_url, f"Parameter '{param}' retrieved local server file /etc/passwd", evidence="root:x:0:0"))
                    return

    def check_csrf(self, url: str, r: requests.Response):
        try:
            soup = BeautifulSoup(r.text, "html.parser")
            for form in soup.find_all("form"):
                if (form.get("method") or "get").lower() != "post":
                    continue
                names = [i.get("name", "").lower() for i in form.find_all("input")]
                types = [i.get("type", "").lower() for i in form.find_all("input")]
                if not any("csrf" in n or "token" in n or "nonce" in n for n in names) and "hidden" not in types:
                    action = urljoin(url, form.get("action") or url)
                    self.add_finding(Finding("MEDIUM", "Possible CSRF Vulnerability", action, "State-modifying POST form lacks CSRF anti-forgery token"))
        except Exception:
            pass

    def check_dir_listing(self, url: str, r: requests.Response):
        body = r.text.lower()
        if any(s in body for s in ["index of /", "parent directory", "<title>index of"]):
            self.add_finding(Finding("MEDIUM", "Directory Listing Enabled", url, "Web server directory browsing is enabled, leaking file names"))

    def scan_page(self, url: str):
        if self.is_stopped():
            return
        r = self.get(url)
        if not r:
            return
        self.check_headers(url, r)
        self.check_dir_listing(url, r)
        self.check_csrf(url, r)
        self.check_xss(url)
        self.check_sqli(url)
        self.check_lfi(url)
        self.check_open_redirect(url)
        self.check_cors(url)

    def run(self) -> List[Finding]:
        self.log(f"[*] Starting vulnerability scan on {self.target}")
        self.check_ssl()
        if self.is_stopped():
            return self.findings

        self.check_sensitive_paths()
        if self.is_stopped():
            return self.findings

        pages = self.crawl()
        total_pages = len(pages)
        sem = threading.Semaphore(self.threads)

        for i, page_url in enumerate(pages, 1):
            if self.is_stopped():
                break
            self.on_progress(i, total_pages)
            with sem:
                self.scan_page(page_url)

        self.log(f"[*] Scan finished. {len(self.findings)} total findings identified.")
        return self.findings

    def generate_json_report(self) -> str:
        data = sorted(
            [f.to_dict() for f in self.findings],
            key=lambda x: SEV_ORDER.get(x["severity"], 9)
        )
        return json.dumps({
            "target": self.target,
            "scan_timestamp": datetime.utcnow().isoformat() + "Z",
            "total_findings": len(data),
            "findings": data
        }, indent=2)
