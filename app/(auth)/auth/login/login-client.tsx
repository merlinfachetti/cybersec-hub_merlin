'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import SignalLost from '@/components/signal-lost';
import { useRouter, useSearchParams } from 'next/navigation';

// ── Canvas background (nebula + stargate) ─────────────────────────────────

function initLoginBg(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d')!;
  let W = 0, H = 0, cx = 0, cy = 0;
  type Star = { x: number; y: number; r: number; a: number; ts: number; to: number };
  type Dust = { x: number; y: number; r: number; vx: number; vy: number; a: number };
  let stars: Star[] = [];
  let dust: Dust[] = [];
  let animId: number;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    cx = W / 2; cy = H * 0.42;
    stars = Array.from({ length: Math.floor((W * H) / 2800) }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.4 + 0.3, a: Math.random() * 0.7 + 0.3,
      ts: Math.random() * 0.02 + 0.005, to: Math.random() * Math.PI * 2,
    }));
    dust = Array.from({ length: 40 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.2 + 0.4,
      vx: (Math.random() - 0.5) * 0.15, vy: (Math.random() - 0.5) * 0.1,
      a: Math.random() * 0.3 + 0.1,
    }));
  }

  function drawBg() {
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(W, H) * 0.8);
    g.addColorStop(0, '#12132a'); g.addColorStop(0.3, '#0d0e1f');
    g.addColorStop(0.7, '#090a14'); g.addColorStop(1, '#050508');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    const clouds: Array<{ x: number; y: number; r: number; c: number[]; a: number }> = [
      { x: cx - W * 0.1, y: cy - H * 0.05, r: W * 0.45, c: [80, 60, 180], a: 0.09 },
      { x: cx + W * 0.05, y: cy, r: W * 0.35, c: [40, 80, 200], a: 0.08 },
      { x: W * 0.85, y: H * 0.15, r: W * 0.35, c: [200, 70, 50], a: 0.07 },
      { x: W * 0.1, y: H * 0.85, r: W * 0.3, c: [190, 60, 40], a: 0.06 },
      { x: cx - W * 0.3, y: cy - H * 0.15, r: W * 0.2, c: [40, 140, 200], a: 0.04 },
    ];
    for (const cl of clouds) {
      const ng = ctx.createRadialGradient(cl.x, cl.y, 0, cl.x, cl.y, cl.r);
      ng.addColorStop(0, `rgba(${cl.c.join(',')},${cl.a})`);
      ng.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = ng; ctx.fillRect(0, 0, W, H);
    }
  }

  function drawStars(t: number) {
    for (const s of stars) {
      const tw = 0.5 + 0.5 * Math.sin(t * s.ts + s.to);
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(220,225,255,${s.a * (0.6 + 0.4 * tw)})`; ctx.fill();
    }
  }

  function drawCore(t: number) {
    const p = 0.92 + 0.08 * Math.sin(t * 0.001);
    const base = Math.min(W, H) * 0.15;
    const layers = [
      { r: base * 5 * p, c: 'rgba(120,150,255,0.06)', c2: 'rgba(80,120,255,0.02)' },
      { r: base * 3 * p, c: 'rgba(150,180,255,0.14)', c2: 'rgba(100,140,255,0.05)' },
      { r: base * 1.8 * p, c: 'rgba(200,215,255,0.28)', c2: 'rgba(160,185,255,0.12)' },
    ];
    for (const l of layers) {
      const gr = ctx.createRadialGradient(cx, cy, 0, cx, cy, l.r);
      gr.addColorStop(0, l.c); gr.addColorStop(0.4, l.c2); gr.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = gr; ctx.fillRect(0, 0, W, H);
    }
    const gc = ctx.createRadialGradient(cx, cy, 0, cx, cy, base * 0.7 * p);
    gc.addColorStop(0, 'rgba(245,248,255,0.85)'); gc.addColorStop(0.25, 'rgba(220,235,255,0.45)');
    gc.addColorStop(0.6, 'rgba(160,190,255,0.12)'); gc.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = gc; ctx.fillRect(0, 0, W, H);
    const g0 = ctx.createRadialGradient(cx, cy, 0, cx, cy, base * 0.2);
    g0.addColorStop(0, 'rgba(255,255,255,1)'); g0.addColorStop(0.5, 'rgba(255,255,255,0.6)');
    g0.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g0; ctx.fillRect(0, 0, W, H);
  }

  function drawRings(t: number) {
    const rings = [
      { rx: 0.28, ry: 0.10, rot: -0.15, a: 0.12 },
      { rx: 0.38, ry: 0.14, rot: -0.10, a: 0.09 },
      { rx: 0.50, ry: 0.18, rot: -0.05, a: 0.06 },
      { rx: 0.65, ry: 0.24, rot: 0.00, a: 0.04 },
    ];
    ctx.save(); ctx.translate(cx, cy);
    for (const r of rings) {
      const p2 = 1 + 0.01 * Math.sin(t * 0.0005 + r.rx * 10);
      ctx.save(); ctx.rotate(r.rot);
      ctx.beginPath();
      ctx.ellipse(0, 0, W * r.rx * p2, H * r.ry * p2, 0, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(160,180,220,${r.a})`; ctx.lineWidth = 1; ctx.stroke();
      ctx.restore();
    }
    ctx.restore();
  }

  function drawRays(t: number) {
    const maxLen = Math.min(W, H) * 0.5;
    ctx.save(); ctx.translate(cx, cy);
    ctx.globalCompositeOperation = 'screen';
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2 + t * 0.00005;
      const len = maxLen * (0.4 + 0.3 * Math.sin(t * 0.0008 + i * 1.5));
      const g = ctx.createLinearGradient(0, 0, Math.cos(angle) * len, Math.sin(angle) * len);
      g.addColorStop(0, 'rgba(200,215,255,0.06)'); g.addColorStop(1, 'rgba(200,215,255,0)');
      ctx.beginPath(); ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(angle - 0.015) * len, Math.sin(angle - 0.015) * len);
      ctx.lineTo(Math.cos(angle + 0.015) * len, Math.sin(angle + 0.015) * len);
      ctx.closePath(); ctx.fillStyle = g; ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over'; ctx.restore();
  }

  function drawDust(t: number) {
    for (const p of dust) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < -10) p.x = W + 10; if (p.x > W + 10) p.x = -10;
      if (p.y < -10) p.y = H + 10; if (p.y > H + 10) p.y = -10;
      const fl = 0.7 + 0.3 * Math.sin(t * 0.003 + p.x);
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(180,195,230,${p.a * fl})`; ctx.fill();
    }
  }

  function render(t: number) {
    ctx.clearRect(0, 0, W, H);
    drawBg(); drawStars(t); drawRays(t); drawCore(t); drawRings(t); drawDust(t);
    animId = requestAnimationFrame(render);
  }

  resize();
  window.addEventListener('resize', resize);
  animId = requestAnimationFrame(render);
  return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
}

// ── Types + constants ─────────────────────────────────────────────────────

type HsState = 'idle' | 'active' | 'success' | 'error';

const STEPS = [
  { text: 'Initiating secure channel...', delay: 600 },
  { text: 'Negotiating cipher suite...', delay: 800 },
  { text: 'Verifying credentials...', delay: 1000 },
  { text: 'Session established \u2713', delay: 600 },
];

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

// ── Main component ────────────────────────────────────────────────────────

export default function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [identifier, setIdentifier] = useState('');
  const [passphrase, setPassphrase] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hsState, setHsState] = useState<HsState>('idle');
  const [hsText, setHsText] = useState('Secure channel ready');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!canvasRef.current) return;
    return initLoginBg(canvasRef.current);
  }, []);

  const runHandshake = useCallback(async () => {
    for (const step of STEPS) {
      setHsState('active');
      setHsText(step.text);
      await sleep(step.delay);
    }
    setHsState('success');
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || !passphrase) {
      setHsState('error');
      setHsText('Could not verify credentials.');
      setErrorMsg('Could not verify credentials.');
      setTimeout(() => { setHsState('idle'); setHsText('Secure channel ready'); setErrorMsg(''); }, 3000);
      return;
    }
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, passphrase }),
      });
      if (!res.ok) {
        const msg = res.status === 429 ? 'Too many attempts. Try again later.' : 'Could not verify credentials.';
        setHsState('error'); setHsText(msg); setErrorMsg(msg);
        setTimeout(() => { setHsState('idle'); setHsText('Secure channel ready'); }, 3500);
        return;
      }
      await runHandshake();
      await sleep(800);
      router.push(searchParams.get('from') ?? '/portal');
      router.refresh();
    } catch {
      const msg = 'Connection error. Try again.';
      setHsState('error'); setHsText(msg); setErrorMsg(msg);
      setTimeout(() => { setHsState('idle'); setHsText('Secure channel ready'); setErrorMsg(''); }, 3000);
    } finally {
      setLoading(false);
    }
  }, [identifier, passphrase, runHandshake, router, searchParams]);

  const dotColor = hsState === 'success' ? '#22c55e'
    : hsState === 'error' ? '#e53e3e'
    : hsState === 'active' ? '#8b5cf6'
    : '#3b82f6';

  return (
    <>
      <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, zIndex: 0, width: '100%', height: '100%' }} />
      <div style={{ position: 'fixed', inset: 0, zIndex: 10, pointerEvents: 'none', background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.5) 100%)' }} />
      <div style={{ position: 'fixed', inset: 0, zIndex: 10, pointerEvents: 'none', opacity: 0.025 }}>
        <svg width="100%" height="100%"><filter id="nf"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(#nf)"/></svg>
      </div>

      {/* ── Main UI ── */}
      <div className="cp-main-app" style={{ position: 'relative', zIndex: 20, height: '100vh', display: 'flex', flexDirection: 'column' }}>

        {/* Topbar */}
        <header style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 30,
          height: 56,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 32px',
          background: 'linear-gradient(180deg, rgba(6,4,18,0.97) 0%, rgba(8,5,22,0.90) 100%)',
          backdropFilter: 'blur(24px) saturate(180%)',
          borderBottom: '1px solid rgba(139,92,246,0.15)',
          boxShadow: '0 1px 0 rgba(139,92,246,0.08), 0 4px 24px rgba(0,0,0,0.5)',
        }}>
          {/* Logo + Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ position: 'relative', width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ position: 'absolute', inset: -4, borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)', pointerEvents: 'none' }} />
              <img src="/logo.png" alt="CYBER PORTAL" style={{
                width: 34, height: 34, objectFit: 'contain', position: 'relative', zIndex: 1,
                filter: 'drop-shadow(0 0 8px rgba(139,92,246,0.8)) drop-shadow(0 0 14px rgba(59,130,246,0.35))' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <span style={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700,
                fontSize: 13, letterSpacing: '0.16em', color: '#f0eeff', lineHeight: 1 }}>
                CYBER PORTAL
              </span>
              <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9,
                color: 'rgba(139,92,246,0.6)', letterSpacing: '0.12em', lineHeight: 1 }}>
                signal &gt; noise
              </span>
            </div>
          </div>
          {/* ENV status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#22c55e',
                boxShadow: '0 0 6px #22c55e', display: 'inline-block' }} />
              <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9,
                color: 'rgba(34,197,94,0.7)', letterSpacing: '0.1em' }}>ENV: PROD</span>
            </div>
            <span style={{ color: 'rgba(255,255,255,0.07)', fontSize: 10 }}>|</span>
            <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9,
              color: 'rgba(180,175,220,0.3)', letterSpacing: '0.08em' }}>LAT: 18ms</span>
          </div>
        </header>

        {/* Auth stage */}
        <main style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100vh', padding: '50px 24px 56px' }}>
          <div className="cp-glass cp-animate-in" style={{ width: '100%', maxWidth: 380, padding: '22px 28px 18px', display: 'flex', flexDirection: 'column' }}>

            <h1 style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 20, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', textAlign: 'center', color: '#ffffff', marginBottom: 16, textShadow: '0 0 20px rgba(200,210,255,0.15)' }}>
              IDENTIFY
            </h1>

            <form onSubmit={handleSubmit} autoComplete="off" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

              {errorMsg && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 8, background: 'rgba(229,62,62,0.10)', border: '1px solid rgba(229,62,62,0.25)', fontSize: 13, color: '#ff6b6b' }}>
                  <AlertIcon /> {errorMsg}
                </div>
              )}

              <InputField icon="user" placeholder="Identifier" type="text" value={identifier} onChange={setIdentifier} autoComplete="username" />
              {/* Passphrase + strength hint */}
              <InputField icon="lock" placeholder="Min 12 chars · upper · lower · symbol" type={showPass ? 'text' : 'password'} value={passphrase} onChange={setPassphrase} autoComplete="current-password"
                trailing={
                  <button type="button" onClick={() => setShowPass(v => !v)} style={{ width: 24, height: 24, flexShrink: 0, color: '#6a6a8a', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {showPass ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                }
              />

              {/* Passphrase strength */}
              {passphrase.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 2px' }}>
                  {[
                    passphrase.length >= 12,
                    /[A-Z]/.test(passphrase),
                    /[0-9]/.test(passphrase),
                    /[^A-Za-z0-9]/.test(passphrase),
                  ].map((ok, i) => (
                    <div key={i} style={{ flex: 1, height: 2, borderRadius: 1, background: ok ? ['#e53e3e','#f59e0b','#3b82f6','#22c55e'][i] : 'rgba(255,255,255,0.08)', transition: 'background 300ms' }} />
                  ))}
                  <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, color: 'rgba(150,140,200,0.5)', whiteSpace: 'nowrap', minWidth: 32 }}>
                    {passphrase.length < 12 ? 'weak' : !/[A-Z]/.test(passphrase) ? 'fair' : !/[0-9]/.test(passphrase) ? 'good' : !/[^A-Za-z0-9]/.test(passphrase) ? 'strong' : 'max'}
                  </span>
                </div>
              )}

              {/* Remember device */}
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', userSelect: 'none', padding: '2px 0' }}>
                <input type="checkbox" checked={rememberDevice} onChange={e => setRememberDevice(e.target.checked)} style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }} />
                <span style={{ width: 16, height: 16, flexShrink: 0, border: `1px solid ${rememberDevice ? '#3b82f6' : 'rgba(255,255,255,0.12)'}`, borderRadius: 2, background: rememberDevice ? '#3b82f6' : 'rgba(5,5,20,0.70)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 150ms' }}>
                  {rememberDevice && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </span>
                <span style={{ fontSize: 13, color: '#e8e8f0', lineHeight: 1.3 }}>Remember this device <span style={{ color: '#6a6a8a', fontSize: 11 }}>· Only on trusted devices</span></span>
              </label>

              {/* Authenticate button */}
              <button type="submit" disabled={loading} style={{ position: 'relative', width: '100%', height: 42, borderRadius: 8, overflow: 'hidden', marginTop: 4, cursor: loading ? 'not-allowed' : 'pointer', border: 'none', outline: 'none', background: 'linear-gradient(135deg, #e53e3e 0%, #3b82f6 50%, #8b5cf6 100%)', backgroundSize: '200% 200%', animation: 'cp-tricolor 4s ease infinite', opacity: loading ? 0.7 : 1 }}>
                <span style={{ position: 'relative', zIndex: 2, fontFamily: '"Space Grotesk", sans-serif', fontSize: 13, fontWeight: 700, letterSpacing: '0.14em', color: '#ffffff', textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>
                  {loading ? 'AUTHENTICATING...' : 'AUTHENTICATE'}
                </span>
              </button>

            </form>

            {/* Secondary links */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, marginTop: 14 }}>
              <a href="#" style={{ fontSize: 13, color: '#60a5fa', textDecoration: 'none' }}>Use passkey</a>
              <a href="#" style={{ fontSize: 13, color: '#6a6a8a', textDecoration: 'none' }}>Forgot passphrase?</a>
            </div>

            {/* Handshake strip */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '6px 16px', marginTop: 12, borderRadius: 100, background: 'rgba(10,10,30,0.40)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: dotColor, boxShadow: `0 0 6px ${dotColor}`, display: 'inline-block', animation: hsState === 'active' ? 'cp-hs-pulse 2s ease-in-out infinite' : 'none' }} />
              <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: '#6a6a8a', whiteSpace: 'nowrap' }}>{hsText}</span>
            </div>

          </div>
        </main>
      </div>

      {/* Team badges */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 20, display: 'flex', justifyContent: 'center', gap: 12, padding: '12px 24px' }}>
        {TEAM_BADGES.map(t => (
          <div key={t.team} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 8, background: 'rgba(10,10,30,0.65)', border: `1px solid ${t.border}`, backdropFilter: 'blur(8px)', minWidth: 180 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={t.color} strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            <div>
              <span style={{ display: 'block', fontFamily: '"Space Grotesk", sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: t.soft }}>{t.label}</span>
              <span style={{ display: 'block', fontSize: 10, color: '#6a6a8a', lineHeight: 1.3 }}>{t.desc}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Signal Lost — mobile block */}
      <div className="cp-signal-lost">
        <SignalLost />
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        body{background:#060610;overflow:hidden}
        input{outline:none;border:none;background:transparent;font-family:'Inter',sans-serif;color:#e8e8f0;width:100%}
        input::placeholder{color:#6a6a8a}
        @keyframes cp-hs-pulse{0%,100%{opacity:1}50%{opacity:0.4}}
      `}</style>
    </>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────

