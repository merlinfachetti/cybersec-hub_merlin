'use client';

/**
 * components/locale-toggle.tsx
 * Compact EN / PT-BR language switcher.
 * Works in both hub nav (dark/light) and auth screens (always dark).
 */

import { useI18n, type Locale } from '@/lib/i18n';

interface LocaleToggleProps {
  /** 'nav' = compact pill in topbar; 'auth' = slightly larger, standalone */
  variant?: 'nav' | 'auth';
}

const OPTIONS: { value: Locale; label: string; flag: string }[] = [
  { value: 'EN',    label: 'EN',    flag: '🇺🇸' },
  { value: 'PT_BR', label: 'PT',    flag: '🇧🇷' },
];

export function LocaleToggle({ variant = 'nav' }: LocaleToggleProps) {
  const { locale, setLocale } = useI18n();

  const isAuth = variant === 'auth';
  const height = isAuth ? 28 : 24;
  const fontSize = isAuth ? 10 : 9;
  const gap = isAuth ? 2 : 1;

  return (
    <div
      role="group"
      aria-label="Language selector"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap,
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 6,
        padding: 2,
        height,
      }}
    >
      {OPTIONS.map(opt => {
        const active = locale === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => setLocale(opt.value)}
            aria-pressed={active}
            aria-label={`Switch to ${opt.label}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: isAuth ? '0 8px' : '0 6px',
              height: height - 6,
              borderRadius: 4,
              border: 'none',
              cursor: 'pointer',
              fontFamily: '"JetBrains Mono", monospace',
              fontSize,
              letterSpacing: '0.06em',
              fontWeight: active ? 700 : 400,
              color: active ? '#ffffff' : 'rgba(255,255,255,0.35)',
              background: active
                ? 'rgba(139,92,246,0.28)'
                : 'transparent',
              boxShadow: active
                ? '0 0 0 1px rgba(139,92,246,0.45)'
                : 'none',
              transition: 'all 150ms ease',
              whiteSpace: 'nowrap',
            }}
          >
            <span style={{ fontSize: fontSize + 1, lineHeight: 1 }}>{opt.flag}</span>
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
