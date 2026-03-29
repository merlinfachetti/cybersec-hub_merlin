/**
 * lib/cosmos-bg.ts
 * Shared living cosmos canvas — used by:
 *   - Login page (desktop)
 *   - Signal Lost mobile gate
 *   - Auth reveal mobile login
 *   - Threat Universe (has its own extended version with nodes)
 *
 * Single source of truth for the "space" aesthetic.
 */

export function initCosmosBg(canvas: HTMLCanvasElement): () => void {
  const ctx = canvas.getContext('2d')!;
  let W = 0, H = 0, animId: number, lastT = 0;
  let glitchOn = false, glitchStr = 0;

  type Star = { x: number; y: number; r: number; a: number; ts: number; to: number; layer: number };
  type Comet = { x: number; y: number; vx: number; vy: number; len: number; width: number; alpha: number; hue: number; life: number; maxLife: number };
  type Dust = { x: number; y: number; vx: number; vy: number; r: number; a: number; pulse: number };
  type ShootingStar = { x: number; y: number; vx: number; vy: number; len: number; alpha: number; active: boolean; timer: number };

  let stars: Star[] = [];
  let comets: Comet[] = [];
  let dust: Dust[] = [];
  let shootingStar: ShootingStar = { x: 0, y: 0, vx: 0, vy: 0, len: 0, alpha: 0, active: false, timer: 0 };

  function spawnComet(): Comet {
    const speed = 0.4 + Math.random() * 1.1;
    const edge = Math.floor(Math.random() * 4);
    let x = 0, y = 0;
    if (edge === 0) { x = Math.random() * W; y = -50; }
    else if (edge === 1) { x = W + 50; y = Math.random() * H; }
    else if (edge === 2) { x = Math.random() * W; y = H + 50; }
    else { x = -50; y = Math.random() * H; }
    const toCx = W / 2 + (Math.random() - 0.5) * W * 0.6 - x;
    const toCy = H / 2 + (Math.random() - 0.5) * H * 0.6 - y;
    const len = Math.sqrt(toCx * toCx + toCy * toCy) || 1;
    return {
      x, y,
      vx: (toCx / len) * speed,
      vy: (toCy / len) * speed,
      len: 60 + Math.random() * 140,
      width: 0.8 + Math.random() * 1.6,
      alpha: 0,
      hue: Math.random() < 0.5 ? 260 + Math.random() * 60 : Math.random() < 0.5 ? 200 + Math.random() * 40 : 330 + Math.random() * 30,
      life: 0,
      maxLife: 180 + Math.random() * 280,
    };
  }

  function spawnShootingStar() {
    const startX = Math.random() * W * 0.8;
    const startY = Math.random() * H * 0.3;
    const angle = Math.PI * 0.15 + Math.random() * Math.PI * 0.2;
    const speed = 6 + Math.random() * 8;
    shootingStar = { x: startX, y: startY, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, len: 120 + Math.random() * 200, alpha: 0.9, active: true, timer: 0 };
  }

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    const count = Math.min(Math.floor((W * H) / 900), 500);
    stars = Array.from({ length: count }, () => {
      const layer = Math.floor(Math.random() * 3);
      return {
        x: Math.random() * W, y: Math.random() * H,
        r: layer === 0 ? Math.random() * 0.8 + 0.2 : layer === 1 ? Math.random() * 1.2 + 0.5 : Math.random() * 2.0 + 0.8,
        a: layer === 0 ? Math.random() * 0.5 + 0.15 : layer === 1 ? Math.random() * 0.6 + 0.2 : Math.random() * 0.85 + 0.3,
        ts: layer === 0 ? Math.random() * 0.008 + 0.002 : layer === 1 ? Math.random() * 0.015 + 0.006 : Math.random() * 0.025 + 0.012,
        to: Math.random() * Math.PI * 2,
        layer,
      };
    });
    comets = Array.from({ length: 7 }, () => spawnComet());
    dust = Array.from({ length: 60 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.12, vy: (Math.random() - 0.5) * 0.08,
      r: Math.random() * 1.0 + 0.3, a: Math.random() * 0.25 + 0.05,
      pulse: Math.random() * Math.PI * 2,
    }));
  }

  function render(t: number) {
    if (t - lastT < 24) { animId = requestAnimationFrame(render); return; }
    lastT = t;
    ctx.clearRect(0, 0, W, H);

    // ── Background ──
    const cx = W * 0.5 + Math.sin(t * 0.00008) * W * 0.04;
    const cy = H * 0.42 + Math.cos(t * 0.00006) * H * 0.03;
    const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(W, H) * 0.9);
    bg.addColorStop(0, '#14102a'); bg.addColorStop(0.3, '#0c0818');
    bg.addColorStop(0.7, '#06040e'); bg.addColorStop(1, '#020208');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

    // ── Nebulae ──
    const np = t * 0.00018;
    for (const n of [
      { x: W * 0.22, y: H * 0.20, r: W * 0.85, c: [120, 30, 200], a: 0.13 + 0.04 * Math.sin(np) },
      { x: W * 0.80, y: H * 0.25, r: W * 0.60, c: [200, 30, 70],  a: 0.10 + 0.03 * Math.sin(np + 1.2) },
      { x: W * 0.50, y: H * 0.65, r: W * 0.55, c: [40, 60, 180],  a: 0.08 + 0.03 * Math.sin(np + 2.4) },
      { x: W * 0.08, y: H * 0.78, r: W * 0.45, c: [180, 40, 30],  a: 0.07 + 0.02 * Math.sin(np + 3.6) },
    ] as const) {
      const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r);
      g.addColorStop(0, `rgba(${n.c[0]},${n.c[1]},${n.c[2]},${n.a})`);
      g.addColorStop(0.45, `rgba(${n.c[0]},${n.c[1]},${n.c[2]},${n.a * 0.3})`);
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    }

    // ── Stars (3 layers) ──
    for (const s of stars) {
      const tw = 0.5 + 0.5 * Math.sin(t * s.ts + s.to);
      const brightness = s.a * (0.55 + 0.45 * tw);
      const color = s.layer === 0 ? `rgba(200,205,240,${brightness})` : s.layer === 1 ? `rgba(220,215,255,${brightness})` : `rgba(240,235,255,${brightness})`;
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r * (0.85 + 0.15 * tw), 0, Math.PI * 2);
      ctx.fillStyle = color; ctx.fill();
      if (s.layer === 2 && tw > 0.85) {
        const fl = (tw - 0.85) / 0.15;
        ctx.strokeStyle = `rgba(240,235,255,${fl * 0.3})`; ctx.lineWidth = 0.5;
        ctx.beginPath(); ctx.moveTo(s.x - s.r * 2.5, s.y); ctx.lineTo(s.x + s.r * 2.5, s.y);
        ctx.moveTo(s.x, s.y - s.r * 2.5); ctx.lineTo(s.x, s.y + s.r * 2.5); ctx.stroke();
      }
    }

    // ── Cosmic dust ──
    for (const p of dust) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < -5) p.x = W + 5; if (p.x > W + 5) p.x = -5;
      if (p.y < -5) p.y = H + 5; if (p.y > H + 5) p.y = -5;
      p.pulse += 0.018;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(180,170,230,${p.a * (0.6 + 0.4 * Math.sin(p.pulse))})`; ctx.fill();
    }

    // ── Comets ──
    for (let i = 0; i < comets.length; i++) {
      const c = comets[i];
      c.x += c.vx; c.y += c.vy; c.life++;
      if (c.life < 20) c.alpha = (c.life / 20) * 0.35;
      else if (c.life > c.maxLife - 40) c.alpha *= 0.96;
      if (c.life > c.maxLife || c.x < -200 || c.x > W + 200 || c.y < -200 || c.y > H + 200) { comets[i] = spawnComet(); continue; }
      const spd2 = Math.sqrt(c.vx * c.vx + c.vy * c.vy) || 1;
      const tailX = c.x - c.vx * (c.len / spd2);
      const tailY = c.y - c.vy * (c.len / spd2);
      const trail = ctx.createLinearGradient(c.x, c.y, tailX, tailY);
      trail.addColorStop(0, `hsla(${c.hue},80%,80%,${c.alpha})`);
      trail.addColorStop(0.3, `hsla(${c.hue},60%,70%,${c.alpha * 0.5})`);
      trail.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.save(); ctx.lineWidth = c.width; ctx.lineCap = 'round'; ctx.strokeStyle = trail;
      ctx.beginPath(); ctx.moveTo(c.x, c.y); ctx.lineTo(tailX, tailY); ctx.stroke();
      ctx.beginPath(); ctx.arc(c.x, c.y, c.width * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${c.hue},90%,90%,${c.alpha * 0.8})`; ctx.fill(); ctx.restore();
    }

    // ── Shooting star ──
    if (!shootingStar.active) {
      shootingStar.timer++;
      if (shootingStar.timer > 280 + Math.random() * 400) spawnShootingStar();
    } else {
      shootingStar.x += shootingStar.vx; shootingStar.y += shootingStar.vy;
      shootingStar.alpha -= 0.018;
      if (shootingStar.alpha <= 0 || shootingStar.x > W + 100 || shootingStar.y > H + 100) {
        shootingStar.active = false; shootingStar.timer = 0;
      } else {
        const spd3 = Math.sqrt(shootingStar.vx * shootingStar.vx + shootingStar.vy * shootingStar.vy) || 1;
        const stx = shootingStar.x - shootingStar.vx * (shootingStar.len / spd3);
        const sty = shootingStar.y - shootingStar.vy * (shootingStar.len / spd3);
        const sg = ctx.createLinearGradient(shootingStar.x, shootingStar.y, stx, sty);
        sg.addColorStop(0, `rgba(255,255,255,${shootingStar.alpha})`);
        sg.addColorStop(0.4, `rgba(200,210,255,${shootingStar.alpha * 0.5})`);
        sg.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.save(); ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.strokeStyle = sg;
        ctx.beginPath(); ctx.moveTo(shootingStar.x, shootingStar.y); ctx.lineTo(stx, sty); ctx.stroke();
        ctx.beginPath(); ctx.arc(shootingStar.x, shootingStar.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${shootingStar.alpha})`; ctx.fill(); ctx.restore();
      }
    }

    // ── Glitch ──
    if (glitchOn) {
      for (let i = 0; i < Math.floor(glitchStr * 14); i++) {
        const y2 = Math.random() * H, h2 = Math.random() * 3 + 1;
        ctx.fillStyle = `rgba(${Math.random() > 0.5 ? '255,40,80' : '20,120,255'},${Math.random() * 0.13})`;
        ctx.fillRect(0, y2, W, h2);
      }
    }

    // ── Vignette ──
    const vig = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.max(W, H) * 0.72);
    vig.addColorStop(0, 'rgba(0,0,0,0)'); vig.addColorStop(1, 'rgba(0,0,0,0.82)');
    ctx.fillStyle = vig; ctx.fillRect(0, 0, W, H);

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
  setTimeout(spawnShootingStar, 2000 + Math.random() * 3000);

  return () => {
    cancelAnimationFrame(animId);
    window.removeEventListener('resize', resize);
  };
}
