'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Award, BookOpen, Map, TrendingUp, ChevronRight } from 'lucide-react';

// ── Search index — todos os dados da aplicação ─────────────────────────────
const SEARCH_INDEX = [
  // Certificações
  { id: 'c1',  type: 'cert',     icon: '🛡️',  title: 'Security+',    sub: 'CompTIA · Entry · $392',           href: '/certifications?search=Security%2B',    tags: ['sec+', 'entry', 'defensive', 'baseline', 'dod', 'comptia'] },
  { id: 'c2',  type: 'cert',     icon: '🎯',  title: 'eJPT',         sub: 'INE Security · Entry · $200',       href: '/certifications?search=eJPT',           tags: ['ejpt', 'entry', 'pentest', 'offensive', 'ine', 'prático'] },
  { id: 'c3',  type: 'cert',     icon: '🔵',  title: 'CySA+',        sub: 'CompTIA · Intermediate · $392',     href: '/certifications?search=CySA%2B',        tags: ['cysa', 'intermediate', 'blue team', 'soc', 'defensive'] },
  { id: 'c4',  type: 'cert',     icon: '🔴',  title: 'CEH',          sub: 'EC-Council · Intermediate · $1.199',href: '/certifications?search=CEH',            tags: ['ceh', 'intermediate', 'ethical hacking', 'offensive', 'ec-council'] },
  { id: 'c5',  type: 'cert',     icon: '🔴',  title: 'GPEN',         sub: 'SANS/GIAC · Intermediate · $979',   href: '/certifications?search=GPEN',           tags: ['gpen', 'intermediate', 'pentest', 'offensive', 'sans', 'giac', 'active directory'] },
  { id: 'c6',  type: 'cert',     icon: '🔥',  title: 'OSCP',         sub: 'Offensive Security · Advanced · $1.499', href: '/certifications?search=OSCP',      tags: ['oscp', 'advanced', 'pentest', 'offensive', 'try harder', 'offensive security'] },
  { id: 'c7',  type: 'cert',     icon: '🟣',  title: 'CISM',         sub: 'ISACA · Advanced · $575',           href: '/certifications?search=CISM',           tags: ['cism', 'advanced', 'governance', 'risk', 'management', 'isaca'] },
  { id: 'c8',  type: 'cert',     icon: '🏆',  title: 'CISSP',        sub: '(ISC)² · Advanced · $749',          href: '/certifications?search=CISSP',          tags: ['cissp', 'advanced', 'governance', 'gold standard', 'isc2', 'arquitetura'] },
  { id: 'c9',  type: 'cert',     icon: '🆓',  title: 'ISC2 CC',      sub: '(ISC)² · Entry · ~$199',            href: '/certifications?search=CC',             tags: ['cc', 'entry', 'isc2', 'gratuito', 'free', 'iniciante', 'transição'] },
  { id: 'c10', type: 'cert',     icon: '⚡',  title: 'PNPT',         sub: 'TCM Security · Intermediate · $400',href: '/certifications?search=PNPT',           tags: ['pnpt', 'intermediate', 'pentest', 'practical', 'tcm', 'dev', 'relatório'] },
  { id: 'c11', type: 'cert',     icon: '☁️',  title: 'AWS Security', sub: 'AWS · Advanced · $300',             href: '/certifications?search=AWS',            tags: ['aws', 'advanced', 'cloud', 'cloud security', 'amazon', 'specialty'] },
  { id: 'c12', type: 'cert',     icon: '🌐',  title: 'Google Cyber', sub: 'Google · Entry · ~$200',            href: '/certifications?search=Google',         tags: ['google', 'entry', 'certificado', 'coursera', 'linkedin'] },
  { id: 'c13', type: 'cert',     icon: '🧪',  title: 'HTB CPTS',     sub: 'HackTheBox · Advanced · $490',      href: '/certifications?search=CPTS',           tags: ['cpts', 'advanced', 'hackthebox', 'htb', 'pentest', 'oscp alternativa'] },

  // Resources
  { id: 'r1',  type: 'resource', icon: '🎓',  title: 'Professor Messer SY0-701', sub: 'Gratuito · Vídeo · Security+',  href: '/resources',  tags: ['professor messer', 'sec+', 'free', 'gratuito', 'video'] },
  { id: 'r2',  type: 'resource', icon: '🧪',  title: 'TryHackMe Pre-Security',   sub: 'Freemium · Lab · Fundamentos',  href: '/resources',  tags: ['tryhackme', 'free', 'lab', 'iniciante', 'beginner', 'fundamentos'] },
  { id: 'r3',  type: 'resource', icon: '🧪',  title: 'HackTheBox Starting Point',sub: 'Gratuito · Lab · Pentest',      href: '/resources',  tags: ['hackthebox', 'htb', 'free', 'gratuito', 'lab', 'pentest', 'guiado'] },
  { id: 'r4',  type: 'resource', icon: '📖',  title: 'OWASP Testing Guide v4',   sub: 'Gratuito · Guia · Web App Sec', href: '/resources',  tags: ['owasp', 'free', 'web', 'app security', 'guia', 'pdf'] },
  { id: 'r5',  type: 'resource', icon: '▶️',  title: 'ippsec YouTube',           sub: 'Gratuito · Vídeo · OSCP',       href: '/resources',  tags: ['ippsec', 'youtube', 'free', 'oscp', 'walkthroughs', 'htb'] },
  { id: 'r6',  type: 'resource', icon: '📋',  title: 'TJ Null OSCP Prep List',   sub: 'Gratuito · Guia · OSCP',        href: '/resources',  tags: ['tj null', 'oscp', 'free', 'prep', 'lista', 'htb', 'pg'] },
  { id: 'r7',  type: 'resource', icon: '🎓',  title: 'Jason Dion SEC+ Udemy',    sub: 'Pago · Curso · Security+',      href: '/resources',  tags: ['jason dion', 'udemy', 'sec+', 'simulado', 'prova'] },
  { id: 'r8',  type: 'resource', icon: '⚡',  title: 'TCM Security PEH',         sub: 'Pago · Curso · PNPT/OSCP',      href: '/resources',  tags: ['tcm', 'practical ethical hacking', 'peh', 'pentest', 'active directory'] },
  { id: 'r9',  type: 'resource', icon: '🆓',  title: 'Splunk Free Training',     sub: 'Gratuito · Curso · SIEM',       href: '/resources',  tags: ['splunk', 'free', 'siem', 'soc', 'logs', 'blue team', 'gratuito'] },
  { id: 'r10', type: 'resource', icon: '🎓',  title: 'OffSec PEN-200 (PWK)',     sub: 'Pago · Curso · OSCP',           href: '/resources',  tags: ['offsec', 'pen-200', 'pwk', 'oscp', 'oficial', 'lab'] },

  // Roadmap / Career Paths
  { id: 'm1',  type: 'path',     icon: '🔀',  title: 'Dev → Security',     sub: 'Transition path · ISC2 CC → SEC+ → Splunk → PNPT', href: '/roadmap', tags: ['dev', 'transição', 'transition', 'developer', 'software', 'career change', 'começar'] },
  { id: 'm2',  type: 'path',     icon: '🌱',  title: 'Beginner Path',      sub: 'Sem experiência · SEC+ + eJPT',                    href: '/roadmap', tags: ['beginner', 'iniciante', 'zero', 'começar', 'entry', 'primeiro'] },
  { id: 'm3',  type: 'path',     icon: '⚡',  title: 'Intermediate Path',  sub: '1-3 anos · CySA+ / CEH / GPEN',                   href: '/roadmap', tags: ['intermediate', 'intermediário', 'crescimento', 'blue team', 'red team'] },
  { id: 'm4',  type: 'path',     icon: '🔥',  title: 'Advanced Path',      sub: '3-6 anos · OSCP / CISSP / CISM',                  href: '/roadmap', tags: ['advanced', 'avançado', 'expert', 'sênior', 'oscp', 'cissp'] },

  // Market
  { id: 'mk1', type: 'market',   icon: '💼',  title: 'SOC Analyst',        sub: '$55k–$85k US · €42k–€65k DE',  href: '/market', tags: ['soc', 'analyst', 'salário', 'salary', 'blue team', 'entry'] },
  { id: 'mk2', type: 'market',   icon: '💼',  title: 'Penetration Tester', sub: '$90k–$145k US · €65k–€110k DE',href: '/market', tags: ['pentest', 'pentester', 'red team', 'salário', 'salary', 'offensive'] },
  { id: 'mk3', type: 'market',   icon: '💼',  title: 'Security Architect', sub: '$140k–$200k US',               href: '/market', tags: ['arquiteto', 'architect', 'sênior', 'senior', 'salário', 'cissp'] },
  { id: 'mk4', type: 'market',   icon: '💼',  title: 'Cloud Security Eng', sub: '$110k–$160k US',               href: '/market', tags: ['cloud', 'aws', 'security engineer', 'salário', 'devops', 'devsecops'] },
  { id: 'mk5', type: 'market',   icon: '🌍',  title: 'Mercado Alemanha',   sub: 'Demanda CRITICAL · +42% crescimento', href: '/market', tags: ['alemanha', 'germany', 'europa', 'europe', 'koln', 'berlin'] },
  { id: 'mk6', type: 'market',   icon: '🌍',  title: 'Mercado EUA',        sub: '850k+ vagas · $105k médio',    href: '/market', tags: ['eua', 'usa', 'estados unidos', 'america', 'vagas'] },
];

