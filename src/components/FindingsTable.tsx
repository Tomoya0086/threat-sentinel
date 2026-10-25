import React, { useState } from 'react';
import { 
  AlertTriangle, 
  ShieldX, 
  AlertCircle, 
  Info, 
  CheckCircle, 
  Download, 
  Search, 
  Filter, 
  Eye, 
  Copy, 
  Check, 
  ExternalLink,
  ShieldCheck,
  Lock
} from 'lucide-react';
import { Finding, Severity } from '../types';

interface FindingsTableProps {
  findings: Finding[];
  targetUrl: string;
  isScanning: boolean;
  onExport: () => void;
}

const SEVERITY_CONFIG: Record<Severity, { bg: string; text: string; border: string; icon: any }> = {
  CRITICAL: { bg: 'bg-red-500/15', text: 'text-red-400', border: 'border-red-500/30', icon: ShieldX },
  HIGH: { bg: 'bg-orange-500/15', text: 'text-orange-400', border: 'border-orange-500/30', icon: AlertTriangle },
  MEDIUM: { bg: 'bg-yellow-500/15', text: 'text-yellow-400', border: 'border-yellow-500/30', icon: AlertCircle },
  LOW: { bg: 'bg-blue-500/15', text: 'text-blue-400', border: 'border-blue-500/30', icon: Info },
  INFO: { bg: 'bg-slate-500/15', text: 'text-slate-400', border: 'border-slate-500/30', icon: CheckCircle },
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

  // Calculate severity counts
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
    const text = `[${finding.severity}] ${finding.check}\nTarget: ${finding.url}\nDetails: ${finding.detail}\nRemediation: ${finding.remediation || 'N/A'}`;
    navigator.clipboard.writeText(text);
    setCopiedId(finding.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Severity Counters Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO'] as Severity[]).map((sev) => {
          const cfg = SEVERITY_CONFIG[sev];
          const Icon = cfg.icon;
          const isActive = filterSeverity === sev;
          return (
            <button
              key={sev}
              onClick={() => setFilterSeverity(isActive ? 'ALL' : sev)}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                isActive 
                  ? `${cfg.bg} ${cfg.border} ring-2 ring-cyan-500/40` 
                  : 'bg-[#0b1020] border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-[11px] font-bold tracking-wider ${cfg.text}`}>{sev}</span>
                <Icon className={`w-3.5 h-3.5 ${cfg.text}`} />
              </div>
              <div className="text-2xl font-extrabold text-white font-mono-code">
                {counts[sev]}
              </div>
            </button>
          );
        })}

        {/* Total Findings Card */}
        <button
          onClick={() => setFilterSeverity('ALL')}
          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
            filterSeverity === 'ALL'
              ? 'bg-cyan-500/10 border-cyan-500/40 ring-2 ring-cyan-500/40'
              : 'bg-[#0b1020] border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold tracking-wider text-cyan-400">TOTAL</span>
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono-code">
            {counts.TOTAL}
          </div>
        </button>
      </div>

      {/* Action and Search Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#0b1020]/90 p-3.5 rounded-xl border border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter vulnerabilities by name, URL, or detail..."
            className="w-full pl-9 pr-4 py-2 bg-[#070b14] border border-slate-700/60 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          {filterSeverity !== 'ALL' && (
            <button
              onClick={() => setFilterSeverity('ALL')}
              className="text-xs px-2.5 py-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white flex items-center gap-1 cursor-pointer"
            >
              Reset Filter ({filterSeverity})
            </button>
          )}

          <button
            onClick={onExport}
            disabled={findings.length === 0}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors border border-slate-700 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export Report (JSON)</span>
          </button>
        </div>
      </div>

      {/* Empty State (Rule 11: Empty State Page) */}
      {findings.length === 0 ? (
        <div className="bg-[#0b1020] border border-dashed border-slate-800 rounded-2xl p-10 text-center">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mx-auto mb-4 text-cyan-400">
            <Lock className="w-8 h-8 stroke-[1.75]" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">No Security Findings to Display</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
            Enter a target website URL above and click "Launch Vulnerability Scan" to begin automated security testing and attack surface auditing.
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Target credentials & API keys will be automatically masked</span>
          </div>
        </div>
      ) : filteredFindings.length === 0 ? (
        <div className="bg-[#0b1020] border border-slate-800 rounded-2xl p-8 text-center">
          <p className="text-slate-400 text-sm">No findings match your current filter query "{searchTerm}".</p>
          <button 
            onClick={() => { setSearchTerm(''); setFilterSeverity('ALL'); }}
            className="mt-3 text-xs text-cyan-400 underline cursor-pointer"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        /* Findings List (Cards for Mobile, Table for Desktop) */
        <div className="space-y-3">
          {filteredFindings.map((finding) => {
            const cfg = SEVERITY_CONFIG[finding.severity];
            const Icon = cfg.icon;
            return (
              <div
                key={finding.id}
                className="bg-[#0b1020] border border-slate-800/90 hover:border-slate-700 rounded-xl p-4 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <div className={`p-2 rounded-lg ${cfg.bg} border ${cfg.border} shrink-0 mt-0.5`}>
                    <Icon className={`w-4 h-4 ${cfg.text}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${cfg.bg} ${cfg.text} border ${cfg.border}`}>
                        {finding.severity}
                      </span>
                      <h4 className="text-sm font-bold text-white truncate">
                        {finding.check}
                      </h4>
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-2 mb-1.5 break-words">
                      {finding.detail}
                    </p>

                    <div className="flex items-center gap-2 text-[11px] text-cyan-400/80 font-mono-code break-all">
                      <span className="truncate max-w-full">{finding.url}</span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-800/80">
                  <button
                    onClick={() => handleCopyFinding(finding)}
                    className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    title="Copy finding details"
                  >
                    {copiedId === finding.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => setSelectedFinding(finding)}
                    className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Inspect</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Finding Detail Modal */}
      {selectedFinding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0e1424] border border-slate-700 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${SEVERITY_CONFIG[selectedFinding.severity].bg} ${SEVERITY_CONFIG[selectedFinding.severity].text} border ${SEVERITY_CONFIG[selectedFinding.severity].border}`}>
                  {selectedFinding.severity}
                </span>
                <h3 className="text-base font-bold text-white">{selectedFinding.check}</h3>
              </div>
              <button
                onClick={() => setSelectedFinding(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <div>
                <span className="text-slate-400 font-semibold block mb-1">Vulnerable Endpoint:</span>
                <div className="p-2.5 rounded-lg bg-[#070b14] border border-slate-800 text-cyan-400 font-mono-code break-all">
                  {selectedFinding.url}
                </div>
              </div>

              <div>
                <span className="text-slate-400 font-semibold block mb-1">Finding Description:</span>
                <p className="text-slate-200 leading-relaxed bg-[#070b14] p-3 rounded-lg border border-slate-800">
                  {selectedFinding.detail}
                </p>
              </div>

              {selectedFinding.evidence && (
                <div>
                  <span className="text-slate-400 font-semibold block mb-1">Technical Evidence (Sanitized):</span>
                  <pre className="p-3 rounded-lg bg-[#050811] border border-slate-800/80 text-amber-300 font-mono-code text-xs overflow-x-auto whitespace-pre-wrap break-all">
                    {selectedFinding.evidence}
                  </pre>
                </div>
              )}

              {selectedFinding.remediation && (
                <div>
                  <span className="text-slate-400 font-semibold block mb-1">Recommended Remediation:</span>
                  <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-800/40 text-emerald-300 text-xs sm:text-sm leading-relaxed">
                    {selectedFinding.remediation}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedFinding(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors cursor-pointer"
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
