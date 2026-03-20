'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return <div style={{ width: 52, height: 28, borderRadius: 14, background: 'rgba(255,255,255,0.06)' }} />;

  const isDark = theme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Ativar modo claro' : 'Ativar modo escuro'}
      style={{
        position: 'relative', width: 52, height: 28, borderRadius: 14,
        cursor: 'pointer', border: 'none', flexShrink: 0,
        background: isDark
          ? 'linear-gradient(135deg, #1a1535, #2d1f5e)'
          : 'linear-gradient(135deg, #fbbf24, #f59e0b)',
        boxShadow: isDark
          ? '0 0 0 1px rgba(139,92,246,0.3), inset 0 1px 3px rgba(0,0,0,0.4)'
          : '0 0 0 1px rgba(245,158,11,0.5), inset 0 1px 3px rgba(0,0,0,0.1)',
        transition: 'background 300ms ease, box-shadow 300ms ease',
        padding: 0,
      }}
    >
      {/* Track icons */}
      <span style={{
        position: 'absolute', left: 7, top: '50%', transform: 'translateY(-50%)',
        fontSize: 12, opacity: isDark ? 0.5 : 0, transition: 'opacity 200ms',
        pointerEvents: 'none',
      }}>🌙</span>
      <span style={{
        position: 'absolute', right: 7, top: '50%', transform: 'translateY(-50%)',
        fontSize: 12, opacity: isDark ? 0 : 0.7, transition: 'opacity 200ms',
        pointerEvents: 'none',
      }}>☀️</span>
      {/* Knob */}
      <span style={{
        position: 'absolute',
        top: 3, left: isDark ? 3 : 25,
        width: 22, height: 22, borderRadius: '50%',
        background: isDark ? '#a78bfa' : '#fff',
        boxShadow: isDark
          ? '0 0 8px rgba(139,92,246,0.6)'
          : '0 2px 6px rgba(0,0,0,0.2)',
        transition: 'left 250ms cubic-bezier(0.4,0,0.2,1), background 300ms, box-shadow 300ms',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 11,
      }}>
        {isDark ? '🌙' : '☀️'}
      </span>
    </button>
  );
}
