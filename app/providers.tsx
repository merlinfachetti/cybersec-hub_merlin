'use client';

import { ThemeProvider } from 'next-themes';
import { DeviceOrientationGuard } from '@/components/device-orientation-guard';
import { ErrorModal } from '@/components/error-modal';
import { I18nProvider } from '@/lib/i18n';

// Light mode is handled entirely in app/globals.css via html.light selectors.
// next-themes adds class="light" to <html> instantly on theme change,
// and pure CSS responds immediately without any JS useEffect delay.
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem={false}
        storageKey="cp-theme"
        disableTransitionOnChange
      >
        {children}
        <DeviceOrientationGuard />
        <ErrorModal />
      </ThemeProvider>
    </I18nProvider>
  );
}
