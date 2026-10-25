import React from 'react';
import { Cpu, Terminal, ShieldAlert, Monitor, CheckCircle2 } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <div className="space-y-4 max-w-4xl mx-auto animate-in fade-in duration-150">
      <div className="bg-[#0B0F17] border border-zinc-800 rounded-lg p-5 sm:p-6 space-y-4">
        <h2 className="text-lg sm:text-xl font-bold text-white font-sans">
          ThreatSentinel Architecture & Desktop Build
        </h2>
        <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">
          ThreatSentinel is an offensive-defensive dual tool designed to give security engineers, developers, and red teams automated visibility into exposed attack vectors before malicious actors exploit them.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div className="p-3.5 rounded bg-[#07090E] border border-zinc-800">
            <h4 className="text-xs font-bold text-cyan-400 mb-1 flex items-center gap-1.5 font-mono-code">
              <ShieldAlert className="w-3.5 h-3.5" />
              Automated Credential Redaction
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              Every request response, log entry, and technical evidence artifact is evaluated against entropy heuristics. OpenAI, Anthropic, AWS, and Google API keys are sanitized before display.
            </p>
          </div>

          <div className="p-3.5 rounded bg-[#07090E] border border-zinc-800">
            <h4 className="text-xs font-bold text-cyan-400 mb-1 flex items-center gap-1.5 font-mono-code">
              <Cpu className="w-3.5 h-3.5" />
              Multi-Threaded Path Crawler
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              Thread-safe concurrent workers crawl and parse DOM elements, form action handlers, and link graphs to test for multi-hop injection vulnerabilities.
            </p>
          </div>
        </div>
      </div>

      {/* Standalone Desktop Executable Build Instructions */}
      <div className="bg-[#0B0F17] border border-zinc-800 rounded-lg p-5 sm:p-6 space-y-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded bg-zinc-900 text-cyan-400 border border-zinc-800">
            <Monitor className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white font-sans">Building the Standalone Desktop GUI</h3>
            <span className="text-[11px] text-zinc-400 font-mono-code">Cross-platform Tkinter GUI & PyInstaller packaging</span>
          </div>
        </div>

        <p className="text-xs text-zinc-300 leading-relaxed font-sans">
          The desktop scanner GUI (<code className="text-cyan-400 font-mono-code bg-zinc-900 px-1 py-0.5 rounded">python-engine/scanner_gui.py</code>) can be compiled into a single portable binary with PyInstaller:
        </p>

        <pre className="p-3.5 rounded bg-[#07090E] border border-zinc-800 text-cyan-300 font-mono-code text-[11px] overflow-x-auto whitespace-pre leading-relaxed">
{`# 1. Install dependencies
pip install -r python-engine/requirements.txt

# 2. Package into a single standalone binary
pyinstaller --onefile --noconsole --name "ThreatSentinel" python-engine/scanner_gui.py

# 3. Executable created inside:
# dist/ThreatSentinel`}
        </pre>

        <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium font-mono-code">
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
          <span>Python core engine and Tkinter GUI are fully packaged in python-engine/</span>
        </div>
      </div>
    </div>
  );
};
