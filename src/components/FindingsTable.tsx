import React, { useState } from 'react';
import { 
  AlertTriangle, 
  ShieldX, 
  AlertCircle, 
  Info, 
  CheckCircle, 
  Download, 
  Search, 
  Eye, 
  Copy, 
  Check, 
  ShieldCheck,
  Lock,
  Terminal,
  FileCode
} from 'lucide-react';
import { Finding, Severity } from '../types';

interface FindingsTableProps {
  findings: Finding[];
  targetUrl: string;
  isScanning: boolean;
  onExport: () => void;
}

const SEVERITY_CONFIG: Record<Severity, { bg: string; text: string; border: string; cvss: string; icon: any }> = {
  CRITICAL: { bg: 'bg-rose-950/40', text: 'text-rose-400', border: 'border-rose-800/80', cvss: '9.8', icon: ShieldX },
  HIGH: { bg: 'bg-orange-950/40', text: 'text-orange-400', border: 'border-orange-800/80', cvss: '7.5', icon: AlertTriangle },
  MEDIUM: { bg: 'bg-amber-950/40', text: 'text-amber-400', border: 'border-amber-800/80', cvss: '5.4', icon: AlertCircle },
  LOW: { bg: 'bg-sky-950/40', text: 'text-sky-400', border: 'border-sky-800/80', cvss: '3.1', icon: Info },
  INFO: { bg: 'bg-zinc-900', text: 'text-zinc-400', border: 'border-zinc-800', cvss: '0.0', icon: CheckCircle },
};

