import React, { useEffect, useRef } from 'react';

interface CyberRadarAnimationProps {
  isScanning: boolean;
  findingsCount: number;
}

export const CyberRadarAnimation: React.FC<CyberRadarAnimationProps> = ({ isScanning, findingsCount }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let angle = 0;
    const targets: Array<{ x: number; y: number; size: number; alpha: number; isThreat: boolean }> = [];

    // Resize canvas
    const resize = () => {
      canvas.width = canvas.parentElement?.clientWidth || 400;
      canvas.height = 240;
    };
    resize();
    window.addEventListener('resize', resize);

    // Generate random nodes
    const count = Math.max(8, Math.min(24, findingsCount > 0 ? findingsCount * 2 : 12));
    for (let i = 0; i < count; i++) {
      targets.push({
        x: Math.random() * (canvas.width - 60) + 30,
        y: Math.random() * (canvas.height - 60) + 30,
        size: Math.random() * 2 + 2,
        alpha: Math.random() * 0.7 + 0.3,
        isThreat: i < findingsCount
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const radius = Math.min(cx, cy) - 15;

      // Draw background grid lines (Webflow matrix look)
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.08)';
      ctx.lineWidth = 1;

      for (let x = 0; x < canvas.width; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw Concentric Radar Circles
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.25)';
      ctx.lineWidth = 1;
      [0.3, 0.6, 0.9].forEach(factor => {
        ctx.beginPath();
        ctx.arc(cx, cy, radius * factor, 0, Math.PI * 2);
        ctx.stroke();
      });

      // Crosshairs
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.2)';
      ctx.beginPath();
      ctx.moveTo(cx - radius, cy);
      ctx.lineTo(cx + radius, cy);
      ctx.moveTo(cx, cy - radius);
      ctx.lineTo(cx, cy + radius);
      ctx.stroke();

      // Rotating Sweep Beam
      if (isScanning) {
        angle += 0.04;
      } else {
        angle += 0.01;
      }

      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      grad.addColorStop(0, 'rgba(6, 182, 212, 0.4)');
      grad.addColorStop(1, 'rgba(6, 182, 212, 0.0)');

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, angle, angle + 0.4);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.restore();

      // Draw Targets / Pings
      targets.forEach(t => {
        ctx.beginPath();
        ctx.arc(t.x, t.y, t.size, 0, Math.PI * 2);
        if (t.isThreat) {
          ctx.fillStyle = `rgba(239, 68, 68, ${t.alpha})`;
          ctx.shadowColor = '#ef4444';
          ctx.shadowBlur = 8;
        } else {
          ctx.fillStyle = `rgba(6, 182, 212, ${t.alpha})`;
          ctx.shadowColor = '#06b6d4';
          ctx.shadowBlur = 4;
        }
        ctx.fill();
        ctx.shadowBlur = 0;

        // Ping expansion when scanning
        if (isScanning) {
          t.alpha = (t.alpha + 0.02) % 1;
        }
      });

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, [isScanning, findingsCount]);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-[#070b16] border border-cyan-500/20 shadow-2xl p-4 my-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isScanning ? 'bg-cyan-400' : 'bg-emerald-400'} opacity-75`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${isScanning ? 'bg-cyan-500' : 'bg-emerald-500'}`}></span>
          </span>
          <span className="text-xs font-mono-code font-bold uppercase tracking-wider text-cyan-400">
            {isScanning ? 'Radar Sweep Active — Auditing Nodes' : 'Attack Surface Radar Idle'}
          </span>
        </div>
        <span className="text-[11px] font-mono-code text-slate-500">360° Real-Time Heuristics</span>
      </div>

      <div className="w-full flex justify-center">
        <canvas ref={canvasRef} className="w-full h-[240px] block" />
      </div>
    </div>
  );
};
