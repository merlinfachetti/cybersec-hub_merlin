'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X, ChevronRight, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import {
  CAREER_PATH_LIST,
  CERTIFICATIONS,
  STUDY_RESOURCES,
} from '@/lib/content/career-guide';

// ── Search index ────────────────────────────────────────────────────────────
type ItemType = 'cert' | 'resource' | 'path' | 'market';

interface SearchItem {
  id: string; type: ItemType; icon: string;
  title: string; sub: string; href: string; tags: string[];
  // Detail panel
  level?: string; levelColor?: string;
  cost?: string; hours?: string; provider?: string;
  desc: string;
  meta?: { label: string; value: string }[];
  actions?: { label: string; href: string; primary?: boolean }[];
}

const LEVEL_COLOR: Record<string, string> = {
  ENTRY: '#22c55e',
  INTERMEDIATE: '#3b82f6',
  ADVANCED: '#f59e0b',
  EXPERT: '#ef4444',
};

const CERT_INDEX: SearchItem[] = CERTIFICATIONS.map((cert) => ({
  id: `cert-${cert.slug}`,
  type: 'cert',
  icon:
    cert.category === 'OFFENSIVE_SECURITY'
      ? '🎯'
      : cert.category === 'CLOUD_SECURITY'
        ? '☁️'
        : cert.category === 'GOVERNANCE_RISK'
          ? '🏗️'
          : '🛡️',
  title: cert.acronym,
  sub: `${cert.provider} · ${cert.level} · ${cert.searchCost}`,
  href: `/certifications?search=${encodeURIComponent(cert.acronym)}`,
  tags: [
    cert.slug,
    cert.name.toLowerCase(),
    cert.acronym.toLowerCase(),
    cert.provider.toLowerCase(),
    cert.category.toLowerCase(),
  ],
  level: cert.level,
  levelColor: LEVEL_COLOR[cert.level] ?? '#8b5cf6',
  cost: cert.searchCost,
  hours: cert.studyHours,
  provider: cert.provider,
  desc: cert.marketSignal,
  meta: [
    { label: 'Formato', value: cert.numberOfQuestions > 0 ? `${cert.numberOfQuestions} questoes` : 'Exame pratico' },
    { label: 'Duracao', value: cert.examDuration > 0 ? `${cert.examDuration} min` : 'Modular' },
    { label: 'Validade', value: cert.validityLabel },
  ],
  actions: [
    { label: 'Ver certificacao', href: `/certifications/${cert.slug}`, primary: true },
    { label: 'Abrir recursos', href: `/resources?search=${encodeURIComponent(cert.acronym)}` },
  ],
}));

const RESOURCE_INDEX: SearchItem[] = STUDY_RESOURCES.map((resource) => ({
  id: `resource-${resource.id}`,
  type: 'resource',
  icon: resource.type === 'LAB' ? '🧪' : resource.type === 'VIDEO' ? '▶️' : '📘',
  title: resource.title,
  sub: `${resource.cost === 0 ? 'Gratis' : `$${resource.cost}`} · ${resource.type} · ${resource.hours}h`,
  href: '/resources',
  tags: [...resource.tags, resource.provider.toLowerCase(), resource.cert.toLowerCase()],
  provider: resource.provider,
  cost: resource.cost === 0 ? 'Gratis' : `$${resource.cost}`,
  hours: `${resource.hours}h`,
  desc: resource.bestFor,
  meta: [
    { label: 'Tipo', value: resource.type },
    { label: 'Rating', value: `⭐ ${resource.rating.toFixed(1)}` },
  ],
  actions: [
    { label: 'Abrir recurso', href: resource.url, primary: true },
    { label: 'Ver tela completa', href: `/resources?search=${encodeURIComponent(resource.provider)}` },
  ],
}));

const PATH_INDEX: SearchItem[] = CAREER_PATH_LIST.map((path) => ({
  id: `path-${path.id}`,
  type: 'path',
  icon: path.icon,
  title: path.label,
  sub: `${path.totalHours} · ${path.totalCost}`,
  href: '/roadmap',
  tags: [
    path.id,
    path.label.toLowerCase(),
    path.goal.toLowerCase(),
    ...path.steps.flatMap((step) => [
      step.acronym.toLowerCase(),
      step.name.toLowerCase(),
    ]),
  ],
  cost: path.totalCost,
  hours: path.totalHours,
  desc: path.realityCheck,
  meta: [
    { label: 'Passos', value: path.steps.map((step) => step.acronym).join(' ⇒ ') },
    { label: 'Foco', value: path.goal },
  ],
  actions: [{ label: 'Ver roadmap', href: '/roadmap', primary: true }],
}));

