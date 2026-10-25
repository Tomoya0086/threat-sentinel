import React from 'react';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

interface NotFoundPageProps {
  onReturnHome: () => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onReturnHome }) => {
  return (
    <div className="min-h-[50vh] flex items-center justify-center p-6 text-center animate-in fade-in duration-150">
      <div className="max-w-md w-full bg-[#0B0F17] border border-zinc-800 rounded-lg p-8 space-y-4 shadow-2xl">
        <div className="w-12 h-12 rounded bg-rose-950/30 border border-rose-800/50 text-rose-400 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div className="text-3xl font-extrabold text-white font-mono-code">404</div>
        <h2 className="text-base font-bold text-white font-sans">Endpoint Not Found</h2>
        <p className="text-xs text-zinc-400 leading-relaxed font-sans">
          The requested audit route or security report does not exist or has expired.
        </p>
        <button
          onClick={onReturnHome}
          className="mt-3 px-4 py-2 rounded bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs inline-flex items-center gap-2 transition-colors border border-zinc-700 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Scanner Console</span>
        </button>
      </div>
    </div>
  );
};
