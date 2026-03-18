import type { Metadata } from 'next';
import '../globals.css';

export const metadata: Metadata = {
  title: 'CYBER PORTAL — Identify',
  description: 'Secure authentication portal',
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return children;
}
