'use client';

/**
 * components/locale-toggle.tsx
 * Flag-only sliding toggle — same visual language as ThemeToggle.
 *
 * variant="nav"      → compact (used only in auth topbar now)
 * variant="dropdown" → inside UserAvatar menu (default)
 * variant="auth"     → auth screens topbar
 */

import { useI18n, type Locale } from '@/lib/i18n';
import { useEffect, useState } from 'react';

interface LocaleToggleProps {
  variant?: 'nav' | 'dropdown' | 'auth';
}

export function LocaleToggle({ variant = 'dropdown' }: LocaleToggleProps) {
  const { locale, setLocale } = useI18n();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Skeleton to prevent layout shift
  if (!mounted) {
    return <div style={{ width: 52, height: 28, borderRadius: 14, background: 'rgba(255,255,255,0.06)', flexShrink: 0 }} />;
  }

  const isEN = locale === 'EN';
  const toggle = () => setLocale(isEN ? 'PT_BR' : 'EN');

  // ── Dropdown variant: label row with toggle (inside profile menu) ──────
  if (variant === 'dropdown') {
    return (
      <button
        onClick={toggle}
        type="button"
        aria-label={isEN ? 'Switch to Portuguese' : 'Switch to English'}
        title={isEN ? 'Switch to PT-BR' : 'Switch to EN'}
        style={{
          position: 'relative',
          width: 52,
          height: 28,
          borderRadius: 14,
          cursor: 'pointer',
          border: 'none',
          flexShrink: 0,
          background: isEN
            ? 'linear-gradient(135deg, #1a2a4a, #0d2060)'
            : 'linear-gradient(135deg, #1a3a20, #0d6030)',
          boxShadow: isEN
            ? '0 0 0 1px rgba(59,130,246,0.35), inset 0 1px 3px rgba(0,0,0,0.4)'
            : '0 0 0 1px rgba(34,197,94,0.35), inset 0 1px 3px rgba(0,0,0,0.4)',
          transition: 'background 300ms ease, box-shadow 300ms ease',
          padding: 0,
        }}
      >
        {/* Track flags */}
        <span style={{
          position: 'absolute', left: 7, top: '50%', transform: 'translateY(-50%)',
          fontSize: 12, opacity: isEN ? 0.5 : 0, transition: 'opacity 200ms', pointerEvents: 'none',
        }}>🇺🇸</span>
        <span style={{
          position: 'absolute', right: 7, top: '50%', transform: 'translateY(-50%)',
          fontSize: 12, opacity: isEN ? 0 : 0.7, transition: 'opacity 200ms', pointerEvents: 'none',
        }}>🇧🇷</span>
        {/* Knob */}
        <span style={{
          position: 'absolute',
          top: 3,
          left: isEN ? 3 : 25,
          width: 22,
          height: 22,
          borderRadius: '50%',
          background: isEN
            ? 'linear-gradient(135deg, #60a5fa, #3b82f6)'
            : 'linear-gradient(135deg, #4ade80, #22c55e)',
          boxShadow: isEN
            ? '0 0 8px rgba(59,130,246,0.6)'
            : '0 0 8px rgba(34,197,94,0.6)',
          transition: 'left 250ms cubic-bezier(0.4,0,0.2,1), background 300ms, box-shadow 300ms',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12,
        }}>
          {isEN ? '🇺🇸' : '🇧🇷'}
        </span>
      </button>
    );
  }

  // ── Auth / nav variant: flags-only pill (used in login/register topbar) ─
  return (
    <button
      onClick={toggle}
      type="button"
      aria-label={isEN ? 'Switch to Portuguese' : 'Switch to English'}
      title={isEN ? 'PT-BR' : 'EN'}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 32,
        height: 28,
        borderRadius: 8,
        border: '1px solid rgba(255,255,255,0.10)',
        background: 'rgba(255,255,255,0.04)',
        cursor: 'pointer',
        fontSize: 16,
        transition: 'all 150ms ease',
        flexShrink: 0,
      }}
      onMouseEnter={e => {
        const el = e.currentTarget;
        el.style.background = 'rgba(139,92,246,0.12)';
        el.style.borderColor = 'rgba(139,92,246,0.35)';
      }}
      onMouseLeave={e => {
        const el = e.currentTarget;
        el.style.background = 'rgba(255,255,255,0.04)';
        el.style.borderColor = 'rgba(255,255,255,0.10)';
      }}
    >
      {isEN ? '🇺🇸' : '🇧🇷'}
    </button>
  );
}
