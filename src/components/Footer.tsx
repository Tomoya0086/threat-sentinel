import React from 'react';
import { Shield, Mail, Phone, Lock, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-slate-800/80 bg-[#070b14] py-12 text-slate-400 text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Shield className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-white text-base tracking-tight">ThreatSentinel</span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Automated offensive security simulation and attack surface intelligence. Protect your web properties against zero-day exposures and credential leakage.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <Lock className="w-3.5 h-3.5" />
              <span>Zero-Leak Credential Redaction Protocol Active</span>
            </div>
          </div>

          {/* Contact Col (Rule 6: Clickable Email, Rule 17: Clickable Phone) */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Direct Security Desk</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a 
                  href="mailto:security@threatsentinel.io?subject=Security%20Support" 
                  className="hover:text-cyan-400 transition-colors flex items-center gap-2 py-1"
                  title="Click to compose security inquiry email"
                >
                  <Mail className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>security@threatsentinel.io</span>
                </a>
              </li>
              <li>
                <a 
                  href="tel:+18005550199" 
                  className="hover:text-emerald-400 transition-colors flex items-center gap-2 py-1"
                  title="Click to dial security hotline"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>+1 (800) 555-0199</span>
                </a>
              </li>
              <li className="text-slate-500 text-[11px] pt-1">
                Mon - Fri: 24/7 Threat Telemetry
              </li>
            </ul>
          </div>

          {/* Legal / Policy */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Compliance & Docs</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <span className="text-slate-400 hover:text-white cursor-pointer transition-colors">
                  Vulnerability Disclosure Policy
                </span>
              </li>
              <li>
                <span className="text-slate-400 hover:text-white cursor-pointer transition-colors">
                  Zero False-Positive SLA
                </span>
              </li>
              <li>
                <span className="text-slate-400 hover:text-white cursor-pointer transition-colors">
                  Data Sanitization & Privacy
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} ThreatSentinel. All rights reserved. Zero-leak protection enabled.
          </div>
          <div className="flex items-center gap-1.5">
            <span>Built for high-assurance security engineering</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
