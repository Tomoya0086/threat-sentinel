import React, { useState } from 'react';
import { Shield, ShieldAlert, Menu, X, Mail, Phone, ExternalLink } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onTabChange }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'scanner', label: 'Vulnerability Scanner' },
    { id: 'remediation', label: 'Remediation Guide' },
    { id: 'about', label: 'Security Architecture' },
  ];

  const handleNavClick = (id: string) => {
    onTabChange(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#070b14]/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => handleNavClick('scanner')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-cyan-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform duration-200">
              <Shield className="w-5 h-5 text-black stroke-[2.5]" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-400 bg-clip-text text-transparent">
                ThreatSentinel
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-400 border border-cyan-800/50">
                v1.2 Security
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentTab === link.id
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Quick Contact & Action (Rule 6: Clickable Email, Rule 17: Clickable Phone) */}
          <div className="hidden lg:flex items-center gap-4 text-xs font-medium text-slate-400">
            <a 
              href="mailto:security@threatsentinel.io?subject=Vulnerability%20Scan%20Support" 
              className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors py-1 px-2 rounded hover:bg-slate-800/40"
              title="Clickable Security Inquiries Email"
            >
              <Mail className="w-3.5 h-3.5 text-cyan-400" />
              <span>security@threatsentinel.io</span>
            </a>
            <a 
              href="tel:+18005550199" 
              className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors py-1 px-2 rounded hover:bg-slate-800/40"
              title="Direct Hotline"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>+1 (800) 555-0199</span>
            </a>
          </div>

          {/* Mobile Menu Hamburger (Rule 8: Mobile Menu) */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer (Rule 8 & 12: Mobile Optimization) */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0a0f1d] border-b border-slate-800 px-4 pt-3 pb-6 space-y-3 animate-in fade-in slide-in-from-top-3">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`w-full text-left px-4 py-3 rounded-xl text-base font-medium flex items-center justify-between ${
                  currentTab === link.id
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                <span>{link.label}</span>
                <span className="text-xs text-slate-500">→</span>
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-800/80 space-y-2 text-sm">
            <a 
              href="mailto:security@threatsentinel.io"
              className="flex items-center gap-2.5 text-slate-300 hover:text-cyan-400 py-2 px-3 rounded-lg bg-slate-900/60 border border-slate-800"
            >
              <Mail className="w-4 h-4 text-cyan-400" />
              <span>security@threatsentinel.io</span>
            </a>
            <a 
              href="tel:+18005550199"
              className="flex items-center gap-2.5 text-slate-300 hover:text-emerald-400 py-2 px-3 rounded-lg bg-slate-900/60 border border-slate-800"
            >
              <Phone className="w-4 h-4 text-emerald-400" />
              <span>Call: +1 (800) 555-0199</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
