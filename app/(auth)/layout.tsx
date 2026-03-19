import type { Metadata } from 'next';
import '../globals.css';

export const metadata: Metadata = {
  title: 'CYBERSEC LAB — Identify',
  description: 'Secure authentication · signal > noise',
  icons: {
    icon: '/favicon-32x32.png',
    apple: '/apple-touch-icon.png',
  },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
