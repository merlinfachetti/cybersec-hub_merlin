'use client';

import { useEffect, useState } from 'react';

type OrientationRule = 'portrait' | 'landscape' | null;

function getOrientationRule(): OrientationRule {
  if (typeof window === 'undefined') return null;

  const hasTouch =
    navigator.maxTouchPoints > 0 ||
    window.matchMedia('(pointer: coarse)').matches;

  if (!hasTouch) return null;

  const shortEdge = Math.min(window.innerWidth, window.innerHeight);

  if (shortEdge < 768) return 'portrait';
  if (shortEdge < 1024) return 'landscape';

  return null;
}

function getIsWrongOrientation(rule: OrientationRule) {
  if (typeof window === 'undefined' || !rule) return false;

  const isPortrait = window.innerHeight >= window.innerWidth;
  return rule === 'portrait' ? !isPortrait : isPortrait;
}

export function DeviceOrientationGuard() {
  const [rule, setRule] = useState<OrientationRule>(null);
  const [wrongOrientation, setWrongOrientation] = useState(false);

  useEffect(() => {
    const update = () => {
      const nextRule = getOrientationRule();
      setRule(nextRule);
      setWrongOrientation(getIsWrongOrientation(nextRule));
    };

    update();
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);

    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
    };
  }, []);

  if (!rule || !wrongOrientation) return null;

  const isPortraitRequired = rule === 'portrait';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        background:
          'radial-gradient(circle at 50% 35%, rgba(139,92,246,0.18), rgba(4,4,10,0.98) 58%)',
        color: '#f0eeff',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          maxWidth: 320,
          padding: '28px 22px',
          borderRadius: 18,
          background: 'rgba(10, 6, 24, 0.88)',
          border: '1px solid rgba(139,92,246,0.24)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.55)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <div
          style={{
            fontFamily: '"Space Grotesk", sans-serif',
            fontWeight: 700,
            fontSize: 18,
            letterSpacing: '0.12em',
            color: '#f0eeff',
            marginBottom: 12,
          }}
        >
          ROTATE DEVICE
        </div>
        <div
          style={{
            fontSize: 42,
            lineHeight: 1,
            marginBottom: 14,
            color: isPortraitRequired ? '#60a5fa' : '#f59e0b',
          }}
        >
          {isPortraitRequired ? '↻' : '↺'}
        </div>
        <p
          style={{
            margin: '0 0 10px',
            fontSize: 14,
            lineHeight: 1.65,
            color: 'rgba(220, 215, 240, 0.86)',
          }}
        >
          {isPortraitRequired
            ? 'No mobile, esta experiência funciona apenas na vertical.'
            : 'No tablet, esta experiência funciona apenas na horizontal.'}
        </p>
        <div
          style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 10,
            letterSpacing: '0.08em',
            color: 'rgba(139,92,246,0.78)',
          }}
        >
          {isPortraitRequired ? 'PORTRAIT REQUIRED' : 'LANDSCAPE REQUIRED'}
        </div>
      </div>
    </div>
  );
}
