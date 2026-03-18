import type { Metadata } from 'next';
import '../globals.css';

export const metadata: Metadata = {
  title: 'CYBER PORTAL — Threat Universe',
  description: 'Threat Intelligence & Learning Platform',
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
};

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return children;
}
