import React from 'react';
import { ShieldCheck, Scale, X, FileText, Check } from 'lucide-react';

interface LegalModalProps {
  type: 'privacy' | 'terms' | null;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0B0F17] border border-zinc-800 rounded-lg max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[85vh] overflow-y-auto">
        <div className="flex items-start justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-zinc-900 border border-zinc-800 text-cyan-400">
              {type === 'privacy' ? <ShieldCheck className="w-5 h-5" /> : <Scale className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                {type === 'privacy' ? 'Data Sanitization & Privacy Policy' : 'Terms of Service & Authorized Assessment Agreement'}
              </h3>
              <p className="text-xs text-zinc-400">
                ThreatSentinel Security Protocol • Effective Date: October 2026
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1.5 rounded hover:bg-zinc-800 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {type === 'privacy' ? (
          <div className="space-y-4 text-xs sm:text-sm text-zinc-300 leading-relaxed">
            <section className="space-y-1.5">
              <h4 className="font-semibold text-white uppercase text-xs tracking-wider text-cyan-400">
                1. Local Execution & Zero Data Ingestion
              </h4>
              <p>
                ThreatSentinel executes scan operations client-side in the operator's browser session or inside the operator's local runtime environment. Target URLs, response bodies, and heuristic findings are never stored on external databases or shared with third-party advertising networks.
              </p>
            </section>

            <section className="space-y-1.5">
              <h4 className="font-semibold text-white uppercase text-xs tracking-wider text-cyan-400">
                2. Automated Secret Scrubbing Protocol
              </h4>
              <p>
                Any API keys, JSON Web Tokens (JWT), AWS credentials, or proprietary tokens detected in technical evidence are immediately processed through regular-expression entropy scrubbers (<code className="text-emerald-400 font-mono-code bg-zinc-900 px-1 py-0.5 rounded">maskSecrets()</code>). They are obfuscated prior to display or export.
              </p>
            </section>

            <section className="space-y-1.5">
              <h4 className="font-semibold text-white uppercase text-xs tracking-wider text-cyan-400">
                3. Tracking & Cookie Policy
              </h4>
              <p>
                This application employs zero tracking pixels, third-party analytics cookies, or behavioral fingerprinting scripts. Session state persists solely within ephemeral browser memory.
              </p>
            </section>
          </div>
        ) : (
          <div className="space-y-4 text-xs sm:text-sm text-zinc-300 leading-relaxed">
            <section className="space-y-1.5">
              <h4 className="font-semibold text-white uppercase text-xs tracking-wider text-cyan-400">
                1. Authorization Requirement
              </h4>
              <p>
                ThreatSentinel is explicitly intended for use by authorized security personnel, system administrators, and security researchers conducting tests upon infrastructure they legally own or hold written authorization to evaluate.
              </p>
            </section>

            <section className="space-y-1.5">
              <h4 className="font-semibold text-white uppercase text-xs tracking-wider text-cyan-400">
                2. Legal Compliance
              </h4>
              <p>
                Unauthorized reconnaissance, port scanning, or vulnerability probing against external targets without consent violates federal and international legislation, including the Computer Fraud and Abuse Act (CFAA, 18 U.S.C. § 1030) and the UK Computer Misuse Act 1990.
              </p>
            </section>

            <section className="space-y-1.5">
              <h4 className="font-semibold text-white uppercase text-xs tracking-wider text-cyan-400">
                3. Limitation of Liability
              </h4>
              <p>
                The developers and contributors of ThreatSentinel assume zero liability for damages, system downtime, regulatory violations, or unlawful use resulting from the deployment of this tool.
              </p>
            </section>
          </div>
        )}

        <div className="pt-4 border-t border-zinc-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Acknowledge & Close</span>
          </button>
        </div>
      </div>
    </div>
  );
};
