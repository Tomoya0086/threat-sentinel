import React, { useEffect, useRef } from 'react';

interface CyberRadarAnimationProps {
  isScanning: boolean;
  findingsCount: number;
}

interface RadarNode {
  x: number;
  y: number;
  angle: number;
  dist: number;
  size: number;
  alpha: number;
  isThreat: boolean;
  label: string;
}

export const CyberRadarAnimation: React.FC<CyberRadarAnimationProps> = ({ isScanning, findingsCount }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let sweepAngle = 0;
    const nodes: RadarNode[] = [];

    const updateDimensions = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = canvas.parentElement?.clientWidth || 400;
      const height = 260;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    // Initial Threat/Recon Nodes
    const threatLabels = ['PORT:443', 'PATH:/.git', 'CORS:REFL', 'HDR:HSTS', 'TOKEN:REDACT', 'SQL:ANOMALY', 'XSS:DOM', 'TLS:1.3'];
    const count = Math.max(10, Math.min(24, findingsCount > 0 ? findingsCount * 3 : 12));
    
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const d = 0.2 + Math.random() * 0.7; // percentage of radius
      nodes.push({
        x: 0,
        y: 0,
        angle: a,
        dist: d,
        size: Math.random() * 1.5 + 2,
        alpha: Math.random() * 0.6 + 0.3,
        isThreat: i < findingsCount,
        label: threatLabels[i % threatLabels.length]
      });
    }

    const render = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const maxRadius = Math.min(cx, cy) - 20;

      // 1. Tactical Cartesian Grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      const step = 40;
      for (let x = 0; x < w; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // 2. Concentric Radar Rings & Distance Marks
      const rings = [0.25, 0.5, 0.75, 1.0];
      rings.forEach((factor, idx) => {
        const r = maxRadius * factor;
        ctx.strokeStyle = idx === rings.length - 1 
          ? 'rgba(6, 182, 212, 0.3)' 
          : 'rgba(6, 182, 212, 0.12)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();

        // Distance text
        ctx.fillStyle = 'rgba(6, 182, 212, 0.4)';
        ctx.font = '9px monospace';
        ctx.fillText(`${Math.round(factor * 100)}m`, cx + 4, cy - r + 11);
      });

      // 3. Compass Crosshairs & Degree Labels
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.18)';
      ctx.beginPath();
      ctx.moveTo(cx - maxRadius, cy);
      ctx.lineTo(cx + maxRadius, cy);
      ctx.moveTo(cx, cy - maxRadius);
      ctx.lineTo(cx, cy + maxRadius);
      ctx.stroke();

      ctx.fillStyle = 'rgba(6, 182, 212, 0.6)';
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('000°', cx, cy - maxRadius - 6);
      ctx.fillText('180°', cx, cy + maxRadius + 14);
      ctx.fillText('270°', cx - maxRadius - 16, cy + 3);
      ctx.fillText('090°', cx + maxRadius + 16, cy + 3);
      ctx.textAlign = 'left';

      // 4. Sweep Beam Update
      sweepAngle += isScanning ? 0.035 : 0.008;
      if (sweepAngle >= Math.PI * 2) sweepAngle -= Math.PI * 2;

      // Draw Sweep Beam Trail (Phosphor Fan)
      const trailAngle = 0.5; // arc in radians
      ctx.save();
      const sweepGradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxRadius);
      sweepGradient.addColorStop(0, 'rgba(6, 182, 212, 0.35)');
      sweepGradient.addColorStop(1, 'rgba(6, 182, 212, 0.0)');

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, maxRadius, sweepAngle - trailAngle, sweepAngle, false);
      ctx.closePath();
      ctx.fillStyle = sweepGradient;
      ctx.fill();

      // Sharp Leading Edge
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.8)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(
        cx + Math.cos(sweepAngle) * maxRadius,
        cy + Math.sin(sweepAngle) * maxRadius
      );
      ctx.stroke();
      ctx.restore();

      // 5. Render Threat & Recon Nodes
      nodes.forEach((n) => {
        const nx = cx + Math.cos(n.angle) * (maxRadius * n.dist);
        const ny = cy + Math.sin(n.angle) * (maxRadius * n.dist);

        // Calculate angular difference to sweep beam
        let diff = sweepAngle - n.angle;
        while (diff < 0) diff += Math.PI * 2;
        while (diff >= Math.PI * 2) diff -= Math.PI * 2;

        const isPinged = diff < 0.25;

        ctx.beginPath();
        ctx.arc(nx, ny, isPinged ? n.size * 1.6 : n.size, 0, Math.PI * 2);

        if (n.isThreat) {
          ctx.fillStyle = isPinged ? 'rgba(239, 68, 68, 1.0)' : `rgba(239, 68, 68, ${n.alpha})`;
          ctx.shadowColor = '#ef4444';
          ctx.shadowBlur = isPinged ? 8 : 2;
        } else {
          ctx.fillStyle = isPinged ? 'rgba(16, 185, 129, 1.0)' : `rgba(6, 182, 212, ${n.alpha})`;
          ctx.shadowColor = '#06b6d4';
          ctx.shadowBlur = isPinged ? 6 : 1;
        }
        ctx.fill();
        ctx.shadowBlur = 0;

        // Draw HUD target bracket if pinged
        if (isPinged && (n.isThreat || isScanning)) {
          ctx.strokeStyle = n.isThreat ? 'rgba(239, 68, 68, 0.7)' : 'rgba(6, 182, 212, 0.6)';
          ctx.lineWidth = 1;
          const s = 7;
          ctx.strokeRect(nx - s, ny - s, s * 2, s * 2);

          ctx.fillStyle = n.isThreat ? 'rgba(239, 68, 68, 0.9)' : 'rgba(6, 182, 212, 0.8)';
          ctx.font = '8px monospace';
          ctx.fillText(n.label, nx + s + 3, ny + 3);
        }
      });

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', updateDimensions);
    };
  }, [isScanning, findingsCount]);

  return (
    <div className="relative w-full overflow-hidden rounded-lg bg-[#07090E] border border-zinc-800 p-4 my-6 shadow-2xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-2 border-b border-zinc-800/80">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          <span className="text-xs font-mono-code font-bold uppercase tracking-wider text-white">
            {isScanning ? 'RADAR TELEMETRY: ACTIVE RECONNAISSANCE SWEEP' : 'SURFACE RADAR: PASSIVE SCAN MONITOR'}
          </span>
        </div>
        <div className="flex items-center gap-4 text-[11px] font-mono-code text-zinc-400">
          <span>FREQ: 60Hz</span>
          <span>RANGE: 200m</span>
          <span className="text-cyan-400">STATUS: CALIBRATED</span>
        </div>
      </div>

      <div className="w-full flex justify-center py-2">
        <canvas ref={canvasRef} className="block cursor-crosshair" />
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80 text-[10px] font-mono-code text-zinc-500">
        <span>COORDINATES: SPHERICAL AZIMUTH / RANGE</span>
        <span>SECURITY LEVEL: ASSURANCE 4</span>
      </div>
    </div>
  );
};
