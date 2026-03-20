'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

// ── Canvas background ──────────────────────────────────────────────────────
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
    const bg = ctx.createRadialGradient(W*.5, H*.38, 0, W*.5, H*.38, Math.max(W,H));
    bg.addColorStop(0, '#180c2c'); bg.addColorStop(0.35, '#0c071a');
    bg.addColorStop(0.7, '#06040e'); bg.addColorStop(1, '#020208');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
    for (const n of [
      { x: W*.25, y: H*.18, r: W*.9, c: [130,35,210], a: 0.16 },
      { x: W*.82, y: H*.28, r: W*.65, c: [210,35,75], a: 0.12 },
      { x: W*.5,  y: H*.5,  r: W*.4,  c: [55,18,130], a: 0.08 },
    ]) {
      const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r);
      g.addColorStop(0, `rgba(${n.c},${n.a})`);
      g.addColorStop(.5, `rgba(${n.c},${n.a*.25})`);
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    }
    for (const s of stars) {
      const tw = .5 + .5 * Math.sin(t * s.ts + s.to);
      const fl = glitchOn ? (Math.random() > .25 ? 1 : 0) : 1;
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r * fl, 0, Math.PI*2);
      ctx.fillStyle = `rgba(215,205,255,${s.a*(.5+.5*tw)*fl})`; ctx.fill();
    }
    if (glitchOn) {
      for (let i = 0; i < Math.floor(glitchStr * 14); i++) {
        const y = Math.random() * H, h2 = Math.random() * 3 + 1;
        ctx.fillStyle = `rgba(${Math.random()>.5?'255,40,80':'20,120,255'},${Math.random()*.13})`;
        ctx.fillRect(0, y, W, h2);
      }
    }
    const vig = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, Math.max(W,H)*.72);
    vig.addColorStop(0, 'rgba(0,0,0,0)'); vig.addColorStop(1, 'rgba(0,0,0,.78)');
    ctx.fillStyle = vig; ctx.fillRect(0, 0, W, H);
    animId = requestAnimationFrame(render);
  }

  function scheduleGlitch() {
    setTimeout(() => {
      glitchOn = true; glitchStr = .35 + Math.random() * .65;
      setTimeout(() => { glitchOn = false; glitchStr = 0; scheduleGlitch(); }, 55 + Math.random() * 230);
    }, 1200 + Math.random() * 3800);
  }

  resize();
  window.addEventListener('resize', resize);
  animId = requestAnimationFrame(render);
  scheduleGlitch();
  return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
}

// ── Types ──────────────────────────────────────────────────────────────────
type GateState = 'idle' | 'armed' | 'dragging' | 'locked' | 'charging' | 'burst' | 'auth';

const TEAMS = [
  { key: 'red',    label: 'RED TEAM',    sub: 'Adversarial heuristics active',    color: '#e53e3e', soft: '#ff6b6b', dim: 'rgba(229,62,62,0.18)',  border: 'rgba(229,62,62,0.4)' },
  { key: 'blue',   label: 'BLUE TEAM',   sub: 'Defensive session checks enabled', color: '#3b82f6', soft: '#60a5fa', dim: 'rgba(59,130,246,0.18)', border: 'rgba(59,130,246,0.4)' },
  { key: 'purple', label: 'PURPLE TEAM', sub: 'Telemetry & improvement logging',  color: '#8b5cf6', soft: '#a78bfa', dim: 'rgba(139,92,246,0.18)', border: 'rgba(139,92,246,0.4)' },
];

const STORAGE_KEY = 'cp_mobile_intro_seen';
const COMPACT_KEY = 'cp_mobile_compact';

