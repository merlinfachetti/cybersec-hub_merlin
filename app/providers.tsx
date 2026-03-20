'use client';

import { ThemeProvider, useTheme } from 'next-themes';
import { useEffect } from 'react';

// React serializes inline styles to the DOM differently than what's written in JSX:
// style={{ background: '#0b0f14' }} → style="background: rgb(11, 15, 20);"
// style={{ background: 'rgba(12,8,28,0.8)' }} → style="background: rgba(12, 8, 28, 0.8);"
// So CSS selectors must use the DOM-serialized form, not the JSX source form.
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
        /* ── LIGHT MODE — uses DOM-serialized style values ─────────────────── */
        /* React converts hex → rgb(r, g, b) and normalizes rgba spaces         */

        /* Body */
        body {
          background: #f0f4fa !important;
          color: #1a1d2e !important;
        }

        /* ── Page backgrounds (hex values React serializes to rgb) ── */
        /* #0b0f14 */ [style*="rgb(11, 15, 20)"] { background: #f0f4fa !important; color: #1a1d2e !important; }
        /* #060610 */ [style*="rgb(6, 6, 16)"]   { background: #f0f4fa !important; color: #1a1d2e !important; }
        /* #0a0814 */ [style*="rgb(10, 8, 20)"]  { background: #eef0f8 !important; color: #1a1d2e !important; }
        /* #0f1620 */ [style*="rgb(15, 22, 32)"] { background: #f8f9fc !important; }
        /* #141f2d */ [style*="rgb(20, 31, 45)"] { background: #f0f4fa !important; }

        /* ── Cards (rgba with spaces — React normalizes) ── */
        [style*="rgba(12, 8, 28"]   { background: rgba(255,255,255,0.95) !important; border-color: rgba(0,0,0,0.07) !important; }
        [style*="rgba(10, 6, 24"]   { background: rgba(255,255,255,0.95) !important; border-color: rgba(0,0,0,0.07) !important; }
        [style*="rgba(15, 10, 35"]  { background: rgba(255,255,255,0.9) !important; border-color: rgba(0,0,0,0.07) !important; }
        [style*="rgba(15, 22, 40"]  { background: rgba(240,242,252,0.8) !important; }
        [style*="rgba(9, 12, 16"]   { background: rgba(255,255,255,0.9) !important; }

        /* ── Semi-transparent overlays ── */
        [style*="rgba(255, 255, 255, 0.04)"] { background: rgba(0,0,0,0.04) !important; }
        [style*="rgba(255, 255, 255, 0.05)"] { background: rgba(0,0,0,0.04) !important; }
        [style*="rgba(255, 255, 255, 0.03)"] { background: rgba(0,0,0,0.03) !important; }

        /* ── Modal/overlay backgrounds ── */
        [style*="rgba(6, 4, 18"]  { background: rgba(200,205,230,0.88) !important; }

        /* ── Text colors ── */
        /* #e6eef8 */ [style*="rgb(230, 238, 248)"]  { color: #1a1d2e !important; }
        /* #f0eeff */ [style*="rgb(240, 238, 255)"]  { color: #1a1d2e !important; }
        /* muted  */ [style*="rgba(155, 176, 198, 0.6)"] { color: rgba(50,60,90,0.75) !important; }
        /* muted  */ [style*="rgba(155, 176, 198, 0.5)"] { color: rgba(50,60,90,0.65) !important; }
        /* muted  */ [style*="rgba(155, 176, 198, 0.4)"] { color: rgba(50,60,90,0.55) !important; }
        /* muted  */ [style*="rgba(155, 176, 198, 0.45)"] { color: rgba(50,60,90,0.6) !important; }
        /* muted  */ [style*="rgba(155, 176, 198, 0.35)"] { color: rgba(50,60,90,0.5) !important; }
        /* muted  */ [style*="rgba(155, 176, 198, 0.55)"] { color: rgba(50,60,90,0.7) !important; }

        /* ── Borders ── */
        [style*="rgba(255, 255, 255, 0.07)"] { border-color: rgba(0,0,0,0.08) !important; }
        [style*="rgba(255, 255, 255, 0.08)"] { border-color: rgba(0,0,0,0.08) !important; }
        [style*="rgba(255, 255, 255, 0.09)"] { border-color: rgba(0,0,0,0.09) !important; }
        [style*="rgba(255, 255, 255, 0.1)"]  { border-color: rgba(0,0,0,0.09) !important; }
        [style*="rgba(255, 255, 255, 0.12)"] { border-color: rgba(0,0,0,0.1) !important; }
        [style*="rgba(255, 255, 255, 0.14)"] { border-color: rgba(0,0,0,0.1) !important; }

        /* ── Inputs ── */
        input, select, textarea {
          background: #ffffff !important;
          color: #1a1d2e !important;
          border-color: rgba(139,92,246,0.25) !important;
        }
        input::placeholder,
        textarea::placeholder { color: rgba(50,60,90,0.4) !important; }

        /* ── Search trigger button ── */
        button.search-trigger {
          background: rgba(139,92,246,0.07) !important;
          border-color: rgba(139,92,246,0.3) !important;
          color: rgba(50,60,90,0.7) !important;
        }
        button.search-trigger svg {
          stroke: rgba(50,60,90,0.6) !important;
        }

        /* ── Hamburger button ── */
        header button[aria-label="Menu"] {
          background: rgba(139,92,246,0.07) !important;
          border-color: rgba(139,92,246,0.3) !important;
          color: #1a1d2e !important;
        }
        header button[aria-label="Menu"] svg {
          stroke: #1a1d2e !important;
        }

        /* ── Header light mode ── */
        header {
          background: #eef0fa !important;
          border-color: rgba(139,92,246,0.18) !important;
          box-shadow: 0 1px 0 rgba(139,92,246,0.12) !important;
        }
        /* Keep nav text dark and readable */
        header a, header p, header h1, header h2 {
          color: #1a1d2e !important;
        }
        /* Muted text in header */
        header span {
          color: #1a1d2e !important;
        }

        /* ── Footer ── */
        footer {
          background: #edf0f8 !important;
          border-color: rgba(0,0,0,0.07) !important;
        }

        /* ── Dropdown menus — match header tone ── */
        [role="menu"],
        [data-radix-popper-content-wrapper] > div {
          background: #eef0fa !important;
          border-color: rgba(139,92,246,0.18) !important;
          box-shadow: 0 4px 20px rgba(139,92,246,0.12) !important;
        }
        [role="menuitem"] { color: #1a1d2e !important; }
        [role="menuitem"]:hover { background: rgba(139,92,246,0.1) !important; }
        [role="separator"] { background: rgba(139,92,246,0.12) !important; }

        /* ── Hero featured card (home) — roxo vibrante no light mode ── */
        /* rgba(8,5,22) = rgb(8, 5, 22) — escuro do gradiente do card */
        [style*="rgba(8, 5, 22"] {
          background: rgba(248,246,255,0.95) !important;
        }
        /* O card hero em si — gradiente com rgba(featured.rgb) como início */
        /* Targeta divs com border-radius 16 e padding 28px */
        div[style*="linear-gradient(135deg"] {
          background: linear-gradient(135deg, rgba(139,92,246,0.12) 0%, rgba(255,255,255,0.95) 60%) !important;
        }

        /* ── Keep accent colors untouched ── */
        [style*="color: rgb(34, 197, 94)"],
        [style*="color: rgba(34, 197, 94"],
        [style*="color: rgb(229, 62, 62)"],
        [style*="color: rgba(229, 62, 62"],
        [style*="color: rgb(59, 130, 246)"],
        [style*="color: rgba(59, 130, 246"],
        [style*="color: rgb(139, 92, 246)"],
        [style*="color: rgba(139, 92, 246"],
        [style*="color: rgb(167, 139, 250)"],
        [style*="color: rgb(245, 158, 11)"],
        [style*="color: rgba(245, 158, 11"],
        [style*="color: rgba(255, 140, 40"],
        [style*="color: rgb(255, 77, 109)"] {
          /* keep — accent colors preserved */
          color: unset;
        }
      `;
    } else {
      if (el) el.remove();
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
