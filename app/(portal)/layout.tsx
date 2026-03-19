import type { Metadata } from 'next';
import '../globals.css';

export const metadata: Metadata = {
  title: 'CYBERSEC LAB — Threat Universe',
  description: 'Threat Intelligence & Learning Platform · signal > noise',
  icons: {
    icon: '/favicon-32x32.png',
    apple: '/apple-touch-icon.png',
  },
};

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
