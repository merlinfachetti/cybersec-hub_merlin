import { MainNav } from '@/components/main-nav';

export default function HubLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1">{children}</main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            CYBERSEC LAB · Built by Alden Merlin © 2025
          </p>
        </div>
      </footer>
    </div>
  );
}
