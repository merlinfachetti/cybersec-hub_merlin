'use client';

import { ThemeProvider, useTheme } from 'next-themes';
import { useEffect } from 'react';

// Injeta/remove estilos quando o tema muda
function ThemeStyleInjector() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const styleId = 'cp-light-mode-styles';
    let el = document.getElementById(styleId) as HTMLStyleElement | null;

    if (resolvedTheme === 'light') {
      if (!el) {
        el = document.createElement('style');
        el.id = styleId;
        document.head.appendChild(el);
      }
      el.textContent = `
        /* LIGHT MODE — Injected dynamically to override inline styles */

        /* Page backgrounds */
        body { background: #f0f2f8 !important; color: #1a1d2e !important; }

        /* All divs with dark backgrounds */
        div[style*="background: #0b0f14"],
        div[style*="background: #060610"],
        div[style*="background: #0a0814"],
        div[style*="background: #080c10"],
        div[style*="background: #0b0f14;"],
        div[style*="background:#0b0f14"],
        div[style*="background: rgb(11, 15, 20)"],
        div[style*="background: rgb(6, 6, 16)"] {
          background: #f0f2f8 !important;
        }

        /* Cards with dark card backgrounds */
        div[style*="rgba(12,8,28"],
        div[style*="rgba(12, 8, 28"],
        div[style*="rgba(10,6,24"],
        div[style*="rgba(10, 6, 24"],
        div[style*="rgba(15,10,35"],
        div[style*="rgba(15, 10, 35"] {
          background: rgba(255,255,255,0.92) !important;
          border-color: rgba(0,0,0,0.08) !important;
        }

        /* Text colors */
        [style*="color: #e6eef8"],
        [style*="color: #f0eeff"],
        [style*="color: #f0eeff"] {
          color: #1a1d2e !important;
        }

        [style*="color: rgba(155,176,198, 0.6)"],
        [style*="color: rgba(155,176,198,0.6)"],
        [style*="color: rgba(155,176,198,0.5)"],
        [style*="color: rgba(155,176,198,0.4)"],
        [style*="color: rgba(155,176,198,0.45)"],
        [style*="color: rgba(155,176,198,0.55)"] {
          color: rgba(60,70,100,0.75) !important;
        }

        /* Borders */
        [style*="border: 1px solid rgba(255,255,255,0.07)"],
        [style*="border-top: 1px solid rgba(255,255,255"],
        [style*="border-bottom: 1px solid rgba(255,255,255"],
        [style*="borderColor: rgba(255,255,255,0.07)"],
        [style*="borderColor: 'rgba(255,255,255,0.07)'"] {
          border-color: rgba(0,0,0,0.08) !important;
        }

        /* Inputs */
        input[style], select[style], textarea[style] {
          background: #ffffff !important;
          color: #1a1d2e !important;
          border-color: rgba(139,92,246,0.3) !important;
        }
        input::placeholder { color: rgba(60,70,100,0.45) !important; }

        /* Modal overlays */
        div[style*="rgba(6,4,18"],
        div[style*="rgba(6, 4, 18"] {
          background: rgba(220,222,240,0.85) !important;
          backdrop-filter: blur(10px);
        }

        /* Mono text (labels, badges) */
        [style*="fontFamily: '\"JetBrains Mono\""],
        [style*='fontFamily: "\\"JetBrains Mono\\"'] {
          color: rgba(60,70,100,0.7);
        }

        /* Section background strips */
        div[style*="background: 'rgba(255,255,255,0.04)'"],
        div[style*="background: rgba(255,255,255,0.04)"],
        div[style*="background: rgba(255,255,255,0.05)"],
        div[style*="background: rgba(255,255,255,0.03)"] {
          background: rgba(0,0,0,0.04) !important;
        }

        /* Keep accent colors */
        [style*="color: #22c55e"],
        [style*="color: #e53e3e"],
        [style*="color: #3b82f6"],
        [style*="color: #8b5cf6"],
        [style*="color: #a78bfa"],
        [style*="color: #f59e0b"],
        [style*="color: rgba(255,140,40"] { /* keep orange */ }

        /* footer */
        footer { background: #eaecf5 !important; border-color: rgba(0,0,0,0.08) !important; }

        /* Search modal */
        div[style*="rgba(10,6,24,0.98)"] {
          background: rgba(248,248,252,0.99) !important;
        }
      `;
    } else {
      // Dark mode: remove injected styles
      if (el) {
        el.remove();
      }
    }
  }, [resolvedTheme]);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      storageKey="cp-theme"
    >
      <ThemeStyleInjector />
      {children}
    </ThemeProvider>
  );
}
