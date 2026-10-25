<div align="center">

# 🛡️ ThreatSentinel
### Next-Gen Cybersecurity Vulnerability Scanner & Attack Surface Reconnaissance Suite

[![React](https://img.shields.io/badge/React-19.3-61DAFB?logo=react&logoColor=black&style=for-the-badge)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white&style=for-the-badge)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css&logoColor=white&style=for-the-badge)](https://tailwindcss.com/)
[![Python](https://img.shields.io/badge/Python-3.10%2B-3776AB?logo=python&logoColor=white&style=for-the-badge)](https://www.python.org/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?logo=vite&logoColor=white&style=for-the-badge)](https://vitejs.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)
[![Security: Zero-Leak](https://img.shields.io/badge/Secrets_Redaction-Active-00FF66?style=for-the-badge&logo=shield)](src/services/scannerEngine.ts)

<p align="center">
  <b>A high-performance dual-engine security suite combining a modern Webflow-inspired React 19 interface with a multithreaded Python reconnaissance core and real-time credential sanitization.</b>
</p>

[Explore Web Dashboard](#-quickstart---web-dashboard) • [Run Desktop GUI](#-python-core--desktop-gui) • [Features](#-key-features) • [Vulnerability Checks](#-supported-vulnerability-checks) • [Zero-Leak Engine](#-zero-leak-secrets-protection)

---

</div>

## 📌 Overview

**ThreatSentinel** is engineered for security researchers, DevSecOps teams, and ethical penetration testers. It automates surface recon, security header audits, path disclosure discovery, and injection vector detection across targets — featuring an interactive **360° Cyber Radar Canvas**, instant executive PDF/JSON report exports, and built-in **zero-leak credential redaction** to safeguard exposed API keys in scan reports.

ThreatSentinel offers two operational modalities:
1. **Interactive Web Dashboard**: React 19 + TypeScript + Tailwind CSS with hardware-accelerated Canvas threat telemetry.
2. **Native Python Core & Desktop GUI**: High-throughput multithreaded Python scanning engine with a Tkinter desktop console, ready for single-binary packaging via PyInstaller.

---

## ⚡ Key Features

- **🌐 Interactive 360° Cyber Radar Sweep**: Real-time HTML5 Canvas animation mapping detected threats dynamically with sound telemetry and spatial threat ping matrices.
- **🔒 Zero-Leak Credential Redaction Engine**: Real-time regex sanitization filtering OpenAI keys, AWS access tokens, GitHub tokens, JWTs, and database passwords from all output logs.
- **🔍 Deep Surface Reconnaissance**: Scans for exposed `.env`, `/.git/HEAD`, AWS credentials, `wp-config.php`, debug endpoints, and configuration disclosure.
- **🛡️ Transport & Security Header Audit**: Evaluates HSTS enforcement, Content Security Policy (CSP), Clickjacking defenses (`X-Frame-Options`), and MIME-type sniffing protections.
- **🌐 Advanced CORS Auditing**: Probes for wildcard `*` origins and origin reflection with `Access-Control-Allow-Credentials: true`.
- **💥 Injection & Anomaly Detection**: Heuristic detection for reflected XSS entry points and SQL injection error anomalies.
- **📊 Executive Audit & Compliance Export**: One-click JSON and Markdown security report generation with prioritized CVSS remediation guides.
- **📱 Fully Responsive Cyberpunk UI**: Tailored for desktop, tablet, and mobile with accessible navigation and zero layout shifting.

---

## 🔬 Supported Vulnerability Checks

| Check Name | Category | Severity | Detection Logic | Remediation |
| :--- | :--- | :---: | :--- | :--- |
| **Git Exposure** | Recon | `CRITICAL` | Directly accessible `/.git/HEAD` | Deny HTTP access to `/.git` in reverse proxy |
| **Env File Disclosure** | Recon | `CRITICAL` | Publicly reachable `/.env` configuration | Block web server access to dotfiles (`^\/\.env`) |
| **SQLi Heuristic** | Injection | `CRITICAL` | Database syntax error anomalies triggered | Use parameterized queries & prepared statements |
| **CORS Origin Reflection**| Network | `HIGH` | Dynamically reflects Origin with credentials enabled | Restrict to strict origin whitelist |
| **Reflected XSS** | Injection | `HIGH` | Unsanitized parameter reflected into DOM | Contextual HTML entity encoding & strict CSP |
| **Missing HSTS** | Transport | `MEDIUM` | `Strict-Transport-Security` header absent | Enforce `Strict-Transport-Security: max-age=31536000` |
| **Missing CSP** | Transport | `MEDIUM` | No `Content-Security-Policy` header set | Deploy granular CSP restricting script execution |
| **CORS Wildcard** | Network | `MEDIUM` | `Access-Control-Allow-Origin: *` on private endpoints | Explicitly declare permitted caller origins |
| **Clickjacking** | Defense | `LOW` | Missing `X-Frame-Options` / CSP `frame-ancestors` | Set `X-Frame-Options: DENY` |
| **MIME Sniffing** | Defense | `LOW` | `X-Content-Type-Options: nosniff` missing | Add `X-Content-Type-Options: nosniff` |

---

## 🛡️ Zero-Leak Secrets Protection

Exposing live API keys in scan reports or terminal logs is a critical hazard during security assessments. ThreatSentinel implements proactive regex masking across both the Web frontend and Python core engines:

```ts
// src/services/scannerEngine.ts
const SECRET_MASKS = [
  { regex: /sk-[a-zA-Z0-9_-]{20,}/gi, mask: '[REDACTED_OPENAI_KEY]' },
  { regex: /sk-ant-[a-zA-Z0-9_-]{20,}/gi, mask: '[REDACTED_ANTHROPIC_KEY]' },
  { regex: /AIza[0-9A-Za-z-_]{35}/gi, mask: '[REDACTED_GOOGLE_KEY]' },
  { regex: /AKIA[0-9A-Z]{16}/gi, mask: '[REDACTED_AWS_KEY]' },
  { regex: /gh[pousr]_[a-zA-Z0-9]{36,}/gi, mask: '[REDACTED_GITHUB_KEY]' },
  { regex: /eyJ[a-zA-Z0-9_-]{10,}\.eyJ[a-zA-Z0-9_-]{10,}\.[a-zA-Z0-9_-]{10,}/gi, mask: '[REDACTED_JWT_TOKEN]' }
];
```

Any detected credentials in headers, responses, or error traces are masked into safe replacement tokens before being rendered or persisted.

---

## 🚀 Quickstart - Web Dashboard

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### 1. Clone the Repository
```bash
git clone https://github.com/Tomoya0086/threat-sentinel.git
cd threat-sentinel
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Launch Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser to view the interactive dashboard.

### 4. Build for Production
```bash
npm run build
```
The optimized bundle is output to `dist/`, ready for zero-config deployment to Vercel, Netlify, or AWS CloudFront.

---

## 🐍 Python Core & Desktop GUI

For native, multithreaded desktop scanning outside the browser, ThreatSentinel includes a standalone Python suite.

### 1. Install Python Dependencies
```bash
cd python-engine
pip install -r requirements.txt
```

### 2. Launch the Desktop GUI
```bash
python scanner_gui.py
```

### 3. Run Headless CLI Scan
```bash
python scanner_core.py https://example.com
```

### 4. Compile Single Standalone Executable (PyInstaller)
```bash
pyinstaller --onefile --noconsole --name "ThreatSentinel" scanner_gui.py
```
The compiled binary will be placed inside `python-engine/dist/ThreatSentinel`.

---

## 📂 Repository Architecture

```text
threat-sentinel/
├── index.html                   # HTML entry point with security CSP & SEO meta
├── package.json                 # Project dependencies & build scripts
├── postcss.config.js            # PostCSS configuration for Tailwind
├── tailwind.config.js           # Cyberpunk-themed color system & animations
├── tsconfig.json                # TypeScript compiler configuration
├── vercel.json                  # Vercel deployment & client-side route rewrites
├── vite.config.ts               # Vite build pipeline
├── src/
│   ├── App.tsx                  # Root application controller & state machine
│   ├── index.css                # Global styles, scanline overlays & scrollbars
│   ├── main.tsx                 # React DOM mount point
│   ├── types.ts                 # Type definitions for findings & severity
│   ├── components/
│   │   ├── AboutSection.tsx     # Mission, ethical guidelines & system stats
│   │   ├── CyberRadarAnimation.tsx # HTML5 Canvas 360° radar sweep & threat pings
│   │   ├── FindingsTable.tsx    # Interactive filtered vulnerability table
│   │   ├── Footer.tsx           # Contact details, versioning & disclosures
│   │   ├── Navbar.tsx           # Responsive navigation with mobile drawer
│   │   ├── NotFoundPage.tsx     # Terminal-styled 404 error handler
│   │   ├── RemediationGuide.tsx # Actionable vulnerability remediation steps
│   │   └── ScanForm.tsx         # Target URL input with validation & error states
│   └── services/
│       └── scannerEngine.ts     # Scanning heuristics, CORS audit & secret masking
└── python-engine/
    ├── requirements.txt         # Python package dependencies
    ├── scanner_core.py          # Multithreaded Python scanner & secret scrubbers
    └── scanner_gui.py           # Tkinter desktop GUI with live thread telemetry
```

---

## ☁️ Deployment

### Deploy to Vercel (Recommended)
1. Fork or push this repository to your GitHub account.
2. Navigate to [vercel.com/new](https://vercel.com/new).
3. Import `threat-sentinel`.
4. Leave settings as default (Framework Preset: **Vite**).
5. Click **Deploy**.

`vercel.json` provides rewrite rules ensuring client-side navigation functions without 404 errors.

---

## ⚖️ Legal & Responsible Disclosure

> **DISCLAIMER:**  
> ThreatSentinel is intended **strictly for educational, defensive, and authorized penetration testing purposes**. Scanning external web applications, servers, or networks without explicit, written authorization from the owner is illegal and violates computer fraud regulations globally (e.g., CFAA in the United States, Computer Misuse Act in the UK, Section 66 of the Information Technology Act).  
> The creators and contributors assume no liability for misuse, damages, or unauthorized activities conducted with this tool.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request:
1. Fork the Project (`https://github.com/Tomoya0086/threat-sentinel/fork`)
2. Create your Feature Branch (`git checkout -b feature/AdvancedScanner`)
3. Commit your Changes (`git commit -m 'feat: Add HTTP/3 QUIC audit capability'`)
4. Push to the Branch (`git push origin feature/AdvancedScanner`)
5. Open a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for more information.

---

<div align="center">
  <b>Built with precision by <a href="https://github.com/Tomoya0086">Tomoya0086</a></b>
</div>
