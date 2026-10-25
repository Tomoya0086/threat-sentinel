import React, { useState } from 'react';
import { Play, Square, AlertCircle, CheckCircle2, Globe, SlidersHorizontal, Terminal, ShieldCheck, Activity } from 'lucide-react';

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
    { label: 'Target: Staging Host', url: 'https://portal-staging.threatsentinel.io' },
    { label: 'Target: API Sandbox', url: 'https://sandbox.threatsentinel.io/v1' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = targetUrl.trim();
    if (!trimmed) {
      setInputError('Please specify a target hostname or IP address.');
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
      setInputError('Invalid URI syntax. Please provide a fully qualified domain name (e.g. https://target.domain).');
    }
  };

  return (
    <div className="bg-[#0B0F17] border border-zinc-800 rounded-lg p-5 sm:p-6 shadow-xl space-y-4">
      {/* Alert Banners */}
      {errorMessage && (
        <div className="p-3.5 rounded bg-rose-950/20 border border-rose-800/50 flex items-start gap-3 text-rose-300 text-xs sm:text-sm animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold block text-rose-200 uppercase text-[11px] tracking-wider">Engine Scan Exception:</span>
            {errorMessage}
          </div>
        </div>
      )}

      {successMessage && (
        <div className="p-3.5 rounded bg-emerald-950/20 border border-emerald-800/50 flex items-start gap-3 text-emerald-300 text-xs sm:text-sm animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold block text-emerald-200 uppercase text-[11px] tracking-wider">Execution Completed:</span>
            {successMessage}
          </div>
        </div>
      )}

      {inputError && (
        <div className="p-3 rounded bg-amber-950/20 border border-amber-800/50 flex items-center gap-2.5 text-amber-300 text-xs sm:text-sm">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{inputError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Main URL Bar */}
        <div>
          <div className="flex items-center justify-between mb-2 text-xs font-mono-code text-zinc-400">
            <span className="flex items-center gap-1.5 uppercase tracking-wider text-zinc-300">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              Target Host Input Console:
            </span>
            <span className="text-zinc-500 hidden sm:inline">RFC 3986 COMPLIANT URI</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                <Globe className="w-4 h-4 text-cyan-400" />
              </div>
              <input
                type="text"
                value={targetUrl}
                onChange={(e) => {
                  setTargetUrl(e.target.value);
                  if (inputError) setInputError('');
                }}
                disabled={isScanning}
                placeholder="https://target-organization.com"
                className="w-full pl-10 pr-4 py-3 bg-[#07090E] border border-zinc-700/80 rounded text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-cyan-500 font-mono-code transition-colors"
              />
            </div>

            <div className="flex gap-2">
              {!isScanning ? (
                <button
                  type="submit"
                  className="flex-1 sm:flex-none px-6 py-3 rounded bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-colors cursor-pointer select-none"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Execute Audit</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onStopScan}
                  className="flex-1 sm:flex-none px-6 py-3 rounded bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-colors cursor-pointer select-none"
                >
                  <Square className="w-3.5 h-3.5 fill-current" />
                  <span>Abort Scan</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className={`p-3 rounded border transition-colors flex items-center justify-center cursor-pointer ${
                  showAdvanced 
                    ? 'bg-zinc-800 border-cyan-500/50 text-cyan-400' 
                    : 'bg-[#07090E] border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                }`}
                title="Toggle Scan Concurrency & Depth"
                aria-label="Scan Configuration"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Tactical Telemetry Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 py-1 text-[11px] font-mono-code text-zinc-400 border-y border-zinc-800/80">
          <div className="flex items-center gap-1.5 py-1">
            <span className="text-zinc-600">SCHEME:</span>
            <span className="text-cyan-400">HTTPS / TLS 1.3</span>
          </div>
          <div className="flex items-center gap-1.5 py-1">
            <span className="text-zinc-600">METHOD:</span>
            <span className="text-zinc-300">PASSIVE HEURISTIC</span>
          </div>
          <div className="flex items-center gap-1.5 py-1">
            <span className="text-zinc-600">THREADS:</span>
            <span className="text-zinc-300">{threads} CONCURRENT</span>
          </div>
          <div className="flex items-center gap-1.5 py-1">
            <span className="text-zinc-600">REDACTION:</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              ENFORCED
            </span>
          </div>
        </div>

        {/* Quick Benchmark Targets */}
        <div className="flex flex-wrap items-center gap-2 pt-0.5">
          <span className="text-xs text-zinc-400 font-mono-code">PRESETS:</span>
          {quickTargets.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setTargetUrl(item.url);
                setInputError('');
              }}
              className="text-xs font-mono-code px-2 py-1 rounded bg-[#07090E] border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors cursor-pointer"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Advanced Concurrency & Depth Settings */}
        {showAdvanced && (
          <div className="pt-3 border-t border-zinc-800/80 grid grid-cols-1 sm:grid-cols-2 gap-3 animate-in fade-in duration-150">
            <div className="bg-[#07090E] p-3 rounded border border-zinc-800">
              <div className="flex justify-between text-xs font-mono-code text-zinc-300 mb-1">
                <span>CRAWL HOPS:</span>
                <span className="text-cyan-400 font-bold">{depth} DEPTH</span>
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
              <span className="text-[11px] text-zinc-500 mt-1 block">Maximum recursive link recursion steps</span>
            </div>

            <div className="bg-[#07090E] p-3 rounded border border-zinc-800">
              <div className="flex justify-between text-xs font-mono-code text-zinc-300 mb-1">
                <span>THREAD CONCURRENCY:</span>
                <span className="text-cyan-400 font-bold">{threads} WORKERS</span>
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
              <span className="text-[11px] text-zinc-500 mt-1 block">Asynchronous parallel probe workers</span>
            </div>
          </div>
        )}

        {/* Live Progress HUD */}
        {isScanning && (
          <div className="pt-2 space-y-2 animate-in fade-in duration-150">
            <div className="flex justify-between text-xs font-mono-code">
              <span className="text-cyan-400 flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                <span>{progressStatus}</span>
              </span>
              <span className="text-white font-bold">{progressPercent}%</span>
            </div>
            <div className="w-full bg-zinc-900 h-1.5 overflow-hidden border border-zinc-800">
              <div
                className="bg-cyan-400 h-full transition-all duration-200 ease-out"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
