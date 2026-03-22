'use client';

import { useEffect, useRef, useState, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useInactivity } from '@/lib/use-inactivity';
import { MerlinModal } from '@/components/merlin-modal';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';
import SignalLost from '@/components/signal-lost';

// ── Node data (matching mock exactly) ─────────────────────────────────────

const NODES = [
  { id: 'sec-plus',     label: 'SEC+',      sublabel: 'EXAM PREP',  team: 'red',    orbit: 1, angle: 200, size: 22 },
  { id: 'phishing',     label: 'Phishing Kit', sublabel: 'Analysis', team: 'red',   orbit: 2, angle: 320, size: 16 },
  { id: 'patch',        label: 'PATCH',     sublabel: 'ANALYSIS',   team: 'blue',   orbit: 2, angle: 140, size: 18 },
  { id: 'siem',         label: 'SIEM',      sublabel: 'Log Review',  team: 'blue',  orbit: 3, angle: 60,  size: 14 },
  { id: 'recon',        label: 'Recon',     sublabel: 'OSINT',      team: 'red',    orbit: 3, angle: 250, size: 14 },
  { id: 'hardening',    label: 'Hardening', sublabel: 'Baseline',   team: 'blue',   orbit: 1, angle: 40,  size: 16 },
  { id: 'threat-model', label: 'Threat',    sublabel: 'Modeling',   team: 'purple', orbit: 3, angle: 170, size: 15 },
  { id: 'tabletop',     label: 'Tabletop',  sublabel: 'Exercise',   team: 'purple', orbit: 2, angle: 20,  size: 16 },
  { id: 'vuln-scan',    label: 'Vuln Scan', sublabel: 'Nessus',     team: 'red',    orbit: 4, angle: 100, size: 12 },
  { id: 'ir-plan',      label: 'IR Plan',   sublabel: 'Playbook',   team: 'purple', orbit: 4, angle: 290, size: 13 },
] as const;

type NodeId = typeof NODES[number]['id'];
type TeamColor = 'red' | 'blue' | 'purple';

const NODE_DETAILS: Record<NodeId, {
  title: string; desc: string; mitre: string; severity: string; actions: [string, string, string]; team: TeamColor; routes: [string, string, string];
}> = {
  'sec-plus':     { title: 'SEC+ Exam Prep',           desc: 'CompTIA Security+ é a certificação de entrada mais reconhecida. Cobre ameaças, criptografia, identidade e redes.',   mitre: '',                            severity: 'N/A',    actions: ['Start Study', 'Practice Exam', 'Add Notes'],      team: 'red',    routes: ['/certifications?search=security%2B', '/certifications', '/profile'] },
  'phishing':     { title: 'Phishing Kit Analysis',    desc: 'Analise kits de phishing reais: infraestrutura, credenciais capturadas e IOCs para detecção e atribuição.',          mitre: 'MITRE ATT&CK: T1566 · T1204', severity: 'Medium', actions: ['Start Lab', 'Read Report', 'Add Notes'],           team: 'red',    routes: ['/resources?category=OFFENSIVE_SECURITY', '/resources', '/profile'] },
  'patch':        { title: 'Patch Analysis',           desc: 'Avalie patches críticos de CVEs, priorize por CVSS e verifique exposição antes e depois da aplicação.',             mitre: 'MITRE ATT&CK: T1190',         severity: 'High',   actions: ['View CVEs', 'Read Report', 'Add Notes'],           team: 'blue',   routes: ['/resources?category=DEFENSIVE_SECURITY', '/resources', '/profile'] },
  'siem':         { title: 'SIEM Log Review',          desc: 'Correlacione eventos de SIEM, reduza falsos positivos e crie regras de detecção baseadas em TTPs conhecidas.',      mitre: 'MITRE ATT&CK: T1070',         severity: 'Low',    actions: ['View Resources', 'Read Report', 'Add Notes'],      team: 'blue',   routes: ['/resources?category=DEFENSIVE_SECURITY', '/resources', '/profile'] },
  'recon':        { title: 'Recon & OSINT',            desc: 'Mapeie a superfície de ataque usando fontes abertas: DNS, WHOIS, redes sociais, vazamentos e infraestrutura.',     mitre: 'MITRE ATT&CK: T1595 · T1592', severity: 'Medium', actions: ['Start Lab', 'View Resources', 'Add Notes'],        team: 'red',    routes: ['/resources?category=OFFENSIVE_SECURITY', '/resources', '/profile'] },
  'hardening':    { title: 'System Hardening',         desc: 'Aplique benchmarks CIS, remova serviços desnecessários e verifique configurações de linha de base.',                mitre: '',                            severity: 'Medium', actions: ['View Checklist', 'View Resources', 'Add Notes'],   team: 'blue',   routes: ['/resources?category=DEFENSIVE_SECURITY', '/resources', '/profile'] },
  'threat-model': { title: 'Threat Modeling',          desc: 'Use STRIDE/PASTA para mapear ameaças, identificar superfícies e priorizar controles por impacto e probabilidade.',  mitre: '',                            severity: 'N/A',    actions: ['View Roadmap', 'Read Guide', 'Add Notes'],         team: 'purple', routes: ['/roadmap', '/resources', '/profile'] },
  'tabletop':     { title: 'Tabletop Exercise',        desc: 'Simule cenários de resposta a incidentes com sua equipe: ransomware, breach de dados, APT e comprometimento cloud.', mitre: '',                            severity: 'N/A',    actions: ['View Roadmap', 'View Scenarios', 'Add Notes'],     team: 'purple', routes: ['/roadmap', '/resources', '/profile'] },
  'vuln-scan':    { title: 'Vulnerability Scanning',   desc: 'Execute scans automatizados com Nessus/OpenVAS, faça triagem por severidade e integre ao ciclo de patch.',         mitre: 'MITRE ATT&CK: T1595.002',     severity: 'High',   actions: ['View Resources', 'View Results', 'Add Notes'],     team: 'red',    routes: ['/resources?category=OFFENSIVE_SECURITY', '/resources', '/profile'] },
  'ir-plan':      { title: 'IR Plan & Playbook',       desc: 'Revise e atualize o plano de resposta a incidentes: contenção, erradicação, recuperação e lições aprendidas.',     mitre: '',                            severity: 'N/A',    actions: ['View Roadmap', 'Edit Steps', 'Add Notes'],         team: 'purple', routes: ['/roadmap', '/resources', '/profile'] },
};

