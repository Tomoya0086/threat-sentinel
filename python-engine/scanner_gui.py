"""
ThreatSentinel Desktop GUI
Cross-platform (Windows & Linux) Vulnerability Scanner Interface.
Can be packaged directly into a standalone Windows .exe using:
    pip install pyinstaller requests beautifulsoup4
    pyinstaller --onefile --noconsole --name "ThreatSentinel" scanner_gui.py
"""

import os
import sys
import json
import threading
import tkinter as tk
from tkinter import ttk, messagebox, filedialog
from datetime import datetime

# Import the core scanner engine
from scanner_core import VulnerabilityScanner, Finding, SEV_ORDER, mask_secrets

COLOR_BG = "#0b0f19"
COLOR_CARD = "#111827"
COLOR_CARD_BORDER = "#1f2937"
COLOR_ACCENT = "#06b6d4"
COLOR_TEXT = "#f3f4f6"
COLOR_MUTED = "#9ca3af"

SEV_COLORS = {
    "CRITICAL": "#ef4444",
    "HIGH": "#f97316",
    "MEDIUM": "#eab308",
    "LOW": "#38bdf8",
    "INFO": "#94a3b8"
}

class ScannerGUI:
    def __init__(self, root: tk.Tk):
        self.root = root
        self.root.title("ThreatSentinel — Web Vulnerability Scanner")
        self.root.geometry("1024x720")
        self.root.minsize(800, 600)
        self.root.configure(bg=COLOR_BG)

        self.scanner: VulnerabilityScanner = None
        self.scan_thread: threading.Thread = None
        self.findings: list[Finding] = []

        self.setup_styles()
        self.build_ui()

    def setup_styles(self):
        style = ttk.Style()
        style.theme_use("clam")

        style.configure(".", background=COLOR_BG, foreground=COLOR_TEXT)
        style.configure("Card.TFrame", background=COLOR_CARD, relief="flat")
        style.configure("Header.TLabel", background=COLOR_BG, foreground=COLOR_ACCENT, font=("Segoe UI", 16, "bold"))
        style.configure("Sub.TLabel", background=COLOR_BG, foreground=COLOR_MUTED, font=("Segoe UI", 10))
        style.configure("Card.TLabel", background=COLOR_CARD, foreground=COLOR_TEXT, font=("Segoe UI", 10))
        style.configure("Muted.TLabel", background=COLOR_CARD, foreground=COLOR_MUTED, font=("Segoe UI", 9))

        style.configure("Primary.TButton", background=COLOR_ACCENT, foreground="#000000", font=("Segoe UI", 10, "bold"), borderwidth=0, padding=6)
        style.map("Primary.TButton", background=[("active", "#22d3ee"), ("disabled", "#374151")])

        style.configure("Danger.TButton", background="#dc2626", foreground="#ffffff", font=("Segoe UI", 10, "bold"), borderwidth=0, padding=6)
        style.map("Danger.TButton", background=[("active", "#ef4444"), ("disabled", "#374151")])

        style.configure("Treeview", background="#131b2e", foreground=COLOR_TEXT, fieldbackground="#131b2e", rowheight=26, font=("Segoe UI", 9))
        style.configure("Treeview.Heading", background="#1e293b", foreground=COLOR_TEXT, font=("Segoe UI", 9, "bold"))
        style.map("Treeview", background=[("selected", "#0284c7")])

    def build_ui(self):
        # Header Bar
        header_frame = tk.Frame(self.root, bg=COLOR_BG, padx=20, pady=14)
        header_frame.pack(fill="x")

        title_lbl = ttk.Label(header_frame, text="🛡️ ThreatSentinel Vulnerability Scanner", style="Header.TLabel")
        title_lbl.pack(anchor="w")
        sub_lbl = ttk.Label(header_frame, text="Automated zero-leak security analyzer with credential sanitization", style="Sub.TLabel")
        sub_lbl.pack(anchor="w")

        # Controls Card
        ctrl_card = ttk.Frame(self.root, style="Card.TFrame", padding=15)
        ctrl_card.pack(fill="x", padx=20, pady=5)

        # URL Input row
        url_frame = tk.Frame(ctrl_card, bg=COLOR_CARD)
        url_frame.pack(fill="x", pady=(0, 10))

        ttk.Label(url_frame, text="Target URL:", style="Card.TLabel").pack(side="left", padx=(0, 10))
        self.url_var = tk.StringVar(value="https://")
        self.url_entry = tk.Entry(url_frame, textvariable=self.url_var, bg="#1f2937", fg="#ffffff", insertbackground="#ffffff", font=("Segoe UI", 10), relief="flat")
        self.url_entry.pack(side="left", fill="x", expand=True, padx=(0, 10), ipady=5)

        self.btn_start = ttk.Button(url_frame, text="Start Scan", style="Primary.TButton", command=self.start_scan)
        self.btn_start.pack(side="left", padx=5)

        self.btn_stop = ttk.Button(url_frame, text="Stop", style="Danger.TButton", state="disabled", command=self.stop_scan)
        self.btn_stop.pack(side="left", padx=5)

        self.btn_export = ttk.Button(url_frame, text="Export JSON", command=self.export_report)
        self.btn_export.pack(side="left", padx=5)

        # Settings row
        set_frame = tk.Frame(ctrl_card, bg=COLOR_CARD)
        set_frame.pack(fill="x")

        ttk.Label(set_frame, text="Crawl Depth:", style="Card.TLabel").pack(side="left", padx=(0, 5))
        self.depth_var = tk.IntVar(value=2)
        ttk.Spinbox(set_frame, from_=1, to=5, textvariable=self.depth_var, width=4).pack(side="left", padx=(0, 20))

        ttk.Label(set_frame, text="Worker Threads:", style="Card.TLabel").pack(side="left", padx=(0, 5))
        self.threads_var = tk.IntVar(value=8)
        ttk.Spinbox(set_frame, from_=1, to=20, textvariable=self.threads_var, width=4).pack(side="left", padx=(0, 20))

        self.status_var = tk.StringVar(value="Ready to scan")
        self.status_lbl = ttk.Label(set_frame, textvariable=self.status_var, style="Muted.TLabel")
        self.status_lbl.pack(side="left", fill="x", expand=True)

        # Progress bar
        self.progress_bar = ttk.Progressbar(self.root, mode="determinate")
        self.progress_bar.pack(fill="x", padx=20, pady=(6, 2))

        # Severity Counter Badges
        badge_frame = tk.Frame(self.root, bg=COLOR_BG, padx=20, pady=5)
        badge_frame.pack(fill="x")

        self.badge_vars = {
            "CRITICAL": tk.StringVar(value="0"),
            "HIGH": tk.StringVar(value="0"),
            "MEDIUM": tk.StringVar(value="0"),
            "LOW": tk.StringVar(value="0"),
            "INFO": tk.StringVar(value="0"),
        }

        for sev, col in SEV_COLORS.items():
            b_box = tk.Frame(badge_frame, bg=COLOR_CARD, padx=12, pady=4)
            b_box.pack(side="left", padx=4)
            tk.Label(b_box, text=f"{sev}:", bg=COLOR_CARD, fg=col, font=("Segoe UI", 9, "bold")).pack(side="left")
            tk.Label(b_box, textvariable=self.badge_vars[sev], bg=COLOR_CARD, fg="#ffffff", font=("Segoe UI", 9, "bold")).pack(side="left", padx=(4, 0))

        # Treeview Findings Table
        table_frame = tk.Frame(self.root, bg=COLOR_BG, padx=20, pady=5)
        table_frame.pack(fill="both", expand=True)

        cols = ("severity", "check", "url", "detail")
        self.tree = ttk.Treeview(table_frame, columns=cols, show="headings", selectmode="browse")
        self.tree.heading("severity", text="Severity")
        self.tree.heading("check", text="Vulnerability Check")
        self.tree.heading("url", text="Vulnerable URL")
        self.tree.heading("detail", text="Finding Details")

        self.tree.column("severity", width=100, anchor="center")
        self.tree.column("check", width=180)
        self.tree.column("url", width=280)
        self.tree.column("detail", width=400)

        for sev, col in SEV_COLORS.items():
            self.tree.tag_configure(sev, foreground=col)

        scroll_y = ttk.Scrollbar(table_frame, orient="vertical", command=self.tree.yview)
        self.tree.configure(yscrollcommand=scroll_y.set)
        self.tree.pack(side="left", fill="both", expand=True)
        scroll_y.pack(side="right", fill="y")

        self.tree.bind("<<TreeviewSelect>>", self.on_select_finding)

        # Detail Inspector
        self.detail_text = tk.Text(self.root, height=4, bg="#0d1117", fg="#c9d1d9", font=("Consolas", 9), relief="flat", padx=10, pady=6)
        self.detail_text.pack(fill="x", padx=20, pady=(0, 10))
        self.detail_text.insert("1.0", "Select a vulnerability finding from the list above to view technical evidence.")
        self.detail_text.configure(state="disabled")

    def on_select_finding(self, event):
        selected = self.tree.selection()
        if not selected:
            return
        item = self.tree.item(selected[0])
        idx = int(item["text"])
        if 0 <= idx < len(self.findings):
            f = self.findings[idx]
            self.detail_text.configure(state="normal")
            self.detail_text.delete("1.0", "end")
            evidence_str = f" [Evidence: {f.evidence}]" if f.evidence else ""
            self.detail_text.insert("1.0", f"[{f.severity}] {f.check}\nURL: {f.url}\nDetail: {f.detail}{evidence_str}")
            self.detail_text.configure(state="disabled")

    def log_message(self, msg: str):
        self.root.after(0, lambda: self.status_var.set(msg))

    def on_finding_received(self, finding: Finding):
        def _add():
            idx = len(self.findings)
            self.findings.append(finding)
            self.tree.insert("", "end", text=str(idx), values=(
                finding.severity,
                finding.check,
                finding.url,
                finding.detail
            ), tags=(finding.severity,))
            
            # Update counter
            cur = int(self.badge_vars.get(finding.severity, tk.StringVar(value="0")).get())
            self.badge_vars[finding.severity].set(str(cur + 1))

        self.root.after(0, _add)

    def on_progress_updated(self, current: int, total: int):
        def _prog():
            if total > 0:
                self.progress_bar["maximum"] = total
                self.progress_bar["value"] = current
        self.root.after(0, _prog)

    def start_scan(self):
        target = self.url_var.get().strip()
        if not target or target == "https://":
            messagebox.showwarning("Target Required", "Please provide a valid website URL to scan.")
            return

        # Clear existing state
        self.findings.clear()
        for item in self.tree.get_children():
            self.tree.delete(item)
        for var in self.badge_vars.values():
            var.set("0")
        self.progress_bar["value"] = 0

        self.btn_start.configure(state="disabled")
        self.btn_stop.configure(state="normal")
        self.status_var.set("Initializing scan engine...")

        self.scanner = VulnerabilityScanner(
            target=target,
            depth=self.depth_var.get(),
            threads=self.threads_var.get(),
            on_log=self.log_message,
            on_finding=self.on_finding_received,
            on_progress=self.on_progress_updated
        )

        def _worker():
            try:
                self.scanner.run()
                self.root.after(0, lambda: messagebox.showinfo("Scan Completed", f"Scan finished with {len(self.findings)} findings."))
            except Exception as e:
                self.root.after(0, lambda: messagebox.showerror("Scan Error", str(e)))
            finally:
                self.root.after(0, self.reset_buttons)

        self.scan_thread = threading.Thread(target=_worker, daemon=True)
        self.scan_thread.start()

    def stop_scan(self):
        if self.scanner:
            self.scanner.stop()
            self.status_var.set("Scan cancellation in progress...")
            self.btn_stop.configure(state="disabled")

    def reset_buttons(self):
        self.btn_start.configure(state="normal")
        self.btn_stop.configure(state="disabled")
        self.status_var.set(f"Scan complete. Total findings: {len(self.findings)}")

    def export_report(self):
        if not self.findings:
            messagebox.showinfo("Export", "No findings to export. Run a scan first.")
            return
        path = filedialog.asksaveasfilename(
            defaultextension=".json",
            filetypes=[("JSON files", "*.json"), ("All files", "*.*")],
            title="Save Scan Report"
        )
        if path:
            report_data = {
                "scan_date": datetime.utcnow().isoformat() + "Z",
                "target": self.url_var.get(),
                "total_findings": len(self.findings),
                "findings": [f.to_dict() for f in self.findings]
            }
            with open(path, "w", encoding="utf-8") as f:
                json.dump(report_data, f, indent=2)
            messagebox.showinfo("Saved", f"Report saved successfully to {path}")

def main():
    root = tk.Tk()
    app = ScannerGUI(root)
    root.mainloop()

if __name__ == "__main__":
    main()
