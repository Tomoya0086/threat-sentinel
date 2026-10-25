import React from 'react';
import { Cpu, Terminal, ShieldAlert, Monitor, CheckCircle2 } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in">
      <div className="bg-[#0b1020] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-white">
          ThreatSentinel Architecture & Desktop Build
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed">
          ThreatSentinel is an offensive-defensive dual tool designed to give security engineers, developers, and red teams automated visibility into exposed attack vectors before malicious actors exploit them.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-[#070b14] border border-slate-800">
            <h4 className="text-sm font-bold text-cyan-400 mb-1 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" />
              Automated Credential Redaction
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every request response, log entry, and technical evidence artifact is evaluated against entropy heuristics. OpenAI, Anthropic, AWS, and Google API keys are sanitized before display.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#070b14] border border-slate-800">
            <h4 className="text-sm font-bold text-cyan-400 mb-1 flex items-center gap-2">
              <Cpu className="w-4 h-4" />
              Multi-Threaded Path Crawler
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Thread-safe concurrent workers crawl and parse DOM elements, form action handlers, and link graphs to test for multi-hop injection vulnerabilities.
            </p>
          </div>
        </div>
      </div>

      {/* Windows .EXE Build Instructions */}
      <div className="bg-[#0b1020] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Monitor className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Building the Windows Desktop GUI (.exe)</h3>
            <span className="text-xs text-slate-400">Compile standalone executable without Python dependency on Windows</span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          The desktop scanner GUI (<code className="text-cyan-300 font-mono-code bg-slate-900 px-1.5 py-0.5 rounded">scanner_gui.py</code>) has been generated in your workspace. You can package it into a single portable Windows executable with PyInstaller:
        </p>

        <pre className="p-4 rounded-xl bg-[#060a14] border border-slate-800/80 text-cyan-300 font-mono-code text-xs overflow-x-auto whitespace-pre leading-relaxed">
{`# 1. Install dependencies
pip install pyinstaller requests beautifulsoup4

# 2. Package into a single standalone Windows .exe
pyinstaller --onefile --noconsole --name "ThreatSentinel" scanner_gui.py

# 3. Executable will be located at:
# dist/ThreatSentinel.exe`}
        </pre>

        <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Both scanner_core.py and scanner_gui.py are written and ready in your root directory.</span>
        </div>
      </div>
    </div>
  );
};