const TYPE_META: Record<string, { label: string; color: string }> = {
  cert:     { label: 'Certificação', color: '#3b82f6' },
  resource: { label: 'Recurso',      color: '#22c55e' },
  path:     { label: 'Roadmap',      color: '#8b5cf6' },
  market:   { label: 'Mercado',      color: '#f59e0b' },
};

function score(item: typeof SEARCH_INDEX[0], q: string): number {
  const ql = q.toLowerCase();
  if (item.title.toLowerCase().startsWith(ql)) return 100;
  if (item.title.toLowerCase().includes(ql)) return 80;
  if (item.sub.toLowerCase().includes(ql)) return 60;
  if (item.tags.some(t => t.startsWith(ql))) return 70;
  if (item.tags.some(t => t.includes(ql))) return 40;
  return 0;
}

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const results = query.trim().length < 1 ? [] :
    SEARCH_INDEX
      .map(item => ({ item, s: score(item, query.trim()) }))
      .filter(x => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 8)
      .map(x => x.item);

  const open_ = useCallback(() => {
    setOpen(true);
    setQuery('');
    setActive(0);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    setQuery('');
  }, []);

  const go = useCallback((href: string) => {
    router.push(href);
    close();
  }, [router, close]);

  // ⌘K / Ctrl+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        open_ ? (open ? close() : open_()) : null;
      }
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, open_, close]);

  // Arrow navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!open || results.length === 0) return;
      if (e.key === 'ArrowDown') { e.preventDefault(); setActive(a => Math.min(a + 1, results.length - 1)); }
      if (e.key === 'ArrowUp')   { e.preventDefault(); setActive(a => Math.max(a - 1, 0)); }
      if (e.key === 'Enter')     { e.preventDefault(); go(results[active]?.href ?? ''); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, results, active, go]);

  useEffect(() => { setActive(0); }, [query]);

  return (
    <>
      {/* Trigger button — aparece no MainNav */}
      <button
        onClick={open_}
        aria-label="Busca global"
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '6px 12px', borderRadius: 8, cursor: 'pointer',
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)',
          color: 'rgba(155,176,198,0.6)', fontSize: 12,
          fontFamily: '"JetBrains Mono", monospace',
          transition: 'all 150ms', whiteSpace: 'nowrap',
        }}
        onMouseEnter={e => { const el = e.currentTarget; el.style.background = 'rgba(255,255,255,0.08)'; el.style.borderColor = 'rgba(255,255,255,0.15)'; el.style.color = '#e6eef8'; }}
        onMouseLeave={e => { const el = e.currentTarget; el.style.background = 'rgba(255,255,255,0.04)'; el.style.borderColor = 'rgba(255,255,255,0.09)'; el.style.color = 'rgba(155,176,198,0.6)'; }}
      >
        <Search size={13} />
        <span className="hidden sm:inline">Buscar</span>
        <kbd style={{ display: 'none', fontSize: 10, opacity: 0.5, marginLeft: 2 }} className="md:inline-flex items-center gap-1">
          ⌘K
        </kbd>
      </button>

      {/* Modal overlay */}
      {open && (
        <div
          onClick={close}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(6,4,18,0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
            paddingTop: 'clamp(60px, 12vh, 120px)',
            paddingLeft: 16, paddingRight: 16,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              width: '100%', maxWidth: 580,
              background: 'rgba(12,8,28,0.98)',
              border: '1px solid rgba(139,92,246,0.25)',
              borderRadius: 14,
              boxShadow: '0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(139,92,246,0.1)',
              overflow: 'hidden',
            }}
          >
            {/* Input */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              <Search size={16} style={{ color: 'rgba(139,92,246,0.6)', flexShrink: 0 }} />
              <input
                ref={inputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Buscar certificações, recursos, cargos, salários..."
                style={{
                  flex: 1, background: 'none', border: 'none', outline: 'none',
                  fontSize: 15, color: '#e6eef8', fontFamily: '"Inter", sans-serif',
                  caretColor: '#8b5cf6',
                }}
              />
              {query && (
                <button onClick={() => setQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(155,176,198,0.4)', padding: 2 }}>
                  <X size={14} />
                </button>
              )}
              <kbd style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: 'rgba(155,176,198,0.3)', padding: '2px 6px', background: 'rgba(255,255,255,0.04)', borderRadius: 4, border: '1px solid rgba(255,255,255,0.08)', flexShrink: 0 }}>
                ESC
              </kbd>
            </div>

            {/* Results */}
            {results.length > 0 ? (
              <ul style={{ listStyle: 'none', padding: '8px 0', margin: 0, maxHeight: 400, overflowY: 'auto' }}>
                {results.map((item, i) => {
                  const meta = TYPE_META[item.type];
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => go(item.href)}
                        onMouseEnter={() => setActive(i)}
                        style={{
                          width: '100%', padding: '10px 18px',
                          display: 'flex', alignItems: 'center', gap: 12,
                          background: active === i ? 'rgba(139,92,246,0.1)' : 'none',
                          border: 'none', cursor: 'pointer',
                          textAlign: 'left', transition: 'background 80ms',
                          borderLeft: active === i ? `2px solid ${meta.color}` : '2px solid transparent',
                        }}
                      >
                        <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 600, fontSize: 14, color: '#f0eeff', marginBottom: 1 }}>
                            {item.title}
                          </div>
                          <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, color: 'rgba(155,176,198,0.5)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {item.sub}
                          </div>
                        </div>
                        <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, color: meta.color, background: `${meta.color}18`, border: `1px solid ${meta.color}30`, padding: '2px 7px', borderRadius: 4, flexShrink: 0 }}>
                          {meta.label}
                        </span>
                        <ChevronRight size={13} style={{ color: 'rgba(155,176,198,0.3)', flexShrink: 0 }} />
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : query.trim().length > 0 ? (
              <div style={{ padding: '32px 18px', textAlign: 'center', color: 'rgba(155,176,198,0.4)', fontSize: 13 }}>
                Nenhum resultado para <strong style={{ color: 'rgba(155,176,198,0.6)' }}>"{query}"</strong>
              </div>
            ) : (
              /* Empty state — sugestões */
              <div style={{ padding: '16px 18px' }}>
                <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, color: 'rgba(155,176,198,0.3)', letterSpacing: '0.1em', marginBottom: 10 }}>SUGESTÕES</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {['SEC+', 'OSCP', 'Dev → Security', 'Splunk', 'SOC Analyst', 'Gratuito', 'Alemanha'].map(s => (
                    <button key={s} onClick={() => setQuery(s)} style={{
                      padding: '5px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 12,
                      background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                      color: 'rgba(155,176,198,0.6)', fontFamily: '"Inter", sans-serif',
                    }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Footer */}
            <div style={{ padding: '10px 18px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: 16 }}>
              {[['↵', 'selecionar'], ['↑↓', 'navegar'], ['ESC', 'fechar']].map(([k, l]) => (
                <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <kbd style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: 'rgba(155,176,198,0.4)', padding: '2px 5px', background: 'rgba(255,255,255,0.04)', borderRadius: 3, border: '1px solid rgba(255,255,255,0.08)' }}>{k}</kbd>
                  <span style={{ fontSize: 11, color: 'rgba(155,176,198,0.3)' }}>{l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
