import React from 'react';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

interface NotFoundPageProps {
  onReturnHome: () => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onReturnHome }) => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6 text-center animate-in fade-in">
      <div className="max-w-md w-full bg-[#0b1020] border border-slate-800 rounded-2xl p-8 space-y-4 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div className="text-4xl font-extrabold text-white font-mono-code">404</div>
        <h2 className="text-xl font-bold text-white">Endpoint Not Found</h2>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
          The requested security dashboard route or audit report does not exist or has been relocated.
        </p>
        <button
          onClick={onReturnHome}
          className="mt-4 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs sm:text-sm inline-flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-cyan-500/20"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Vulnerability Scanner</span>
        </button>
      </div>
    </div>
  );
};
