import React, { useEffect, useState } from 'react';

interface CyberWarpOverlayProps {
  triggerKey: string;
}

export const CyberWarpOverlay: React.FC<CyberWarpOverlayProps> = ({ triggerKey }) => {
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(true);
    const timer = setTimeout(() => setActive(false), 450);
    return () => clearTimeout(timer);
  }, [triggerKey]);

  if (!active) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {/* High-speed Laser Scanline Wipe */}
      <div className="absolute inset-x-0 h-1 bg-cyan-400 shadow-[0_0_20px_#00F0FF,0_0_40px_#00F0FF] animate-laser-sweep"></div>

      {/* Cyberpunk Glitch Slices */}
      <div className="absolute inset-0 bg-cyan-500/5 mix-blend-screen animate-pulse"></div>

      {/* Top & Bottom Holographic HUD telemetry flashes */}
      <div className="absolute top-2 left-4 font-mono-code text-[11px] text-cyan-400 tracking-widest uppercase flex items-center gap-2 bg-black/90 px-3 py-1 border border-cyan-500/50">
        <span className="w-2 h-2 bg-cyan-400 animate-ping"></span>
        <span>&gt;&gt; QUANTUM STATE SHIFT: {triggerKey.toUpperCase()} &lt;&lt;</span>
      </div>

      <div className="absolute bottom-2 right-4 font-mono-code text-[10px] text-emerald-400 tracking-wider bg-black/90 px-3 py-1 border border-emerald-500/50">
        <span>MEM_ALLOC: 0x7FFE • BUFFER_WARP_ACTIVE</span>
      </div>
    </div>
  );
};
