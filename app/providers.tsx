'use client';

import { ThemeProvider } from 'next-themes';

// Light mode is handled entirely in app/globals.css via html.light selectors.
// next-themes adds class="light" to <html> instantly on theme change,
// and pure CSS responds immediately without any JS useEffect delay.
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      storageKey="cp-theme"
    >
      {children}
    </ThemeProvider>
  );
}
