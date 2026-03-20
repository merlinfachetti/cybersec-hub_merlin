'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronUp } from 'lucide-react';

const FOOTER_LINKS = {
  Careers: [
    { label: 'Certificações', href: '/certifications' },
    { label: 'Roadmap', href: '/roadmap' },
    { label: 'Recursos', href: '/resources' },
    { label: 'Mercado', href: '/market' },
  ],
  Portal: [
    { label: 'Threat Universe', href: '/threat-universe' },
    { label: 'Home', href: '/home' },
    { label: 'Perfil', href: '/profile' },
  ],
  Docs: [
    { label: 'API Reference', href: '/docs/api' },
  ],
};

const TEAM_BADGES = [
  { label: 'Red Team',    color: '#e53e3e' },
  { label: 'Blue Team',   color: '#3b82f6' },
  { label: 'Purple Team', color: '#8b5cf6' },
];

export function SiteFooter() {
  const [expanded, setExpanded] = useState(false);

  return (
    <footer style={{ background: '#0a0814', borderTop: '1px solid rgba(139,92,246,0.12)', marginTop: 'auto' }}>
      {/* Toggle */}
      <button
        onClick={() => setExpanded(v => !v)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 8, padding: '10px 16px', background: 'none', border: 'none', cursor: 'pointer',
          borderBottom: expanded ? '1px solid rgba(255,255,255,0.04)' : 'none',
        }}
        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,140,40,0.04)'}
        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'none'}
      >
        <ChevronUp size={14} style={{
          color: 'rgba(255,140,40,0.7)',
          transform: expanded ? 'rotate(0deg)' : 'rotate(180deg)',
          transition: 'transform 300ms ease',
        }} />
        <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, color: 'rgba(255,140,40,0.5)', letterSpacing: '0.1em' }}>
          {expanded ? 'RECOLHER' : 'EXPANDIR'}
        </span>
        <ChevronUp size={14} style={{
          color: 'rgba(255,140,40,0.7)',
          transform: expanded ? 'rotate(0deg)' : 'rotate(180deg)',
          transition: 'transform 300ms ease',
        }} />
      </button>

      {/* Expandable content */}
      <div style={{
        overflow: 'hidden',
        maxHeight: expanded ? '800px' : '0px',
        transition: 'max-height 400ms cubic-bezier(0.4,0,0.2,1)',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 16px 20px' }}>
          {/* Brand */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <img src="/logo.png" alt="CYBERSEC LAB" style={{ width: 28, height: 28, objectFit: 'contain', filter: 'drop-shadow(0 0 8px rgba(139,92,246,0.5))' }} />
              <span style={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700, fontSize: 13, letterSpacing: '0.12em', color: '#e6eef8' }}>CYBERSEC LAB</span>
            </div>
            <p style={{ fontSize: 12, color: 'rgba(155,176,198,0.45)', lineHeight: 1.6, marginBottom: 12, maxWidth: 320 }}>
              Plataforma de aprendizado em cybersecurity — Red, Blue e Purple Team.
            </p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {TEAM_BADGES.map(t => (
                <div key={t.label} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '3px 9px', borderRadius: 5, background: `${t.color}15`, border: `1px solid ${t.color}28` }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: t.color, boxShadow: `0 0 4px ${t.color}` }} />
                  <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, color: t.color, letterSpacing: '0.08em' }}>{t.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Links — wrap naturally on mobile */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
            {Object.entries(FOOTER_LINKS).map(([group, links]) => (
              <div key={group} style={{ minWidth: 100 }}>
                <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, color: 'rgba(255,140,40,0.6)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 10 }}>
                  {group}
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {links.map(link => (
                    <li key={link.href}>
                      <Link href={link.href} style={{ fontSize: 13, color: 'rgba(155,176,198,0.5)', textDecoration: 'none', transition: 'color 150ms' }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#e6eef8'}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(155,176,198,0.5)'}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Credits bar — always visible */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
          <img src="/merlin.jpg" alt="Alden Merlin" style={{ width: 22, height: 22, borderRadius: '50%', objectFit: 'cover', border: '1px solid rgba(139,92,246,0.3)', flexShrink: 0 }} />
          <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 11, color: 'rgba(155,176,198,0.35)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            Desenvolvido por <span style={{ color: 'rgba(155,176,198,0.6)', fontWeight: 500 }}>Alden Merlin</span> © 2026
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 5px #22c55e' }} />
          <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, color: 'rgba(34,197,94,0.5)', letterSpacing: '0.08em' }}>
            signal &gt; noise
          </span>
        </div>
      </div>
    </footer>
  );
}