export const FindingsTable: React.FC<FindingsTableProps> = ({
  findings,
  targetUrl,
  isScanning,
  onExport
}) => {
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFinding, setSelectedFinding] = useState<Finding | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const counts = {
    CRITICAL: findings.filter(f => f.severity === 'CRITICAL').length,
    HIGH: findings.filter(f => f.severity === 'HIGH').length,
    MEDIUM: findings.filter(f => f.severity === 'MEDIUM').length,
    LOW: findings.filter(f => f.severity === 'LOW').length,
    INFO: findings.filter(f => f.severity === 'INFO').length,
    TOTAL: findings.length
  };

  const filteredFindings = findings.filter(f => {
    const matchesSev = filterSeverity === 'ALL' || f.severity === filterSeverity;
    const matchesSearch = 
      f.check.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.detail.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSev && matchesSearch;
  });

  const handleCopyFinding = (finding: Finding) => {
    const text = `[${finding.severity} - CVSS ${SEVERITY_CONFIG[finding.severity].cvss}] ${finding.check}\nTarget: ${finding.url}\nDetails: ${finding.detail}\nRemediation: ${finding.remediation || 'N/A'}`;
    navigator.clipboard.writeText(text);
    setCopiedId(finding.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Severity Counters Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO'] as Severity[]).map((sev) => {
          const cfg = SEVERITY_CONFIG[sev];
          const Icon = cfg.icon;
          const isActive = filterSeverity === sev;
          return (
            <button
              key={sev}
              onClick={() => setFilterSeverity(isActive ? 'ALL' : sev)}
              className={`p-3 rounded border text-left transition-colors cursor-pointer ${
                isActive 
                  ? `${cfg.bg} ${cfg.border} ring-1 ring-white/20` 
                  : 'bg-[#0B0F17] border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1 text-[11px] font-mono-code font-bold">
                <span className={cfg.text}>{sev}</span>
                <Icon className={`w-3.5 h-3.5 ${cfg.text}`} />
              </div>
              <div className="text-xl font-bold text-white font-mono-code">
                {counts[sev]}
              </div>
            </button>
          );
        })}

        {/* Total Findings Card */}
        <button
          onClick={() => setFilterSeverity('ALL')}
          className={`p-3 rounded border text-left transition-colors cursor-pointer ${
            filterSeverity === 'ALL'
              ? 'bg-zinc-800 border-zinc-600 ring-1 ring-white/20'
              : 'bg-[#0B0F17] border-zinc-800 hover:border-zinc-700'
          }`}
        >
          <div className="flex items-center justify-between mb-1 text-[11px] font-mono-code font-bold text-zinc-300">
            <span>TOTAL FINDINGS</span>
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-xl font-bold text-white font-mono-code">
            {counts.TOTAL}
          </div>
        </button>
      </div>

      {/* Filter and Export Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 bg-[#0B0F17] p-3 rounded border border-zinc-800">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search security findings by parameter, header, or CVE..."
            className="w-full pl-8 pr-3 py-1.5 bg-[#07090E] border border-zinc-700/80 rounded text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-cyan-500 font-mono-code transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          {filterSeverity !== 'ALL' && (
            <button
              onClick={() => setFilterSeverity('ALL')}
              className="text-xs font-mono-code px-2 py-1.5 rounded bg-zinc-800 text-zinc-300 hover:text-white transition-colors cursor-pointer"
            >
              RESET [{filterSeverity}]
            </button>
          )}

          <button
            onClick={onExport}
            disabled={findings.length === 0}
            className="px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold text-zinc-200 flex items-center gap-1.5 transition-colors border border-zinc-700 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>EXPORT AUDIT (JSON)</span>
          </button>
        </div>
      </div>

      {/* Empty State */}
      {findings.length === 0 ? (
        <div className="bg-[#0B0F17] border border-dashed border-zinc-800 rounded-lg p-10 text-center">
          <div className="w-12 h-12 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-3 text-cyan-400">
            <Lock className="w-6 h-6 stroke-[1.8]" />
          </div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1 font-mono-code">No Audit Results Available</h3>
          <p className="text-xs text-zinc-400 max-w-md mx-auto mb-4">
            Specify a target URL in the console above and trigger "Execute Audit" to run automated non-destructive surface heuristics.
          </p>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-[11px] font-mono-code text-zinc-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Entropy Scrubber Active: Sensitive API Keys Auto-Redacted</span>
          </div>
        </div>
      ) : filteredFindings.length === 0 ? (
        <div className="bg-[#0B0F17] border border-zinc-800 rounded-lg p-8 text-center font-mono-code text-xs">
          <p className="text-zinc-400">No telemetry records match query: "{searchTerm}".</p>
          <button 
            onClick={() => { setSearchTerm(''); setFilterSeverity('ALL'); }}
            className="mt-2 text-cyan-400 underline cursor-pointer"
          >
            Clear Search Filters
          </button>
        </div>
      ) : (
        /* Findings List */
        <div className="space-y-2">
          {filteredFindings.map((finding) => {
            const cfg = SEVERITY_CONFIG[finding.severity];
            const Icon = cfg.icon;
            return (
              <div
                key={finding.id}
                className="bg-[#0B0F17] border border-zinc-800 hover:border-zinc-700 rounded p-3.5 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-mono-code text-xs"
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className={`p-1.5 rounded ${cfg.bg} border ${cfg.border} shrink-0 mt-0.5`}>
                    <Icon className={`w-3.5 h-3.5 ${cfg.text}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${cfg.bg} ${cfg.text} border ${cfg.border}`}>
                        {finding.severity} (CVSS {cfg.cvss})
                      </span>
                      <h4 className="text-xs font-bold text-white truncate font-sans">
                        {finding.check}
                      </h4>
                    </div>

                    <p className="text-xs text-zinc-400 font-sans line-clamp-2 mb-1.5 break-words">
                      {finding.detail}
                    </p>

                    <div className="text-[11px] text-cyan-400/80 truncate">
                      {finding.url}
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-zinc-800">
                  <button
                    onClick={() => handleCopyFinding(finding)}
                    className="p-1.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-colors cursor-pointer"
                    title="Copy finding details"
                  >
                    {copiedId === finding.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => setSelectedFinding(finding)}
                    className="px-2.5 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-cyan-400" />
                    <span>INSPECT</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Finding Detail Modal */}
      {selectedFinding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-[#0B0F17] border border-zinc-700 rounded-lg max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-mono-code font-bold px-2 py-0.5 rounded ${SEVERITY_CONFIG[selectedFinding.severity].bg} ${SEVERITY_CONFIG[selectedFinding.severity].text} border ${SEVERITY_CONFIG[selectedFinding.severity].border}`}>
                  {selectedFinding.severity}
                </span>
                <h3 className="text-sm sm:text-base font-bold text-white">{selectedFinding.check}</h3>
              </div>
              <button
                onClick={() => setSelectedFinding(null)}
                className="text-zinc-400 hover:text-white p-1 rounded hover:bg-zinc-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-zinc-400 font-mono-code font-semibold block mb-1">TARGET RESOURCE:</span>
                <div className="p-2.5 rounded bg-[#07090E] border border-zinc-800 text-cyan-400 font-mono-code break-all">
                  {selectedFinding.url}
                </div>
              </div>

              <div>
                <span className="text-zinc-400 font-mono-code font-semibold block mb-1">ANALYSIS & IMPACT:</span>
                <p className="text-zinc-300 leading-relaxed bg-[#07090E] p-3 rounded border border-zinc-800">
                  {selectedFinding.detail}
                </p>
              </div>

              {selectedFinding.evidence && (
                <div>
                  <span className="text-zinc-400 font-mono-code font-semibold block mb-1">SANITIZED TECHNICAL EVIDENCE:</span>
                  <pre className="p-3 rounded bg-[#07090E] border border-zinc-800 text-amber-300 font-mono-code text-[11px] overflow-x-auto whitespace-pre-wrap break-all">
                    {selectedFinding.evidence}
                  </pre>
                </div>
              )}

              {selectedFinding.remediation && (
                <div>
                  <span className="text-zinc-400 font-mono-code font-semibold block mb-1">VERIFIED REMEDIATION:</span>
                  <div className="p-3 rounded bg-emerald-950/20 border border-emerald-800/40 text-emerald-300 leading-relaxed">
                    {selectedFinding.remediation}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-zinc-800 flex justify-end">
              <button
                onClick={() => setSelectedFinding(null)}
                className="px-4 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white transition-colors cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
