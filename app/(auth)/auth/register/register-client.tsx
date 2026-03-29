'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { touchSessionActivity } from '@/lib/session-activity';
import { LocaleToggle } from '@/components/locale-toggle';
import { useI18n } from '@/lib/i18n';

// ── Career paths ──────────────────────────────────────────────────────────
const PATHS = [
  { id: 'it-to-cyber-transition', label: 'IT → Cyber Transition', desc: 'Profissional experiente em outra área de TI migrando para Cyber' },
  { id: 'foundations-to-soc', label: 'Foundations → SOC', desc: 'Primeira vaga em Blue Team / SOC com base realista' },
  { id: 'dev-to-security-engineer', label: 'Dev → Security Engineer', desc: 'AppSec, cloud security e engenharia de segurança' },
  { id: 'pentest-red-team', label: 'Pentest / Red Team', desc: 'Trilha ofensiva prática para ofensiva e validação' },
  { id: 'architecture-leadership', label: 'Architecture / Leadership', desc: 'Senioridade, arquitetura e liderança em segurança' },
];

const TEAMS = [
  { id: 'red',    label: 'Red Team',    color: '#e53e3e', desc: 'Offensive Security' },
  { id: 'blue',   label: 'Blue Team',   color: '#3b82f6', desc: 'Defensive Security' },
  { id: 'purple', label: 'Purple Team', color: '#8b5cf6', desc: 'Continuous Improvement' },
];

type Step = 'identity' | 'career' | 'bio' | 'credentials';

