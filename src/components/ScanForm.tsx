import React, { useState } from 'react';
import { Search, Play, Square, AlertCircle, CheckCircle2, Globe, SlidersHorizontal, Sparkles } from 'lucide-react';

interface ScanFormProps {
  onStartScan: (url: string, depth: number, threads: number) => void;
  onStopScan: () => void;
  isScanning: boolean;
  progressPercent: number;
  progressStatus: string;
  errorMessage: string | null;
  successMessage: string | null;
}

export const ScanForm: React.FC<ScanFormProps> = ({
  onStartScan,
  onStopScan,
  isScanning,
  progressPercent,
  progressStatus,
  errorMessage,
  successMessage
}) => {
  const [targetUrl, setTargetUrl] = useState('https://chemistry-virtual-14mxmgyg9-hoctf.vercel.app');
  const [depth, setDepth] = useState(2);
  const [threads, setThreads] = useState(8);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [inputError, setInputError] = useState('');

  const quickTargets = [
    { label: 'Target: ChemSpace (Vercel)', url: 'https://chemistry-virtual-14mxmgyg9-hoctf.vercel.app' },
    { label: 'Target: Staging Portal', url: 'https://portal-staging.threatsentinel.io' },
    { label: 'Target: API Sandbox', url: 'https://sandbox.threatsentinel.io/v1' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = targetUrl.trim();
    if (!trimmed) {
      setInputError('Please enter a target URL or domain.');
      return;
    }
    try {
      const formatted = trimmed.startsWith('http://') || trimmed.startsWith('https://') 
        ? trimmed 
        : `https://${trimmed}`;
      new URL(formatted);
      setInputError('');
      onStartScan(formatted, depth, threads);
    } catch {
      setInputError('Invalid URL format. Please provide a valid hostname (e.g. https://your-site.com).');
    }
  };

  return (
    <div className="bg-[#0b1020]/90 border border-slate-800/80 rounded-2xl p-5 sm:p-7 shadow-xl shadow-cyan-950/20 backdrop-blur-sm">
      {/* Notifications / Alerts (Rules 14 & 15) */}
      {errorMessage && (
        <div className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-red-300 text-sm animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold block text-red-200">Scan Error:</span>
            {errorMessage}
          </div>
        </div>
      )}

      {successMessage && (
        <div className="mb-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3 text-emerald-300 text-sm animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold block text-emerald-200">Scan Completed Successfully:</span>
            {successMessage}
          </div>
        </div>
      )}

      {inputError && (
        <div className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-2.5 text-amber-300 text-sm">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{inputError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Main URL Bar */}
        <div>
          <label htmlFor="target-input" className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Target Host or Web Application URL:
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Globe className="w-5 h-5 text-cyan-400" />
              </div>
              <input
                id="target-input"
                type="text"
                value={targetUrl}
                onChange={(e) => {
                  setTargetUrl(e.target.value);
                  if (inputError) setInputError('');
                }}
                disabled={isScanning}
                placeholder="https://example.com"
                className="w-full pl-11 pr-4 py-3.5 bg-[#070b14] border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all font-mono-code"
              />
            </div>

            <div className="flex gap-2">
              {!isScanning ? (
                <button
                  type="submit"
                  className="flex-1 sm:flex-none px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition-all transform active:scale-95 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Launch Vulnerability Scan</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onStopScan}
                  className="flex-1 sm:flex-none px-6 py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-red-500/25 transition-all cursor-pointer"
                >
                  <Square className="w-4 h-4 fill-current" />
                  <span>Cancel Scan</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className={`p-3.5 rounded-xl border transition-colors flex items-center justify-center ${
                  showAdvanced 
                    ? 'bg-slate-800 border-cyan-500/50 text-cyan-400' 
                    : 'bg-[#070b14] border-slate-700 text-slate-400 hover:text-white'
                }`}
                title="Toggle Scan Engine Settings"
                aria-label="Scan Engine Settings"
              >
                <SlidersHorizontal className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Targets / Benchmarks */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Quick Targets:
          </span>
          {quickTargets.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setTargetUrl(item.url);
                setInputError('');
              }}
              className="text-xs px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-300 hover:border-cyan-600/50 transition-colors cursor-pointer"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Advanced Configuration Panel */}
        {showAdvanced && (
          <div className="pt-4 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in">
            <div className="bg-[#070b14] p-3.5 rounded-xl border border-slate-800">
              <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1.5">
                <span>Crawl Depth:</span>
                <span className="text-cyan-400 font-mono-code">{depth} hops</span>
              </div>
              <input
                type="range"
                min="1"
                max="4"
                value={depth}
                onChange={(e) => setDepth(Number(e.target.value))}
                disabled={isScanning}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">Higher depth explores deeper multi-page links.</span>
            </div>

            <div className="bg-[#070b14] p-3.5 rounded-xl border border-slate-800">
              <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1.5">
                <span>Concurrency Threads:</span>
                <span className="text-cyan-400 font-mono-code">{threads} parallel</span>
              </div>
              <input
                type="range"
                min="2"
                max="16"
                step="2"
                value={threads}
                onChange={(e) => setThreads(Number(e.target.value))}
                disabled={isScanning}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">Parallel workers for path probing and heuristic checks.</span>
            </div>
          </div>
        )}

        {/* Live Scan Progress */}
        {isScanning && (
          <div className="pt-3 space-y-2 animate-in fade-in">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-cyan-400 flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                </span>
                {progressStatus}
              </span>
              <span className="text-slate-400 font-mono-code">{progressPercent}%</span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden border border-slate-800">
              <div
                className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 h-2.5 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