// ── Main component ─────────────────────────────────────────────────────────
export default function SignalLost() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gateState, setGateState] = useState<GateState>('idle');
  const [logoPos, setLogoPos] = useState({ x: 0, y: 0 });
  const [scannerPos, setScannerPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [statusText, setStatusText] = useState('SIGNAL LOST');
  const [subText, setSubText] = useState('full-spectrum viewport required');
  const [scannerColor, setScannerColor] = useState('#e53e3e');
  const [compactMode, setCompactMode] = useState(false);
  const [showAuthReveal, setShowAuthReveal] = useState(false);
  const [checking, setChecking] = useState(true);

  // Verificar sessão ativa — redirecionar direto pro hub se já autenticado
  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' })
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (d?.user) { window.location.href = '/home'; }
        else { setChecking(false); }
      })
      .catch(() => setChecking(false));
  }, []);


  const logoRef = useRef<HTMLDivElement>(null);
  const scannerRef = useRef<HTMLDivElement>(null);
  const holdTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const holdStartRef = useRef<number>(0);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const stateRef = useRef<GateState>('idle');

  stateRef.current = gateState;

  // Check localStorage for intro seen
  useEffect(() => {
    const seen = localStorage.getItem(STORAGE_KEY);
    const compact = localStorage.getItem(COMPACT_KEY);
    if (seen === 'true') setCompactMode(compact !== 'false');
  }, []);

  useEffect(() => {
    if (canvasRef.current) return initBg(canvasRef.current);
  }, []);

  // Bloquear context menu e seleção nativa do browser no mobile
  useEffect(() => {
    const blockContextMenu = (e: Event) => e.preventDefault();
    const blockTouchCallout = (e: TouchEvent) => {
      // Só bloqueia se o toque está no logo
      if ((e.target as HTMLElement)?.closest('[data-logo]')) {
        e.preventDefault();
      }
    };
    document.addEventListener('contextmenu', blockContextMenu);
    document.addEventListener('touchstart', blockTouchCallout, { passive: false });
    return () => {
      document.removeEventListener('contextmenu', blockContextMenu);
      document.removeEventListener('touchstart', blockTouchCallout);
    };
  }, []);

  // Position scanner at center
  useEffect(() => {
    const updateScannerPos = () => {
      if (scannerRef.current) {
        const rect = scannerRef.current.getBoundingClientRect();
        setScannerPos({ x: rect.left + rect.width/2, y: rect.top + rect.height/2 });
      }
    };
    updateScannerPos();
    window.addEventListener('resize', updateScannerPos);
    return () => window.removeEventListener('resize', updateScannerPos);
  }, []);

  // ── Compact mode: tap & hold 0.8s ──────────────────────────────────────
  const startCompactHold = useCallback(() => {
    if (stateRef.current !== 'idle') return;
    holdStartRef.current = Date.now();
    setGateState('armed');
    setStatusText('scanning for secure token...');
    setScannerColor('#f59e0b');

    holdTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - holdStartRef.current;
      const dur = 800;
      setHoldProgress(Math.min(elapsed / dur, 1));
      if (elapsed >= dur) {
        clearInterval(holdTimerRef.current!);
        triggerLockSequence();
      }
    }, 16);
  }, []);

  // ── Full mode: tap & hold 1.5s → drag ──────────────────────────────────
  const startFullHold = useCallback((e: React.PointerEvent) => {
    if (stateRef.current !== 'idle') return;
    holdStartRef.current = Date.now();

    const logoEl = logoRef.current!;
    const rect = logoEl.getBoundingClientRect();
    dragOffsetRef.current = {
      x: e.clientX - rect.left - rect.width/2,
      y: e.clientY - rect.top - rect.height/2,
    };

    holdTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - holdStartRef.current;
      const dur = 1500;
      setHoldProgress(Math.min(elapsed / dur, 1));
      if (elapsed >= dur) {
        clearInterval(holdTimerRef.current!);
        setGateState('armed');
        setStatusText('beacon detected');
        setSubText('drag seal to scanner to authenticate');
        setScannerColor('#f59e0b');
        setIsDragging(true);
        // Haptic
        if (navigator.vibrate) navigator.vibrate([30, 20, 30]);
      }
    }, 16);
  }, []);

  const cancelHold = useCallback(() => {
    if (holdTimerRef.current) clearInterval(holdTimerRef.current);
    if (stateRef.current === 'idle') {
      setHoldProgress(0);
    }
  }, []);

  const onPointerMove = useCallback((e: PointerEvent) => {
    if (!isDragging || stateRef.current !== 'armed') return;
    e.preventDefault();

    const newX = e.clientX - dragOffsetRef.current.x;
    const newY = e.clientY - dragOffsetRef.current.y;
    setLogoPos({ x: newX, y: newY });

    // Check proximity to scanner (snap zone ~80px)
    const dx = e.clientX - scannerPos.x;
    const dy = e.clientY - scannerPos.y;
    const dist = Math.sqrt(dx*dx + dy*dy);

    if (dist < 80) {
      setStatusText('aligning signal...');
      setScannerColor('#22c55e');
    } else if (dist < 160) {
      setStatusText('beacon detected');
      setScannerColor('#f59e0b');
    } else {
      setStatusText('scanning for secure token...');
      setScannerColor('#f59e0b');
    }
  }, [isDragging, scannerPos]);

  const onPointerUp = useCallback((e: PointerEvent) => {
    if (!isDragging || stateRef.current !== 'armed') return;

    const dx = e.clientX - scannerPos.x;
    const dy = e.clientY - scannerPos.y;
    const dist = Math.sqrt(dx*dx + dy*dy);

    if (dist < 80) {
      // SNAP + LOCK
      setLogoPos({ x: scannerPos.x, y: scannerPos.y });
      triggerLockSequence();
    } else {
      // Too far — reset
      setIsDragging(false);
      setGateState('idle');
      setLogoPos({ x: 0, y: 0 });
      setHoldProgress(0);
      setStatusText('SIGNAL LOST');
      setSubText('full-spectrum viewport required');
      setScannerColor('#e53e3e');
    }
  }, [isDragging, scannerPos]);

  useEffect(() => {
    window.addEventListener('pointermove', onPointerMove, { passive: false });
    window.addEventListener('pointerup', onPointerUp);
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, [onPointerMove, onPointerUp]);

  // ── Lock → Charge → Burst → Auth ───────────────────────────────────────
  const triggerLockSequence = useCallback(() => {
    setGateState('locked');
    setStatusText('signal lock acquired');
    setSubText('admin mobile node detected');
    setScannerColor('#22c55e');
    if (navigator.vibrate) navigator.vibrate([50, 30, 100]);

    setTimeout(() => {
      setGateState('charging');
      setStatusText('authentication corridor opening');
    }, 400);

    setTimeout(() => {
      setGateState('burst');
      setStatusText('secure channel established');
      localStorage.setItem(STORAGE_KEY, 'true');
      localStorage.setItem(COMPACT_KEY, 'true');
    }, 800);

    setTimeout(() => {
      setGateState('auth');
      setShowAuthReveal(true);
    }, 1400);
  }, []);

  const getStatusColor = () => {
    if (gateState === 'locked' || gateState === 'charging' || gateState === 'burst' || gateState === 'auth') return '#22c55e';
    if (gateState === 'armed') return '#f59e0b';
    return 'rgba(255,60,80,0.7)';
  };

  // If auth revealed, show login
  if (showAuthReveal) {
    return <AuthReveal />;
  }

  if (checking) return (
    <div style={{ position: 'fixed', inset: 0, background: '#060610', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
      <div style={{ width: 40, height: 40, border: '2px solid rgba(139,92,246,0.2)', borderTopColor: '#8b5cf6', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: '#020208', overflow: 'hidden',
        touchAction: 'none', userSelect: 'none',
        WebkitUserSelect: 'none', WebkitTouchCallout: 'none',
      }}
      onContextMenu={e => e.preventDefault()}
    >
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />

      {/* Grain */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: .055 }}>
        <svg width="100%" height="100%">
          <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".65" numOctaves="3" stitchTiles="stitch"/></filter>
          <rect width="100%" height="100%" filter="url(#grain)"/>
        </svg>
      </div>

      {/* Scanlines */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,.045) 3px,rgba(0,0,0,.045) 4px)' }} />

      {/* Burst overlay */}
      {(gateState === 'burst' || gateState === 'auth') && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 50, pointerEvents: 'none',
          background: 'radial-gradient(circle at center, rgba(255,255,255,0.95) 0%, rgba(139,92,246,0.8) 30%, rgba(59,130,246,0.4) 60%, transparent 80%)',
          animation: 'sl-burst 0.6s ease-out forwards',
        }} />
      )}

      {/* Charging halo */}
      {gateState === 'charging' && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 40, pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            width: 200, height: 200, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(34,197,94,0.4) 0%, rgba(139,92,246,0.2) 50%, transparent 70%)',
            animation: 'sl-charge 0.4s ease-out forwards',
          }} />
        </div>
      )}

      {/* UI */}
      <div style={{ position: 'relative', zIndex: 10, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

        {/* Top — logo (draggable in full mode) */}
        <div style={{ paddingTop: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, width: '100%', textAlign: 'center' }}>
          {/* Placeholder keeps layout when logo goes fixed */}
          {isDragging && gateState === 'armed' && (
            <div style={{ width: 56, height: 56, flexShrink: 0 }} />
          )}
          <div
            ref={logoRef}
            data-logo="true"
            onPointerDown={compactMode ? startCompactHold : startFullHold}
            onPointerUp={cancelHold}
            onPointerLeave={cancelHold}
            onContextMenu={e => e.preventDefault()}
            onDragStart={e => e.preventDefault()}
            style={{
              position: isDragging && gateState === 'armed' ? 'fixed' : 'relative',
              left: isDragging && gateState === 'armed' ? logoPos.x - 28 : 'auto',
              top: isDragging && gateState === 'armed' ? logoPos.y - 28 : 'auto',
              zIndex: isDragging ? 100 : 1,
              cursor: gateState === 'idle' ? 'grab' : gateState === 'armed' ? 'grabbing' : 'default',
              touchAction: 'none',
              WebkitTouchCallout: 'none',
              WebkitUserSelect: 'none',
              userSelect: 'none',
              flexShrink: 0,
              transition: (gateState === 'locked' || gateState === 'charging') ? 'all 0.3s ease' : 'none',
            }}
          >
            {/* Hold progress ring */}
            {holdProgress > 0 && holdProgress < 1 && (
              <svg style={{ position: 'absolute', inset: -6, width: 68, height: 68, pointerEvents: 'none' }}>
                <circle cx="34" cy="34" r="30" fill="none" stroke="rgba(139,92,246,0.2)" strokeWidth="2"/>
                <circle cx="34" cy="34" r="30" fill="none" stroke="#8b5cf6" strokeWidth="2"
                  strokeDasharray={`${holdProgress * 188.5} 188.5`}
                  strokeLinecap="round"
                  style={{ transform: 'rotate(-90deg)', transformOrigin: '34px 34px', transition: 'stroke-dasharray 50ms linear' }}
                />
              </svg>
            )}
            <div style={{ position: 'relative', width: 64, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
              <div style={{
                position: 'absolute', inset: -8, borderRadius: '50%',
                background: `radial-gradient(circle, ${gateState === 'armed' || gateState === 'locked' ? 'rgba(34,197,94,0.3)' : 'rgba(139,92,246,0.2)'} 0%, rgba(59,130,246,0.1) 50%, transparent 70%)`,
                transition: 'background 300ms',
                animation: gateState === 'armed' ? 'sl-pulse-halo 1s ease-in-out infinite' : 'none',
              }} />
              <img
                src="/logo.png" alt="CYBERSEC LAB"
                draggable={false}
                onContextMenu={e => e.preventDefault()}
                onDragStart={e => e.preventDefault()}
                style={{
                  width: 64, height: 64, objectFit: 'contain', position: 'relative', zIndex: 1,
                  filter: `drop-shadow(0 0 12px ${gateState === 'locked' || gateState === 'charging' ? 'rgba(34,197,94,0.9)' : 'rgba(139,92,246,0.9)'}) drop-shadow(0 0 24px rgba(59,130,246,0.5))`,
                  transition: 'filter 300ms',
                  WebkitTouchCallout: 'none',
                  WebkitUserSelect: 'none',
                  userSelect: 'none',
                  pointerEvents: 'none',
                }}
              />
            </div>
          </div>

          <span style={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700, fontSize: 13, letterSpacing: '.14em', color: '#ffffff', marginTop: 4 }}>CYBERSEC LAB</span>
          <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, color: '#6a6a8a', letterSpacing: '.1em' }}>signal &gt; noise</span>

          {/* Hold hint */}
          {gateState === 'idle' && (
            <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, color: 'rgba(139,92,246,0.4)', letterSpacing: '.08em', marginTop: 8, animation: 'sl-blink-slow 2s ease-in-out infinite' }}>
              {compactMode ? 'hold seal to authenticate' : 'hold seal · drag to scanner'}
            </span>
          )}
        </div>

        {/* Center — scanner + signal lost */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 32px', textAlign: 'center' }}>

          {/* Scanner target */}
          <div ref={scannerRef} style={{ marginBottom: 24, position: 'relative', width: 80, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* Outer ring */}
            <div style={{
              position: 'absolute', inset: 0, borderRadius: '50%',
              border: `1.5px solid ${scannerColor}`,
              boxShadow: `0 0 12px ${scannerColor}, 0 0 24px ${scannerColor}40`,
              transition: 'border-color 300ms, box-shadow 300ms',
              animation: gateState === 'idle' ? 'sl-spin-slow 8s linear infinite' : gateState === 'locked' ? 'sl-scanner-lock 0.3s ease-out forwards' : 'none',
            }} />
            {/* Inner ring */}
            <div style={{
              position: 'absolute', inset: 16, borderRadius: '50%',
              border: `1px solid ${scannerColor}60`,
              transition: 'border-color 300ms',
              animation: gateState === 'idle' ? 'sl-spin-slow 4s linear infinite reverse' : 'none',
            }} />
            {/* Crosshair lines */}
            <div style={{ position: 'absolute', width: 1, height: '100%', background: `${scannerColor}40`, transition: 'background 300ms' }} />
            <div style={{ position: 'absolute', width: '100%', height: 1, background: `${scannerColor}40`, transition: 'background 300ms' }} />
            {/* Center dot */}
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: scannerColor, boxShadow: `0 0 8px ${scannerColor}`, transition: 'background 300ms, box-shadow 300ms' }} />
          </div>

          {/* Status text */}
          <div style={{ position: 'relative', marginBottom: 6 }}>
            <h1 style={{
              fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700,
              fontSize: 'clamp(28px, 9vw, 42px)',
              letterSpacing: '.11em', color: '#fff', margin: 0, lineHeight: 1,
              textShadow: `0 0 30px ${getStatusColor()}, 0 0 60px ${getStatusColor()}40`,
              animation: gateState === 'idle' ? 'sl-flicker 9s ease-in-out infinite' : 'none',
              transition: 'text-shadow 400ms',
            }}>
              {gateState === 'idle' ? 'SIGNAL LOST' :
               gateState === 'armed' ? 'BEACON DETECTED' :
               gateState === 'locked' ? 'SIGNAL LOCKED' :
               gateState === 'charging' ? 'AUTHENTICATING' :
               'ACCESS GRANTED'}
            </h1>
          </div>

          <div style={{ width: 56, height: 1, background: `linear-gradient(90deg,transparent,${getStatusColor()},transparent)`, margin: '16px auto 16px', transition: 'background 400ms' }} />

          <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, color: 'rgba(220,215,240,.65)', lineHeight: 1.7, maxWidth: 260, margin: 0 }}>
            {statusText}
          </p>
          {subText && (
            <p style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: 'rgba(145,135,195,.5)', lineHeight: 1.6, maxWidth: 252, margin: '6px 0 0', letterSpacing: '.04em' }}>
              {subText}
            </p>
          )}
        </div>

        {/* Bottom — badges carousel */}
        <div style={{ width: '100%', paddingBottom: 52, overflow: 'hidden' }}>
          <div style={{ position: 'relative', overflow: 'hidden', maskImage: 'linear-gradient(90deg,transparent,black 15%,black 85%,transparent)', WebkitMaskImage: 'linear-gradient(90deg,transparent,black 15%,black 85%,transparent)' }}>
            <div style={{ display: 'flex', gap: 12, animation: 'sl-carousel 12s linear infinite', width: 'max-content' }}>
              {[...TEAMS, ...TEAMS, ...TEAMS].map((t, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '8px 16px', borderRadius: 8, background: t.dim, border: `1px solid ${t.border}`, backdropFilter: 'blur(8px)', flexShrink: 0 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={t.color} strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  <div>
                    <div style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 10, fontWeight: 700, letterSpacing: '.1em', color: t.soft }}>{t.label}</div>
                    <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 9, color: 'rgba(150,145,190,.55)' }}>{t.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Terminal */}
          <div style={{ padding: '14px 24px 0', fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: 'rgba(140,130,190,.38)', lineHeight: 2.1, letterSpacing: '.04em' }}>
            {[
              { text: 'initializing interface...', color: 'rgba(140,130,190,.38)', delay: '0s' },
              { text: gateState !== 'idle' ? statusText : 'viewport mismatch detected', color: gateState !== 'idle' ? 'rgba(34,197,94,.6)' : 'rgba(255,175,55,.55)', delay: '.7s' },
              { text: gateState === 'locked' || gateState === 'charging' || gateState === 'burst' ? 'authentication corridor opening' : 'rendering aborted', color: gateState !== 'idle' ? 'rgba(34,197,94,.8)' : 'rgba(255,55,75,.6)', delay: '1.4s' },
            ].map(l => (
              <div key={l.text} style={{ display: 'flex', gap: 8, animation: `sl-in .3s ease-out ${l.delay} both`, transition: 'color 400ms' }}>
                <span style={{ color: 'rgba(255,55,75,.4)' }}>▸</span>
                <span style={{ color: l.color }}>{l.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700&family=Inter:wght@400&family=JetBrains+Mono:wght@400&display=swap');
        * { -webkit-touch-callout: none; }
        canvas { touch-action: none; }
        @keyframes sl-flicker { 0%,93%,100%{opacity:1} 94%{opacity:.82} 95%{opacity:1} 97%{opacity:.9} 98%{opacity:1} }
        @keyframes sl-spin-slow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes sl-pulse-halo { 0%,100%{opacity:0.6;transform:scale(1)} 50%{opacity:1;transform:scale(1.15)} }
        @keyframes sl-scanner-lock { 0%{transform:scale(1)} 50%{transform:scale(1.2)} 100%{transform:scale(1)} }
        @keyframes sl-carousel { from{transform:translateX(0)} to{transform:translateX(calc(-100%/3))} }
        @keyframes sl-in { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:translateY(0)} }
        @keyframes sl-blink-slow { 0%,100%{opacity:0.4} 50%{opacity:0.8} }
        @keyframes sl-charge { from{transform:scale(0.3);opacity:0} to{transform:scale(1.5);opacity:0} }
        @keyframes sl-burst {
          0%{opacity:0}
          15%{opacity:1}
          60%{opacity:0.6}
          100%{opacity:0}
        }
      `}</style>
    </div>
  );
}

// ── Auth reveal — clean login form ──────────────────────────────────────────
function AuthReveal() {
  const [identifier, setIdentifier] = useState('');
  const [passphrase, setPassphrase] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'appear' | 'ready'>('appear');

  useEffect(() => {
    setTimeout(() => setStep('ready'), 400);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, passphrase }),
      });
      const data = await res.json();
      if (res.ok) {
        window.location.href = '/home';
      } else {
        setError(data.error ?? 'Could not verify credentials.');
      }
    } catch {
      setError('Could not verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'linear-gradient(180deg, #0a0618 0%, #050310 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '24px',
      animation: 'auth-reveal 0.5s ease-out both',
      fontFamily: 'sans-serif',
    }}>
      {/* Nebula glow */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse at 50% 40%, rgba(139,92,246,0.12) 0%, transparent 65%)' }} />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 340, opacity: step === 'appear' ? 0 : 1, transform: step === 'appear' ? 'translateY(12px)' : 'translateY(0)', transition: 'all 0.4s ease-out' }}>

        {/* Logo + brand — centered, orange neon glow */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: 28 }}>
          <div style={{ position: 'relative', width: 72, height: 72, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
            {/* Orange neon pulse layers */}
            <div style={{
              position: 'absolute', inset: -12, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,120,20,0.35) 0%, rgba(255,80,0,0.15) 50%, transparent 70%)',
              animation: 'auth-neon-pulse 1.8s ease-in-out infinite',
            }} />
            <div style={{
              position: 'absolute', inset: -4, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,140,40,0.25) 0%, transparent 60%)',
              animation: 'auth-neon-pulse 1.8s ease-in-out 0.3s infinite',
            }} />
            <img src="/logo.png" alt="CYBERSEC LAB" style={{
              width: 72, height: 72, objectFit: 'contain', position: 'relative', zIndex: 1,
              filter: 'drop-shadow(0 0 14px rgba(255,120,20,0.9)) drop-shadow(0 0 28px rgba(255,80,0,0.5))',
            }} />
          </div>
          <div style={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700, fontSize: 15, letterSpacing: '.14em', color: '#f0eeff' }}>CYBERSEC LAB</div>
          <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, color: 'rgba(255,140,40,0.7)', letterSpacing: '.1em', marginTop: 4 }}>● SECURE CHANNEL ESTABLISHED</div>
        </div>

        {/* Auth card */}
        <div style={{ background: 'rgba(10,6,30,0.8)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 16, padding: '24px 20px', backdropFilter: 'blur(20px)', boxShadow: '0 0 0 1px rgba(139,92,246,0.08), 0 24px 64px rgba(0,0,0,0.6)' }}>

          <div style={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700, fontSize: 16, letterSpacing: '.12em', color: '#f0eeff', textAlign: 'center', marginBottom: 4 }}>IDENTIFY</div>
          <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, color: 'rgba(139,92,246,0.5)', textAlign: 'center', letterSpacing: '.08em', marginBottom: 20 }}>admin mobile node · authenticate to proceed</div>

          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderRadius: 8, background: 'rgba(229,62,62,0.1)', border: '1px solid rgba(229,62,62,0.25)', fontSize: 12, color: '#ff6b6b', marginBottom: 14 }}>
              ⚠ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Identifier */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(5,5,20,0.7)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '0 14px', height: 46 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(139,92,246,0.5)" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              <input
                type="text" placeholder="Identifier" value={identifier}
                onChange={e => setIdentifier(e.target.value)}
                style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: '#e8e4ff', fontSize: 14, fontFamily: '"Inter", sans-serif' }}
              />
            </div>

            {/* Passphrase */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(5,5,20,0.7)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '0 14px', height: 46 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(139,92,246,0.5)" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
              <input
                type={showPass ? 'text' : 'password'} placeholder="Passphrase" value={passphrase}
                onChange={e => setPassphrase(e.target.value)}
                style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: '#e8e4ff', fontSize: 14, fontFamily: '"Inter", sans-serif' }}
              />
              <button type="button" onClick={() => setShowPass(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(139,92,246,0.5)', padding: 0 }}>
                {showPass
                  ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                }
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit" disabled={loading}
              style={{
                width: '100%', height: 46, borderRadius: 8, border: 'none', cursor: loading ? 'wait' : 'pointer',
                background: loading ? 'rgba(139,92,246,0.3)' : 'linear-gradient(135deg, rgba(229,62,62,0.8), rgba(139,92,246,0.9), rgba(59,130,246,0.8))',
                color: '#ffffff', fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700,
                fontSize: 12, letterSpacing: '.14em', marginTop: 4,
                boxShadow: loading ? 'none' : '0 0 20px rgba(139,92,246,0.3)',
                transition: 'all 200ms',
              }}
            >
              {loading ? 'AUTHENTICATING...' : 'AUTHENTICATE'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <a href="#" style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: 'rgba(139,92,246,0.4)', letterSpacing: '.06em', textDecoration: 'none' }}>Forgot passphrase</a>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes auth-reveal { from{opacity:0;background:white} 30%{opacity:1} to{opacity:1} }
        @keyframes auth-neon-pulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.12); }
        }
      `}</style>
    </div>
  );
}
