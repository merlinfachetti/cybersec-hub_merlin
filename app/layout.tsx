import type { Metadata } from 'next';
import './globals.css';
import { MainNav } from '@/components/main-nav';
import { ErrorBoundary } from '@/components/error-boundary';

export const metadata: Metadata = {
  title: {
    default: 'CYBER PORTAL',
    template: '%s | CYBER PORTAL',
  },
  description: 'Threat Intelligence & Cybersecurity Learning Platform',
};

/**
 * Root layout — used only by legacy routes (certifications, roadmap, etc.)
 * Auth (/auth/*) and Portal (/portal) have their own isolated layouts
 * via Next.js Route Groups: (auth) and (portal)
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ErrorBoundary>
          <div className="relative flex min-h-screen flex-col">
            <MainNav />
            <main className="flex-1">{children}</main>
            <footer className="border-t py-6 md:py-0">
              <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
                <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                  Built by Merlin. © 2025 CYBER PORTAL. All rights reserved.
                </p>
              </div>
            </footer>
          </div>
        </ErrorBoundary>
      </body>
    </html>
  );
}
