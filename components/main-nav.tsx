'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function MainNav() {
  const pathname = usePathname();

  const routes = [
    {
      href: '/',
      label: 'Home',
      active: pathname === '/',
    },
    {
      href: '/certifications',
      label: 'Certifications',
      active: pathname.startsWith('/certifications'),
    },
    {
      href: '/roadmap',
      label: 'Roadmap',
      active: pathname === '/roadmap',
    },
    {
      href: '/market',
      label: 'Market',
      active: pathname === '/market',
    },
    {
      href: '/resources',
      label: 'Resources',
      active: pathname === '/resources',
    },
    {
      href: '/profile',
      label: 'Profile',
      active: pathname === '/profile',
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container flex h-16 items-center justify-between gap-3">
        <Link href="/" className="flex min-w-0 items-center gap-2">
          <img src="/logo.png" alt="CYBER PORTAL" style={{ width: 28, height: 28, objectFit: "contain", filter: "drop-shadow(0 0 5px rgba(139,92,246,0.45))" }} />
          <span className="truncate font-bold text-lg sm:text-xl">CyberSec Lab</span>
        </Link>

        <nav className="hidden items-center space-x-6 text-sm font-medium md:flex">
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

        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Open navigation">
                <Menu className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              {routes.map((route) => (
                <DropdownMenuItem key={route.href} asChild>
                  <Link
                    href={route.href}
                    className={cn(
                      'w-full',
                      route.active && 'font-semibold text-primary'
                    )}
                  >
                    {route.label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
