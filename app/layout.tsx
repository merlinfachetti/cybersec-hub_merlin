import type { Metadata, Viewport } from 'next';
import { Providers } from './providers';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'CYBERSEC HUB',
    template: '%s | CYBERSEC HUB',
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
    title: 'CYBERSEC HUB',
    description: 'Threat Intelligence & Cybersecurity Learning Platform',
    images: [{ url: '/logo-512.png', width: 512, height: 512 }],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Critical CSS inline — prevents FOUC of desktop content on mobile */}
        <style dangerouslySetInnerHTML={{ __html: `
          @media (max-width: 1023px) {
            .cp-main-app { display: none !important; visibility: hidden !important; opacity: 0 !important; }
          }
        ` }} />
      </head>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
