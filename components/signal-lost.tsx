'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { touchSessionActivity } from '@/lib/session-activity';

// ── Canvas background — Living Cosmos ─────────────────────────────────────
function initBg(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d')!;
  let W = 0, H = 0, animId: number, lastT = 0;
  let glitchOn = false, glitchStr = 0;

  // Three parallax star layers — different sizes, speeds, colors
  type Star = { x: number; y: number; r: number; a: number; ts: number; to: number; layer: number };
  // Free-angle comets — direction, speed, angle all random
  type Comet = {
    x: number; y: number;
    vx: number; vy: number;
    len: number; width: number; alpha: number;
    hue: number; // color variation
    life: number; maxLife: number; // fade in/out
  };
  // Cosmic dust — slow drifting particles
  type Dust = { x: number; y: number; vx: number; vy: number; r: number; a: number; pulse: number };
  // Occasional dramatic shooting star
  type ShootingStar = { x: number; y: number; vx: number; vy: number; len: number; alpha: number; active: boolean; timer: number };

  let stars: Star[] = [];
  let comets: Comet[] = [];
  let dust: Dust[] = [];
  let shootingStar: ShootingStar = { x: 0, y: 0, vx: 0, vy: 0, len: 0, alpha: 0, active: false, timer: 0 };

  // Nebula state — slowly evolving colors
  let nebulaPhase = 0;

  function spawnComet(): Comet {
    // Random angle — true free direction, not just horizontal
    const angle = Math.random() * Math.PI * 2;
    const speed = 0.4 + Math.random() * 1.1;
    // Start from outside viewport
    const edge = Math.floor(Math.random() * 4); // 0=top, 1=right, 2=bottom, 3=left
    let x, y;
    if (edge === 0) { x = Math.random() * W; y = -50; }
    else if (edge === 1) { x = W + 50; y = Math.random() * H; }
    else if (edge === 2) { x = Math.random() * W; y = H + 50; }
    else { x = -50; y = Math.random() * H; }
    // Direction toward viewport center with some randomness
    const toCx = W/2 + (Math.random() - 0.5) * W * 0.6 - x;
    const toCy = H/2 + (Math.random() - 0.5) * H * 0.6 - y;
    const len = Math.sqrt(toCx*toCx + toCy*toCy);
    const vx = (toCx/len) * speed;
    const vy = (toCy/len) * speed;
    return {
      x, y, vx, vy,
      len: 60 + Math.random() * 140,
      width: 0.8 + Math.random() * 1.6,
      alpha: 0,
      hue: Math.random() < 0.5 ? 260 + Math.random() * 60 : // purple-blue
            Math.random() < 0.5 ? 200 + Math.random() * 40 : // cyan-blue
            330 + Math.random() * 30,                          // red-pink
      life: 0,
      maxLife: 180 + Math.random() * 280,
    };
  }

  function spawnShootingStar() {
    const startX = Math.random() * W * 0.8;
    const startY = Math.random() * H * 0.3;
    const angle = Math.PI * 0.15 + Math.random() * Math.PI * 0.2; // mostly diagonal
    const speed = 6 + Math.random() * 8;
    shootingStar = {
      x: startX, y: startY,
      vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
      len: 120 + Math.random() * 200,
      alpha: 0.9,
      active: true,
      timer: 0,
    };
  }

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    const count = Math.min(Math.floor((W * H) / 900), 500);
    stars = Array.from({ length: count }, () => {
      const layer = Math.floor(Math.random() * 3); // 0=far, 1=mid, 2=near
      return {
        x: Math.random() * W, y: Math.random() * H,
        r: layer === 0 ? Math.random() * 0.8 + 0.2
         : layer === 1 ? Math.random() * 1.2 + 0.5
         : Math.random() * 2.0 + 0.8,
        a: layer === 0 ? Math.random() * 0.5 + 0.15
         : layer === 1 ? Math.random() * 0.6 + 0.2
         : Math.random() * 0.85 + 0.3,
        ts: layer === 0 ? Math.random() * 0.008 + 0.002
          : layer === 1 ? Math.random() * 0.015 + 0.006
          : Math.random() * 0.025 + 0.012,
        to: Math.random() * Math.PI * 2,
        layer,
      };
    });
    comets = Array.from({ length: 7 }, () => spawnComet());
    dust = Array.from({ length: 60 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.12, vy: (Math.random() - 0.5) * 0.08,
      r: Math.random() * 1.0 + 0.3,
      a: Math.random() * 0.25 + 0.05,
      pulse: Math.random() * Math.PI * 2,
    }));
  }

  function drawBg(t: number) {
    // Deep space base — subtle position variation for living feel
    const cx = W * 0.5 + Math.sin(t * 0.00008) * W * 0.04;
    const cy = H * 0.42 + Math.cos(t * 0.00006) * H * 0.03;
    const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(W, H) * 0.9);
    bg.addColorStop(0, '#14102a');
    bg.addColorStop(0.3, '#0c0818');
    bg.addColorStop(0.7, '#06040e');
    bg.addColorStop(1, '#020208');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Evolving nebulae — 4 clouds with phase-shifted pulse
    nebulaPhase = t * 0.00018;
    const nebulae = [
      { x: W*0.22, y: H*0.20, r: W*0.85, c: [120, 30, 200], a: 0.13 + 0.04*Math.sin(nebulaPhase) },
      { x: W*0.80, y: H*0.25, r: W*0.60, c: [200, 30, 70],  a: 0.10 + 0.03*Math.sin(nebulaPhase + 1.2) },
      { x: W*0.50, y: H*0.65, r: W*0.55, c: [40, 60, 180],  a: 0.08 + 0.03*Math.sin(nebulaPhase + 2.4) },
      { x: W*0.08, y: H*0.78, r: W*0.45, c: [180, 40, 30],  a: 0.07 + 0.02*Math.sin(nebulaPhase + 3.6) },
    ];
    for (const n of nebulae) {
      const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r);
      g.addColorStop(0, `rgba(${n.c[0]},${n.c[1]},${n.c[2]},${n.a})`);
      g.addColorStop(0.45, `rgba(${n.c[0]},${n.c[1]},${n.c[2]},${n.a * 0.3})`);
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    }
  }

  function drawStars(t: number) {
    for (const s of stars) {
      const tw = 0.5 + 0.5 * Math.sin(t * s.ts + s.to);
      const brightness = s.a * (0.55 + 0.45 * tw);
      // Layer-specific colors: far=cold white, mid=warm white, near=slight color
      const color = s.layer === 0
        ? `rgba(200,205,240,${brightness})`
        : s.layer === 1
        ? `rgba(220,215,255,${brightness})`
        : `rgba(240,235,255,${brightness})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r * (0.85 + 0.15 * tw), 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      // Near stars get a tiny cross-flare at peak brightness
      if (s.layer === 2 && tw > 0.85) {
        const fl = (tw - 0.85) / 0.15;
        ctx.strokeStyle = `rgba(240,235,255,${fl * 0.3})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(s.x - s.r * 2.5, s.y);
        ctx.lineTo(s.x + s.r * 2.5, s.y);
        ctx.moveTo(s.x, s.y - s.r * 2.5);
        ctx.lineTo(s.x, s.y + s.r * 2.5);
        ctx.stroke();
      }
    }
  }

  function drawDust(t: number) {
    for (const p of dust) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < -5) p.x = W + 5; if (p.x > W + 5) p.x = -5;
      if (p.y < -5) p.y = H + 5; if (p.y > H + 5) p.y = -5;
      p.pulse += 0.018;
      const fl = 0.6 + 0.4 * Math.sin(p.pulse);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(180,170,230,${p.a * fl})`;
      ctx.fill();
    }
  }

  function drawComets(t: number) {
    for (let i = 0; i < comets.length; i++) {
      const c = comets[i];
      c.x += c.vx; c.y += c.vy;
      c.life++;

      // Fade in first 20 frames, fade out last 40
      if (c.life < 20) c.alpha = (c.life / 20) * (0.15 + Math.random() * 0.25);
      else if (c.life > c.maxLife - 40) c.alpha *= 0.96;

      // Offscreen or expired — respawn
      if (c.life > c.maxLife || c.x < -200 || c.x > W + 200 || c.y < -200 || c.y > H + 200) {
        comets[i] = spawnComet();
        continue;
      }

      // Draw trail
      const tailX = c.x - c.vx * (c.len / Math.sqrt(c.vx*c.vx + c.vy*c.vy));
      const tailY = c.y - c.vy * (c.len / Math.sqrt(c.vx*c.vx + c.vy*c.vy));
      const trail = ctx.createLinearGradient(c.x, c.y, tailX, tailY);
      trail.addColorStop(0, `hsla(${c.hue},80%,80%,${c.alpha})`);
      trail.addColorStop(0.3, `hsla(${c.hue},60%,70%,${c.alpha * 0.5})`);
      trail.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.save();
      ctx.lineWidth = c.width;
      ctx.lineCap = 'round';
      ctx.strokeStyle = trail;
      ctx.beginPath();
      ctx.moveTo(c.x, c.y);
      ctx.lineTo(tailX, tailY);
      ctx.stroke();
      // Head glow
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.width * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${c.hue},90%,90%,${c.alpha * 0.8})`;
      ctx.fill();
      ctx.restore();
    }
  }

  function drawShootingStar(t: number) {
    // Schedule next shooting star
    if (!shootingStar.active) {
      shootingStar.timer++;
      if (shootingStar.timer > 280 + Math.random() * 400) {
        spawnShootingStar();
      }
      return;
    }
    shootingStar.x += shootingStar.vx;
    shootingStar.y += shootingStar.vy;
    shootingStar.alpha -= 0.018;
    if (shootingStar.alpha <= 0 || shootingStar.x > W + 100 || shootingStar.y > H + 100) {
      shootingStar.active = false;
      shootingStar.timer = 0;
      return;
    }
    const spd = Math.sqrt(shootingStar.vx * shootingStar.vx + shootingStar.vy * shootingStar.vy);
    const tx = shootingStar.x - shootingStar.vx * (shootingStar.len / (spd || 1));
    const ty = shootingStar.y - shootingStar.vy * (shootingStar.len / (spd || 1));
    const g = ctx.createLinearGradient(shootingStar.x, shootingStar.y, tx, ty);
    g.addColorStop(0, `rgba(255,255,255,${shootingStar.alpha})`);
    g.addColorStop(0.4, `rgba(200,210,255,${shootingStar.alpha * 0.5})`);
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.save();
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = g;
    ctx.beginPath();
    ctx.moveTo(shootingStar.x, shootingStar.y);
    ctx.lineTo(tx, ty);
    ctx.stroke();
    // Bright head
    ctx.beginPath();
    ctx.arc(shootingStar.x, shootingStar.y, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${shootingStar.alpha})`;
    ctx.fill();
    ctx.restore();
  }

  function drawGlitch() {
    if (!glitchOn) return;
    for (let i = 0; i < Math.floor(glitchStr * 14); i++) {
      const y = Math.random() * H, h2 = Math.random() * 3 + 1;
      ctx.fillStyle = `rgba(${Math.random() > 0.5 ? '255,40,80' : '20,120,255'},${Math.random() * 0.13})`;
      ctx.fillRect(0, y, W, h2);
    }
  }

  function drawVignette() {
    const vig = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, Math.max(W, H) * 0.72);
    vig.addColorStop(0, 'rgba(0,0,0,0)');
    vig.addColorStop(1, 'rgba(0,0,0,0.82)');
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, W, H);
  }

  function render(t: number) {
    // ~40fps — smooth enough for cosmos, easy on battery
    if (t - lastT < 24) { animId = requestAnimationFrame(render); return; }
    lastT = t;
    ctx.clearRect(0, 0, W, H);
    drawBg(t);
    drawStars(t);
    drawDust(t);
    drawComets(t);
    drawShootingStar(t);
    drawGlitch();
    drawVignette();
    animId = requestAnimationFrame(render);
  }

  function scheduleGlitch() {
    setTimeout(() => {
      glitchOn = true; glitchStr = 0.35 + Math.random() * 0.65;
      setTimeout(() => { glitchOn = false; glitchStr = 0; scheduleGlitch(); }, 55 + Math.random() * 230);
    }, 1200 + Math.random() * 3800);
  }

  resize();
  window.addEventListener('resize', resize);
  animId = requestAnimationFrame(render);
  scheduleGlitch();
  // Schedule first shooting star after a short delay
  setTimeout(spawnShootingStar, 2000 + Math.random() * 3000);
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
const DEFAULT_STATUS = 'SIGNAL LOST';
const DEFAULT_SUBTEXT = 'full-spectrum viewport required';
const RIDDLE_HINT = 'the patient sigil wakes the silent eye';
const LOGO_SIZE = 64;
const LOGO_RADIUS = LOGO_SIZE / 2;

function clampCenterPosition(x: number, y: number) {
  if (typeof window === 'undefined') return { x, y };

  return {
    x: Math.min(Math.max(x, LOGO_RADIUS), window.innerWidth - LOGO_RADIUS),
    y: Math.min(Math.max(y, LOGO_RADIUS), window.innerHeight - LOGO_RADIUS),
  };
}

// ── HiddenStar — living solar easter egg trigger ───────────────────────────
// A distant sun pulsing with Red/Blue/Purple energy. Tap to reset the long animation.
function HiddenStar({ onActivate }: { onActivate: () => void }) {
  return (
    <button
      type="button"
      onClick={onActivate}
      aria-label="cosmic relay"
      title="⟳"
      style={{
        position: 'absolute',
        top: '7%',
        right: '5%',
        width: 36,
        height: 36,
        padding: 0,
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        zIndex: 30,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Outer corona — slow tricolor rotation */}
      <span style={{
        position: 'absolute',
        inset: -8,
        borderRadius: '50%',
        background: 'conic-gradient(rgba(229,62,62,0.18), rgba(59,130,246,0.18), rgba(139,92,246,0.22), rgba(229,62,62,0.18))',
        animation: 'hs-corona-spin 8s linear infinite',
        filter: 'blur(4px)',
      }} />
      {/* Mid glow ring */}
      <span style={{
        position: 'absolute',
        inset: -2,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,220,140,0.35) 0%, rgba(255,160,40,0.15) 50%, transparent 75%)',
        animation: 'hs-pulse 2.4s ease-in-out infinite',
      }} />
      {/* Star rays — 8 thin spikes */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
        <span key={i} style={{
          position: 'absolute',
          width: i % 2 === 0 ? 22 : 14,
          height: 1.5,
          background: `rgba(255, ${180 + i * 8}, ${80 + i * 12}, ${0.35 - i * 0.02})`,
          borderRadius: 1,
          transformOrigin: 'left center',
          transform: `rotate(${deg}deg) translateX(7px)`,
          animation: `hs-ray-pulse 2.4s ease-in-out ${i * 0.15}s infinite`,
          filter: 'blur(0.5px)',
        }} />
      ))}
      {/* Core star — warm white with orange tint */}
      <span style={{
        position: 'relative',
        zIndex: 2,
        width: 10,
        height: 10,
        borderRadius: '50%',
        background: 'radial-gradient(circle, #fff9f0 0%, #ffd080 50%, #ff8020 100%)',
        boxShadow: [
          '0 0 6px rgba(255,220,140,0.9)',
          '0 0 14px rgba(255,160,40,0.6)',
          '0 0 28px rgba(229,62,62,0.2)',
          '0 0 40px rgba(59,130,246,0.15)',
        ].join(', '),
        animation: 'hs-core-pulse 2.4s ease-in-out infinite',
        display: 'block',
      }} />

      <style>{`
        @keyframes hs-corona-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes hs-pulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50%       { opacity: 1;   transform: scale(1.18); }
        }
        @keyframes hs-core-pulse {
          0%, 100% { transform: scale(1);    box-shadow: 0 0 6px rgba(255,220,140,0.9), 0 0 14px rgba(255,160,40,0.6); }
          50%       { transform: scale(1.15); box-shadow: 0 0 10px rgba(255,220,140,1), 0 0 24px rgba(255,160,40,0.8), 0 0 40px rgba(255,80,20,0.3); }
        }
        @keyframes hs-ray-pulse {
          0%, 100% { opacity: 0.3; transform: rotate(var(--rot, 0deg)) translateX(7px) scaleX(1); }
          50%       { opacity: 0.7; transform: rotate(var(--rot, 0deg)) translateX(7px) scaleX(1.3); }
        }
      `}</style>
    </button>
  );
}

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
    fetch('/api/auth/me', { credentials: 'include', cache: 'no-store' })
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
  const pointerOriginRef = useRef({ x: 0, y: 0 });
  const stateRef = useRef<GateState>('idle');

  stateRef.current = gateState;

  // Check localStorage for intro seen
  useEffect(() => {
    const seen = localStorage.getItem(STORAGE_KEY);
    const compact = localStorage.getItem(COMPACT_KEY);
    if (seen === 'true') setCompactMode(compact !== 'false');
  }, []);

  const resetGate = useCallback(() => {
    if (holdTimerRef.current) {
      clearInterval(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    setGateState('idle');
    setIsDragging(false);
    setHoldProgress(0);
    setLogoPos({ x: 0, y: 0 });
    setStatusText(DEFAULT_STATUS);
    setSubText(DEFAULT_SUBTEXT);
    setScannerColor('#e53e3e');
  }, []);

  const restoreFullGate = useCallback(() => {
    localStorage.setItem(COMPACT_KEY, 'false');
    setCompactMode(false);
    setShowAuthReveal(false);
    resetGate();
  }, [resetGate]);

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
    if (holdTimerRef.current) clearInterval(holdTimerRef.current);
    holdStartRef.current = Date.now();
    setHoldProgress(0);
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
    if (holdTimerRef.current) clearInterval(holdTimerRef.current);
    holdStartRef.current = Date.now();
    pointerOriginRef.current = clampCenterPosition(e.clientX, e.clientY);
    setHoldProgress(0);

    holdTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - holdStartRef.current;
      const dur = 1500;
      setHoldProgress(Math.min(elapsed / dur, 1));
      if (elapsed >= dur) {
        clearInterval(holdTimerRef.current!);
        setGateState('armed');
        setStatusText('beacon detected');
        setSubText(RIDDLE_HINT);
        setScannerColor('#f59e0b');
        setIsDragging(true);
        setLogoPos(pointerOriginRef.current);
        // Haptic
        if (navigator.vibrate) navigator.vibrate([30, 20, 30]);
      }
    }, 16);
  }, []);

  const cancelHold = useCallback(() => {
    if (holdTimerRef.current) clearInterval(holdTimerRef.current);
    holdTimerRef.current = null;
    if (!isDragging && (stateRef.current === 'idle' || stateRef.current === 'armed')) {
      resetGate();
    }
  }, [isDragging, resetGate]);

  const onPointerMove = useCallback((e: PointerEvent) => {
    if (!isDragging || stateRef.current !== 'armed') return;
    e.preventDefault();

    const nextPos = clampCenterPosition(e.clientX, e.clientY);
    setLogoPos(nextPos);

    // Check proximity to scanner (snap zone ~80px)
    const dx = nextPos.x - scannerPos.x;
    const dy = nextPos.y - scannerPos.y;
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

    const nextPos = clampCenterPosition(e.clientX, e.clientY);
    const dx = nextPos.x - scannerPos.x;
    const dy = nextPos.y - scannerPos.y;
    const dist = Math.sqrt(dx*dx + dy*dy);

    if (dist < 80) {
      // SNAP + LOCK
      setLogoPos({ x: scannerPos.x, y: scannerPos.y });
      triggerLockSequence();
    } else {
      // Too far — reset
      resetGate();
    }
  }, [isDragging, resetGate, scannerPos]);

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
    setIsDragging(false);
    setHoldProgress(0);
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
    return <AuthReveal onReset={restoreFullGate} />;
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
      <HiddenStar onActivate={restoreFullGate} />

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
              left: isDragging && gateState === 'armed' ? logoPos.x - LOGO_RADIUS : 'auto',
              top: isDragging && gateState === 'armed' ? logoPos.y - LOGO_RADIUS : 'auto',
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
                src="/logo.png" alt="CYBERSEC HUB"
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

          <span data-auth-brand style={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700, fontSize: 13, letterSpacing: '.14em', color: '#ffffff', marginTop: 4 }}>CYBERSEC HUB</span>
          <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, color: '#6a6a8a', letterSpacing: '.1em' }}>signal &gt; noise</span>

          {/* Hold hint */}
          {gateState === 'idle' && (
            <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, color: 'rgba(34,197,94,0.72)', letterSpacing: '.08em', marginTop: 8, animation: 'sl-blink-slow 2s ease-in-out infinite' }}>
              {RIDDLE_HINT}
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
function AuthReveal({ onReset }: { onReset: () => void }) {
  const [identifier, setIdentifier] = useState('');
  const [passphrase, setPassphrase] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'appear' | 'ready'>('appear');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setTimeout(() => setStep('ready'), 400);
  }, []);

  useEffect(() => {
    if (canvasRef.current) return initBg(canvasRef.current);
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
        touchSessionActivity();
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
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
      <HiddenStar onActivate={onReset} />
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
            <img src="/logo.png" alt="CYBERSEC HUB" style={{
              width: 72, height: 72, objectFit: 'contain', position: 'relative', zIndex: 1,
              filter: 'drop-shadow(0 0 14px rgba(255,120,20,0.9)) drop-shadow(0 0 28px rgba(255,80,0,0.5))',
            }} />
          </div>
          <div data-auth-brand style={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700, fontSize: 15, letterSpacing: '.14em', color: '#f0eeff' }}>CYBERSEC HUB</div>
          <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, color: 'rgba(255,140,40,0.7)', letterSpacing: '.1em', marginTop: 4 }}>● SECURE CHANNEL ESTABLISHED</div>
        </div>

        {/* Auth card */}
        <div style={{ background: 'rgba(10,6,30,0.8)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 16, padding: '24px 20px', backdropFilter: 'blur(20px)', boxShadow: '0 0 0 1px rgba(139,92,246,0.08), 0 24px 64px rgba(0,0,0,0.6)' }}>

          <div data-auth-title style={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700, fontSize: 16, letterSpacing: '.12em', color: '#f0eeff', textAlign: 'center', marginBottom: 4 }}>IDENTIFY</div>
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
