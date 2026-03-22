'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Menu } from 'lucide-react';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { GlobalSearch } from '@/components/global-search';
import { ThemeToggle } from '@/components/theme-toggle';

interface NavUser { name: string | null; email: string; role: string; }

// ── Threat Universe Button — sonar pulse ─────────────────────────────────
function ThreatUniverseBtn() {
  return (
    <Link href="/threat-universe" className="tu-btn" style={{ textDecoration: 'none' }}>
      <span className="tu-sonar">
        <span className="tu-sonar-ring" />
        <span className="tu-sonar-ring tu-sonar-ring-2" />
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="tu-icon">
          {/* Radio/signal icon */}
          <path d="M5 12.55a11 11 0 0 1 14.08 0"/>
          <path d="M1.42 9a16 16 0 0 1 21.16 0"/>
          <path d="M8.53 16.11a6 6 0 0 1 6.95 0"/>
          <circle cx="12" cy="20" r="1" fill="currentColor"/>
        </svg>
      </span>
      Threat Universe
    </Link>
  );
}

// ── Nav Link with border-drawing hover ────────────────────────────────────
function NavLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link href={href} className={cn('nav-link', active && 'nav-link-active')}>
      {label}
    </Link>
  );
}

// ── User Avatar Dropdown ──────────────────────────────────────────────────
function UserAvatar({ user, onLogout }: { user: NavUser | null; onLogout: () => void }) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  return (
    <div ref={menuRef} style={{ position: 'relative', flexShrink: 0 }}>
      <button onClick={() => setMenuOpen(v => !v)} style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '4px 12px 4px 4px', borderRadius: 10, cursor: 'pointer',
        background: menuOpen ? 'rgba(139,92,246,0.1)' : 'rgba(255,255,255,0.03)',
        border: `1px solid ${menuOpen ? 'rgba(139,92,246,0.3)' : 'rgba(255,255,255,0.08)'}`,
        transition: 'all 150ms',
      }}>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', overflow: 'hidden', border: '1.5px solid rgba(139,92,246,0.4)' }}>
            <img src="/merlin.jpg" alt="Merlin" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <span style={{ position: 'absolute', bottom: 0, right: 0, width: 8, height: 8, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px #22c55e, 0 0 12px rgba(34,197,94,0.4)', border: '1.5px solid rgba(8,6,20,0.9)' }} />
        </div>
        <span style={{ fontFamily: '"Space Grotesk",sans-serif', fontSize: 12, fontWeight: 600, color: '#e6eef8' }}>
          {user?.name?.split(' ')[0] ?? 'Merlin'}
        </span>
      </button>

      {menuOpen && (
        <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, background: 'rgba(8,6,20,0.97)', border: '1px solid rgba(139,92,246,0.15)', borderRadius: 12, padding: 6, minWidth: 200, backdropFilter: 'blur(24px)', boxShadow: '0 20px 60px rgba(0,0,0,0.6)', zIndex: 200, animation: 'cp-fade-in 0.12s ease-out both' }}>
          <div style={{ padding: '10px 12px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: 6 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#e8e4ff', fontFamily: '"Space Grotesk",sans-serif' }}>{user?.name ?? 'Merlin'}</div>
            <div style={{ fontSize: 10, color: 'rgba(255,140,40,0.6)', fontFamily: '"JetBrains Mono",monospace', marginTop: 3 }}>{user?.email}</div>
          </div>
          <button onClick={() => { setMenuOpen(false); router.push('/profile'); }}
            style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '8px 12px', background: 'none', border: 'none', cursor: 'pointer', borderRadius: 8, color: '#22c55e', fontSize: 13, fontFamily: '"Inter",sans-serif', fontWeight: 600, transition: 'all 150ms', textAlign: 'left' }}
            onMouseEnter={e => { const el = e.currentTarget; el.style.background = 'rgba(34,197,94,0.08)'; el.style.color = '#4ade80'; }}
            onMouseLeave={e => { const el = e.currentTarget; el.style.background = 'none'; el.style.color = '#22c55e'; }}>
            <span style={{ fontWeight: 900, fontSize: 14 }}>⇒</span> Perfil
          </button>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: 6, paddingTop: 6 }}>
            <button onClick={onLogout}
              style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '8px 12px', background: 'none', border: 'none', cursor: 'pointer', borderRadius: 8, color: 'rgba(255,100,100,0.7)', fontSize: 13, fontFamily: '"Inter",sans-serif', transition: 'all 150ms', textAlign: 'left' }}
              onMouseEnter={e => { const el = e.currentTarget; el.style.background = 'rgba(229,62,62,0.08)'; el.style.color = '#ff7070'; }}
              onMouseLeave={e => { const el = e.currentTarget; el.style.background = 'none'; el.style.color = 'rgba(255,100,100,0.7)'; }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────
export function MainNav() {
  const pathname = usePathname();
  const [user, setUser] = useState<NavUser | null>(null);

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.ok ? r.json() : null).then(d => d?.user && setUser(d.user)).catch(() => null);
  }, []);

  const handleLogout = () => { try { localStorage.removeItem('cp_last_active'); } catch {}
    window.location.href = '/api/auth/signout'; };

  const routes = [
    { href: '/home',           label: 'Home',         active: pathname === '/home' },
    { href: '/certifications', label: 'Certificações', active: pathname.startsWith('/certifications') },
    { href: '/roadmap',        label: 'Roadmap',      active: pathname === '/roadmap' },
    { href: '/resources',      label: 'Recursos',     active: pathname === '/resources' },
    { href: '/market',         label: 'Mercado',      active: pathname === '/market' },
    { href: '/teams',          label: 'Cyber Times',  active: pathname.startsWith('/teams') },
  ];

  return (
    <>
      <style>{`
        /* ── Nav Link — border-drawing hover ── */
        .nav-link {
          position: relative;
          font-size: 13px;
          font-weight: 500;
          color: rgba(155,176,198,0.6);
          text-decoration: none;
          padding: 4px 8px;
          white-space: nowrap;
          transition: color 200ms;
        }
        .nav-link::before,
        .nav-link::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 4px;
          pointer-events: none;
        }
        /* Top + bottom borders animate width */
        .nav-link::before {
          border-top: 1px solid transparent;
          border-bottom: 1px solid transparent;
          width: 0;
          left: 50%;
          transition: width 250ms ease, left 250ms ease, border-color 250ms;
        }
        /* Left + right borders animate height */
        .nav-link::after {
          border-left: 1px solid transparent;
          border-right: 1px solid transparent;
          height: 0;
          top: 50%;
          transition: height 250ms ease, top 250ms ease, border-color 250ms;
          transition-delay: 150ms;
        }
        .nav-link:hover {
          color: #e6eef8;
        }
        .nav-link:hover::before {
          width: 100%;
          left: 0;
          border-color: rgba(139,92,246,0.5);
        }
        .nav-link:hover::after {
          height: 100%;
          top: 0;
          border-color: rgba(139,92,246,0.5);
        }
        .nav-link-active {
          color: #a78bfa !important;
        }
        .nav-link-active::before {
          width: 100% !important;
          left: 0 !important;
          border-color: rgba(139,92,246,0.35) !important;
        }
        .nav-link-active::after {
          height: 100% !important;
          top: 0 !important;
          border-color: rgba(139,92,246,0.35) !important;
        }

        /* ── Threat Universe Button — sonar ── */
        .tu-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 6px 14px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          font-family: "Space Grotesk", sans-serif;
          color: rgba(139,92,246,0.8);
          border: 1px solid rgba(139,92,246,0.3);
          background: rgba(139,92,246,0.06);
          transition: all 200ms ease;
          white-space: nowrap;
        }
        .tu-btn:hover {
          color: #a78bfa;
          border-color: rgba(139,92,246,0.6);
          background: rgba(139,92,246,0.12);
          box-shadow: 0 0 16px rgba(139,92,246,0.2);
        }
        .tu-sonar {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          flex-shrink: 0;
        }
        .tu-sonar-ring {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 1.5px solid rgba(139,92,246,0.6);
          animation: sonar-out 2s ease-out infinite;
        }
        .tu-sonar-ring-2 {
          animation-delay: 1s;
        }
        .tu-icon {
          position: relative;
          z-index: 1;
          color: currentColor;
          flex-shrink: 0;
        }
        .tu-btn:hover .tu-sonar-ring {
          animation: sonar-out 0.8s ease-out infinite;
          border-color: rgba(139,92,246,0.9);
        }
        .tu-btn:hover .tu-sonar-ring-2 {
          animation-delay: 0.4s;
        }
        @keyframes sonar-out {
          0%   { transform: scale(0.6); opacity: 0.9; }
          100% { transform: scale(2.2); opacity: 0; }
        }
      `}</style>

      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        {/* 3-column layout: logo | nav center | actions right */}
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 24px', height: 64, display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: 16 }}>

          {/* LEFT — Logo */}
          <Link href="/home" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', flexShrink: 0 }}>
            <img src="/logo.png" alt="CYBERSEC HUB" style={{ width: 32, height: 32, objectFit: 'contain', filter: 'drop-shadow(0 0 6px rgba(139,92,246,0.5))' }} />
            <span style={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700, fontSize: 16, color: '#e6eef8', whiteSpace: 'nowrap' }}>
              CyberSec Hub
            </span>
          </Link>

          {/* CENTER — Nav (desktop only) */}
          <nav className="hidden md:flex items-center gap-1">
            {routes.map(r => <NavLink key={r.href} href={r.href} label={r.label} active={r.active} />)}
          </nav>

          {/* RIGHT — Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end' }}>
            {/* Desktop actions */}
            <div className="hidden md:flex items-center gap-2">
              <GlobalSearch />
              <ThemeToggle />
              <ThreatUniverseBtn />
              <UserAvatar user={user} onLogout={handleLogout} />
            </div>

            {/* Mobile: search + hamburger */}
            <div className="md:hidden flex items-center gap-2">
              <GlobalSearch fullWidth />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" aria-label="Menu" className="flex-shrink-0">
                    <Menu className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {routes.map(r => (
                    <DropdownMenuItem key={r.href} asChild>
                      <Link href={r.href} className={cn('w-full', r.active && 'font-semibold text-primary')}>{r.label}</Link>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="w-full" style={{ color: '#22c55e', fontWeight: 600 }}>⇒ Perfil</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={handleLogout} className="text-red-400 cursor-pointer">Sign out</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={e => e.preventDefault()} className="flex items-center justify-between cursor-default">
                    <span className="text-sm text-muted-foreground">Tema</span>
                    <ThemeToggle />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

        </div>
      </header>
    </>
  );
}