const TEAM_COLORS = {
  red:    { main: '#e53e3e', soft: '#ff6b6b', dim: 'rgba(229,62,62,0.25)', glow: 'rgba(229,62,62,0.4)' },
  blue:   { main: '#3b82f6', soft: '#60a5fa', dim: 'rgba(59,130,246,0.25)', glow: 'rgba(59,130,246,0.4)' },
  purple: { main: '#8b5cf6', soft: '#a78bfa', dim: 'rgba(139,92,246,0.25)', glow: 'rgba(139,92,246,0.4)' },
};

const ORBITS = [
  { rx: 0.14, ry: 0.09, tilt: -0.08 },
  { rx: 0.24, ry: 0.15, tilt: -0.05 },
  { rx: 0.36, ry: 0.22, tilt: -0.02 },
  { rx: 0.48, ry: 0.29, tilt:  0.01 },
];

// ── Canvas universe ────────────────────────────────────────────────────────

function initUniverse(
  canvas: HTMLCanvasElement,
  onNodeSelect: (id: NodeId) => void,
  onCenterClick: () => void
) {
  const ctx = canvas.getContext('2d')!;
  let W = 0, H = 0, cx = 0, cy = 0;
  type Star = { x: number; y: number; r: number; a: number; twinkle: number; offset: number };
  let stars: Star[] = [];
  let animId: number;
  let hoveredNode: string | null = null;
  let selectedNode: string | null = null;
  let activeMode: TeamColor = 'red';
  let panX = 0, panY = 0, zoom = 1;
  let isPanning = false, panStartX = 0, panStartY = 0, panOriginX = 0, panOriginY = 0;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    cx = W / 2; cy = H / 2 - 20;
    stars = Array.from({ length: Math.floor((W * H) / 3000) }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.2 + 0.2, a: Math.random() * 0.6 + 0.2,
      twinkle: Math.random() * 0.015 + 0.003, offset: Math.random() * Math.PI * 2,
    }));
  }

  function getNodePos(node: typeof NODES[number]) {
    const orbit = ORBITS[node.orbit - 1];
    const dim = Math.min(W, H);
    const rad = (node.angle * Math.PI) / 180;
    return {
      x: cx + panX + Math.cos(rad) * orbit.rx * dim * zoom,
      y: cy + panY + Math.sin(rad) * orbit.ry * dim * zoom,
    };
  }

  function drawBg() {
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(W, H) * 0.75);
    g.addColorStop(0, '#10112a'); g.addColorStop(0.4, '#0b0c1a'); g.addColorStop(1, '#050508');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    const patches = [
      { x: cx - W * 0.3, y: cy - H * 0.2, r: W * 0.3, c: [80, 40, 140], a: 0.04 },
      { x: cx + W * 0.25, y: cy + H * 0.15, r: W * 0.25, c: [140, 40, 50], a: 0.03 },
    ];
    for (const p of patches) {
      const pg = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
      pg.addColorStop(0, `rgba(${p.c.join(',')},${p.a})`); pg.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = pg; ctx.fillRect(0, 0, W, H);
    }
  }

  function drawStars(t: number) {
    for (const s of stars) {
      const tw = 0.5 + 0.5 * Math.sin(t * s.twinkle + s.offset);
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(210,215,240,${s.a * (0.5 + 0.5 * tw)})`; ctx.fill();
    }
  }

  function drawOrbits() {
    const dim = Math.min(W, H);
    ctx.save(); ctx.translate(cx + panX, cy + panY);
    for (const orbit of ORBITS) {
      ctx.save(); ctx.rotate(orbit.tilt);
      ctx.beginPath();
      ctx.ellipse(0, 0, orbit.rx * dim * zoom, orbit.ry * dim * zoom, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(140,160,200,0.14)'; ctx.lineWidth = 0.8; ctx.stroke();
      ctx.restore();
    }
    ctx.restore();
  }

  function drawCenter(t: number) {
    const sx = cx + panX, sy = cy + panY;
    const pulse = 0.9 + 0.1 * Math.sin(t * 0.002);
    const blink = 0.7 + 0.3 * Math.sin(t * 0.003);

    // Glow halo
    const g = ctx.createRadialGradient(sx, sy, 0, sx, sy, 30 * zoom * pulse);
    g.addColorStop(0, 'rgba(255,245,200,0.6)'); g.addColorStop(0.3, 'rgba(255,200,100,0.15)'); g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g; ctx.fillRect(sx - 50 * zoom, sy - 50 * zoom, 100 * zoom, 100 * zoom);

    // Planeta pulsante central
    ctx.beginPath(); ctx.arc(sx, sy, 3.5 * zoom * pulse, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${blink})`; ctx.fill();
    // Sonar ring do planeta
    ctx.beginPath(); ctx.arc(sx, sy, 8 * zoom * pulse, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(255,245,200,${0.3 * (1 - pulse + 0.9)})`; ctx.lineWidth = 0.8 * zoom; ctx.stroke();

    // Texto: YOU'RE  ●  HERE
    const fs = Math.max(9, 10 * zoom);
    ctx.textAlign = 'center';
    const gap = 18 * zoom; // espaço entre texto e planeta

    // "YOU'RE" à esquerda do centro
    ctx.font = `700 ${fs}px "Space Grotesk", sans-serif`;
    ctx.fillStyle = `rgba(255,255,255,${0.65 * blink})`;
    ctx.fillText("YOU'RE", sx - gap - ctx.measureText("YOU'RE").width / 2, sy - 18 * zoom);

    // "HERE" à direita do centro
    ctx.fillText('HERE', sx + gap + ctx.measureText('HERE').width / 2, sy - 18 * zoom);

    // Planeta pequeno entre os dois textos (brilhante e pulsante)
    const pr = 2.2 * zoom * (0.85 + 0.15 * Math.sin(t * 0.004));
    const pg = ctx.createRadialGradient(sx, sy - 18 * zoom, 0, sx, sy - 18 * zoom, pr * 3);
    pg.addColorStop(0, `rgba(255,250,210,${blink})`);
    pg.addColorStop(0.4, `rgba(255,220,120,${0.4 * blink})`);
    pg.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = pg; ctx.fillRect(sx - pr * 3, sy - 18 * zoom - pr * 3, pr * 6, pr * 6);
    ctx.beginPath(); ctx.arc(sx, sy - 18 * zoom, pr, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${blink})`; ctx.fill();
  }

  function drawNodes(t: number) {
    for (const node of NODES) {
      const { x, y } = getNodePos(node);
      const tc = TEAM_COLORS[node.team as TeamColor];
      const isHovered = hoveredNode === node.id;
      const isSelected = selectedNode === node.id;
      const isFocused = node.team === activeMode;
      const scaled = node.size * zoom;
      const alpha = isFocused ? 1 : 0.4;

      // ── Pulsação lenta e contínua ──────────────────────────────────────
      // Cada nó tem uma fase única baseada no index para pulsação desincronizada
      const nodeIndex = NODES.findIndex(n => n.id === node.id);
      const pulsePhase = nodeIndex * 0.7; // fase diferente por nó
      const pulse = 0.85 + 0.15 * Math.sin(t * 0.0018 + pulsePhase);
      const sonarPhase = (t * 0.001 + pulsePhase) % (Math.PI * 2);
      const sonarProgress = (Math.sin(sonarPhase) + 1) / 2; // 0→1→0

      // ── Sonar rings (2 anéis expandindo) ──────────────────────────────
      if (isFocused || isHovered || isSelected) {
        const ring1Progress = (t * 0.0008 + pulsePhase) % 1;
        const ring2Progress = (t * 0.0008 + pulsePhase + 0.5) % 1;
        for (const rp of [ring1Progress, ring2Progress]) {
          const ringR = scaled + scaled * 1.8 * rp;
          const ringAlpha = (1 - rp) * (isFocused ? 0.35 : 0.2) * alpha;
          ctx.beginPath();
          ctx.arc(x, y, ringR, 0, Math.PI * 2);
          ctx.strokeStyle = tc.main;
          ctx.lineWidth = 1 * (1 - rp);
          ctx.globalAlpha = ringAlpha;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }

      // ── Outer glow (radial, pulsante) ──────────────────────────────────
      const glowR = scaled * (2.2 + 0.4 * pulse);
      const gg = ctx.createRadialGradient(x, y, 0, x, y, glowR);
      gg.addColorStop(0, tc.glow.replace('0.3', String(0.25 * alpha * pulse)));
      gg.addColorStop(0.5, tc.glow.replace('0.3', String(0.1 * alpha)));
      gg.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = gg;
      ctx.beginPath(); ctx.arc(x, y, glowR, 0, Math.PI * 2);
      ctx.fill();

      // ── Corpo do nó ───────────────────────────────────────────────────
      ctx.beginPath(); ctx.arc(x, y, scaled * pulse, 0, Math.PI * 2);
      ctx.fillStyle = isSelected ? tc.main : tc.dim;
      ctx.globalAlpha = alpha; ctx.fill();
      ctx.strokeStyle = tc.main;
      ctx.lineWidth = isSelected ? 2 : 1.5;
      ctx.stroke();
      ctx.globalAlpha = 1;

      // ── Luz que corta o astro (lens flare horizontal) ─────────────────
      if (isFocused || isHovered || isSelected) {
        const flareLen = scaled * (1.6 + 0.6 * pulse);
        const flareAlpha = 0.55 * alpha * pulse;
        // Linha horizontal cortando o centro
        const lg = ctx.createLinearGradient(x - flareLen, y, x + flareLen, y);
        lg.addColorStop(0, 'rgba(255,255,255,0)');
        lg.addColorStop(0.3, `rgba(255,255,255,${flareAlpha * 0.4})`);
        lg.addColorStop(0.5, `rgba(255,255,255,${flareAlpha})`);
        lg.addColorStop(0.7, `rgba(255,255,255,${flareAlpha * 0.4})`);
        lg.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = lg;
        ctx.fillRect(x - flareLen, y - 1 * zoom, flareLen * 2, 2 * zoom);
        // Pontas que saem pra fora (spikes)
        const spikeLen = scaled * (0.5 + 0.3 * pulse);
        const spikeAlpha = 0.4 * alpha * pulse;
        for (const dir of [-1, 1]) {
          const sg = ctx.createLinearGradient(x + dir * scaled * 0.8, y, x + dir * (scaled * 0.8 + spikeLen), y);
          sg.addColorStop(0, `rgba(255,255,255,${spikeAlpha})`);
          sg.addColorStop(1, 'rgba(255,255,255,0)');
          ctx.fillStyle = sg;
          ctx.fillRect(
            dir > 0 ? x + scaled * 0.8 : x - scaled * 0.8 - spikeLen,
            y - 0.8 * zoom, spikeLen, 1.6 * zoom
          );
        }
        // Spike vertical mais curto (cruz completa)
        const vg = ctx.createLinearGradient(x, y - flareLen * 0.4, x, y + flareLen * 0.4);
        vg.addColorStop(0, 'rgba(255,255,255,0)');
        vg.addColorStop(0.5, `rgba(255,255,255,${flareAlpha * 0.5})`);
        vg.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = vg;
        ctx.fillRect(x - 0.8 * zoom, y - flareLen * 0.4, 1.6 * zoom, flareLen * 0.8);
      }

      // ── Labels ────────────────────────────────────────────────────────
      const fs = Math.max(9, 10 * zoom);
      // Label — laranja negrito (domínio de conhecimento)
      ctx.font = `800 ${fs}px "Space Grotesk", sans-serif`;
      ctx.fillStyle = `rgba(255,140,40,${alpha * 0.95})`; ctx.textAlign = 'center';
      ctx.fillText(node.label, x, y + scaled * pulse + fs + 3);
      if (node.sublabel) {
        // Sublabel — verde legível (contexto operacional)
        ctx.font = `500 ${fs * 0.85}px "Inter", sans-serif`;
        ctx.fillStyle = `rgba(34,197,94,${alpha * 0.75})`;
        ctx.fillText(node.sublabel, x, y + scaled * pulse + fs * 2 + 4);
      }
    }
  }

  function hitTest(mx: number, my: number) {
    for (let i = NODES.length - 1; i >= 0; i--) {
      const node = NODES[i];
      const { x, y } = getNodePos(node);
      const r = node.size * zoom + 8;
      if ((mx - x) ** 2 + (my - y) ** 2 <= r * r) return node;
    }
    return null;
  }

  function render(t: number) {
    ctx.clearRect(0, 0, W, H);
    drawBg(); drawStars(t); drawOrbits(); drawCenter(t); drawNodes(t);
    animId = requestAnimationFrame(render);
  }

  // Mouse events
  canvas.addEventListener('mousedown', (e) => {
    isPanning = true; panStartX = e.clientX; panStartY = e.clientY;
    panOriginX = panX; panOriginY = panY; canvas.style.cursor = 'grabbing';
  });
  canvas.addEventListener('mousemove', (e) => {
    if (isPanning) { panX = panOriginX + (e.clientX - panStartX); panY = panOriginY + (e.clientY - panStartY); return; }
    const hit = hitTest(e.clientX, e.clientY);
    hoveredNode = hit ? hit.id : null;
    if (!hit) {
      const sx = cx + panX, sy = cy + panY;
      const dist = Math.sqrt((e.clientX - sx) ** 2 + (e.clientY - sy) ** 2);
      canvas.style.cursor = dist < 40 * zoom ? 'pointer' : 'grab';
    } else {
      canvas.style.cursor = 'pointer';
    }
  });
  canvas.addEventListener('mouseup', (e) => {
    const dragged = Math.abs(e.clientX - panStartX) > 4 || Math.abs(e.clientY - panStartY) > 4;
    isPanning = false; canvas.style.cursor = 'grab';
    if (!dragged) {
      const hit = hitTest(e.clientX, e.clientY);
      if (hit) { selectedNode = hit.id; onNodeSelect(hit.id as NodeId); }
      else {
        // Check if clicked near center (YOU ARE HERE)
        const sx = cx + panX, sy = cy + panY;
        const dist = Math.sqrt((e.clientX - sx) ** 2 + (e.clientY - sy) ** 2);
        if (dist < 40 * zoom) onCenterClick();
      }
    }
  });
  canvas.addEventListener('mouseleave', () => { isPanning = false; hoveredNode = null; canvas.style.cursor = 'default'; });
  canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    zoom = Math.max(0.75, Math.min(2.0, zoom + (e.deltaY > 0 ? -0.08 : 0.08)));
  }, { passive: false });

  resize();
  window.addEventListener('resize', resize);
  animId = requestAnimationFrame(render);

  return {
    setMode(mode: TeamColor) { activeMode = mode; },
    resetView() { panX = 0; panY = 0; zoom = 1; },
    destroy() { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); },
  };
}