function initRegisterBg(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d')!;
  let W = 0, H = 0, animId = 0;
  const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
  resize(); window.addEventListener('resize', resize);
  const stars = Array.from({ length: 120 }, () => ({ x: Math.random(), y: Math.random(), r: Math.random() * 1.2 + 0.2, a: Math.random() }));
  function render(t: number) {
    ctx.fillStyle = '#060610'; ctx.fillRect(0, 0, W, H);
    const g = ctx.createRadialGradient(W * 0.5, H * 0.4, 0, W * 0.5, H * 0.4, Math.min(W, H) * 0.55);
    g.addColorStop(0, 'rgba(139,92,246,0.08)'); g.addColorStop(0.5, 'rgba(59,130,246,0.04)'); g.addColorStop(1, 'transparent');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    for (const s of stars) {
      const tw = 0.4 + 0.6 * Math.abs(Math.sin(t * 0.0008 + s.a * 7));
      ctx.beginPath(); ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200,210,255,${tw * 0.5})`; ctx.fill();
    }
    animId = requestAnimationFrame(render);
  }
  animId = requestAnimationFrame(render);
  return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
}

// ── Sub-component: Step indicator ────────────────────────────────────────
function StepDots({ current }: { current: number }) {
  const steps: Step[] = ['identity', 'career', 'bio', 'credentials'];
  const labels = ['Identidade', 'Carreira', 'Bio', 'Acesso'];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24, justifyContent: 'center' }}>
      {steps.map((s, i) => (
        <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
            <div style={{ width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, fontFamily: '"Space Grotesk",sans-serif', background: i < current ? 'rgba(34,197,94,0.2)' : i === current ? 'rgba(139,92,246,0.3)' : 'rgba(255,255,255,0.05)', border: `1.5px solid ${i < current ? '#22c55e' : i === current ? '#8b5cf6' : 'rgba(255,255,255,0.1)'}`, color: i < current ? '#22c55e' : i === current ? '#a78bfa' : 'rgba(155,176,198,0.4)', transition: 'all 300ms' }}>
              {i < current ? '✓' : i + 1}
            </div>
            <span style={{ fontFamily: '"JetBrains Mono",monospace', fontSize: 8, color: i === current ? 'rgba(139,92,246,0.7)' : 'rgba(155,176,198,0.3)', letterSpacing: '0.06em' }}>{labels[i]}</span>
          </div>
          {i < steps.length - 1 && <div style={{ width: 20, height: 1, background: i < current ? 'rgba(34,197,94,0.4)' : 'rgba(255,255,255,0.07)', marginBottom: 14, transition: 'background 300ms' }} />}
        </div>
      ))}
    </div>
  );
}

function Field({ label, placeholder, type = 'text', value, onChange, hint }: { label: string; placeholder: string; type?: string; value: string; onChange: (v: string) => void; hint?: string }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <label style={{ fontFamily: '"JetBrains Mono",monospace', fontSize: 9, color: 'rgba(139,92,246,0.7)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} autoComplete="off"
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{ background: 'rgba(5,5,20,0.7)', border: `1px solid ${focused ? 'rgba(139,92,246,0.5)' : 'rgba(255,255,255,0.1)'}`, borderRadius: 8, padding: '9px 13px', fontSize: 13, color: '#e8e8f0', fontFamily: '"Inter",sans-serif', outline: 'none', transition: 'border-color 200ms', boxShadow: focused ? '0 0 0 2px rgba(139,92,246,0.12)' : 'none' }} />
      {hint && <span style={{ fontFamily: '"JetBrains Mono",monospace', fontSize: 9, color: 'rgba(155,176,198,0.35)', letterSpacing: '0.04em' }}>{hint}</span>}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────
export default function RegisterClient() {
  const { t } = useI18n();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [step, setStep] = useState<Step>('identity');
  const stepIndex = (['identity', 'career', 'bio', 'credentials'] as Step[]).indexOf(step);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Step 1: Identity
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [phone, setPhone] = useState('');
  const [profession, setProfession] = useState('');

  // Step 2: Career
  const [selectedPath, setSelectedPath] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');

  // Step 3: Bio
  const [bio, setBio] = useState('');

  // Step 4: Credentials
  const [email, setEmail] = useState('');
  const [passphrase, setPassphrase] = useState('');
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;
    return initRegisterBg(canvasRef.current);
  }, []);

  const waitForSessionReady = useCallback(async () => {
    for (let attempt = 0; attempt < 6; attempt++) {
      try {
        const response = await fetch('/api/auth/validate', {
          method: 'GET',
          credentials: 'include',
          cache: 'no-store',
        });

        if (response.ok) return true;
      } catch {
        // noop
      }

      await new Promise((resolve) => setTimeout(resolve, 150 * (attempt + 1)));
    }

    return false;
  }, []);

  const next = useCallback(() => {
    setError('');
    if (step === 'identity') {
      if (!name.trim()) { setError('Nome é obrigatório.'); return; }
      setStep('career');
    } else if (step === 'career') {
      if (!selectedPath) { setError('Escolha uma trilha.'); return; }
      setStep('bio');
    } else if (step === 'bio') {
      setStep('credentials');
    } else {
      handleSubmit();
    }
  }, [step, name, selectedPath]);

  const handleSubmit = useCallback(async () => {
    if (!email.trim() || !passphrase.trim()) { setError('Email e senha são obrigatórios.'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, nickname, phone, profession, bio, selectedPath, selectedTeam, email, passphrase }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? 'Erro ao criar conta.'); return; }
      const sessionReady = await waitForSessionReady();
      if (!sessionReady) {
        setError('Sessão criada, mas ainda não ficou estável. Tente novamente.');
        return;
      }
      touchSessionActivity();
      window.location.assign('/home');
    } catch { setError('Erro de conexão.'); }
    finally { setLoading(false); }
  }, [bio, email, name, nickname, passphrase, phone, profession, selectedPath, selectedTeam, waitForSessionReady]);

  const EyeIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
  const EyeOffIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19M1 1l22 22"/></svg>;

  return (
    <>
      <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, zIndex: 0, width: '100%', height: '100%' }} />
      <div style={{ position: 'fixed', inset: 0, zIndex: 10, pointerEvents: 'none', background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.5) 100%)' }} />

      <div className="cp-main-app" style={{ position: 'relative', zIndex: 20, height: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 30, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', background: 'linear-gradient(180deg, rgba(6,4,18,0.97) 0%, rgba(8,5,22,0.90) 100%)', backdropFilter: 'blur(24px)', borderBottom: '1px solid rgba(139,92,246,0.12)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src="/logo.png" alt="CYBERSEC HUB" style={{ width: 36, height: 36, objectFit: 'contain', filter: 'drop-shadow(0 0 8px rgba(139,92,246,0.7))' }} />
            <div>
              <div data-auth-brand style={{ fontFamily: '"Space Grotesk",sans-serif', fontWeight: 700, fontSize: 13, letterSpacing: '0.16em', color: '#f0eeff' }}>CYBERSEC HUB</div>
              <div style={{ fontFamily: '"JetBrains Mono",monospace', fontSize: 9, color: 'rgba(139,92,246,0.6)', letterSpacing: '0.12em' }}>signal &gt; noise</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <LocaleToggle variant="auth" />
            <Link href="/auth/login" style={{ fontFamily: '"JetBrains Mono",monospace', fontSize: 10, color: 'rgba(155,176,198,0.5)', textDecoration: 'none', letterSpacing: '0.08em' }}>
              ← {t('register.haveAccount').replace('?', '')}
            </Link>
          </div>
        </header>

        {/* Main */}
        <main style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100vh', padding: '56px 24px 24px' }}>
          <div className="cp-glass cp-animate-in" style={{ width: '100%', maxWidth: 420, padding: '24px 28px 20px' }}>

            <StepDots current={stepIndex} />

            {/* STEP 1: Identity */}
            {step === 'identity' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <h1 style={{ fontFamily: '"Space Grotesk",sans-serif', fontSize: 16, fontWeight: 700, letterSpacing: '0.2em', textAlign: 'center', color: '#fff', marginBottom: 4 }}>IDENTIDADE</h1>
                <Field label="Nome completo" placeholder="Como você se chama?" value={name} onChange={setName} />
                <Field label="Apelido" placeholder="Como quer ser chamado no Hub?" value={nickname} onChange={setNickname} hint="Opcional — aparece no YOU ARE HERE" />
                <Field label="E-mail" placeholder="seu@email.com" type="email" value={email} onChange={setEmail} />
                <Field label="Telefone" placeholder="+55 11 99999-9999" value={phone} onChange={setPhone} hint="Opcional" />
                <Field label="Profissão atual" placeholder="Ex: Dev Backend, Estudante, Analista..." value={profession} onChange={setProfession} hint="Opcional" />
              </div>
            )}

            {/* STEP 2: Career */}
            {step === 'career' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <h1 style={{ fontFamily: '"Space Grotesk",sans-serif', fontSize: 16, fontWeight: 700, letterSpacing: '0.2em', textAlign: 'center', color: '#fff', marginBottom: 4 }}>TRILHA</h1>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ fontFamily: '"JetBrains Mono",monospace', fontSize: 9, color: 'rgba(139,92,246,0.7)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Qual seu caminho?</div>
                  {PATHS.map(p => (
                    <button key={p.id} onClick={() => setSelectedPath(p.id)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 9, background: selectedPath === p.id ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.03)', border: `1px solid ${selectedPath === p.id ? 'rgba(139,92,246,0.5)' : 'rgba(255,255,255,0.08)'}`, cursor: 'pointer', textAlign: 'left', transition: 'all 180ms' }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: selectedPath === p.id ? '#8b5cf6' : 'rgba(255,255,255,0.15)', flexShrink: 0, boxShadow: selectedPath === p.id ? '0 0 8px #8b5cf6' : 'none', transition: 'all 180ms' }} />
                      <div>
                        <div style={{ fontFamily: '"Space Grotesk",sans-serif', fontWeight: 600, fontSize: 12, color: selectedPath === p.id ? '#e8e4ff' : 'rgba(200,195,240,0.6)' }}>{p.label}</div>
                        <div style={{ fontFamily: '"Inter",sans-serif', fontSize: 11, color: 'rgba(155,176,198,0.4)', marginTop: 1 }}>{p.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ fontFamily: '"JetBrains Mono",monospace', fontSize: 9, color: 'rgba(139,92,246,0.7)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Foco principal (opcional)</div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {TEAMS.map(t => (
                      <button key={t.id} onClick={() => setSelectedTeam(selectedTeam === t.id ? '' : t.id)} style={{ flex: 1, padding: '8px 6px', borderRadius: 8, background: selectedTeam === t.id ? `rgba(${t.id === 'red' ? '229,62,62' : t.id === 'blue' ? '59,130,246' : '139,92,246'},0.15)` : 'rgba(255,255,255,0.03)', border: `1px solid ${selectedTeam === t.id ? t.color + '60' : 'rgba(255,255,255,0.08)'}`, cursor: 'pointer', transition: 'all 180ms' }}>
                        <div style={{ fontFamily: '"JetBrains Mono",monospace', fontSize: 9, color: selectedTeam === t.id ? t.color : 'rgba(155,176,198,0.4)', letterSpacing: '0.06em' }}>{t.label}</div>
                        <div style={{ fontFamily: '"Inter",sans-serif', fontSize: 9, color: 'rgba(155,176,198,0.3)', marginTop: 2 }}>{t.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Bio */}
            {step === 'bio' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <h1 style={{ fontFamily: '"Space Grotesk",sans-serif', fontSize: 16, fontWeight: 700, letterSpacing: '0.2em', textAlign: 'center', color: '#fff', marginBottom: 4 }}>SUA HISTÓRIA</h1>
                <p style={{ fontFamily: '"Inter",sans-serif', fontSize: 12, color: 'rgba(155,176,198,0.5)', lineHeight: 1.6, margin: 0, textAlign: 'center' }}>
                  Escreva algo sobre você. Isso vai alimentar o seu <span style={{ color: 'rgba(139,92,246,0.8)' }}>YOU ARE HERE</span> no dashboard.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  <label style={{ fontFamily: '"JetBrains Mono",monospace', fontSize: 9, color: 'rgba(139,92,246,0.7)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Bio</label>
                  <textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="Quem é você? De onde vem? O que busca no mundo da cybersecurity?" rows={4}
                    style={{ background: 'rgba(5,5,20,0.7)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '9px 13px', fontSize: 13, color: '#e8e8f0', fontFamily: '"Inter",sans-serif', outline: 'none', resize: 'vertical', lineHeight: 1.6 }} />
                  <span style={{ fontFamily: '"JetBrains Mono",monospace', fontSize: 9, color: 'rgba(155,176,198,0.3)' }}>Opcional — pode editar depois no perfil</span>
                </div>
              </div>
            )}

            {/* STEP 4: Credentials */}
            {step === 'credentials' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <h1 style={{ fontFamily: '"Space Grotesk",sans-serif', fontSize: 16, fontWeight: 700, letterSpacing: '0.2em', textAlign: 'center', color: '#fff', marginBottom: 4 }}>ACESSO</h1>
                <Field label="E-mail" placeholder="seu@email.com" type="email" value={email} onChange={setEmail} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  <label style={{ fontFamily: '"JetBrains Mono",monospace', fontSize: 9, color: 'rgba(139,92,246,0.7)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Passphrase</label>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center', background: 'rgba(5,5,20,0.7)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '0 14px', height: 42 }}>
                    <input type={showPass ? 'text' : 'password'} value={passphrase} onChange={e => setPassphrase(e.target.value)} placeholder="Mín. 8 chars · maiúscula · número · símbolo" style={{ flex: 1, height: '100%', fontSize: 13, color: '#e8e8f0', background: 'transparent', border: 'none', outline: 'none', fontFamily: '"Inter",sans-serif' }} />
                    <button type="button" onClick={() => setShowPass(v => !v)} style={{ color: '#6a6a8a', background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}>
                      {showPass ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div style={{ marginTop: 10, padding: '8px 12px', borderRadius: 7, background: 'rgba(229,62,62,0.1)', border: '1px solid rgba(229,62,62,0.25)', fontFamily: '"JetBrains Mono",monospace', fontSize: 11, color: '#ff7070' }}>
                {error}
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', gap: 8, marginTop: 18 }}>
              {stepIndex > 0 && (
                <button onClick={() => { setError(''); setStep((['identity','career','bio','credentials'] as Step[])[stepIndex - 1]); }}
                  style={{ flex: '0 0 auto', padding: '10px 16px', borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', color: 'rgba(155,176,198,0.5)', fontSize: 13, fontFamily: '"Space Grotesk",sans-serif', fontWeight: 600 }}>
                  ←
                </button>
              )}
              <button onClick={next} disabled={loading}
                style={{ flex: 1, padding: '10px 16px', borderRadius: 8, background: 'linear-gradient(135deg, rgba(139,92,246,0.6), rgba(59,130,246,0.4))', border: '1px solid rgba(139,92,246,0.4)', cursor: loading ? 'default' : 'pointer', color: '#fff', fontSize: 13, fontFamily: '"Space Grotesk",sans-serif', fontWeight: 700, letterSpacing: '0.12em', opacity: loading ? 0.7 : 1, transition: 'all 150ms' }}>
                {loading ? t('register.submitting') : step === 'credentials' ? t('register.submit') : `${t('generic.next')} →`}
              </button>
            </div>

            <p style={{ textAlign: 'center', fontFamily: '"JetBrains Mono",monospace', fontSize: 10, color: 'rgba(155,176,198,0.35)', marginTop: 14, letterSpacing: '0.04em' }}>
              {t('register.haveAccount')}{' '}
              <Link href="/auth/login" style={{ color: 'rgba(139,92,246,0.7)', textDecoration: 'none' }}>{t('register.signIn')}</Link>
            </p>
          </div>
        </main>
      </div>

      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        body{background:#060610;overflow:hidden}
        textarea{resize:vertical}
        textarea::placeholder,input::placeholder{color:#6a6a8a}
      `}</style>
    </>
  );
}
