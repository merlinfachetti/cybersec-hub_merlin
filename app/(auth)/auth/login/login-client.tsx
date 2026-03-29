'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import SignalLost from '@/components/signal-lost';
import { LocaleToggle } from '@/components/locale-toggle';
import { useI18n } from '@/lib/i18n';
import { useSearchParams } from 'next/navigation';
import { touchSessionActivity } from '@/lib/session-activity';
import { initCosmosBg as initLoginBg } from '@/lib/cosmos-bg';


// ── Helpers ───────────────────────────────────────────────────────────────

type HsState = 'idle' | 'active' | 'success' | 'error';
const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

function getSafeRedirect(raw: string | null): string {
  if (!raw || !raw.startsWith('/')) return '/home';
  if (raw.startsWith('/api/') || raw.startsWith('/auth/')) return '/home';
  return raw;
}

// ── Main component ────────────────────────────────────────────────────────

export default function LoginClient() {
  const { t } = useI18n();
  const searchParams = useSearchParams();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [identifier, setIdentifier] = useState('');
  const [passphrase, setPassphrase] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hsState, setHsState] = useState<HsState>('idle');
  const [hsText, setHsText] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  useEffect(() => { setHsText(t('auth.channelReady')); }, [t]);
  useEffect(() => { if (!canvasRef.current) return; return initLoginBg(canvasRef.current); }, []);

  const HS_STEPS = [
    { key: 'auth.hs.init' as const,       delay: 600 },
    { key: 'auth.hs.negotiate' as const,  delay: 800 },
    { key: 'auth.hs.verify' as const,     delay: 1000 },
    { key: 'auth.hs.established' as const,delay: 600 },
  ];

  const resetHs = useCallback(() => {
    setHsState('idle');
    setHsText(t('auth.channelReady'));
    setErrorMsg('');
  }, [t]);

  const runHandshake = useCallback(async () => {
    for (const step of HS_STEPS) {
      setHsState('active');
      setHsText(t(step.key));
      await sleep(step.delay);
    }
    setHsState('success');
  }, [t]);

  const waitForSession = useCallback(async () => {
    for (let i = 0; i < 6; i++) {
      try {
        const r = await fetch('/api/auth/validate', { method: 'GET', credentials: 'include', cache: 'no-store' });
        if (r.ok) return true;
      } catch { /* retry */ }
      await sleep(150 * (i + 1));
    }
    return false;
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || !passphrase) {
      const msg = t('auth.error.credentials');
      setHsState('error'); setHsText(msg); setErrorMsg(msg);
      setTimeout(resetHs, 3000);
      return;
    }
    setLoading(true); setErrorMsg('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, passphrase, rememberDevice }),
      });
      if (!res.ok) {
        const msg = res.status === 429 ? t('auth.error.rateLimit') : t('auth.error.credentials');
        setHsState('error'); setHsText(msg); setErrorMsg(msg);
        setTimeout(resetHs, 3500);
        return;
      }
      const [, ok] = await Promise.all([runHandshake(), waitForSession()]);
      if (!ok) {
        const msg = t('auth.error.session');
        setHsState('error'); setHsText(msg); setErrorMsg(msg);
        setTimeout(resetHs, 3500);
        return;
      }
      await sleep(250);
      touchSessionActivity();
      window.location.assign(getSafeRedirect(searchParams.get('from')));
    } catch {
      const msg = t('auth.error.connection');
      setHsState('error'); setHsText(msg); setErrorMsg(msg);
      setTimeout(resetHs, 3000);
    } finally {
      setLoading(false);
    }
  }, [identifier, passphrase, rememberDevice, runHandshake, waitForSession, searchParams, t, resetHs]);

  const dotColor = hsState === 'success' ? '#22c55e' : hsState === 'error' ? '#e53e3e' : hsState === 'active' ? '#8b5cf6' : '#3b82f6';

  const strChecks = passphrase.length > 0 ? [
    { ok: passphrase.length >= 12,           label: t('auth.strength.chars') },
    { ok: /[A-Z]/.test(passphrase),          label: t('auth.strength.upper') },
    { ok: /[0-9]/.test(passphrase),          label: t('auth.strength.number') },
    { ok: /[^A-Za-z0-9]/.test(passphrase),  label: t('auth.strength.symbol') },
  ] : null;
  const strScore = strChecks ? strChecks.filter(c => c.ok).length : 0;
  const STR_COLORS = ['#e53e3e', '#f59e0b', '#3b82f6', '#22c55e'];
  const STR_LABELS = ['', t('auth.strength.weak'), t('auth.strength.fair'), t('auth.strength.good'), t('auth.strength.strong')];

  const TEAM_BADGES = [
    { team: 'red',    label: t('team.red.label'),    desc: t('team.red.desc'),    color: '#e53e3e', soft: '#ff6b6b', border: 'rgba(229,62,62,0.35)',    tooltipTitle: 'Red Team — Offensive',              tooltipLines: ['Simulates real adversaries to test defenses.','Runs pentests, APT simulations within scope.','Goal: find gaps before real attackers do.'] },
    { team: 'blue',   label: t('team.blue.label'),   desc: t('team.blue.desc'),   color: '#3b82f6', soft: '#60a5fa', border: 'rgba(59,130,246,0.35)',   tooltipTitle: 'Blue Team — Defensive',             tooltipLines: ['Monitors, detects, responds: SIEM, logs, alerts.','Contains incidents, hardens systems.','Goal: keep operations secure.'] },
    { team: 'purple', label: t('team.purple.label'), desc: t('team.purple.desc'), color: '#8b5cf6', soft: '#a78bfa', border: 'rgba(139,92,246,0.35)', tooltipTitle: 'Purple Team — Continuous Improvement',tooltipLines: ['Unites Red and Blue in feedback cycles.','Maps MITRE ATT&CK coverage and gaps.','Goal: close the loop without tribalism.'] },
  ];

  return (
    <>
      <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, zIndex: 0, width: '100%', height: '100%' }} />
      <div style={{ position: 'fixed', inset: 0, zIndex: 10, pointerEvents: 'none', background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.5) 100%)' }} />
      <div style={{ position: 'fixed', inset: 0, zIndex: 10, pointerEvents: 'none', opacity: 0.025 }}>
        <svg width="100%" height="100%"><filter id="nf"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(#nf)"/></svg>
      </div>

      <div className="cp-main-app" style={{ position: 'relative', zIndex: 20, height: '100vh', display: 'flex', flexDirection: 'column' }}>

        {/* Topbar */}
        <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 30, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', background: 'linear-gradient(180deg, rgba(6,4,18,0.97) 0%, rgba(8,5,22,0.90) 100%)', backdropFilter: 'blur(24px) saturate(180%)', borderBottom: '1px solid rgba(139,92,246,0.15)', boxShadow: '0 1px 0 rgba(139,92,246,0.08), 0 4px 24px rgba(0,0,0,0.5)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ position: 'relative', width: 51, height: 51, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ position: 'absolute', inset: -4, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)', pointerEvents: 'none' }} />
              <img src="/logo.png" alt="CYBERSEC HUB" style={{ width: 51, height: 51, objectFit: 'contain', position: 'relative', zIndex: 1, filter: 'drop-shadow(0 0 8px rgba(139,92,246,0.8)) drop-shadow(0 0 14px rgba(59,130,246,0.35))' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <span style={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700, fontSize: 13, letterSpacing: '0.16em', color: '#f0eeff', lineHeight: 1 }} data-auth-brand>CYBERSEC HUB</span>
              <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, color: 'rgba(139,92,246,0.6)', letterSpacing: '0.12em', lineHeight: 1 }}>signal &gt; noise</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px #22c55e', display: 'inline-block' }} />
              <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, color: 'rgba(34,197,94,0.7)', letterSpacing: '0.1em' }}>ENV: PROD</span>
            </div>
            <span style={{ color: 'rgba(255,255,255,0.07)' }}>|</span>
            <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, color: 'rgba(180,175,220,0.3)', letterSpacing: '0.08em' }}>LAT: 18ms</span>
            <span style={{ color: 'rgba(255,255,255,0.07)' }}>|</span>
            <LocaleToggle variant="auth" />
          </div>
        </header>

        {/* Center stage */}
        <main style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100vh', padding: '50px 24px 56px' }}>
          <div className="cp-animate-in" style={{ width: 390, minWidth: 320, maxWidth: '90vw', padding: '28px 32px 22px', display: 'flex', flexDirection: 'column', background: 'rgba(8,8,24,0.68)', backdropFilter: 'blur(28px) saturate(160%)', WebkitBackdropFilter: 'blur(28px) saturate(160%)', border: '1px solid rgba(160,150,255,0.16)', borderRadius: 18, boxShadow: '0 0 0 1px rgba(255,255,255,0.04), 0 8px 48px rgba(0,0,0,0.7), 0 0 80px rgba(100,80,200,0.08)' }}>

            <h1 data-auth-title style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 20, fontWeight: 700, letterSpacing: '0.24em', textTransform: 'uppercase', textAlign: 'center', color: '#ffffff', marginBottom: 20, textShadow: '0 0 24px rgba(180,170,255,0.18)' }}>
              {t('auth.identify')}
            </h1>

            <form onSubmit={handleSubmit} autoComplete="off" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {errorMsg && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 8, background: 'rgba(229,62,62,0.10)', border: '1px solid rgba(229,62,62,0.25)', fontSize: 13, color: '#ff6b6b' }}>
                  <AlertIcon /> {errorMsg}
                </div>
              )}

              <InputField icon="user" placeholder={t('auth.identifier')} type="text" value={identifier} onChange={setIdentifier} autoComplete="username" />
              <InputField icon="lock" placeholder={t('auth.passphrase')} type={showPass ? 'text' : 'password'} value={passphrase} onChange={setPassphrase} autoComplete="current-password"
                trailing={<button type="button" onClick={() => setShowPass(v => !v)} style={{ width: 24, height: 24, flexShrink: 0, color: '#6a6a8a', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{showPass ? <EyeOffIcon /> : <EyeIcon />}</button>}
              />

              {strChecks && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: '4px 0' }}>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {strChecks.map((ch, i) => (<div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: ch.ok ? STR_COLORS[i] : 'rgba(255,255,255,0.07)', transition: 'background 250ms ease', boxShadow: ch.ok ? `0 0 6px ${STR_COLORS[i]}60` : 'none' }} />))}
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {strChecks.map((ch, i) => (<span key={i} style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, padding: '1px 6px', borderRadius: 3, color: ch.ok ? STR_COLORS[i] : 'rgba(255,255,255,0.2)', background: ch.ok ? `${STR_COLORS[i]}15` : 'rgba(255,255,255,0.03)', border: `1px solid ${ch.ok ? STR_COLORS[i] + '40' : 'rgba(255,255,255,0.06)'}`, transition: 'all 250ms ease', textDecoration: ch.ok ? 'none' : 'line-through' }}>{ch.label}</span>))}
                    <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, marginLeft: 'auto', color: STR_COLORS[strScore - 1] ?? 'rgba(255,255,255,0.2)', transition: 'color 250ms' }}>{STR_LABELS[strScore] || ''}</span>
                  </div>
                </div>
              )}

              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', userSelect: 'none', padding: '2px 0' }}>
                <input type="checkbox" checked={rememberDevice} onChange={e => setRememberDevice(e.target.checked)} style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }} />
                <span style={{ width: 16, height: 16, flexShrink: 0, border: `1px solid ${rememberDevice ? '#3b82f6' : 'rgba(255,255,255,0.12)'}`, borderRadius: 2, background: rememberDevice ? '#3b82f6' : 'rgba(5,5,20,0.70)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 150ms' }}>
                  {rememberDevice && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </span>
                <span style={{ fontSize: 13, color: '#e8e8f0', lineHeight: 1.3 }}>{t('auth.rememberDevice')} <span style={{ color: '#6a6a8a', fontSize: 11 }}>{t('auth.rememberDeviceHint')}</span></span>
              </label>

              {/* ── Tricolor living button ── */}
              <button
                type="submit"
                disabled={loading}
                className="cp-tricolor-btn"
                style={{ opacity: loading ? 0.72 : 1 }}
              >
                <span className="cp-tricolor-label">
                  {loading ? t('auth.authenticating') : t('auth.authenticate')}
                </span>
              </button>
            </form>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, marginTop: 16 }}>
              <a href="#" style={{ fontSize: 13, color: '#60a5fa', textDecoration: 'none' }}>{t('auth.usePasskey')}</a>
              <a href="#" style={{ fontSize: 13, color: '#6a6a8a', textDecoration: 'none' }}>{t('auth.forgotPassphrase')}</a>
              <a href="/auth/register" style={{ fontSize: 12, color: 'rgba(139,92,246,0.6)', textDecoration: 'none', marginTop: 6, letterSpacing: '0.04em' }}>
                {t('auth.newHere')} <span style={{ color: 'rgba(139,92,246,0.9)', fontWeight: 600 }}>{t('auth.register')}</span>
              </a>
            </div>

            {/* Handshake strip — fixed size to prevent layout shift */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '6px 16px', marginTop: 14, borderRadius: 100, background: 'rgba(10,10,30,0.40)', border: '1px solid rgba(255,255,255,0.08)', minHeight: 32 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: dotColor, boxShadow: `0 0 8px ${dotColor}`, display: 'inline-block', flexShrink: 0, animation: hsState === 'active' ? 'cp-hs-pulse 1.6s ease-in-out infinite' : 'none' }} />
              <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: '#6a6a8a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 280 }}>{hsText}</span>
            </div>
          </div>
        </main>
      </div>

      {/* Team badges */}
      <div className="cp-main-app" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 20, display: 'flex', justifyContent: 'center', gap: 12, padding: '12px 24px' }}>
        {TEAM_BADGES.map(b => (
          <div key={b.team} style={{ position: 'relative', display: 'inline-flex' }} onMouseEnter={() => setActiveTooltip(b.team)} onMouseLeave={() => setActiveTooltip(null)}>
            {activeTooltip === b.team && (() => {
              const idx = TEAM_BADGES.findIndex(x => x.team === b.team);
              const pos = idx === 0 ? { left: 0 } : idx === 2 ? { right: 0, left: 'auto' as const } : { left: '-40px' };
              const arrowL = idx === 0 ? 24 : idx === 2 ? 'auto' : '50%';
              const arrowR = idx === 2 ? 24 : 'auto';
              return (
                <div style={{ position: 'absolute', bottom: 'calc(100% + 14px)', ...pos, background: 'rgba(8,6,20,0.98)', border: `1px solid ${b.border}`, borderRadius: 10, padding: '12px 14px', width: 260, zIndex: 300, backdropFilter: 'blur(20px)', boxShadow: `0 8px 32px rgba(0,0,0,0.7), 0 0 0 1px ${b.color}15`, pointerEvents: 'none', animation: 'cp-fade-in 0.12s ease-out both' }}>
                  <div style={{ position: 'absolute', bottom: -6, left: arrowL, right: arrowR, transform: idx === 1 ? 'translateX(-50%) rotate(45deg)' : 'rotate(45deg)', width: 10, height: 10, background: 'rgba(8,6,20,0.98)', border: `1px solid ${b.border}`, borderTop: 'none', borderLeft: 'none' }} />
                  <div style={{ fontFamily: '"Space Grotesk",sans-serif', fontWeight: 700, fontSize: 11, color: b.soft, letterSpacing: '0.1em', marginBottom: 8 }}>{b.tooltipTitle}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {b.tooltipLines.map((line, i) => (
                      <div key={i} style={{ display: 'flex', gap: 7, alignItems: 'flex-start' }}>
                        <span style={{ color: b.color, flexShrink: 0, fontSize: 10 }}>→</span>
                        <span style={{ fontFamily: '"Inter",sans-serif', fontSize: 11, color: 'rgba(180,175,220,0.7)', lineHeight: 1.5 }}>{line}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 8, background: 'rgba(10,10,30,0.65)', border: `1px solid ${activeTooltip === b.team ? b.color + '70' : b.border}`, backdropFilter: 'blur(8px)', minWidth: 180, cursor: 'default', transition: 'border-color 150ms' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={b.color} strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              <div>
                <span style={{ display: 'block', fontFamily: '"Space Grotesk", sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: b.soft }}>{b.label}</span>
                <span style={{ display: 'block', fontSize: 10, color: '#6a6a8a', lineHeight: 1.3 }}>{b.desc}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="cp-signal-lost"><SignalLost /></div>

      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        body{background:#060610;overflow:hidden}
        input{outline:none;border:none;background:transparent;font-family:'Inter',sans-serif;color:#e8e8f0;width:100%}
        input::placeholder{color:#6a6a8a}

        .cp-tricolor-btn {
          position: relative;
          width: 100%;
          height: 44px;
          border-radius: 10px;
          overflow: hidden;
          margin-top: 4px;
          cursor: pointer;
          border: none;
          outline: none;
          display: flex;
          align-items: center;
          justify-content: center;
          /* Tricolor gradient — wide enough to feel like continuous motion */
          background: linear-gradient(
            135deg,
            #e53e3e 0%,
            #8b5cf6 25%,
            #3b82f6 50%,
            #8b5cf6 75%,
            #e53e3e 100%
          );
          background-size: 400% 400%;
          animation: cp-tricolor-shift 5s ease infinite;
          box-shadow: 0 0 18px rgba(139,92,246,0.25);
          transition: box-shadow 300ms ease, opacity 200ms;
        }
        .cp-tricolor-btn:hover {
          animation-duration: 2.5s;
          box-shadow: 0 0 28px rgba(139,92,246,0.45), 0 0 12px rgba(229,62,62,0.2);
        }
        .cp-tricolor-btn:disabled {
          cursor: not-allowed;
          animation-play-state: paused;
        }
        .cp-tricolor-btn::before {
          content: '';
          position: absolute;
          inset: 1.5px;
          border-radius: 9px;
          background: rgba(8,6,24,0.72);
          z-index: 1;
          transition: background 300ms;
        }
        .cp-tricolor-btn:hover::before {
          background: rgba(8,6,24,0.58);
        }
        .cp-tricolor-label {
          position: relative;
          z-index: 2;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.16em;
          color: #ffffff;
          text-shadow: 0 0 14px rgba(200,180,255,0.5);
        }
        @keyframes cp-tricolor-shift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes cp-hs-pulse{0%,100%{opacity:1}50%{opacity:0.3}}
      `}</style>
    </>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────

function InputField({ icon, placeholder, type, value, onChange, autoComplete, trailing }: {
  icon: 'user' | 'lock'; placeholder: string; type: string;
  value: string; onChange: (v: string) => void;
  autoComplete?: string; trailing?: React.ReactNode;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div onFocusCapture={() => setFocused(true)} onBlurCapture={() => setFocused(false)}
      style={{ position: 'relative', display: 'flex', alignItems: 'center', background: 'rgba(5,5,20,0.70)', border: `1px solid ${focused ? 'rgba(139,92,246,0.45)' : 'rgba(255,255,255,0.10)'}`, borderRadius: 9, padding: '0 14px', height: 44, boxShadow: focused ? '0 0 0 3px rgba(139,92,246,0.10), 0 0 20px rgba(139,92,246,0.06)' : 'none', transition: 'border-color 300ms, box-shadow 300ms' }}>
      <span style={{ width: 18, height: 18, flexShrink: 0, color: focused ? '#a78bfa' : '#6a6a8a', marginRight: 12, display: 'flex', transition: 'color 300ms' }}>
        {icon === 'user' ? <UserIcon /> : <LockIcon />}
      </span>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} autoComplete={autoComplete} style={{ flex: 1, height: '100%', fontSize: 13, color: '#e8e8f0', background: 'transparent', border: 'none', outline: 'none', fontFamily: '"Inter",sans-serif' }} />
      {trailing}
    </div>
  );
}

function UserIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>; }
function LockIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>; }
function EyeIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>; }
function EyeOffIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>; }
function AlertIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>; }
// build: 2026-03-29T15:30:00Z
