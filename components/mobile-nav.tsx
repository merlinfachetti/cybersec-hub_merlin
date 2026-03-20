'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Award, Map, BookOpen, BarChart2, User, Radio } from 'lucide-react';
import { ThemeToggle } from './theme-toggle';

const LINKS = [
  { href: '/home',           icon: Home,     label: 'Hub'     },
  { href: '/certifications', icon: Award,    label: 'Certs'   },
  { href: '/roadmap',        icon: Map,      label: 'Roadmap' },
  { href: '/resources',      icon: BookOpen, label: 'Recursos'},
  { href: '/market',         icon: BarChart2,label: 'Mercado' },
  { href: '/profile',        icon: User,     label: 'Perfil'  },
];

export function MobileNav() {
  const path = usePathname();

  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      zIndex: 100,
      background: 'var(--p-nav-bg, rgba(8,6,18,0.97))',
      borderTop: '1px solid var(--p-border, rgba(255,255,255,0.08))',
      backdropFilter: 'blur(20px)',
      padding: '6px 4px env(safe-area-inset-bottom, 6px)',
      display: 'flex', alignItems: 'center',
    }} className="md:hidden">
      {LINKS.map(({ href, icon: Icon, label }) => {
        const active = path === href || path.startsWith(href + '/');
        return (
          <Link key={href} href={href} style={{
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: 3, padding: '4px 2px', textDecoration: 'none',
            color: active ? '#8b5cf6' : 'rgba(155,176,198,0.45)',
            transition: 'color 150ms',
          }}>
            <Icon size={20} strokeWidth={active ? 2.2 : 1.8} />
            <span style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 9, letterSpacing: '0.04em',
              fontWeight: active ? 600 : 400,
            }}>
              {label}
            </span>
            {active && (
              <span style={{
                position: 'absolute', bottom: 0,
                width: 20, height: 2, borderRadius: 1,
                background: '#8b5cf6',
              }} />
            )}
          </Link>
        );
      })}
      {/* Theme toggle no fim */}
      <div style={{ paddingLeft: 6, paddingRight: 4, flexShrink: 0 }}>
        <ThemeToggle />
      </div>
    </nav>
  );
}

// Bottom padding para evitar que conteúdo fique atrás da nav
export function MobileNavSpacer() {
  return <div className="md:hidden" style={{ height: 72 }} />;
}
