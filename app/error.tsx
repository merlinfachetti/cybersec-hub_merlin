'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global error:', error);
  }, [error]);

  return (
    <div style={{ minHeight: '100vh', background: '#0b0f14', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"Inter", sans-serif' }}>
      <div style={{ textAlign: 'center', maxWidth: 400 }}>
        <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: 'rgba(229,62,62,0.6)', letterSpacing: '0.1em', marginBottom: 12 }}>
          ● ERROR DETECTED
        </div>
        <h2 style={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700, fontSize: 20, color: '#f0eeff', marginBottom: 8 }}>
          Something went wrong
        </h2>
        <p style={{ fontSize: 13, color: 'rgba(155,176,198,0.5)', marginBottom: 20 }}>
          {error.message || 'An unexpected error occurred'}
        </p>
        <button onClick={reset} style={{
          padding: '9px 20px', borderRadius: 8, border: '1px solid rgba(139,92,246,0.3)',
          background: 'rgba(139,92,246,0.1)', color: '#a78bfa', cursor: 'pointer',
          fontFamily: '"Space Grotesk", sans-serif', fontWeight: 600, fontSize: 13,
        }}>
          Try again
        </button>
      </div>
    </div>
  );
}
