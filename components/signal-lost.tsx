'use client';

import { useEffect, useRef } from 'react';

// ── Canvas background (same nebula as login, adapted for mobile) ──────────

function initSignalLostBg(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d')!;
  let W = 0, H = 0;
  let animId: number;
  let glitchTimer = 0;
  let glitchActive = false;
  let glitchIntensity = 0;

  type Star = { x: number; y: number; r: number; a: number; ts: number; to: number };
  let stars: Star[] = [];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    stars = Array.from({ length: Math.floor((W * H) / 1800) }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.2 + 0.2, a: Math.random() * 0.8 + 0.2,
      ts: Math.random() * 0.02 + 0.005, to: Math.random() * Math.PI * 2,
    }));
  }

  function drawBg() {
    // Deep space gradient
    const g = ctx.createRadialGradient(W * 0.5, H * 0.35, 0, W * 0.5, H * 0.35, Math.max(W, H) * 0.9);
    g.addColorStop(0, '#16122a');
    g.addColorStop(0.3, '#0e0c1e');
    g.addColorStop(0.7, '#080812');
    g.addColorStop(1, '#040408');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    // Nebula clouds — red/purple theme (signal collapse)
    const clouds = [
      { x: W * 0.2,  y: H * 0.15, r: W * 0.7,  c: [120, 40, 200], a: 0.12 },
      { x: W * 0.8,  y: H * 0.25, r: W * 0.5,  c: [200, 50, 80],  a: 0.10 },
      { x: W * 0.5,  y: H * 0.5,  r: W * 0.6,  c: [60, 30, 160],  a: 0.08 },
      { x: W * 0.1,  y: H * 0.7,  r: W * 0.4,  c: [180, 40, 60],  a: 0.07 },
      { x: W * 0.9,  y: H * 0.8,  r: W * 0.45, c: [80, 20, 140],  a: 0.06 },
    ];
    for (const cl of clouds) {
      const ng = ctx.createRadialGradient(cl.x, cl.y, 0, cl.x, cl.y, cl.r);
      ng.addColorStop(0, `rgba(${cl.c.join(',')},${cl.a})`);
      ng.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = ng;
      ctx.fillRect(0, 0, W, H);
    }
  }

  function drawStars(t: number) {
    for (const s of stars) {
      const tw = 0.5 + 0.5 * Math.sin(t * s.ts + s.to);
      const flicker = glitchActive ? Math.random() : 1;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200,210,255,${s.a * (0.5 + 0.5 * tw) * flicker})`;
      ctx.fill();
    }
  }

  function drawGlitch(t: number) {
    if (!glitchActive) return;

    // Horizontal scan lines (glitch effect)
    const lineCount = Math.floor(glitchIntensity * 8);
    for (let i = 0; i < lineCount; i++) {
      const y = Math.random() * H;
      const h = Math.random() * 4 + 1;
      const offset = (Math.random() - 0.5) * 30 * glitchIntensity;
      const alpha = Math.random() * 0.15 * glitchIntensity;

      // Copy and shift a horizontal slice
      try {
        const imageData = ctx.getImageData(0, y, W, h);
        ctx.putImageData(imageData, offset, y);
      } catch { /* ignore */ }

      // Color aberration overlay
      ctx.fillStyle = `rgba(${Math.random() > 0.5 ? '255,0,80' : '0,150,255'},${alpha})`;
      ctx.fillRect(0, y, W, h);
    }

    // Vertical RGB split
    if (glitchIntensity > 0.5) {
      ctx.fillStyle = `rgba(255,0,80,0.03)`;
      ctx.fillRect(Math.random() * 4, 0, W, H);
      ctx.fillStyle = `rgba(0,150,255,0.03)`;
      ctx.fillRect(-Math.random() * 4, 0, W, H);
    }
  }

  function drawVignette() {
    const g = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, Math.max(W,H) * 0.75);
    g.addColorStop(0, 'rgba(0,0,0,0)');
    g.addColorStop(1, 'rgba(0,0,0,0.7)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  }

  // Glitch trigger — random intervals
  function scheduleGlitch() {
    const delay = 2000 + Math.random() * 4000;
    setTimeout(() => {
      glitchActive = true;
      glitchIntensity = 0.3 + Math.random() * 0.7;
      const duration = 80 + Math.random() * 200;
      setTimeout(() => {
        glitchActive = false;
        glitchIntensity = 0;
        scheduleGlitch();
      }, duration);
    }, delay);
  }

  function render(t: number) {
    ctx.clearRect(0, 0, W, H);
    drawBg();
    drawStars(t);
    drawGlitch(t);
    drawVignette();
    animId = requestAnimationFrame(render);
  }

  resize();
  window.addEventListener('resize', resize);
  animId = requestAnimationFrame(render);
  scheduleGlitch();

  return () => {
    cancelAnimationFrame(animId);
    window.removeEventListener('resize', resize);
  };
}

// ── Component ─────────────────────────────────────────────────────────────

export default function SignalLost() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    return initSignalLostBg(canvasRef.current);
  }, []);

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#040408', overflow: 'hidden' }}>
      {/* Canvas background */}
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />

      {/* Grain overlay */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.04, pointerEvents: 'none' }}>
        <svg width="100%" height="100%">
          <filter id="sl-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
          </filter>
          <rect width="100%" height="100%" filter="url(#sl-noise)"/>
        </svg>
      </div>

      {/* Content */}
      <div style={{
        position: 'relative', zIndex: 10,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        height: '100%', padding: '40px 32px',
        textAlign: 'center',
      }}>

        {/* Top status bar */}
        <div style={{
          position: 'absolute', top: 32, left: 0, right: 0,
          display: 'flex', justifyContent: 'center', gap: 20,
          fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
          color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em',
        }}>
          <span>SYS://CYBER-PORTAL</span>
          <span style={{ color: 'rgba(255,60,80,0.6)' }}>◉ OFFLINE</span>
        </div>

        {/* Signal Lost title with glitch effect */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{
            fontFamily: '"Space Grotesk", sans-serif',
            fontSize: 'clamp(32px, 10vw, 48px)',
            fontWeight: 700,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: '#ffffff',
            textShadow: '0 0 30px rgba(255,60,80,0.6), 0 0 60px rgba(255,60,80,0.2), -2px 0 rgba(0,150,255,0.4), 2px 0 rgba(255,60,80,0.4)',
            margin: 0,
            lineHeight: 1,
            animation: 'sl-glitch-text 6s ease-in-out infinite',
          }}>
            SIGNAL LOST
          </h1>
          {/* Glitch duplicate */}
          <h1 aria-hidden style={{
            fontFamily: '"Space Grotesk", sans-serif',
            fontSize: 'clamp(32px, 10vw, 48px)',
            fontWeight: 700,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'rgba(255,60,80,0.3)',
            margin: 0,
            lineHeight: 1,
            position: 'absolute',
            top: 0, left: 0, right: 0,
            animation: 'sl-glitch-clone 6s ease-in-out infinite',
            clipPath: 'inset(40% 0 50% 0)',
          }}>
            SIGNAL LOST
          </h1>
        </div>

        {/* Divider */}
        <div style={{
          width: 48, height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(255,60,80,0.6), transparent)',
          marginBottom: 28,
        }} />

        {/* Message */}
        <p style={{
          fontFamily: '"Inter", sans-serif',
          fontSize: 15,
          color: 'rgba(232,232,240,0.75)',
          lineHeight: 1.7,
          maxWidth: 280,
          marginBottom: 8,
        }}>
          This interface requires a full-spectrum viewport.
          Access restricted on mobile devices.
        </p>

        <p style={{
          fontFamily: '"Inter", sans-serif',
          fontSize: 14,
          color: 'rgba(150,160,200,0.6)',
          lineHeight: 1.6,
          maxWidth: 260,
          marginBottom: 48,
        }}>
          Switch to a desktop environment to establish a secure connection.
        </p>

        {/* Terminal log */}
        <div style={{
          position: 'absolute', bottom: 48, left: 32, right: 32,
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: 11,
          color: 'rgba(150,160,200,0.45)',
          textAlign: 'left',
          lineHeight: 2,
          letterSpacing: '0.03em',
        }}>
          <TerminalLine text="initializing interface..." delay={0} color="rgba(150,160,200,0.45)" />
          <TerminalLine text="viewport mismatch detected" delay={800} color="rgba(255,160,60,0.6)" />
          <TerminalLine text="rendering aborted" delay={1600} color="rgba(255,60,80,0.6)" />
        </div>

      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700&family=Inter:wght@400&family=JetBrains+Mono:wght@400&display=swap');

        @keyframes sl-glitch-text {
          0%, 90%, 100% { transform: translate(0); }
          91% { transform: translate(-2px, 0); clip-path: inset(20% 0 60% 0); }
          92% { transform: translate(2px, 0); clip-path: inset(50% 0 20% 0); }
          93% { transform: translate(0); clip-path: none; }
          95% { transform: translate(-1px, 0); }
          96% { transform: translate(1px, 0); }
          97% { transform: translate(0); }
        }

        @keyframes sl-glitch-clone {
          0%, 88%, 100% { opacity: 0; transform: translate(0); }
          89% { opacity: 1; transform: translate(4px, 0); }
          90% { opacity: 0; transform: translate(-4px, 0); }
          91% { opacity: 1; transform: translate(2px, 0); clip-path: inset(30% 0 40% 0); }
          92% { opacity: 0; }
          94% { opacity: 1; transform: translate(-2px, 0); clip-path: inset(60% 0 10% 0); }
          95% { opacity: 0; }
        }

        @keyframes sl-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }

        @keyframes sl-fade-in {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

// ── Terminal line with typewriter ─────────────────────────────────────────

function TerminalLine({ text, delay, color }: { text: string; delay: number; color: string }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      animation: `sl-fade-in 0.4s ease-out ${delay}ms both`,
    }}>
      <span style={{ color: 'rgba(255,60,80,0.5)' }}>▸</span>
      <span style={{ color }}>{text}</span>
    </div>
  );
}