// ── Main component ────────────────────────────────────────────────────────

interface UserProfile {
  name: string | null;
  email: string;
  role: string;
  avatarUrl: string | null;
}

function PortalPageInner() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const universeRef = useRef<ReturnType<typeof initUniverse> | null>(null);

  const [activeMode, setActiveMode] = useState<TeamColor>('red');
  const [selectedNode, setSelectedNode] = useState<NodeId | null>('phishing');
  const [panelHidden, setPanelHidden] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showMerlinModal, setShowMerlinModal] = useState(false);
  const searchParams = useSearchParams();
  const [showStudyTooltip, setShowStudyTooltip] = useState(false);
  const [showNodeDetail, setShowNodeDetail] = useState(false);

  // Filtered nodes based on search + activeMode
  const filteredNodes = NODES.filter(n => {
    const matchesMode = activeMode === 'red'
      ? n.team === 'red'
      : activeMode === 'blue'
      ? n.team === 'blue'
      : n.team === 'purple';
    if (!searchQuery) return true; // search overrides mode filter
    const q = searchQuery.toLowerCase();
    const detail = NODE_DETAILS[n.id as NodeId];
    return (
      n.label.toLowerCase().includes(q) ||
      n.sublabel.toLowerCase().includes(q) ||
      detail.title.toLowerCase().includes(q) ||
      detail.desc.toLowerCase().includes(q) ||
      detail.mitre.toLowerCase().includes(q)
    );
  });

  // Fetch authenticated user
  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.ok ? r.json() : null)
      .then(d => d?.user && setUser(d.user))
      .catch(() => null);
  }, []);

  const panel = selectedNode ? NODE_DETAILS[selectedNode] : NODE_DETAILS['phishing'];

  // ESC closes search + user menu; click outside closes user menu
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowSearch(false);
        setSearchQuery('');
        setShowUserMenu(false);
      }
    };
    const onClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-user-menu]')) {
        setShowUserMenu(false);
      }
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('mousedown', onClickOutside);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('mousedown', onClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;
    universeRef.current = initUniverse(canvasRef.current, (id) => {
      setSelectedNode(id);
      setPanelHidden(false);
      setShowNodeDetail(true);
      // Switch activeMode to match the clicked node's team
      const nodeTeam = NODES.find(n => n.id === id)?.team as TeamColor;
      if (nodeTeam) {
        setActiveMode(nodeTeam);
        universeRef.current?.setMode(nodeTeam);
      }
    }, () => setShowMerlinModal(true));
    return () => universeRef.current?.destroy();
  }, []);

  const handleModeChange = useCallback((mode: TeamColor) => {
    setActiveMode(mode);
    universeRef.current?.setMode(mode);
  }, []);

  const handleLogout = useCallback(() => {
    // GET /api/auth/signout — server deletes session + cookie then redirects
    try { localStorage.removeItem('cp_last_active'); } catch {}
    window.location.href = '/api/auth/signout';
  }, []);

  // Abrir modal YOU ARE HERE se vier do footer (?youarehere=1)
  useEffect(() => {
    if (searchParams.get('youarehere') === '1') {
      setShowMerlinModal(true);
    }
  }, [searchParams]);

  // Auto-logout por inatividade (30 min)
  useInactivity(30 * 60 * 1000, () => {
    window.location.href = '/api/auth/signout?reason=timeout';
  });

  const modeConfig = {
    red:    { label: 'ATTACK',  tag: 'RED TEAM',    color: '#e53e3e', border: 'rgba(229,62,62,0.5)',    glow: '0 0 20px rgba(229,62,62,0.4)' },
    blue:   { label: 'DEFEND',  tag: 'BLUE TEAM',   color: '#3b82f6', border: 'rgba(59,130,246,0.5)',   glow: '0 0 20px rgba(59,130,246,0.4)' },
    purple: { label: 'IMPROVE', tag: 'PURPLE TEAM', color: '#8b5cf6', border: 'rgba(139,92,246,0.5)',   glow: '0 0 20px rgba(139,92,246,0.4)' },
  };

  // Panel colors follow ACTIVE MODE (not node team)
  const panelBorder = activeMode === 'red' ? 'rgba(229,62,62,0.35)' : activeMode === 'blue' ? 'rgba(59,130,246,0.35)' : 'rgba(139,92,246,0.35)';
  const panelIconColor = TEAM_COLORS[activeMode].main;
  const panelRgb = activeMode === 'red' ? '229,62,62' : activeMode === 'blue' ? '59,130,246' : '139,92,246';

  return (
    <>
      {/* Anti-FOUC: hide cp-main-app instantly on mobile before external CSS loads */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 1023px) {
          .cp-main-app { display: none !important; visibility: hidden !important; }
        }
      ` }} />

      {/* Universe canvas */}
      <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, zIndex: 0, cursor: 'grab' }} />

      {/* Vignette + grain */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 10, pointerEvents: 'none', background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.6) 100%)' }} />
      <div style={{ position: 'fixed', inset: 0, zIndex: 10, pointerEvents: 'none', opacity: 0.02 }}>
        <svg width="100%" height="100%"><filter id="nfp"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(#nfp)"/></svg>
      </div>

      {/* ── UI layer ── */}
      <div className="cp-main-app" data-theme="dark" style={{ position: 'relative', zIndex: 20, height: '100vh', display: 'flex', flexDirection: 'column', pointerEvents: 'none' }}>

        {/* ── Topbar ── */}
        <header style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 30,
          height: 60,
          display: 'flex', alignItems: 'center',
          padding: '0 32px',
          background: 'linear-gradient(180deg, rgba(6,4,18,0.97) 0%, rgba(8,5,22,0.92) 100%)',
          backdropFilter: 'blur(24px) saturate(180%)',
          borderBottom: '1px solid rgba(139,92,246,0.15)',
          boxShadow: '0 1px 0 rgba(139,92,246,0.08), 0 4px 24px rgba(0,0,0,0.4)',
          pointerEvents: 'all',
          gap: 0,
        }}>

          {/* ── Left: Logo + Brand ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: '0 0 auto' }}>
            <div style={{ position: 'relative', width: 55, height: 55, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {/* Glow halo behind logo */}
              <div style={{ position: 'absolute', inset: -4, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.25) 0%, transparent 70%)', pointerEvents: 'none' }} />
              <img
                src="/logo.png"
                alt="CYBERSEC HUB"
                style={{ width: 55, height: 55, objectFit: 'contain', position: 'relative', zIndex: 1,
                  filter: 'drop-shadow(0 0 8px rgba(139,92,246,0.8)) drop-shadow(0 0 16px rgba(59,130,246,0.4))' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3, justifyContent: 'center' }}>
              <span style={{
                fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700,
                fontSize: 14, letterSpacing: '0.16em', color: '#f0eeff',
                lineHeight: 1, textTransform: 'uppercase',
              }}>CYBERSEC HUB</span>
              <span style={{
                fontFamily: '"JetBrains Mono", monospace', fontSize: 9,
                color: 'rgba(139,92,246,0.6)', letterSpacing: '0.12em', lineHeight: 1,
              }}>signal &gt; noise</span>
            </div>
          </div>

          {/* ── Divider ── */}
          <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.07)', margin: '0 24px', flexShrink: 0 }} />

          {/* ── Back to Home ── */}
          <Link href="/home" className="hub-btn">
            ← Hub
          </Link>

          {/* ── Center: Title + Study Status ── */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
            <span style={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700, fontSize: 13, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', pointerEvents: 'none' }}>
              Threat Universe
            </span>
            {/* Study status tag — hover tooltip + clicável */}
            <div style={{ position: 'relative' }}
              onMouseEnter={() => setShowStudyTooltip(true)}
              onMouseLeave={() => setShowStudyTooltip(false)}
            >
              <Link href="/roadmap" style={{ textDecoration: 'none' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '3px 10px', borderRadius: 12,
                  background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.28)',
                  cursor: 'pointer', transition: 'all 150ms',
                }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(34,197,94,0.15)'; el.style.borderColor = 'rgba(34,197,94,0.5)'; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(34,197,94,0.08)'; el.style.borderColor = 'rgba(34,197,94,0.28)'; }}
                >
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 5px #22c55e', flexShrink: 0 }} />
                  <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, color: 'rgba(34,197,94,0.9)', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>
                    2h Study · RISK: LOW
                  </span>
                  <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 8, color: 'rgba(34,197,94,0.5)' }}>→</span>
                </div>
              </Link>

              {/* Tooltip — aparece no hover */}
              {showStudyTooltip && (
                <>
                {/* Invisible bridge closing the gap between tag and tooltip */}
                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, height: 14, background: 'transparent' }} />
                <div style={{
                  position: 'absolute', top: 'calc(100% + 10px)', left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'rgba(8,6,20,0.97)', border: '1px solid rgba(34,197,94,0.25)',
                  borderRadius: 10, padding: '12px 14px',
                  width: 240, zIndex: 200,
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(245,158,11,0.08)',
                  animation: 'cp-fade-in 0.12s ease-out both',
                  pointerEvents: 'all',
                }}>
                  {/* Arrow */}
                  <div style={{ position: 'absolute', top: -5, left: '50%', transform: 'translateX(-50%) rotate(45deg)', width: 8, height: 8, background: 'rgba(8,6,20,0.97)', border: '1px solid rgba(34,197,94,0.25)', borderBottom: 'none', borderRight: 'none' }} />

                  <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, color: 'rgba(255,140,40,0.8)', letterSpacing: '0.1em', marginBottom: 8 }}>
                    STATUS DO DIA
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {/* Horas de estudo */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 11, color: 'rgba(180,175,220,0.6)' }}>Estudo hoje</span>
                      <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: '#f59e0b', fontWeight: 600 }}>2h / 2h</span>
                    </div>
                    {/* Progress bar */}
                    <div style={{ height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: '100%', background: 'linear-gradient(90deg, #22c55e, #4ade80)', borderRadius: 2 }} />
                    </div>

                    {/* Risco */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                      <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 11, color: 'rgba(180,175,220,0.6)' }}>Nível de risco</span>
                      <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: '#22c55e', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', padding: '1px 7px', borderRadius: 4 }}>LOW</span>
                    </div>

                    {/* Contexto do risco */}
                    <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 11, color: 'rgba(155,176,198,0.5)', lineHeight: 1.5, margin: 0, marginTop: 2, borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 8 }}>
                      Meta diária atingida. Risco baixo indica cobertura adequada das trilhas do dia. Continue assim para manter o streak.
                    </p>

                    {/* CTA — clicável, vai ao roadmap */}
                    <Link href="/roadmap" style={{ textDecoration: 'none' }}
                      onClick={() => setShowStudyTooltip(false)}>
                      <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, color: 'rgba(255,140,40,0.8)', marginTop: 2, cursor: 'pointer', transition: 'color 150ms' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,160,60,1)'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,140,40,0.8)'; }}>
                        → ver trilha de estudos
                      </div>
                    </Link>
                  </div>
                </div>
                </>
              )}
            </div>
          </div>

          {/* ── Right: Search + User ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: '0 0 auto' }}>



            {/* User pill */}
            <div data-user-menu style={{ position: 'relative' }}>
              <button
                onClick={() => setShowUserMenu(v => !v)}
                style={{ display: 'flex', alignItems: 'center', gap: 9,
                  padding: '5px 12px 5px 5px', borderRadius: 10,
                  background: showUserMenu ? 'rgba(139,92,246,0.12)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${showUserMenu ? 'rgba(139,92,246,0.3)' : 'rgba(255,255,255,0.08)'}`,
                  cursor: 'pointer', transition: 'all 200ms ease' }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  if (!showUserMenu) { el.style.background = 'rgba(139,92,246,0.08)'; el.style.borderColor = 'rgba(139,92,246,0.2)'; }
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  if (!showUserMenu) { el.style.background = 'rgba(255,255,255,0.04)'; el.style.borderColor = 'rgba(255,255,255,0.08)'; }
                }}>
                {/* Avatar com dot verde de status */}
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', overflow: 'hidden', border: '1.5px solid rgba(139,92,246,0.45)', background: 'linear-gradient(135deg, rgba(139,92,246,0.3), rgba(59,130,246,0.2))' }}>
                    <img src="/merlin.jpg" alt="Merlin" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  </div>
                  <span style={{ position: 'absolute', bottom: 0, right: 0, width: 8, height: 8, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px #22c55e, 0 0 12px rgba(34,197,94,0.4)', border: '1.5px solid rgba(8,6,20,0.9)' }} />
                </div>
                {/* Nome preferido */}
                <span style={{ fontFamily: '"Space Grotesk",sans-serif', fontSize: 12, fontWeight: 600, color: '#e8e4ff', lineHeight: 1 }}>
                  {user?.name?.split(' ')[0] ?? 'Merlin'}
                </span>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgba(139,92,246,0.5)" strokeWidth="2.5" style={{ transform: showUserMenu ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 200ms' }}>
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>

              {/* Dropdown */}
              {showUserMenu && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                  background: 'rgba(8,6,20,0.97)',
                  border: '1px solid rgba(139,92,246,0.15)',
                  borderRadius: 12, padding: '6px', minWidth: 200,
                  backdropFilter: 'blur(24px)',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(139,92,246,0.08)',
                  zIndex: 100,
                  animation: 'cp-fade-in 0.15s ease-out both',
                }}>
                  <div style={{ padding: '10px 12px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: 6 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#e8e4ff',
                      fontFamily: '"Space Grotesk", sans-serif' }}>{user?.name ?? 'Merlin'}</div>
                    <div style={{ fontSize: 10, color: 'rgba(255,140,40,0.6)',
                      fontFamily: '"JetBrains Mono", monospace', marginTop: 3 }}>
                      {user?.email ?? 'merlin@cyberportal.dev'}
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: 6, paddingTop: 6 }}>
                    <button onClick={handleLogout} style={{
                      display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                      padding: '8px 12px', background: 'none', border: 'none', cursor: 'pointer',
                      borderRadius: 8, color: 'rgba(255,100,100,0.7)', fontSize: 13,
                      fontFamily: '"Inter", sans-serif', transition: 'all 150ms', textAlign: 'left' }}
                      onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(229,62,62,0.08)'; el.style.color = '#ff7070'; }}
                      onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'none'; el.style.color = 'rgba(255,100,100,0.7)'; }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                        <polyline points="16 17 21 12 16 7"/>
                        <line x1="21" y1="12" x2="9" y2="12"/>
                      </svg>
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>



        {/* YOU ARE HERE — hotspot clicável sobre o centro da galáxia */}
        <div
          onClick={() => setShowMerlinModal(true)}
          title="YOU ARE HERE"
          style={{
            position: 'fixed',
            left: '50%', top: '50%',
            transform: 'translate(-50%, -50%)',
            width: 80, height: 80,
            zIndex: 35,
            cursor: 'pointer',
            pointerEvents: 'all',
            borderRadius: '50%',
            background: 'transparent',
          }}
        />

        {/* Bottom stack */}
        <div className="cp-dark-zone" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 40, display: 'flex', flexDirection: 'column', gap: 0, pointerEvents: 'all' }}>

          {/* Mode bar */}
          <div className="cp-animate-in" style={{ display: 'flex', gap: 0, padding: '0 0 0 0', animationDelay: '0.2s' }}>
            {(Object.keys(modeConfig) as TeamColor[]).map((mode) => {
              const mc = modeConfig[mode];
              const isActive = activeMode === mode;
              return (
                <button key={mode} onClick={() => handleModeChange(mode)} style={{
                  flex: 1, height: 52, border: 'none', cursor: 'pointer',
                  background: isActive ? `rgba(${mode === 'red' ? '229,62,62' : mode === 'blue' ? '59,130,246' : '139,92,246'},0.22)` : 'rgba(6,6,16,0.85)',
                  borderTop: `2px solid ${isActive ? mc.color : 'transparent'}`,
                  borderRight: mode !== 'purple' ? '1px solid rgba(255,255,255,0.06)' : 'none',
                  backdropFilter: 'blur(12px)', transition: 'all 300ms',
                  boxShadow: isActive ? mc.glow : 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                }}>
                  <span style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 15, fontWeight: 700, letterSpacing: '0.08em', color: isActive ? mc.color : 'rgba(255,255,255,0.4)' }}>
                    {mc.label}
                  </span>
                  <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: isActive ? mc.color : 'rgba(255,255,255,0.2)', letterSpacing: '0.1em' }}>
                    {mc.tag}
                  </span>
                </button>
              );
            })}
          </div>

          {/* ── Bottom panel — rich node detail ── */}
          {!panelHidden && selectedNode && (
            <div className="cp-animate-in" style={{
              background: 'rgba(6,4,18,0.97)', backdropFilter: 'blur(24px)',
              borderTop: `2px solid ${panelBorder}`,
              boxShadow: `0 -4px 32px rgba(${panelRgb},0.1)`,
              padding: '0', animationDelay: '0.1s', position: 'relative',
            }}>
              {/* Top accent bar */}
              <div style={{ height: 2, background: `linear-gradient(90deg, ${panelIconColor}, rgba(${panelRgb},0.3), transparent)` }} />

              <div style={{ padding: '14px 24px 18px' }}>
                {/* Header row */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    {/* Team badge */}
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      padding: '4px 10px', borderRadius: 6,
                      background: `rgba(${panelRgb},0.15)`, border: `1px solid rgba(${panelRgb},0.35)`,
                    }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: panelIconColor, boxShadow: `0 0 6px ${panelIconColor}` }} />
                      <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, color: panelIconColor, letterSpacing: '0.1em', fontWeight: 600 }}>
                        {activeMode.toUpperCase()} TEAM
                      </span>
                    </div>
                    {/* Title */}
                    <h2 style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 17, fontWeight: 700, color: '#ffffff', margin: 0 }}>
                      {panel.title}
                    </h2>
                    {/* Severity badge */}
                    {panel.severity !== 'N/A' && (
                      <span style={{
                        fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
                        color: panel.severity === 'High' ? '#ef4444' : panel.severity === 'Medium' ? '#f59e0b' : '#22c55e',
                        background: panel.severity === 'High' ? 'rgba(239,68,68,0.1)' : panel.severity === 'Medium' ? 'rgba(245,158,11,0.1)' : 'rgba(34,197,94,0.1)',
                        border: `1px solid ${panel.severity === 'High' ? 'rgba(239,68,68,0.3)' : panel.severity === 'Medium' ? 'rgba(245,158,11,0.3)' : 'rgba(34,197,94,0.3)'}`,
                        padding: '2px 8px', borderRadius: 4, letterSpacing: '0.08em',
                      }}>
                        {panel.severity}
                      </span>
                    )}
                  </div>
                  <button onClick={() => setPanelHidden(true)} style={{ background: 'none', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 7, cursor: 'pointer', color: '#22c55e', padding: '4px 6px', display: 'flex', transition: 'all 150ms' }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.color = '#4ade80'; el.style.background = 'rgba(34,197,94,0.1)'; el.style.borderColor = 'rgba(34,197,94,0.5)'; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.color = '#22c55e'; el.style.background = 'none'; el.style.borderColor = 'rgba(34,197,94,0.25)'; }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </div>

                {/* Two-column layout: desc + actions */}
                <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
                  {/* Left: description */}
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13, color: 'rgba(220,215,240,0.75)', lineHeight: 1.65, margin: '0 0 10px' }}>
                      {panel.desc}
                    </p>
                    {panel.mitre && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: 'rgba(155,176,198,0.4)' }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                        {panel.mitre}
                      </div>
                    )}
                  </div>

                  {/* Right: action buttons */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 7, flexShrink: 0, minWidth: 180 }}>
                    <button onClick={() => router.push(panel.routes[0])} style={{
                      padding: '9px 18px', borderRadius: 7,
                      background: `linear-gradient(135deg, rgba(${panelRgb},0.9), rgba(${panelRgb},0.7))`,
                      border: 'none', cursor: 'pointer',
                      fontFamily: '"Space Grotesk", sans-serif', fontSize: 12, fontWeight: 700,
                      color: '#fff', letterSpacing: '0.06em', textAlign: 'center',
                      boxShadow: `0 2px 12px rgba(${panelRgb},0.3)`,
                      transition: 'all 150ms',
                    }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = 'none'}
                    >{panel.actions[0]}</button>
                    <button onClick={() => router.push(panel.routes[1])} style={{
                      padding: '8px 18px', borderRadius: 7,
                      background: `rgba(${panelRgb},0.1)`, border: `1px solid rgba(${panelRgb},0.3)`,
                      cursor: 'pointer', fontFamily: '"Inter", sans-serif', fontSize: 12,
                      color: panelIconColor, textAlign: 'center', transition: 'all 150ms',
                    }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = `rgba(${panelRgb},0.18)`}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = `rgba(${panelRgb},0.1)`}
                    >{panel.actions[1]}</button>
                    <button onClick={() => router.push(panel.routes[2])} style={{
                      padding: '8px 18px', borderRadius: 7,
                      background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                      cursor: 'pointer', fontFamily: '"Inter", sans-serif', fontSize: 12,
                      color: 'rgba(220,215,240,0.6)', textAlign: 'center', transition: 'all 150ms',
                    }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.09)'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)'}
                    >{panel.actions[2]}</button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ── Mobile UI ── */}
      <div className="cp-signal-lost" style={{ overflowY: 'auto', paddingBottom: 80, background: '#060610' }}>
        {/* Header */}
        <div style={{
          position: 'sticky', top: 0, zIndex: 10, padding: '10px 16px',
          background: 'rgba(6,4,18,0.97)', borderBottom: '1px solid rgba(139,92,246,0.15)',
          backdropFilter: 'blur(20px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <Link href="/home" style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none' }}>
            <img src="/logo.png" alt="CYBERSEC HUB" style={{ width: 30, height: 30, objectFit: 'contain', filter: 'drop-shadow(0 0 6px rgba(139,92,246,0.6))' }} />
            <div>
              <div style={{ fontFamily: '"Space Grotesk",sans-serif', fontWeight: 700, fontSize: 12, color: '#f0eeff', letterSpacing: '0.1em' }}>CYBERSEC HUB</div>
              <div style={{ fontFamily: '"JetBrains Mono",monospace', fontSize: 8, color: 'rgba(139,92,246,0.6)', letterSpacing: '0.08em' }}>THREAT UNIVERSE</div>
            </div>
          </Link>
          <ThemeToggle />
        </div>

        {/* Mode selector */}
        <div style={{ display: 'flex', gap: 8, padding: '12px 16px 8px' }}>
          {(['red','blue','purple'] as TeamColor[]).map(m => {
            const clr = m === 'red' ? '#e53e3e' : m === 'blue' ? '#3b82f6' : '#8b5cf6';
            const rgb = m === 'red' ? '229,62,62' : m === 'blue' ? '59,130,246' : '139,92,246';
            const lbl = m === 'red' ? 'ATTACK' : m === 'blue' ? 'DEFEND' : 'IMPROVE';
            const isCurrent = activeMode === m;
            return (
              <button key={m} onClick={() => setActiveMode(m)} style={{
                flex: 1, padding: '8px 4px', borderRadius: 8, cursor: 'pointer',
                background: isCurrent ? `rgba(${rgb},0.15)` : 'rgba(255,255,255,0.04)',
                border: `1px solid ${isCurrent ? clr + '50' : 'rgba(255,255,255,0.08)'}`,
                color: isCurrent ? clr : 'rgba(155,176,198,0.5)',
                fontFamily: '"Space Grotesk",sans-serif', fontWeight: 700, fontSize: 11,
                transition: 'all 150ms',
              }}>{lbl}</button>
            );
          })}
        </div>

        {/* Node cards */}
        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {NODES.filter(n => n.team === activeMode).map(node => {
            const detail = NODE_DETAILS[node.id];
            const clr = activeMode === 'red' ? '#e53e3e' : activeMode === 'blue' ? '#3b82f6' : '#8b5cf6';
            const rgb = activeMode === 'red' ? '229,62,62' : activeMode === 'blue' ? '59,130,246' : '139,92,246';
            const isOpen = selectedNode === node.id;
            const sevColor = detail.severity === 'High' ? '#ef4444' : detail.severity === 'Medium' ? '#f59e0b' : '#22c55e';
            return (
              <div key={node.id}
                onClick={() => setSelectedNode(isOpen ? null : node.id)}
                style={{
                  padding: '12px 14px', borderRadius: 10, cursor: 'pointer',
                  background: isOpen ? `rgba(${rgb},0.1)` : 'rgba(12,8,28,0.85)',
                  border: `1px solid ${isOpen ? clr + '40' : 'rgba(255,255,255,0.08)'}`,
                  transition: 'all 180ms',
                }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontFamily: '"Space Grotesk",sans-serif', fontWeight: 700, fontSize: 14, color: '#f0eeff' }}>{detail.title}</div>
                    <div style={{ fontFamily: '"JetBrains Mono",monospace', fontSize: 9, color: 'rgba(155,176,198,0.45)', marginTop: 2 }}>{node.sublabel}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {detail.severity !== 'N/A' && (
                      <span style={{ fontFamily: '"JetBrains Mono",monospace', fontSize: 8, color: sevColor, background: sevColor + '18', border: `1px solid ${sevColor}30`, padding: '2px 5px', borderRadius: 3 }}>
                        {detail.severity.toUpperCase()}
                      </span>
                    )}
                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: clr, boxShadow: `0 0 6px ${clr}` }} />
                  </div>
                </div>

                {isOpen && (
                  <div style={{ marginTop: 10, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 10 }}>
                    <p style={{ fontSize: 12, color: 'rgba(200,195,225,0.7)', lineHeight: 1.6, marginBottom: 10 }}>{detail.desc}</p>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
                      {detail.routes.map((route, i) => (
                        <Link key={i} href={route} onClick={() => setSelectedNode(null)} style={{
                          padding: '6px 12px', borderRadius: 6, textDecoration: 'none',
                          fontFamily: '"Space Grotesk",sans-serif', fontWeight: 600, fontSize: 11,
                          background: i === 0 ? `rgba(${rgb},0.18)` : 'rgba(255,255,255,0.05)',
                          border: `1px solid ${i === 0 ? clr + '40' : 'rgba(255,255,255,0.08)'}`,
                          color: i === 0 ? clr : 'rgba(155,176,198,0.65)',
                        }}>
                          {detail.actions[i]}
                        </Link>
                      ))}
                    </div>
                    {detail.mitre && (
                      <div style={{ fontFamily: '"JetBrains Mono",monospace', fontSize: 9, color: 'rgba(155,176,198,0.3)' }}>{detail.mitre}</div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom nav */}
        <div className="cp-dark-zone" style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 20,
          background: 'rgba(6,4,18,0.97)', borderTop: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(20px)', paddingBottom: 'env(safe-area-inset-bottom,0px)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '6px 4px',
        }}>
          {([
            ['/home',           '🏠', 'Hub'],
            ['/certifications', '🛡️', 'Certs'],
            ['/roadmap',        '🗺️', 'Roadmap'],
            ['/resources',      '📚', 'Recursos'],
            ['/market',         '📊', 'Mercado'],
            ['/profile',        '👤', 'Perfil'],
          ] as [string,string,string][]).map(([href, icon, label]) => (
            <Link key={href} href={href} style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
              textDecoration: 'none', color: 'rgba(155,176,198,0.5)', padding: '4px 2px',
              fontFamily: '"JetBrains Mono",monospace', fontSize: 9,
            }}>
              <span style={{ fontSize: 17 }}>{icon}</span>
              {label}
            </Link>
          ))}
        </div>
      </div>

            {/* Merlin Modal — YOU ARE HERE */}
      {showMerlinModal && <MerlinModal onClose={() => setShowMerlinModal(false)} />}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        body{background:#060610;overflow:hidden}
        /* hub-btn styles → globals.css */
        button{font-family:inherit}
      `}</style>
    </>
  );
}
// build: 2026-03-19T13:30:42Z

export default function PortalPage() {
  return (
    <Suspense fallback={<div style={{ background: '#060610', height: '100vh' }} />}>
      <PortalPageInner />
    </Suspense>
  );
}
