'use client';

import { useEffect, useState } from 'react';
import { useInactivity } from '@/lib/use-inactivity';
import Link from 'next/link';
import Image from 'next/image';
import {
  Shield, Map, BookOpen, TrendingUp,
  FileText, User, Zap, ChevronRight,
  Radio
} from 'lucide-react';

interface UserSession {
  name: string | null;
  email: string;
  role: string;
}

const NAV_SECTIONS = [
  {
    id: 'universe',
    label: 'Threat Universe',
    sublabel: 'Portal Galático',
    description: 'Navegar no universo de ameaças, labs e missões em modo Red/Blue/Purple.',
    href: '/threat-universe',
    icon: <Radio size={22} />,
    color: '#8b5cf6',
    rgb: '139,92,246',
    badge: 'PORTAL',
    featured: true,
  },
  {
    id: 'certifications',
    label: 'Certificações',
    sublabel: 'Careers',
    description: 'Browse certificações de cybersecurity: SEC+, CEH, CISSP, OSCP e muito mais.',
    href: '/certifications',
    icon: <Shield size={20} />,
    color: '#3b82f6',
    rgb: '59,130,246',
    badge: 'CAREERS',
  },
  {
    id: 'roadmap',
    label: 'Roadmap',
    sublabel: 'Careers',
    description: 'Plano de carreira personalizado do seu perfil atual para Security Engineer.',
    href: '/roadmap',
    icon: <Map size={20} />,
    color: 'var(--ds-ok)',
    rgb: '34,197,94',
    badge: 'CAREERS',
  },
  {
    id: 'resources',
    label: 'Recursos',
    sublabel: 'Careers',
    description: 'Cursos, labs, livros e materiais de estudo para cada certificação.',
    href: '/resources',
    icon: <BookOpen size={20} />,
    color: 'var(--ds-warn)',
    rgb: '245,158,11',
    badge: 'CAREERS',
  },
  {
    id: 'market',
    label: 'Mercado',
    sublabel: 'Careers',
    description: 'Demanda de mercado, salários e tendências para profissionais de cybersecurity.',
    href: '/market',
    icon: <TrendingUp size={20} />,
    color: '#06b6d4',
    rgb: '6,182,212',
    badge: 'CAREERS',
  },
  {
    id: 'profile',
    label: 'Perfil',
    sublabel: 'Hub',
    description: 'Seu progresso, certificações em andamento e plano de estudo.',
    href: '/profile',
    icon: <User size={20} />,
    color: '#e53e3e',
    rgb: '229,62,62',
    badge: 'HUB',
  },
];

