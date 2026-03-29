'use client';

/**
 * components/device-orientation-guard.tsx
 *
 * Orientation enforcement:
 *   Mobile  (touch + short edge < 768px)  → portrait only (never landscape)
 *   Tablet  (touch + short edge 768–1023px) → landscape only (never portrait)
 *   Desktop (≥ 1024px or no touch)         → no restriction
 *
 * Shows a full-screen overlay with rotation instruction when wrong orientation.
 * Uses i18n for message text.
 */

import { useEffect, useState } from 'react';
import { useI18n } from '@/lib/i18n';

type DeviceType = 'mobile' | 'tablet' | null;
type RequiredOrientation = 'portrait' | 'landscape' | null;

function getDeviceInfo(): { device: DeviceType; required: RequiredOrientation } {
  if (typeof window === 'undefined') return { device: null, required: null };

  const hasTouch =
    navigator.maxTouchPoints > 0 ||
    window.matchMedia('(pointer: coarse)').matches;

  if (!hasTouch) return { device: null, required: null };

  const shortEdge = Math.min(window.innerWidth, window.innerHeight);
  const longEdge  = Math.max(window.innerWidth, window.innerHeight);

  // Mobile: short edge < 768px
  if (shortEdge < 768) return { device: 'mobile', required: 'portrait' };

  // Tablet: short edge 768–1023px (iPads, Android tablets)
  if (shortEdge < 1024 || longEdge < 1200) return { device: 'tablet', required: 'landscape' };

  return { device: null, required: null };
}

function isWrongOrientation(required: RequiredOrientation): boolean {
  if (typeof window === 'undefined' || !required) return false;
  const isPortrait = window.innerHeight >= window.innerWidth;
  return required === 'portrait' ? !isPortrait : isPortrait;
}

export function DeviceOrientationGuard() {
  const { locale } = useI18n();
  const [info, setInfo] = useState<{ device: DeviceType; required: RequiredOrientation }>({ device: null, required: null });
  const [wrong, setWrong] = useState(false);

  useEffect(() => {
    const update = () => {
      const next = getDeviceInfo();
      setInfo(next);
      setWrong(isWrongOrientation(next.required));
    };
    update();
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
    };
  }, []);

  if (!info.required || !wrong) return null;

  const needPortrait = info.required === 'portrait';

  // Bilingual messages
  const heading   = needPortrait
    ? (locale === 'PT_BR' ? 'GIRE O DISPOSITIVO' : 'ROTATE DEVICE')
    : (locale === 'PT_BR' ? 'GIRE O DISPOSITIVO' : 'ROTATE DEVICE');

  const body = needPortrait
    ? (locale === 'PT_BR'
        ? 'No celular, esta experiência funciona apenas na vertical. Gire o dispositivo para continuar.'
        : 'On mobile, this experience only works in portrait mode. Rotate your device to continue.')
    : (locale === 'PT_BR'
        ? 'No tablet, esta experiência funciona apenas na horizontal. Gire o dispositivo para continuar.'
        : 'On tablet, this experience only works in landscape mode. Rotate your device to continue.');

  const tag = needPortrait ? 'PORTRAIT REQUIRED' : 'LANDSCAPE REQUIRED';
  const arrowColor = needPortrait ? '#60a5fa' : '#f59e0b';

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
      background: 'radial-gradient(circle at 50% 35%, rgba(139,92,246,0.18), rgba(4,4,10,0.98) 58%)',
      color: '#f0eeff', textAlign: 'center',
    }}>
      <div style={{
        maxWidth: 320, padding: '28px 22px', borderRadius: 18,
        background: 'rgba(10,6,24,0.92)',
        border: '1px solid rgba(139,92,246,0.24)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
        backdropFilter: 'blur(20px)',
      }}>
        <div style={{
          fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700,
          fontSize: 16, letterSpacing: '0.14em', color: '#f0eeff', marginBottom: 16,
        }}>
          {heading}
        </div>

        {/* Animated rotation arrow */}
        <div style={{
          fontSize: 48, lineHeight: 1, marginBottom: 16, color: arrowColor,
          animation: 'guard-spin 2.8s ease-in-out infinite',
        }}>
          {needPortrait ? '📱' : '📱'}
        </div>

        {/* Visual indicator of target orientation */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{
            width: needPortrait ? 28 : 48,
            height: needPortrait ? 48 : 28,
            borderRadius: 6,
            border: `2px solid ${arrowColor}`,
            boxShadow: `0 0 12px ${arrowColor}60`,
            background: `${arrowColor}18`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14,
            transition: 'all 400ms ease',
          }}>
            ↻
          </div>
        </div>

        <p style={{
          margin: '0 0 14px', fontSize: 13, lineHeight: 1.7,
          color: 'rgba(220,215,240,0.82)',
          fontFamily: '"Inter", sans-serif',
        }}>
          {body}
        </p>

        <div style={{
          fontFamily: '"JetBrains Mono", monospace', fontSize: 9,
          letterSpacing: '0.1em', color: `${arrowColor}90`,
        }}>
          {tag}
        </div>
      </div>

      <style>{`
        @keyframes guard-spin {
          0%, 100% { transform: rotate(0deg); }
          40%  { transform: rotate(${needPortrait ? '-90deg' : '90deg'}); }
          60%  { transform: rotate(${needPortrait ? '-90deg' : '90deg'}); }
        }
      `}</style>
    </div>
  );
}
