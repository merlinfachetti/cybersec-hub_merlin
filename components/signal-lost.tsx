'use client';

import { useEffect, useRef } from 'react';

function initBg(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d')!;
  let W = 0, H = 0, animId: number;
  let glitchOn = false, glitchStrength = 0;
  type Star = { x: number; y: number; r: number; a: number; ts: number; to: number };
  let stars: Star[] = [];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    stars = Array.from({ length: Math.floor((W * H) / 1600) }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.4 + 0.3, a: Math.random() * 0.9 + 0.1,
      ts: Math.random() * 0.02 + 0.004, to: Math.random() * Math.PI * 2,
    }));
  }

  function render(t: number) {
    ctx.clearRect(0, 0, W, H);

    // Deep space
    const bg = ctx.createRadialGradient(W * 0.5, H * 0.4, 0, W * 0.5, H * 0.4, Math.max(W,H));
    bg.addColorStop(0, '#1a0f2e'); bg.addColorStop(0.4, '#0e0820');
    bg.addColorStop(0.8, '#06040f'); bg.addColorStop(1, '#020208');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

    // Nebula — rich purple/red
    const nebs = [
      { x: W*0.3, y: H*0.2, r: W*0.8, c: [140,40,220], a: 0.14 },
      { x: W*0.8, y: H*0.3, r: W*0.6, c: [220,40,80],  a: 0.11 },
      { x: W*0.1, y: H*0.7, r: W*0.5, c: [180,30,60],  a: 0.09 },
      { x: W*0.7, y: H*0.8, r: W*0.5, c: [100,20,180], a: 0.10 },
      { x: W*0.5, y: H*0.5, r: W*0.4, c: [60,20,140],  a: 0.07 },
    ];
    for (const n of nebs) {
      const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r);
      g.addColorStop(0, `rgba(${n.c.join(',')},${n.a})`);
      g.addColorStop(0.5, `rgba(${n.c.join(',')},${n.a*0.3})`);
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    }

    // Stars
    for (const s of stars) {
      const tw = 0.5 + 0.5 * Math.sin(t * s.ts + s.to);
      const fl = glitchOn ? (Math.random() > 0.3 ? 1 : 0) : 1;
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r * fl, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(220,210,255,${s.a*(0.5+0.5*tw)*fl})`; ctx.fill();
    }

    // Glitch scanlines
    if (glitchOn) {
      const lines = Math.floor(glitchStrength * 12);
      for (let i = 0; i < lines; i++) {
        const y = Math.random() * H;
        const h = Math.random() * 3 + 1;
        ctx.fillStyle = `rgba(${Math.random()>0.5?'255,0,80':'0,120,255'},${Math.random()*0.12})`;
        ctx.fillRect(0, y, W, h);
      }
      // Horizontal shift
      if (glitchStrength > 0.5 && Math.random() > 0.6) {
        const sliceY = Math.random() * H;
        const sliceH = Math.random() * 6 + 2;
        const shift = (Math.random() - 0.5) * 20;
        try {
          const data = ctx.getImageData(0, sliceY, W, sliceH);
          ctx.putImageData(data, shift, sliceY);
        } catch { /* ignore */ }
      }
    }

    // Vignette
    const vig = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, Math.max(W,H)*0.7);
    vig.addColorStop(0, 'rgba(0,0,0,0)'); vig.addColorStop(1, 'rgba(0,0,0,0.75)');
    ctx.fillStyle = vig; ctx.fillRect(0, 0, W, H);

    animId = requestAnimationFrame(render);
  }

  function scheduleGlitch() {
    const wait = 1500 + Math.random() * 3500;
    setTimeout(() => {
      glitchOn = true;
      glitchStrength = 0.4 + Math.random() * 0.6;
      const dur = 60 + Math.random() * 250;
      setTimeout(() => { glitchOn = false; glitchStrength = 0; scheduleGlitch(); }, dur);
    }, wait);
  }

  resize();
  window.addEventListener('resize', resize);
  animId = requestAnimationFrame(render);
  scheduleGlitch();
  return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
}

export default function SignalLost() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => { if (canvasRef.current) return initBg(canvasRef.current); }, []);

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#020208', overflow: 'hidden', fontFamily: 'sans-serif' }}>
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />

      {/* Grain */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.05 }}>
        <svg width="100%" height="100%">
          <filter id="g"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/></filter>
          <rect width="100%" height="100%" filter="url(#g)"/>
        </svg>
      </div>

      {/* Horizontal scan overlay — always subtle */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.04) 3px, rgba(0,0,0,0.04) 4px)', backgroundSize: '100% 4px' }} />

      <div style={{ position: 'relative', zIndex: 10, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 32px', textAlign: 'center' }}>

        {/* Top status */}
        <div style={{ position: 'absolute', top: 28, left: 0, right: 0, display: 'flex', justifyContent: 'space-between', padding: '0 24px' }}>
          <span style={{ fontFamily: '"JetBrains Mono", "Courier New", monospace', fontSize: 9, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.12em' }}>SYS://CYBER-PORTAL/v2</span>
          <span style={{ fontFamily: '"JetBrains Mono", "Courier New", monospace', fontSize: 9, color: 'rgba(255,80,100,0.5)', letterSpacing: '0.12em', animation: 'sl-blink 1.2s steps(1) infinite' }}>◉ OFFLINE</span>
        </div>

        {/* Crosshair icon */}
        <div style={{ marginBottom: 24, opacity: 0.4 }}>
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
            <circle cx="22" cy="22" r="18" stroke="rgba(255,60,80,0.6)" strokeWidth="1"/>
            <circle cx="22" cy="22" r="8" stroke="rgba(255,60,80,0.4)" strokeWidth="0.5"/>
            <line x1="22" y1="0" x2="22" y2="10" stroke="rgba(255,60,80,0.5)" strokeWidth="1"/>
            <line x1="22" y1="34" x2="22" y2="44" stroke="rgba(255,60,80,0.5)" strokeWidth="1"/>
            <line x1="0" y1="22" x2="10" y2="22" stroke="rgba(255,60,80,0.5)" strokeWidth="1"/>
            <line x1="34" y1="22" x2="44" y2="22" stroke="rgba(255,60,80,0.5)" strokeWidth="1"/>
          </svg>
        </div>

        {/* SIGNAL LOST */}
        <div style={{ position: 'relative', marginBottom: 8 }}>
          <h1 style={{
            fontFamily: '"Space Grotesk", "Arial Black", sans-serif',
            fontSize: 'clamp(34px, 11vw, 52px)',
            fontWeight: 700,
            letterSpacing: '0.12em',
            color: '#ffffff',
            margin: 0, lineHeight: 1,
            textShadow: '0 0 40px rgba(255,60,80,0.7), 0 0 80px rgba(255,60,80,0.25), -3px 0 rgba(0,120,255,0.5), 3px 0 rgba(255,60,80,0.5)',
            animation: 'sl-flicker 8s ease-in-out infinite',
          }}>SIGNAL LOST</h1>
          {/* Glitch clone */}
          <h1 aria-hidden style={{
            fontFamily: '"Space Grotesk", "Arial Black", sans-serif',
            fontSize: 'clamp(34px, 11vw, 52px)',
            fontWeight: 700,
            letterSpacing: '0.12em',
            color: 'rgba(0,180,255,0.25)',
            margin: 0, lineHeight: 1,
            position: 'absolute', top: 0, left: 0, right: 0,
            animation: 'sl-clone 8s ease-in-out infinite',
          }}>SIGNAL LOST</h1>
        </div>

        {/* Subtitle line */}
        <div style={{ width: 60, height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,60,80,0.7), transparent)', margin: '20px auto 20px' }} />

        <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 14, color: 'rgba(220,220,240,0.7)', lineHeight: 1.7, maxWidth: 270, marginBottom: 6 }}>
          This interface requires a full-spectrum viewport.
        </p>
        <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, color: 'rgba(150,140,200,0.55)', lineHeight: 1.6, maxWidth: 250, marginBottom: 0 }}>
          Access restricted on mobile devices.
          Switch to desktop to establish a secure connection.
        </p>

        {/* Team color dots */}
        <div style={{ display: 'flex', gap: 10, marginTop: 28 }}>
          {['#e53e3e','#3b82f6','#8b5cf6'].map((c, i) => (
            <div key={c} style={{ width: 6, height: 6, borderRadius: '50%', background: c, boxShadow: `0 0 8px ${c}`, animation: `sl-pulse 2s ease-in-out ${i*0.4}s infinite` }}/>
          ))}
        </div>

        {/* Terminal */}
        <div style={{ position: 'absolute', bottom: 40, left: 24, right: 24, fontFamily: '"JetBrains Mono", "Courier New", monospace', fontSize: 10, color: 'rgba(150,140,200,0.4)', textAlign: 'left', lineHeight: 2.2, letterSpacing: '0.04em' }}>
          <div style={{ animation: 'sl-in 0.3s ease-out 0s both', display: 'flex', gap: 8 }}>
            <span style={{ color: 'rgba(255,60,80,0.4)' }}>▸</span>
            <span>initializing interface...</span>
          </div>
          <div style={{ animation: 'sl-in 0.3s ease-out 0.7s both', display: 'flex', gap: 8 }}>
            <span style={{ color: 'rgba(255,180,60,0.5)' }}>▸</span>
            <span style={{ color: 'rgba(255,180,60,0.5)' }}>viewport mismatch detected</span>
          </div>
          <div style={{ animation: 'sl-in 0.3s ease-out 1.4s both', display: 'flex', gap: 8 }}>
            <span style={{ color: 'rgba(255,60,80,0.6)' }}>▸</span>
            <span style={{ color: 'rgba(255,60,80,0.6)' }}>rendering aborted</span>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700&family=Inter:wght@400&family=JetBrains+Mono:wght@400&display=swap');
        @keyframes sl-flicker { 0%,95%,100%{opacity:1} 96%{opacity:0.85} 97%{opacity:1} 98%{opacity:0.9} 99%{opacity:1} }
        @keyframes sl-clone { 0%,88%,100%{opacity:0;transform:translate(0)} 89%{opacity:1;transform:translate(5px,0)} 90%{opacity:0;transform:translate(-5px,0)} 91%{opacity:1;transform:translate(3px,-2px);clip-path:inset(30% 0 50% 0)} 92%{opacity:0} 93%{opacity:1;transform:translate(-3px,0);clip-path:inset(60% 0 10% 0)} 94%{opacity:0} }
        @keyframes sl-blink { 0%,49%{opacity:1} 50%,100%{opacity:0} }
        @keyframes sl-pulse { 0%,100%{opacity:0.4;transform:scale(1)} 50%{opacity:1;transform:scale(1.3)} }
        @keyframes sl-in { from{opacity:0;transform:translateY(3px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
    </div>
  );
}
