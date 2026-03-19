'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Menu, Radio } from 'lucide-react';
import { GlobalSearch } from '@/components/global-search';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function MainNav() {
  const pathname = usePathname();

  const routes = [
    { href: '/home',            label: 'Home',          active: pathname === '/home' },
    { href: '/certifications',  label: 'Certificações', active: pathname.startsWith('/certifications') },
    { href: '/roadmap',         label: 'Roadmap',       active: pathname === '/roadmap' },
    { href: '/resources',       label: 'Recursos',      active: pathname === '/resources' },
    { href: '/market',          label: 'Mercado',       active: pathname === '/market' },
    { href: '/profile',         label: 'Perfil',        active: pathname === '/profile' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container flex h-16 items-center justify-between gap-3">

        {/* Logo → /home */}
        <Link href="/home" className="flex min-w-0 items-center gap-2">
          <img
            src="/logo.png"
            alt="CYBERSEC LAB"
            style={{ width: 32, height: 32, objectFit: 'contain', filter: 'drop-shadow(0 0 6px rgba(139,92,246,0.5))' }}
          />
          <span className="truncate font-bold text-lg sm:text-xl">CyberSec Lab</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                'transition-colors hover:text-primary',
                route.active ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              {route.label}
            </Link>
          ))}
        </nav>

        {/* Global Search */}
        <div className="flex items-center">
          <GlobalSearch />
        </div>

        {/* Threat Universe CTA — sempre visível no desktop */}
        <div className="hidden items-center gap-3 md:flex">
          <Link href="/threat-universe">
            <Button
              size="sm"
              variant="outline"
              className="gap-2 border-purple-500/40 text-purple-400 hover:bg-purple-500/10 hover:text-purple-300"
            >
              <Radio className="h-3.5 w-3.5" />
              Threat Universe
            </Button>
          </Link>
        </div>

        {/* Search — mobile */}
        <div className="md:hidden flex items-center gap-2">
          <GlobalSearch />
        </div>

        {/* Mobile hamburger menu */}
        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Abrir menu">
                <Menu className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              {routes.map((route) => (
                <DropdownMenuItem key={route.href} asChild>
                  <Link href={route.href} className={cn('w-full', route.active && 'font-semibold text-primary')}>
                    {route.label}
                  </Link>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/threat-universe" className="w-full gap-2 text-purple-400">
                  <Radio className="h-3.5 w-3.5" />
                  Threat Universe
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

      </div>
    </header>
  );
}
