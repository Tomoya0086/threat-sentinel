import React, { useState } from 'react';
import { Shield, Menu, X, Mail, Phone, Lock, Scale, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  onOpenPrivacy?: () => void;
  onOpenTerms?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onTabChange, onOpenPrivacy, onOpenTerms }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'scanner', label: 'Vulnerability Scanner' },
    { id: 'remediation', label: 'Remediation Playbooks' },
    { id: 'about', label: 'Engine Architecture' },
  ];

  const handleNavClick = (id: string) => {
    onTabChange(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#08090D]/95 backdrop-blur-md border-b border-zinc-800/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Telemetry Indicator */}
          <div 
            className="flex items-center gap-3 cursor-pointer select-none"
            onClick={() => handleNavClick('scanner')}
          >
            <div className="w-9 h-9 rounded bg-zinc-900 border border-zinc-700/80 flex items-center justify-center text-cyan-400 shadow-sm">
              <Shield className="w-5 h-5 text-cyan-400 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight text-white">
                  ThreatSentinel
                </span>
                <span className="hidden sm:inline-block text-[11px] font-mono-code px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-cyan-400">
                  BUILD 2.4.0
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 font-mono-code">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>ZERO-LEAK ENGINE ONLINE</span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`px-3.5 py-1.5 rounded text-xs font-semibold tracking-wide transition-colors ${
                  currentTab === link.id
                    ? 'bg-zinc-800 text-white border border-zinc-700'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Direct Security Contact Actions (Clickable Email & Phone) */}
          <div className="hidden lg:flex items-center gap-3 text-xs font-mono-code text-zinc-400">
            <a 
              href="mailto:security@threatsentinel.io?subject=Security%20Assessment%20Inquiry" 
              className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors py-1 px-2.5 rounded bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700"
              title="Click to email security team"
            >
              <Mail className="w-3.5 h-3.5 text-cyan-400" />
              <span>security@threatsentinel.io</span>
            </a>
            <a 
              href="tel:+18005550199" 
              className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors py-1 px-2.5 rounded bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700"
              title="Direct incident hotline"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>+1 (800) 555-0199</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0A0D14] border-b border-zinc-800 px-4 pt-3 pb-6 space-y-4 animate-in fade-in duration-150">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`w-full text-left px-3.5 py-2.5 rounded text-sm font-semibold flex items-center justify-between ${
                  currentTab === link.id
                    ? 'bg-zinc-800 text-cyan-400 border border-zinc-700'
                    : 'text-zinc-300 hover:bg-zinc-900'
                }`}
              >
                <span>{link.label}</span>
                <span className="text-xs text-zinc-500 font-mono-code">SELECT</span>
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-zinc-800/80 space-y-2 text-xs font-mono-code">
            <a 
              href="mailto:security@threatsentinel.io"
              className="flex items-center gap-2 text-zinc-300 hover:text-cyan-400 py-2 px-3 rounded bg-zinc-900 border border-zinc-800"
            >
              <Mail className="w-3.5 h-3.5 text-cyan-400" />
              <span>security@threatsentinel.io</span>
            </a>
            <a 
              href="tel:+18005550199"
              className="flex items-center gap-2 text-zinc-300 hover:text-emerald-400 py-2 px-3 rounded bg-zinc-900 border border-zinc-800"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Direct: +1 (800) 555-0199</span>
            </a>
          </div>

          {(onOpenPrivacy || onOpenTerms) && (
            <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80 text-[11px] text-zinc-400">
              {onOpenPrivacy && (
                <button 
                  onClick={() => { onOpenPrivacy(); setMobileMenuOpen(false); }}
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy
                </button>
              )}
              {onOpenTerms && (
                <button 
                  onClick={() => { onOpenTerms(); setMobileMenuOpen(false); }}
                  className="hover:text-white transition-colors"
                >
                  Terms & Authorization
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </header>
  );
};
