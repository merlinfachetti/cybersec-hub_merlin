'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MerlinModal } from '@/components/merlin-modal';
import Link from 'next/link';
import { ChevronUp } from 'lucide-react';

const FOOTER_LINKS = {
  Careers: [
    { label: 'Certificações', href: '/certifications' },
    { label: 'Roadmap',       href: '/roadmap' },
    { label: 'Recursos',      href: '/resources' },
    { label: 'Mercado',       href: '/market' },
  ],
  Portal: [
    { label: 'Threat Universe', href: '/threat-universe' },
    { label: 'Home',            href: '/home' },
    { label: 'Perfil',          href: '/profile' },
  ],
  Docs: [
    { label: 'API Reference', href: '/docs/api' },
  ],
};

const TEAM_BADGES = [
  { label: 'Red Team',    color: '#e53e3e', href: '/teams#red',    desc: 'Offensive' },
  { label: 'Blue Team',   color: '#3b82f6', href: '/teams#blue',   desc: 'Defensive' },
  { label: 'Purple Team', color: '#8b5cf6', href: '/teams#purple', desc: 'Improve'   },
];

function TeamBadge({ t }: { t: typeof TEAM_BADGES[0] }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      href={t.href}
      style={{ textDecoration: 'none' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{
        display: 'flex', alignItems: 'center', gap: 5,
        padding: '4px 10px', borderRadius: 5,
        background: hovered ? `${t.color}28` : `${t.color}15`,
        border: `1px solid ${hovered ? t.color + '60' : t.color + '28'}`,
        transform: hovered ? 'translateY(-1px)' : 'none',
        boxShadow: hovered ? `0 4px 12px ${t.color}30` : 'none',
        transition: 'all 180ms ease',
        cursor: 'pointer',
        /* fixed width — never shifts siblings */
        minWidth: 120,
      }}>
        <div style={{ width: 5, height: 5, borderRadius: '50%', flexShrink: 0, background: t.color, boxShadow: hovered ? `0 0 8px ${t.color}` : `0 0 4px ${t.color}` }} />
        <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, color: t.color, letterSpacing: '0.08em', flex: 1 }}>
          {t.label}
        </span>
        {/* desc sempre renderizado, só muda opacity — não muda layout */}
        <span style={{
          fontFamily: '"JetBrains Mono", monospace', fontSize: 8,
          color: `${t.color}90`,
          borderLeft: `1px solid ${t.color}30`, paddingLeft: 5,
          opacity: hovered ? 1 : 0,
          transition: 'opacity 180ms ease',
          whiteSpace: 'nowrap',
        }}>
          →
        </span>
      </div>
    </Link>
  );
}

function FooterGroup({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div style={{ minWidth: 90, flexShrink: 0 }}>
      <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, color: 'rgba(255,140,40,0.6)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 10 }}>
        {title}
      </div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {links.map(link => (
          <li key={link.href}>
            <Link href={link.href}
              style={{ fontSize: 13, color: 'var(--ds-body-dim, rgba(155,176,198,0.45))', textDecoration: 'none', transition: 'color 150ms' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#e6eef8'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--ds-body-dim, rgba(155,176,198,0.45))'}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SiteFooter() {
  const [expanded, setExpanded] = useState(false);
  const router = useRouter();
  const [showMerlin, setShowMerlin] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include', cache: 'no-store' })
      .then(r => r.ok ? r.json() : null)
      .then(d => d?.user?.role && setUserRole(d.user.role))
      .catch(() => null);
  }, []);

  const canSeeDocs = userRole === 'ADMIN' || userRole === 'DEV';

  return (
    <footer style={{ background: '#0a0814', borderTop: '1px solid rgba(139,92,246,0.12)', marginTop: 'auto' }}>

      {/* Toggle strip */}
      <button
        onClick={() => setExpanded(v => !v)}
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '10px 16px', background: 'none', border: 'none', cursor: 'pointer', borderBottom: expanded ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,140,40,0.04)'}
        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'none'}
      >
        <ChevronUp size={14} style={{ color: 'rgba(255,140,40,0.7)', transform: expanded ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform 300ms ease' }} />
        <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, color: 'rgba(255,140,40,0.5)', letterSpacing: '0.1em' }}>
          {expanded ? 'RECOLHER' : 'EXPANDIR'}
        </span>
        <ChevronUp size={14} style={{ color: 'rgba(255,140,40,0.7)', transform: expanded ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform 300ms ease' }} />
      </button>

      {/* Expandable content */}
      <div style={{ overflow: 'hidden', maxHeight: expanded ? '600px' : '0px', transition: 'max-height 400ms cubic-bezier(0.4,0,0.2,1)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px clamp(16px,4vw,48px) 20px', width: '100%' }}>

          {/* Desktop: brand + links inline | Mobile: stack */}
          <div className="footer-expanded-row" style={{ display: 'flex', gap: 32, alignItems: 'flex-start', flexWrap: 'wrap' }}>

            {/* Brand block */}
            <div style={{ flexShrink: 0, minWidth: 220 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <img src="/logo.png" alt="CYBERSEC HUB" style={{ width: 28, height: 28, objectFit: 'contain', filter: 'drop-shadow(0 0 8px rgba(139,92,246,0.5))' }} />
                <span style={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700, fontSize: 13, letterSpacing: '0.12em', color: 'var(--ds-title-section, #e6eef8)' }}>
                  CYBERSEC HUB
                </span>
              </div>
              {/* Texto em 2 linhas */}
              <p style={{ fontSize: 12, color: 'var(--ds-body-dim)', lineHeight: 1.65, marginBottom: 14, maxWidth: 260 }}>
                Plataforma de aprendizado em CyberSecurity<br />
                <span style={{ color: 'rgba(139,92,246,0.7)' }}>→</span> Red, Blue e Purple Team.
              </p>
              {/* Team badges — interativos */}
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {TEAM_BADGES.map(t => <TeamBadge key={t.label} t={t} />)}
              </div>
            </div>

            {/* Link groups — ao lado do brand no desktop */}
            <div className="footer-links-row" style={{ display: 'flex', gap: 32, flexWrap: 'nowrap', flex: 1 }}>
              {Object.entries(FOOTER_LINKS).map(([group, links]) => (
                <FooterGroup key={group} title={group} links={links} />
              ))}
            </div>

          </div>
        </div>
      </div>

      {/* Credits bar — always visible */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
          <img src="/merlin.jpg" alt="Alden Merlin" style={{ width: 22, height: 22, borderRadius: '50%', objectFit: 'cover', border: '1px solid rgba(139,92,246,0.3)', flexShrink: 0 }} />
          <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 11, color: 'var(--ds-mono-dim)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            Desenvolvido por{' '}
            <button onClick={() => router.push('/threat-universe?youarehere=1')} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'var(--ds-body-muted)', fontWeight: 500, fontSize: 11, fontFamily: 'inherit', textDecoration: 'underline dotted', textUnderlineOffset: 3, transition: 'color 150ms' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#a78bfa'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--ds-body-muted)'; }}>
              Alden Merlin
            </button>{' '}© 2026
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
