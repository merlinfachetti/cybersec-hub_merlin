'use client';

import { useEffect, useState, useRef } from 'react';

const LINES = [
  { text: '"Em um mundo onde cada sistema é uma fortaleza…', delay: 0,   style: 'italic' as const, color: 'rgba(255,255,255,0.45)', size: 13 },
  { text: 'e cada falha, uma brecha na muralha…"',           delay: 600, style: 'italic' as const, color: 'rgba(255,255,255,0.45)', size: 13 },
  { text: 'Surge Merlin',                                    delay: 1400, style: 'normal' as const, color: '#f0eeff', size: 20, weight: 700, mono: false },
  { text: '— não um mago de contos antigos, mas um engenheiro das camadas invisíveis da realidade digital.',
                                                             delay: 1800, style: 'normal' as const, color: 'rgba(200,195,240,0.8)', size: 14 },
  { text: 'Forjado entre código, falhas e reconstruções,',   delay: 2600, style: 'normal' as const, color: 'rgba(180,175,220,0.7)', size: 13 },
  { text: 'ele aprendeu que segurança não é um estado —',    delay: 3100, style: 'normal' as const, color: 'rgba(180,175,220,0.7)', size: 13 },
  { text: 'é uma guerra constante.',                         delay: 3600, style: 'normal' as const, color: '#e53e3e', size: 14, weight: 700 },
  { text: 'Seu domínio não está apenas na construção,',      delay: 4400, style: 'normal' as const, color: 'rgba(180,175,220,0.7)', size: 13 },
  { text: 'mas na antecipação do colapso.',                  delay: 4900, style: 'normal' as const, color: 'rgba(139,92,246,0.9)', size: 14, weight: 600 },
  { text: 'O CyberSec Hub é seu artefato.',                  delay: 5700, style: 'normal' as const, color: 'rgba(255,140,40,0.9)', size: 14, weight: 600 },
  { text: 'Um núcleo onde vulnerabilidades são expostas,',   delay: 6300, style: 'normal' as const, color: 'rgba(180,175,220,0.7)', size: 13 },
  { text: 'sistemas são testados…',                          delay: 6800, style: 'normal' as const, color: 'rgba(180,175,220,0.7)', size: 13 },
  { text: 'e o caos é convertido em controle.',              delay: 7400, style: 'normal' as const, color: '#22c55e', size: 14, weight: 600 },
  { text: 'Se você está aqui, já entrou no jogo.',           delay: 8400, style: 'italic' as const, color: 'rgba(255,255,255,0.9)', size: 15, weight: 600 },
];

interface Props { onClose: () => void; }

export function MerlinModal({ onClose }: Props) {
  const [visible, setVisible] = useState<boolean[]>(Array(LINES.length).fill(false));
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    // Stagger each line in
    LINES.forEach((line, i) => {
      const t = setTimeout(() => {
        setVisible(v => { const n = [...v]; n[i] = true; return n; });
      }, line.delay);
      timers.current.push(t);
    });
    // ESC closes
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose(); };
    window.addEventListener('keydown', onKey);
    return () => {
      timers.current.forEach(clearTimeout);
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  const handleClose = () => {
    timers.current.forEach(clearTimeout);
    onClose();
  };

  return (
    <div
      onClick={handleClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 99999,
        background: 'rgba(4,3,14,0.88)',
        backdropFilter: 'blur(18px) saturate(160%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
        animation: 'modal-fade-in 300ms ease both',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: 'relative',
          width: '100%', maxWidth: 520,
          background: 'rgba(10,7,26,0.96)',
          border: '1px solid rgba(139,92,246,0.2)',
          borderRadius: 20,
          overflow: 'hidden',
          boxShadow: '0 0 0 1px rgba(139,92,246,0.08), 0 40px 100px rgba(0,0,0,0.8), 0 0 80px rgba(139,92,246,0.08)',
        }}
      >
        {/* Top gradient accent */}
        <div style={{ height: 2, background: 'linear-gradient(90deg, #e53e3e, #8b5cf6, #3b82f6)' }} />

        {/* Ambient glow behind content */}
        <div style={{ position: 'absolute', top: -60, left: '50%', transform: 'translateX(-50%)', width: 300, height: 200, background: 'radial-gradient(ellipse, rgba(139,92,246,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

        {/* Header */}
        <div style={{ padding: '22px 24px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ position: 'relative' }}>
              <img src="/merlin.jpg" alt="Merlin" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(139,92,246,0.5)', display: 'block' }} />
              <span style={{ position: 'absolute', bottom: 0, right: 0, width: 10, height: 10, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px #22c55e', border: '2px solid rgba(10,7,26,0.96)' }} />
            </div>
            <div>
              <div style={{ fontFamily: '"Space Grotesk",sans-serif', fontWeight: 700, fontSize: 14, color: '#f0eeff', letterSpacing: '0.06em' }}>
                YOU ARE HERE
              </div>
              <div style={{ fontFamily: '"JetBrains Mono",monospace', fontSize: 9, color: 'rgba(139,92,246,0.6)', letterSpacing: '0.1em', marginTop: 2 }}>
                MERLIN · CYBERSEC HUB
              </div>
            </div>
          </div>
          {/* Close — verde */}
          <button
            onClick={handleClose}
            style={{ background: 'none', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 8, cursor: 'pointer', padding: '5px 7px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22c55e', transition: 'all 150ms' }}
            onMouseEnter={e => { const el = e.currentTarget; el.style.background = 'rgba(34,197,94,0.1)'; el.style.borderColor = 'rgba(34,197,94,0.6)'; el.style.boxShadow = '0 0 12px rgba(34,197,94,0.2)'; }}
            onMouseLeave={e => { const el = e.currentTarget; el.style.background = 'none'; el.style.borderColor = 'rgba(34,197,94,0.3)'; el.style.boxShadow = 'none'; }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Narrative — animated lines */}
        <div style={{ padding: '20px 24px 24px', display: 'flex', flexDirection: 'column', gap: 10, maxHeight: '65vh', overflowY: 'auto' }}>
          {LINES.map((line, i) => (
            <p key={i} style={{
              margin: 0,
              fontFamily: line.weight && line.weight >= 700 ? '"Space Grotesk",sans-serif' : '"Inter",sans-serif',
              fontStyle: line.style,
              fontWeight: line.weight ?? 400,
              fontSize: line.size,
              color: line.color,
              lineHeight: 1.6,
              opacity: visible[i] ? 1 : 0,
              transform: visible[i] ? 'translateY(0)' : 'translateY(8px)',
              transition: 'opacity 500ms ease, transform 500ms ease',
            }}>
              {line.text}
            </p>
          ))}
        </div>

        {/* Footer signature */}
        <div style={{ padding: '12px 24px 18px', borderTop: '1px solid rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: '"JetBrains Mono",monospace', fontSize: 9, color: 'rgba(155,176,198,0.3)', letterSpacing: '0.08em' }}>signal &gt; noise</span>
          <span style={{ fontFamily: '"JetBrains Mono",monospace', fontSize: 9, color: 'rgba(34,197,94,0.4)', letterSpacing: '0.08em' }}>● ONLINE</span>
        </div>
      </div>

      <style>{`
        @keyframes modal-fade-in {
          from { opacity: 0; backdrop-filter: blur(0px); }
          to   { opacity: 1; backdrop-filter: blur(18px) saturate(160%); }
        }
      `}</style>
    </div>
  );
}
