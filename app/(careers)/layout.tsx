import { MainNav } from '@/components/main-nav';
import { SiteFooter } from '@/components/site-footer';
import { MobileNav, MobileNavSpacer } from '@/components/mobile-nav';

export default function CareersLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
