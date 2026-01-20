'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Shield } from 'lucide-react';

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
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center gap-2 mr-8">
          <Shield className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">CyberSec Hub</span>
        </Link>

        <nav className="flex items-center space-x-6 text-sm font-medium">
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
      </div>
    </header>
  );
}