const MARKET_INDEX: SearchItem[] = [
  {
    id: 'mk1',
    type: 'market',
    icon: '💼',
    title: 'SOC Analyst',
    sub: 'Role defensiva de entrada',
    href: '/market',
    tags: ['soc', 'analyst', 'blue team', 'entry', 'monitoring'],
    desc: 'Boa porta de entrada para quem quer comecar com monitoramento, triagem, SIEM e resposta a incidentes.',
    meta: [
      { label: 'Nível', value: 'Entry ⇒ Mid' },
      { label: 'Certs comuns', value: 'Security+ · CySA+' },
      { label: 'Labs úteis', value: 'Splunk · SOC Level 1' },
    ],
    actions: [
      { label: 'Ver mercado', href: '/market', primary: true },
      { label: 'Abrir roadmap', href: '/roadmap' },
    ],
  },
  {
    id: 'mk2',
    type: 'market',
    icon: '🎯',
    title: 'Penetration Tester',
    sub: 'Trilha ofensiva prática',
    href: '/market',
    tags: ['pentest', 'red team', 'offensive', 'oscp', 'pnpt'],
    desc: 'Carreira que depende muito mais de prova prática e laboratório do que de storytelling no curriculo.',
    meta: [
      { label: 'Nível', value: 'Junior ⇒ Senior' },
      { label: 'Certs comuns', value: 'eJPT · PNPT/CPTS · OSCP' },
      { label: 'Base real', value: 'Enumeration · AD · report writing' },
    ],
    actions: [
      { label: 'Ver mercado', href: '/market', primary: true },
      { label: 'Abrir roadmap', href: '/roadmap' },
    ],
  },
];

const INDEX: SearchItem[] = [
  ...CERT_INDEX,
  ...RESOURCE_INDEX,
  ...PATH_INDEX,
  ...MARKET_INDEX,
];

