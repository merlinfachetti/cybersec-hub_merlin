'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Menu, Radio } from 'lucide-react';
import { GlobalSearch } from '@/components/global-search';
import { ThemeToggle } from '@/components/theme-toggle';
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
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="flex h-16 items-center px-4 gap-3">

        {/* Logo — fixed width */}
        <Link href="/home" className="flex items-center gap-2 flex-shrink-0">
          <img src="/logo.png" alt="CYBERSEC LAB"
            style={{ width: 32, height: 32, objectFit: 'contain', filter: 'drop-shadow(0 0 6px rgba(139,92,246,0.5))' }} />
          <span className="hidden sm:block font-bold text-lg whitespace-nowrap">CyberSec Lab</span>
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

        {/* Desktop right: Search + Toggle + Portal */}
        <div className="hidden md:flex items-center gap-2 ml-auto">
          <GlobalSearch />
          <ThemeToggle />
          <Link href="/threat-universe">
            <Button size="sm" variant="outline" className="gap-2 border-purple-500/40 text-purple-400 hover:bg-purple-500/10 hover:text-purple-300">
              <Radio className="h-3.5 w-3.5" />
              Threat Universe
            </Button>
          </Link>
        </div>

        {/* Mobile: Search fills gap, Hamburger right-aligned next to it */}
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
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}
                className="flex items-center justify-between cursor-default">
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
