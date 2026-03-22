'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Menu, Radio } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { GlobalSearch } from '@/components/global-search';
import { ThemeToggle } from '@/components/theme-toggle';

interface NavUser { name: string | null; email: string; role: string; }

export function MainNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<NavUser | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.ok ? r.json() : null)
      .then(d => d?.user && setUser(d.user))
      .catch(() => null);
  }, []);

  // Click outside closes menu
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ESC closes menu
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleLogout = () => {
    window.location.href = '/api/auth/signout';
  };

  // Nav routes — Perfil is in user menu only, not here
  const routes = [
    { href: '/home',           label: 'Home',          active: pathname === '/home' },
    { href: '/certifications', label: 'Certificações', active: pathname.startsWith('/certifications') },
    { href: '/roadmap',        label: 'Roadmap',       active: pathname === '/roadmap' },
    { href: '/resources',      label: 'Recursos',      active: pathname === '/resources' },
    { href: '/market',         label: 'Mercado',       active: pathname === '/market' },
  ];

  const UserAvatar = () => (
    <div ref={menuRef} style={{ position: 'relative', flexShrink: 0 }}>
      <button
        onClick={() => setMenuOpen(v => !v)}
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '4px 12px 4px 4px', borderRadius: 10, cursor: 'pointer',
          background: menuOpen ? 'rgba(139,92,246,0.1)' : 'rgba(255,255,255,0.03)',
          border: `1px solid ${menuOpen ? 'rgba(139,92,246,0.3)' : 'rgba(255,255,255,0.08)'}`,
          transition: 'all 150ms',
        }}
      >
        {/* Avatar com dot verde de status */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', overflow: 'hidden', border: '1.5px solid rgba(139,92,246,0.4)' }}>
            <img src="/merlin.jpg" alt="Merlin" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          {/* Status dot — verde = autenticado */}
          <span style={{
            position: 'absolute', bottom: 0, right: 0,
            width: 8, height: 8, borderRadius: '50%',
            background: '#22c55e',
            boxShadow: '0 0 6px #22c55e, 0 0 12px rgba(34,197,94,0.4)',
            border: '1.5px solid rgba(8,6,20,0.9)',
          }} />
        </div>
        {/* Nome preferido */}
        <span style={{ fontFamily: '"Space Grotesk",sans-serif', fontSize: 12, fontWeight: 600, color: '#e6eef8' }}>
          {user?.name?.split(' ')[0] ?? 'Merlin'}
        </span>
      </button>

      {menuOpen && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 8px)', right: 0,
          background: 'rgba(8,6,20,0.97)',
          border: '1px solid rgba(139,92,246,0.15)',
          borderRadius: 12, padding: 6, minWidth: 200,
          backdropFilter: 'blur(24px)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
          zIndex: 200,
          animation: 'cp-fade-in 0.12s ease-out both',
        }}>
          {/* User info */}
          <div style={{ padding: '10px 12px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: 6 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#e8e4ff', fontFamily: '"Space Grotesk",sans-serif' }}>
              {user?.name ?? 'Merlin'}
            </div>
            <div style={{ fontSize: 10, color: 'rgba(255,140,40,0.6)', fontFamily: '"JetBrains Mono",monospace', marginTop: 3 }}>
              {user?.email}
            </div>
          </div>

          {/* Perfil */}
          <button
            onClick={() => { setMenuOpen(false); router.push('/profile'); }}
            style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '8px 12px', background: 'none', border: 'none', cursor: 'pointer', borderRadius: 8, color: '#22c55e', fontSize: 13, fontFamily: '"Inter",sans-serif', fontWeight: 600, transition: 'all 150ms', textAlign: 'left' }}
            onMouseEnter={e => { const el = e.currentTarget; el.style.background = 'rgba(34,197,94,0.08)'; el.style.color = '#4ade80'; }}
            onMouseLeave={e => { const el = e.currentTarget; el.style.background = 'none'; el.style.color = '#22c55e'; }}
          >
            <span style={{ fontWeight: 900, fontSize: 14 }}>⇒</span> Perfil
          </button>

          {/* Sign out */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: 6, paddingTop: 6 }}>
            <button
              onClick={handleLogout}
              style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '8px 12px', background: 'none', border: 'none', cursor: 'pointer', borderRadius: 8, color: 'rgba(255,100,100,0.7)', fontSize: 13, fontFamily: '"Inter",sans-serif', transition: 'all 150ms', textAlign: 'left' }}
              onMouseEnter={e => { const el = e.currentTarget; el.style.background = 'rgba(229,62,62,0.08)'; el.style.color = '#ff7070'; }}
              onMouseLeave={e => { const el = e.currentTarget; el.style.background = 'none'; el.style.color = 'rgba(255,100,100,0.7)'; }}
            >
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
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container flex h-16 items-center gap-3">

        {/* Logo */}
        <Link href="/home" className="flex min-w-0 items-center gap-2 flex-shrink-0">
          <img src="/logo.png" alt="CYBERSEC HUB" style={{ width: 32, height: 32, objectFit: 'contain', filter: 'drop-shadow(0 0 6px rgba(139,92,246,0.5))' }} />
          <span className="truncate font-bold text-lg sm:text-xl">CyberSec Hub</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {routes.map((route) => (
            <Link key={route.href} href={route.href}
              className={cn('transition-colors hover:text-primary whitespace-nowrap',
                route.active ? 'text-primary' : 'text-muted-foreground')}>
              {route.label}
            </Link>
          ))}
        </nav>

        {/* Desktop right: Search + Toggle + Threat Universe + User */}
        <div className="hidden md:flex items-center gap-2 ml-auto">
          <GlobalSearch />
          <ThemeToggle />
          <Link href="/threat-universe">
            <Button size="sm" variant="outline" className="gap-2 border-purple-500/40 text-purple-400 hover:bg-purple-500/10 hover:text-purple-300">
              <Radio className="h-3.5 w-3.5" />
              Threat Universe
            </Button>
          </Link>
          <UserAvatar />
        </div>

        {/* Mobile: Search + Hamburger + User avatar */}
        <div className="md:hidden flex items-center gap-2 ml-auto">
          <GlobalSearch fullWidth />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Menu" className="flex-shrink-0">
                <Menu className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {routes.map((route) => (
                <DropdownMenuItem key={route.href} asChild>
                  <Link href={route.href} className={cn('w-full', route.active && 'font-semibold text-primary')}>
                    {route.label}
                  </Link>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile" className="w-full" style={{ color: "#22c55e", fontWeight: 600 }}>⇒ Perfil</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={handleLogout} className="text-red-400 cursor-pointer">
                Sign out
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="flex items-center justify-between cursor-default">
                <span className="text-sm text-muted-foreground">Tema</span>
                <ThemeToggle />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

      </div>
    </header>
  );
}
