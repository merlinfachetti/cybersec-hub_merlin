'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Evitar hydration mismatch
  useEffect(() => setMounted(true), []);
  if (!mounted) return (
    <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(255,255,255,0.04)' }} />
  );

  const isDark = theme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Ativar modo claro' : 'Ativar modo escuro'}
      title={isDark ? 'Modo claro' : 'Modo escuro'}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: 34, height: 34, borderRadius: 8, cursor: 'pointer',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.09)',
        color: isDark ? 'rgba(245,158,11,0.8)' : 'rgba(139,92,246,0.8)',
        transition: 'all 200ms ease',
        flexShrink: 0,
      }}
      onMouseEnter={e => {
        const el = e.currentTarget;
        el.style.background = isDark ? 'rgba(245,158,11,0.1)' : 'rgba(139,92,246,0.1)';
        el.style.borderColor = isDark ? 'rgba(245,158,11,0.3)' : 'rgba(139,92,246,0.3)';
        el.style.transform = 'scale(1.08)';
      }}
      onMouseLeave={e => {
        const el = e.currentTarget;
        el.style.background = 'rgba(255,255,255,0.04)';
        el.style.borderColor = 'rgba(255,255,255,0.09)';
        el.style.transform = 'scale(1)';
      }}
    >
      {isDark
        ? <Sun size={15} />
        : <Moon size={15} />
      }
    </button>
  );
}
