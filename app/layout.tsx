import type { Metadata } from 'next';
import './globals.css';
import { ErrorBoundary } from '@/components/error-boundary';

export const metadata: Metadata = {
  title: {
    default: 'CYBERSEC LAB',
    template: '%s | CYBERSEC LAB',
  },
  description: 'Threat Intelligence & Cybersecurity Learning Platform by Alden Merlin',
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
    other: [
      { rel: 'android-chrome-192x192', url: '/android-chrome-192x192.png' },
      { rel: 'android-chrome-512x512', url: '/android-chrome-512x512.png' },
    ],
  },
  openGraph: {
    title: 'CYBERSEC LAB',
    description: 'Threat Intelligence & Cybersecurity Learning Platform',
    images: [{ url: '/logo-512.png', width: 512, height: 512 }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
