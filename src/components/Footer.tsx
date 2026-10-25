import React from 'react';
import { Shield, Mail, Phone, Lock, Terminal, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onOpenPrivacy?: () => void;
  onOpenTerms?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPrivacy, onOpenTerms }) => {
  return (
    <footer className="mt-20 border-t border-zinc-800/90 bg-[#07090E] py-12 text-zinc-400 text-xs sm:text-sm font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded bg-zinc-900 border border-zinc-700/80 flex items-center justify-center text-cyan-400">
                <Shield className="w-4 h-4 stroke-[2.2]" />
              </div>
              <span className="font-bold text-white text-base tracking-tight">ThreatSentinel</span>
            </div>
            <p className="text-xs text-zinc-400 max-w-sm leading-relaxed">
              Automated offensive security simulation and attack surface intelligence suite. Engineered for high-assurance vulnerability discovery and proactive credential protection.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono-code text-emerald-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Zero-Leak Redaction Active: Entropy Key Masking</span>
            </div>
          </div>

          {/* Contact Col */}
          <div className="space-y-3 font-mono-code">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Direct Security Desk</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a 
                  href="mailto:security@threatsentinel.io?subject=Security%20Inquiry" 
                  className="hover:text-cyan-400 transition-colors flex items-center gap-2 py-0.5"
                  title="Click to compose security inquiry email"
                >
                  <Mail className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>security@threatsentinel.io</span>
                </a>
              </li>
              <li>
                <a 
                  href="tel:+18005550199" 
                  className="hover:text-emerald-400 transition-colors flex items-center gap-2 py-0.5"
                  title="Click to dial security hotline"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>+1 (800) 555-0199</span>
                </a>
              </li>
              <li className="text-zinc-500 text-[11px] pt-1">
                Mon - Fri: 24/7 Threat Telemetry
              </li>
            </ul>
          </div>

          {/* Compliance & Legal Policies */}
          <div className="space-y-3 font-mono-code">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Compliance & Governance</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button 
                  onClick={onOpenPrivacy}
                  className="text-zinc-400 hover:text-cyan-400 cursor-pointer transition-colors text-left"
                >
                  Privacy & Data Sanitization
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenTerms}
                  className="text-zinc-400 hover:text-cyan-400 cursor-pointer transition-colors text-left"
                >
                  Terms & Authorized Testing
                </button>
              </li>
              <li>
                <a 
                  href="https://cve.mitre.org" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-zinc-400 hover:text-cyan-400 cursor-pointer transition-colors"
                >
                  MITRE CVE Harmonization
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono-code text-zinc-500">
          <div>
            © {new Date().getFullYear()} ThreatSentinel Systems. All rights reserved.
          </div>
          <div className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-zinc-600" />
            <span>High-Assurance Security Architecture</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
