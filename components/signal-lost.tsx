'use client';

import { useEffect, useRef } from 'react';

function initBg(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d')!;
  let W = 0, H = 0, animId: number;
  let glitchOn = false, glitchStr = 0;
  type Star = { x: number; y: number; r: number; a: number; ts: number; to: number };
  let stars: Star[] = [];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    stars = Array.from({ length: Math.floor((W * H) / 1400) }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.4 + 0.3, a: Math.random() * 0.85 + 0.15,
      ts: Math.random() * 0.018 + 0.004, to: Math.random() * Math.PI * 2,
    }));
  }

  function render(t: number) {
    ctx.clearRect(0, 0, W, H);

    // Deep space bg
    const bg = ctx.createRadialGradient(W*.5, H*.38, 0, W*.5, H*.38, Math.max(W,H));
    bg.addColorStop(0, '#180c2c'); bg.addColorStop(0.35, '#0c071a');
    bg.addColorStop(0.7, '#06040e'); bg.addColorStop(1, '#020208');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

    // Nebula
    for (const n of [
      { x: W*.25, y: H*.18, r: W*.9, c: [130,35,210], a: 0.16 },
      { x: W*.82, y: H*.28, r: W*.65, c: [210,35,75], a: 0.12 },
      { x: W*.1,  y: H*.72, r: W*.55, c: [170,25,55], a: 0.10 },
      { x: W*.75, y: H*.82, r: W*.5,  c: [90,18,170], a: 0.11 },
      { x: W*.5,  y: H*.5,  r: W*.4,  c: [55,18,130], a: 0.08 },
    ]) {
      const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r);
      g.addColorStop(0, `rgba(${n.c},${n.a})`);
      g.addColorStop(.5, `rgba(${n.c},${n.a*.25})`);
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    }

    // Stars
    for (const s of stars) {
      const tw = .5 + .5 * Math.sin(t * s.ts + s.to);
      const fl = glitchOn ? (Math.random() > .25 ? 1 : 0) : 1;
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r * fl, 0, Math.PI*2);
      ctx.fillStyle = `rgba(215,205,255,${s.a*(.5+.5*tw)*fl})`; ctx.fill();
    }

    // Glitch scanlines
    if (glitchOn) {
      for (let i = 0; i < Math.floor(glitchStr * 14); i++) {
        const y = Math.random() * H, h2 = Math.random() * 3 + 1;
        ctx.fillStyle = `rgba(${Math.random()>.5?'255,40,80':'20,120,255'},${Math.random()*.13})`;
        ctx.fillRect(0, y, W, h2);
      }
      if (glitchStr > .45 && Math.random() > .5) {
        const sy = Math.random() * H, sh = Math.random() * 5 + 2;
        const shift = (Math.random() - .5) * 18;
        try { const d = ctx.getImageData(0, sy, W, sh); ctx.putImageData(d, shift, sy); } catch{}
      }
    }

    // Vignette
    const vig = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, Math.max(W,H)*.72);
    vig.addColorStop(0, 'rgba(0,0,0,0)'); vig.addColorStop(1, 'rgba(0,0,0,.78)');
    ctx.fillStyle = vig; ctx.fillRect(0, 0, W, H);

    animId = requestAnimationFrame(render);
  }

  function scheduleGlitch() {
    setTimeout(() => {
      glitchOn = true; glitchStr = .35 + Math.random() * .65;
      const dur = 55 + Math.random() * 230;
      setTimeout(() => { glitchOn = false; glitchStr = 0; scheduleGlitch(); }, dur);
    }, 1200 + Math.random() * 3800);
  }

  resize();
  window.addEventListener('resize', resize);
  animId = requestAnimationFrame(render);
  scheduleGlitch();
  return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
}

