'use client';

import Link from 'next/link';
import { Radio } from 'lucide-react';

const FOOTER_LINKS = {
  Careers: [
    { label: 'Certificações', href: '/certifications' },
    { label: 'Roadmap', href: '/roadmap' },
    { label: 'Recursos', href: '/resources' },
    { label: 'Mercado', href: '/market' },
  ],
  Portal: [
    { label: 'Threat Universe', href: '/threat-universe' },
    { label: 'Perfil', href: '/profile' },
    { label: 'Home', href: '/home' },
  ],
  Docs: [
    { label: 'Conceitos', href: '/docs/concepts' },
    { label: 'API Reference', href: '/docs/api' },
    { label: 'Arquitetura', href: '/docs/architecture' },
    { label: 'API Reference', href: '/docs/api' },
  ],
};

const TEAM_BADGES = [
  { label: 'Red Team', color: '#e53e3e', desc: 'Offensive' },
  { label: 'Blue Team', color: '#3b82f6', desc: 'Defensive' },
  { label: 'Purple Team', color: '#8b5cf6', desc: 'Improve' },
];

export function SiteFooter() {
  return (
    <footer style={{
      background: 'linear-gradient(180deg, transparent 0%, rgba(6,4,18,0.95) 100%)',
      borderTop: '1px solid rgba(255,255,255,0.06)',
      marginTop: 'auto',
    }}>
      {/* Main footer content */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 40, marginBottom: 40 }}>

          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <img src="/logo.png" alt="CYBERSEC LAB" style={{ width: 32, height: 32, objectFit: 'contain', filter: 'drop-shadow(0 0 8px rgba(139,92,246,0.5))' }} />
              <span style={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700, fontSize: 14, letterSpacing: '0.12em', color: '#e6eef8' }}>CYBERSEC LAB</span>
            </div>
            <p style={{ fontSize: 12, color: 'rgba(155,176,198,0.5)', lineHeight: 1.7, marginBottom: 16, maxWidth: 260 }}>
              Plataforma de aprendizado em cybersecurity com foco em Red, Blue e Purple Team. Signal sobre o ruído.
            </p>
            {/* Team badges */}
            <div style={{ display: 'flex', gap: 8 }}>
              {TEAM_BADGES.map(t => (
                <div key={t.label} style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  padding: '4px 10px', borderRadius: 6,
                  background: `${t.color}18`, border: `1px solid ${t.color}30`,
                }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: t.color, boxShadow: `0 0 5px ${t.color}` }} />
                  <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, color: t.color, letterSpacing: '0.08em' }}>{t.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Link groups */}
          {Object.entries(FOOTER_LINKS).map(([group, links]) => (
            <div key={group}>
              <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, color: 'rgba(139,92,246,0.6)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 14 }}>
                {group}
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 9 }}>
                {links.map(link => (
                  <li key={link.href}>
                    <Link href={link.href} style={{
                      fontSize: 13, color: 'rgba(155,176,198,0.55)',
                      textDecoration: 'none', transition: 'color 150ms',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#e6eef8'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(155,176,198,0.55)'; }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.05)',
          flexWrap: 'wrap', gap: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* Security status */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px #22c55e' }} />
              <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: 'rgba(34,197,94,0.7)', letterSpacing: '0.08em' }}>
                SECURE · signal &gt; noise
              </span>
            </div>
            <span style={{ color: 'rgba(255,255,255,0.06)' }}>|</span>
            <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 11, color: 'rgba(155,176,198,0.3)' }}>
              © 2025 Alden Merlin · Built with Next.js + Prisma
            </span>
          </div>

          {/* Right: Threat Universe shortcut */}
          <Link href="/threat-universe" style={{
            display: 'flex', alignItems: 'center', gap: 6,
            fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
            color: 'rgba(255,140,40,0.6)', letterSpacing: '0.08em',
            textDecoration: 'none', padding: '5px 12px',
            border: '1px solid rgba(255,140,40,0.2)', borderRadius: 6,
            transition: 'all 150ms',
          }}
          onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.color = 'rgba(255,140,40,1)'; el.style.borderColor = 'rgba(255,140,40,0.5)'; el.style.background = 'rgba(255,140,40,0.06)'; }}
          onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.color = 'rgba(255,140,40,0.6)'; el.style.borderColor = 'rgba(255,140,40,0.2)'; el.style.background = 'transparent'; }}
          >
            <Radio size={10} />
            Threat Universe
          </Link>
        </div>
      </div>
    </footer>
  );
}