function InputField({ icon, placeholder, type, value, onChange, autoComplete, trailing }: {
  icon: 'user' | 'lock'; placeholder: string; type: string;
  value: string; onChange: (v: string) => void;
  autoComplete?: string; trailing?: React.ReactNode;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div onFocusCapture={() => setFocused(true)} onBlurCapture={() => setFocused(false)}
      style={{ position: 'relative', display: 'flex', alignItems: 'center', background: 'rgba(5,5,20,0.70)', border: `1px solid ${focused ? 'rgba(59,130,246,0.40)' : 'rgba(255,255,255,0.12)'}`, borderRadius: 8, padding: '0 14px', height: 42, boxShadow: focused ? '0 0 0 2px rgba(59,130,246,0.15),0 0 20px rgba(59,130,246,0.08)' : 'none', transition: 'border-color 300ms,box-shadow 300ms' }}>
      <span style={{ width: 18, height: 18, flexShrink: 0, color: focused ? '#60a5fa' : '#6a6a8a', marginRight: 12, display: 'flex', transition: 'color 300ms' }}>
        {icon === 'user' ? <UserIcon /> : <LockIcon />}
      </span>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} autoComplete={autoComplete} style={{ flex: 1, height: '100%', fontSize: 13, color: '#e8e8f0', background: 'transparent', border: 'none', outline: 'none', fontFamily: '"Inter",sans-serif' }} />
      {trailing}
    </div>
  );
}

const TEAM_BADGES = [
  { team: 'red', label: 'RED TEAM', desc: 'Adversarial heuristics active', color: '#e53e3e', soft: '#ff6b6b', border: 'rgba(229,62,62,0.35)' },
  { team: 'blue', label: 'BLUE TEAM', desc: 'Defensive session checks enabled', color: '#3b82f6', soft: '#60a5fa', border: 'rgba(59,130,246,0.35)' },
  { team: 'purple', label: 'PURPLE TEAM', desc: 'Telemetry & improvement logging', color: '#8b5cf6', soft: '#a78bfa', border: 'rgba(139,92,246,0.35)' },
];

function UserIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>; }
function LockIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>; }
function EyeIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>; }
function EyeOffIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>; }
function AlertIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>; }
// build: 2026-03-19T13:30:42Z