const TYPE_META: Record<ItemType, { label: string; color: string; bg: string }> = {
  cert:     { label: 'Certificação', color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
  resource: { label: 'Recurso',      color: 'var(--ds-ok)', bg: 'rgba(34,197,94,0.12)'  },
  path:     { label: 'Roadmap',      color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)' },
  market:   { label: 'Mercado',      color: 'var(--ds-warn)', bg: 'rgba(245,158,11,0.12)' },
};

function scoreItem(item: SearchItem, q: string): number {
  const ql = q.toLowerCase();
  if (item.title.toLowerCase() === ql) return 100;
  if (item.title.toLowerCase().startsWith(ql)) return 90;
  if (item.title.toLowerCase().includes(ql)) return 75;
  if (item.tags.some(t => t === ql)) return 80;
  if (item.tags.some(t => t.startsWith(ql))) return 65;
  if (item.sub.toLowerCase().includes(ql)) return 55;
  if (item.desc.toLowerCase().includes(ql)) return 40;
  if (item.tags.some(t => t.includes(ql))) return 35;
  return 0;
}

// ── Component ────────────────────────────────────────────────────────────────
export function GlobalSearch({ fullWidth = false }: { fullWidth?: boolean }) {
  const [open, setOpen]         = useState(false);
  const [query, setQuery]       = useState('');
  const [active, setActive]     = useState(0);
  const [selected, setSelected] = useState<SearchItem | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = query.trim().length < 1 ? [] :
    INDEX.map(item => ({ item, s: scoreItem(item, query.trim()) }))
      .filter(x => x.s > 0).sort((a, b) => b.s - a.s)
      .slice(0, 8).map(x => x.item);

  const openModal = useCallback(() => {
    setOpen(true); setQuery(''); setActive(0); setSelected(null);
    setTimeout(() => inputRef.current?.focus(), 60);
  }, []);
  const close = useCallback(() => { setOpen(false); setQuery(''); setSelected(null); }, []);
  const select = useCallback((item: SearchItem) => { setSelected(item); }, []);

  // ⌘K / Ctrl+K
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); open ? close() : openModal(); }
      if (e.key === 'Escape') { if (selected) setSelected(null); else close(); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [open, selected, close, openModal]);

  // Arrow + Enter
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (!open || selected || results.length === 0) return;
      if (e.key === 'ArrowDown') { e.preventDefault(); setActive(a => Math.min(a + 1, results.length - 1)); }
      if (e.key === 'ArrowUp')   { e.preventDefault(); setActive(a => Math.max(a - 1, 0)); }
      if (e.key === 'Enter')     { e.preventDefault(); if (results[active]) select(results[active]); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [open, selected, results, active, select]);

  useEffect(() => { setActive(0); setSelected(null); }, [query]);

  const SUGGESTIONS = ['SEC+', 'Dev ⇒ Security', 'OSCP', 'SOC Analyst', 'Splunk', 'CISSP', 'AppSec'];

  return (
    <>
      {/* Trigger */}
      <button onClick={openModal} aria-label="Busca global" className="search-trigger"
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '6px 12px', borderRadius: 8, cursor: 'pointer',
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)',
          color: 'var(--ds-body-muted)', fontSize: 12,
          fontFamily: '"JetBrains Mono", monospace', transition: 'all 150ms',
        }}
        onMouseEnter={e => { const el = e.currentTarget; el.style.background='rgba(255,255,255,0.08)'; el.style.color='#e6eef8'; el.style.borderColor='rgba(255,255,255,0.15)'; }}
        onMouseLeave={e => { const el = e.currentTarget; el.style.background='rgba(255,255,255,0.04)'; el.style.color='rgba(155,176,198,0.6)'; el.style.borderColor='rgba(255,255,255,0.09)'; }}
      >
        <Search size={13} />
        <span style={{ display: 'none' }} className="sm-inline">Buscar</span>
      </button>

      {/* Overlay */}
      {open && (
        <div onClick={close} style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(6,4,18,0.82)', backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
          padding: 'clamp(60px,10vh,100px) 16px 16px',
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            width: '100%', maxWidth: selected ? 880 : 560,
            display: 'flex', gap: 12,
            transition: 'max-width 250ms cubic-bezier(0.4,0,0.2,1)',
          }}>

            {/* ── Search panel ── */}
            <div style={{
              flex: selected ? '0 0 340px' : '1',
              background: 'rgba(10,6,24,0.98)',
              border: '1px solid rgba(139,92,246,0.2)',
              borderRadius: 14, overflow: 'hidden',
              boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
              transition: 'flex 250ms ease',
            }}>
              {/* Input */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '13px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                <Search size={15} style={{ color: 'rgba(139,92,246,0.5)', flexShrink: 0 }} />
                <input ref={inputRef} value={query} onChange={e => setQuery(e.target.value)}
                  placeholder="Certificações, recursos, cargos..."
                  style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontSize: 14, color: 'var(--ds-title-section, #e6eef8)', fontFamily: '"Inter", sans-serif', caretColor: '#8b5cf6' }}
                />
                {query ? (
                  <button onClick={() => setQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ds-mono-dim)', padding: 2 }}><X size={13} /></button>
                ) : (
                  <kbd style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, color: 'var(--ds-body-faint)', padding: '2px 5px', background: 'rgba(255,255,255,0.03)', borderRadius: 4, border: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>ESC</kbd>
                )}
              </div>

              {/* Results */}
              {results.length > 0 ? (
                <ul style={{ listStyle: 'none', padding: '6px 0', margin: 0, maxHeight: 380, overflowY: 'auto' }}>
                  {results.map((item, i) => {
                    const meta = TYPE_META[item.type];
                    const isActive = active === i;
                    const isSel = selected?.id === item.id;
                    return (
                      <li key={item.id}>
                        <button onClick={() => select(item)} onMouseEnter={() => setActive(i)}
                          style={{
                            width: '100%', padding: '9px 16px',
                            display: 'flex', alignItems: 'center', gap: 10,
                            background: isSel ? `${meta.color}20` : isActive ? 'rgba(255,255,255,0.04)' : 'none',
                            border: 'none', cursor: 'pointer', textAlign: 'left',
                            borderLeft: `2px solid ${isSel ? meta.color : isActive ? `${meta.color}60` : 'transparent'}`,
                            transition: 'background 80ms',
                          }}>
                          <span style={{ fontSize: 16, flexShrink: 0 }}>{item.icon}</span>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 600, fontSize: 13, color: isSel ? '#fff' : '#e6eef8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</div>
                            <div style={{ fontSize: 11, color: 'var(--ds-body-dim)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.sub}</div>
                          </div>
                          <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 8, color: meta.color, background: meta.bg, padding: '2px 6px', borderRadius: 3, flexShrink: 0 }}>{meta.label.toUpperCase()}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              ) : query.trim().length > 0 ? (
                <div style={{ padding: '28px 16px', textAlign: 'center', color: 'var(--ds-body-dim)', fontSize: 13 }}>
                  Nenhum resultado para <strong style={{ color: 'var(--ds-body-muted)' }}>"{query}"</strong>
                </div>
              ) : (
                <div style={{ padding: '14px 16px' }}>
                  <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, color: 'var(--ds-mono-dim)', letterSpacing: '0.1em', marginBottom: 10 }}>SUGESTÕES</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {SUGGESTIONS.map(s => (
                      <button key={s} onClick={() => setQuery(s)} style={{ padding: '4px 10px', borderRadius: 5, cursor: 'pointer', fontSize: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--ds-body-muted)', fontFamily: '"Inter", sans-serif', transition: 'all 120ms' }}
                        onMouseEnter={e => { const el = e.currentTarget; el.style.background='rgba(139,92,246,0.1)'; el.style.color='#a78bfa'; }}
                        onMouseLeave={e => { const el = e.currentTarget; el.style.background='rgba(255,255,255,0.04)'; el.style.color='rgba(155,176,198,0.55)'; }}
                      >{s}</button>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer hints */}
              <div style={{ padding: '8px 16px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: 14 }}>
                {[['↑↓','navegar'],['↵','detalhes'],['ESC','fechar']].map(([k,l]) => (
                  <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <kbd style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, color: 'var(--ds-mono-dim)', padding: '1px 4px', background: 'rgba(255,255,255,0.04)', borderRadius: 3, border: '1px solid rgba(255,255,255,0.07)' }}>{k}</kbd>
                    <span style={{ fontSize: 10, color: 'var(--ds-body-faint)' }}>{l}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Detail panel ── */}
            {selected && (() => {
              const meta = TYPE_META[selected.type];
              return (
                <div style={{
                  flex: 1, background: 'rgba(10,6,24,0.98)',
                  border: `1px solid ${meta.color}30`,
                  borderRadius: 14, overflow: 'hidden',
                  boxShadow: `0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px ${meta.color}15`,
                  display: 'flex', flexDirection: 'column',
                  animation: 'detail-in 200ms cubic-bezier(0.4,0,0.2,1)',
                }}>
                  {/* Top accent */}
                  <div style={{ height: 2, background: `linear-gradient(90deg, ${meta.color}, ${meta.color}40, transparent)` }} />

                  <div style={{ padding: '18px 20px', flex: 1, overflowY: 'auto' }}>
                    {/* Header */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: 28 }}>{selected.icon}</span>
                        <div>
                          <div style={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700, fontSize: 18, color: 'var(--ds-title-card, #f0eeff)' }}>{selected.title}</div>
                          {selected.level && (
                            <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, color: selected.levelColor, background: `${selected.levelColor}18`, border: `1px solid ${selected.levelColor}30`, padding: '2px 7px', borderRadius: 4 }}>{selected.level}</span>
                          )}
                        </div>
                      </div>
                      <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ds-mono-dim)', padding: 4 }}><X size={14} /></button>
                    </div>

                    {/* Provider + cost + hours */}
                    <div style={{ display: 'flex', gap: 16, marginBottom: 14, flexWrap: 'wrap' }}>
                      {selected.provider && <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: 'var(--ds-body-dim)' }}>{selected.provider}</span>}
                      {selected.cost && <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: meta.color }}>{selected.cost}</span>}
                      {selected.hours && <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: 'var(--ds-body-dim)' }}>{selected.hours}</span>}
                    </div>

                    {/* Description */}
                    <p style={{ fontSize: 13, color: 'var(--ds-body)', lineHeight: 1.65, marginBottom: 16 }}>{selected.desc}</p>

                    {/* Meta */}
                    {selected.meta && selected.meta.length > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 18, padding: '12px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.05)' }}>
                        {selected.meta.map(m => (
                          <div key={m.label} style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                            <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: 'var(--ds-body-dim)' }}>{m.label}</span>
                            <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, color: 'var(--ds-body)', textAlign: 'right' }}>{m.value}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Actions */}
                    {selected.actions && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {selected.actions.map(a => {
                          const isExt = a.href.startsWith('http');
                          const style_: React.CSSProperties = {
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '10px 14px', borderRadius: 8, cursor: 'pointer',
                            textDecoration: 'none', fontSize: 13, fontFamily: '"Space Grotesk", sans-serif', fontWeight: 600,
                            transition: 'all 150ms',
                            ...(a.primary ? {
                              background: `linear-gradient(135deg, ${meta.color}25, ${meta.color}10)`,
                              border: `1px solid ${meta.color}40`, color: meta.color,
                            } : {
                              background: 'rgba(255,255,255,0.03)',
                              border: '1px solid rgba(255,255,255,0.08)', color: 'var(--ds-body-muted)',
                            }),
                          };
                          return isExt ? (
                            <a key={a.label} href={a.href} target="_blank" rel="noopener noreferrer" style={style_}>
                              {a.label} <ExternalLink size={12} style={{ opacity: 0.6 }} />
                            </a>
                          ) : (
                            <Link key={a.label} href={a.href} onClick={close} style={style_}>
                              {a.label} <ChevronRight size={13} style={{ opacity: 0.6 }} />
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      <style>{`
        @keyframes detail-in {
          from { opacity: 0; transform: translateX(12px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @media (max-width: 640px) {
          /* Em mobile: painel de detalhe empilha abaixo, não ao lado */
          .search-trigger span.sm-inline { display: inline; }
        }
      `}</style>
    </>
  );
}
