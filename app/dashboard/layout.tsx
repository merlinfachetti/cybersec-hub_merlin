import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, Award, Map, BarChart3, BookOpen, User } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl">🔐</span>
            <span className="font-bold text-xl">CyberSec Hub</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              <Home className="h-4 w-4 inline mr-1" />
              Home
            </Link>
            <Link
              href="/certifications"
              className="transition-colors hover:text-foreground/80 text-foreground"
            >
              <Award className="h-4 w-4 inline mr-1" />
              Certifications
            </Link>
            <Link
              href="/roadmap"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              <Map className="h-4 w-4 inline mr-1" />
              Roadmap
            </Link>
            <Link
              href="/market"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              <BarChart3 className="h-4 w-4 inline mr-1" />
              Market
            </Link>
            <Link
              href="/resources"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              <BookOpen className="h-4 w-4 inline mr-1" />
              Resources
            </Link>
          </nav>

          <Button asChild variant="outline" size="sm">
            <Link href="/profile">
              <User className="h-4 w-4 mr-2" />
              Profile
            </Link>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row px-4">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by <span className="font-medium text-foreground">Merlin</span>
            . For your cybersecurity career journey.
          </p>
          <p className="text-center text-sm text-muted-foreground">
            Sprint 2 - Part 1 Complete ✅
          </p>
        </div>
      </footer>
    </div>
  );
}