const TEAMS = [
  { key: 'red',    label: 'RED TEAM',    sub: 'Adversarial heuristics active',     color: '#e53e3e', soft: '#ff6b6b', dim: 'rgba(229,62,62,0.18)',   border: 'rgba(229,62,62,0.4)' },
  { key: 'blue',   label: 'BLUE TEAM',   sub: 'Defensive session checks enabled',  color: '#3b82f6', soft: '#60a5fa', dim: 'rgba(59,130,246,0.18)',  border: 'rgba(59,130,246,0.4)' },
  { key: 'purple', label: 'PURPLE TEAM', sub: 'Telemetry & improvement logging',   color: '#8b5cf6', soft: '#a78bfa', dim: 'rgba(139,92,246,0.18)',  border: 'rgba(139,92,246,0.4)' },
];

export default function SignalLost() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) return initBg(canvasRef.current);
  }, []);

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: '#020208',
      overflow: 'hidden',
      // Prevent any interaction/scrolling
      touchAction: 'none',
      userSelect: 'none',
    }}>
      {/* Canvas */}
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />

      {/* Grain */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: .055 }}>
        <svg width="100%" height="100%">
          <filter id="g2"><feTurbulence type="fractalNoise" baseFrequency=".65" numOctaves="3" stitchTiles="stitch"/></filter>
          <rect width="100%" height="100%" filter="url(#g2)"/>
        </svg>
      </div>

      {/* Scanlines always-on */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,.045) 3px,rgba(0,0,0,.045) 4px)' }} />

      {/* UI layer */}
      <div style={{ position: 'relative', zIndex: 10, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

        {/* ── TOP — logo only, centered, no interactive elements ── */}
        <div style={{ paddingTop: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          {/* Shield tricolor */}
          <svg width="28" height="32" viewBox="0 0 24 28" fill="none">
            <defs>
              <linearGradient id="sl-shield" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#e53e3e"/>
                <stop offset="50%" stopColor="#3b82f6"/>
                <stop offset="100%" stopColor="#8b5cf6"/>
              </linearGradient>
            </defs>
            <path d="M12 26s10-5 10-12V4L12 1 2 4v10c0 7 10 12 10 12z" stroke="url(#sl-shield)" strokeWidth="1.5" fill="none"/>
          </svg>
          <span style={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700, fontSize: 13, letterSpacing: '.14em', color: '#ffffff' }}>CYBER PORTAL</span>
          <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, color: '#6a6a8a', letterSpacing: '.1em' }}>signal &gt; noise</span>
        </div>

        {/* ── CENTER — signal lost content ── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 32px', textAlign: 'center' }}>

          {/* Crosshair */}
          <div style={{ marginBottom: 22, animation: 'sl-spin-slow 20s linear infinite', opacity: .45 }}>
            <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
              <circle cx="26" cy="26" r="22" stroke="rgba(255,55,75,.65)" strokeWidth="1"/>
              <circle cx="26" cy="26" r="10" stroke="rgba(255,55,75,.35)" strokeWidth=".7" strokeDasharray="3 3"/>
              <line x1="26" y1="0"  x2="26" y2="12"  stroke="rgba(255,55,75,.55)" strokeWidth="1.2"/>
              <line x1="26" y1="40" x2="26" y2="52"  stroke="rgba(255,55,75,.55)" strokeWidth="1.2"/>
              <line x1="0"  y1="26" x2="12" y2="26"  stroke="rgba(255,55,75,.55)" strokeWidth="1.2"/>
              <line x1="40" y1="26" x2="52" y2="26"  stroke="rgba(255,55,75,.55)" strokeWidth="1.2"/>
              <circle cx="26" cy="26" r="2.5" fill="rgba(255,55,75,.8)"/>
            </svg>
          </div>

          {/* Title */}
          <div style={{ position: 'relative', marginBottom: 6 }}>
            <h1 style={{
              fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700,
              fontSize: 'clamp(36px, 11vw, 54px)',
              letterSpacing: '.11em', color: '#fff', margin: 0, lineHeight: 1,
              textShadow: '0 0 40px rgba(255,55,75,.75), 0 0 80px rgba(255,55,75,.22), -3px 0 rgba(20,120,255,.45), 3px 0 rgba(255,55,75,.45)',
              animation: 'sl-flicker 9s ease-in-out infinite',
            }}>SIGNAL LOST</h1>
            {/* Glitch clone */}
            <h1 aria-hidden style={{
              fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700,
              fontSize: 'clamp(36px, 11vw, 54px)',
              letterSpacing: '.11em', margin: 0, lineHeight: 1,
              color: 'rgba(20,130,255,.28)',
              position: 'absolute', top: 0, left: 0, right: 0,
              animation: 'sl-clone 9s ease-in-out infinite',
              pointerEvents: 'none',
            }}>SIGNAL LOST</h1>
          </div>

          {/* Divider */}
          <div style={{ width: 56, height: 1, background: 'linear-gradient(90deg,transparent,rgba(255,55,75,.7),transparent)', margin: '18px auto 18px' }} />

          <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 14, color: 'rgba(220,215,240,.72)', lineHeight: 1.75, maxWidth: 268, margin: '0 0 6px' }}>
            This interface requires a full-spectrum viewport.
          </p>
          <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, color: 'rgba(145,135,195,.55)', lineHeight: 1.65, maxWidth: 252, margin: 0 }}>
            Switch to a desktop environment to establish a secure connection.
          </p>

        </div>

        {/* ── BOTTOM — team badges carousel ── */}
        <div style={{ width: '100%', paddingBottom: 52, overflow: 'hidden' }}>

          {/* Carousel track — infinite loop via CSS animation */}
          <div style={{ position: 'relative', overflow: 'hidden', maskImage: 'linear-gradient(90deg,transparent,black 15%,black 85%,transparent)', WebkitMaskImage: 'linear-gradient(90deg,transparent,black 15%,black 85%,transparent)' }}>
            <div style={{ display: 'flex', gap: 12, animation: 'sl-carousel 12s linear infinite', width: 'max-content' }}>
              {/* Render teams twice for seamless loop */}
              {[...TEAMS, ...TEAMS, ...TEAMS].map((t, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 9,
                  padding: '8px 16px', borderRadius: 8,
                  background: t.dim, border: `1px solid ${t.border}`,
                  backdropFilter: 'blur(8px)',
                  flexShrink: 0,
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={t.color} strokeWidth="1.5">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                  <div>
                    <div style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 10, fontWeight: 700, letterSpacing: '.12em', color: t.soft, textTransform: 'uppercase' }}>{t.label}</div>
                    <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 9, color: 'rgba(150,145,190,.6)', lineHeight: 1.3 }}>{t.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Terminal */}
          <div style={{ padding: '16px 24px 0', fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: 'rgba(140,130,190,.38)', lineHeight: 2.1, letterSpacing: '.04em' }}>
            {[
              { text: 'initializing interface...', color: 'rgba(140,130,190,.38)', delay: '0s' },
              { text: 'viewport mismatch detected', color: 'rgba(255,175,55,.55)', delay: '.7s' },
              { text: 'rendering aborted', color: 'rgba(255,55,75,.6)', delay: '1.4s' },
            ].map(l => (
              <div key={l.text} style={{ display: 'flex', gap: 8, animation: `sl-in .3s ease-out ${l.delay} both` }}>
                <span style={{ color: 'rgba(255,55,75,.4)' }}>▸</span>
                <span style={{ color: l.color }}>{l.text}</span>
              </div>
            ))}
          </div>

        </div>

      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700&family=Inter:wght@400&family=JetBrains+Mono:wght@400&display=swap');
        @keyframes sl-flicker { 0%,93%,100%{opacity:1} 94%{opacity:.82} 95%{opacity:1} 97%{opacity:.9} 98%{opacity:1} }
        @keyframes sl-clone {
          0%,86%,100%{opacity:0;transform:translate(0)}
          87%{opacity:1;transform:translate(6px,0)}
          88%{opacity:0;transform:translate(-6px,0)}
          89%{opacity:1;transform:translate(3px,-2px);clip-path:inset(28% 0 52% 0)}
          90%{opacity:0}
          92%{opacity:1;transform:translate(-3px,1px);clip-path:inset(62% 0 8% 0)}
          93%{opacity:0}
        }
        @keyframes sl-spin-slow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes sl-carousel { from{transform:translateX(0)} to{transform:translateX(calc(-100%/3))} }
        @keyframes sl-in { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
    </div>
  );
}