export default function HomePage() {
  const [user, setUser] = useState<UserSession | null>(null);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite');
    fetch('/api/auth/me')
      .then(r => r.ok ? r.json() : null)
      .then(d => d?.user && setUser(d.user))
      .catch(() => null);
  }, []);

  const featured = NAV_SECTIONS.find(s => s.featured);
  const rest = NAV_SECTIONS.filter(s => !s.featured);

  // Auto-logout por inatividade (30 min)
  useInactivity(30 * 60 * 1000, async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/auth/login?reason=timeout';
  });

  return (
    <div style={{ minHeight: '100vh', background: 'var(--p-bg)', color: 'var(--ds-title-section, #e6eef8)', fontFamily: '"Inter", sans-serif' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: 'clamp(24px, 5vw, 48px) clamp(16px, 4vw, 24px)' }}>

        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: 'rgba(34,197,94,0.7)', letterSpacing: '0.14em', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span className="secure-dot" style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#22c55e', flexShrink: 0 }} />
            SECURE SESSION ACTIVE
          </div>
          <h1 style={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700, fontSize: 32, marginBottom: 6 }}>
            {greeting}{user?.name ? `, ${user.name}` : ''}.
          </h1>
          <p style={{ fontSize: 14, color: 'var(--ds-body-muted)', maxWidth: 480 }}>
            Escolha onde quer ir. O universo está aguardando.
          </p>
        </div>

        {/* Featured — Threat Universe */}
        {featured && (
          <Link href={featured.href} style={{ textDecoration: 'none', display: 'block', marginBottom: 20 }}>
            <div style={{
              background: `linear-gradient(135deg, rgba(${featured.rgb},0.15) 0%, rgba(var(--p-bg-rgb,8,5,22),0.8) 60%)`,
              border: `1px solid rgba(${featured.rgb},0.25)`,
              borderRadius: 16,
              padding: '28px 32px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              cursor: 'pointer',
              transition: 'all 200ms ease',
              position: 'relative', overflow: 'hidden',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `rgba(${featured.rgb},0.5)`; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = `rgba(${featured.rgb},0.25)`; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
            >
              {/* Glow */}
              <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: `radial-gradient(circle, rgba(${featured.rgb},0.12) 0%, transparent 70%)`, pointerEvents: 'none' }} />

              <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                {/* Logo */}
                <div style={{ position: 'relative', width: 64, height: 64, flexShrink: 0 }}>
                  <div style={{ position: 'absolute', inset: -6, borderRadius: '50%', background: `radial-gradient(circle, rgba(${featured.rgb},0.2) 0%, transparent 70%)` }} />
                  <img src="/logo.png" alt="CYBERSEC HUB" style={{ width: 64, height: 64, objectFit: 'contain', position: 'relative', filter: `drop-shadow(0 0 12px rgba(${featured.rgb},0.8))` }} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <span style={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700, fontSize: 20, color: 'var(--ds-title-card, #f0eeff)' }}>{featured.label}</span>
                    <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, color: `rgba(${featured.rgb},0.7)`, background: `rgba(${featured.rgb},0.1)`, border: `1px solid rgba(${featured.rgb},0.2)`, borderRadius: 4, padding: '2px 8px', letterSpacing: '0.1em' }}>{featured.badge}</span>
                  </div>
                  <p style={{ fontSize: 13, color: 'rgba(155,176,198,0.7)', maxWidth: 480, lineHeight: 1.6 }}>{featured.description}</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: `rgba(${featured.rgb},0.7)`, flexShrink: 0 }}>
                <span style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 13, fontWeight: 600 }}>Entrar</span>
                <ChevronRight size={18} />
              </div>
            </div>
          </Link>
        )}

        {/* Grid — other sections */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
          {rest.map(section => (
            <Link key={section.id} href={section.href} style={{ textDecoration: 'none', display: 'block' }}>
              <div className={`hub-nav-card hub-nav-card--${section.id}`} style={{
                background: 'var(--ds-card)',
                borderRadius: 12,
                padding: '20px 22px',
                cursor: 'pointer',
                height: '100%',
                position: 'relative',
                overflow: 'hidden',
              }}>
                {/* SVG stroke border — efeito dasharray no hover */}
                <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', borderRadius: 12, overflow: 'hidden' }} xmlns="http://www.w3.org/2000/svg">
                  <rect
                    className={`hub-card-rect hub-card-rect--${section.id}`}
                    x="1" y="1"
                    width="calc(100% - 2px)" height="calc(100% - 2px)"
                    rx="11"
                    fill="none"
                    stroke={`rgba(${section.rgb},0.7)`}
                    strokeWidth="1.5"
                    style={{ strokeDasharray: 1000, strokeDashoffset: 1000 } as React.CSSProperties}
                  />
                </svg>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 10,
                      background: `rgba(${section.rgb},0.12)`,
                      border: `1px solid rgba(${section.rgb},0.2)`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: section.color,
                    }}>
                      {section.icon}
                    </div>
                    <div>
                      <div style={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 600, fontSize: 15, color: 'var(--ds-title-section, #e6eef8)' }}>{section.label}</div>
                      <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, color: `rgba(${section.rgb},0.6)`, letterSpacing: '0.1em', marginTop: 2 }}>{section.badge}</div>
                    </div>
                  </div>
                  <ChevronRight size={14} style={{ color: 'var(--ds-mono-dim)', marginTop: 4 }} />
                </div>
                <p style={{ fontSize: 12, color: 'var(--ds-body-muted)', lineHeight: 1.65 }}>{section.description}</p>
              </div>
            </Link>
          ))}
        </div>



      </div>
    </div>
  );
}
