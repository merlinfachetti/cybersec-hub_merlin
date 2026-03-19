'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Award, TrendingUp, Clock, Target, BookOpen,
  Shield, Zap, ChevronRight, Star, Edit3, Plus,
  CheckCircle, Circle, BarChart2, User,
} from 'lucide-react';

interface UserSession { name: string | null; email: string; role: string; }

const STATUS_COLOR: Record<string, string> = {
  STUDYING: '#3b82f6', INTERESTED: '#8b5cf6', SCHEDULED: '#f59e0b',
  PASSED: '#22c55e', FAILED: '#ef4444', EXPIRED: '#6b7280',
};
const STATUS_LABEL: Record<string, string> = {
  STUDYING: 'Studying', INTERESTED: 'Interested', SCHEDULED: 'Scheduled',
  PASSED: '✓ Passed', FAILED: 'Failed', EXPIRED: 'Expired',
};

// Study plan — interactive checklist
const STUDY_PLAN = [
  { id: 1, task: 'Assistir Professor Messer SY0-701 completo', cert: 'SEC+', hours: 14, done: false },
  { id: 2, task: 'Completar 3 simulados Jason Dion (min. 80%)', cert: 'SEC+', hours: 6, done: false },
  { id: 3, task: 'Revisar flashcards de Network Security', cert: 'SEC+', hours: 3, done: true },
  { id: 4, task: 'Fazer TryHackMe Pre-Security Path', cert: 'Fundamentos', hours: 40, done: false },
  { id: 5, task: 'Concluir HackTheBox Starting Point Tier 1', cert: 'eJPT', hours: 10, done: false },
  { id: 6, task: 'Ler capítulo 3 – Cryptography (Darril Gibson)', cert: 'SEC+', hours: 2, done: true },
];

const QUICK_STATS = [
  { label: 'Estudo hoje', value: '2h 15m', icon: <Clock size={16} />, color: '#3b82f6' },
  { label: 'Streak', value: '12 dias', icon: <Zap size={16} />, color: '#f59e0b' },
  { label: 'Labs feitos', value: '8', icon: <BarChart2 size={16} />, color: '#8b5cf6' },
  { label: 'Próxima meta', value: 'SEC+', icon: <Target size={16} />, color: '#22c55e' },
];

export default function ProfilePage() {
  const [user, setUser] = useState<UserSession | null>(null);
  const [tasks, setTasks] = useState(STUDY_PLAN);
  const [activeSection, setActiveSection] = useState<'overview' | 'plan' | 'certs' | 'posture'>('overview');

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.ok ? r.json() : null)
      .then(d => d?.user && setUser(d.user))
      .catch(() => null);
  }, []);

  const toggleTask = (id: number) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const completedTasks = tasks.filter(t => t.done).length;
  const totalHours = tasks.reduce((s, t) => s + (t.done ? t.hours : 0), 0);

  const S = {
    card: { background: 'rgba(12,8,28,0.8)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12 },
    mono: { fontFamily: '"JetBrains Mono", monospace' as const },
    grotesk: { fontFamily: '"Space Grotesk", sans-serif' as const },
  };

  const SECTIONS = [
    { id: 'overview', label: 'Overview' },
    { id: 'plan', label: 'Plano de Estudo' },
    { id: 'certs', label: 'Certificações' },
    { id: 'posture', label: 'Postura' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#0b0f14', color: '#e6eef8', fontFamily: '"Inter", sans-serif' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: 'clamp(20px, 4vw, 40px) clamp(16px, 4vw, 24px)' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
          <div style={{ position: 'relative' }}>
            <img src="/merlin.jpg" alt="Alden Merlin" style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(139,92,246,0.4)' }} />
            <div style={{ position: 'absolute', bottom: 2, right: 2, width: 14, height: 14, borderRadius: '50%', background: '#22c55e', border: '2px solid #0b0f14', boxShadow: '0 0 6px #22c55e' }} />
          </div>
          <div>
            <h1 style={{ ...S.grotesk, fontWeight: 700, fontSize: 24, color: '#f0eeff', margin: 0 }}>
              {user?.name ?? 'Merlin'}
            </h1>
            <div style={{ fontSize: 13, color: 'rgba(155,176,198,0.5)', marginTop: 2 }}>
              {user?.email} · <span style={{ color: '#8b5cf6', fontWeight: 600 }}>{user?.role?.toUpperCase() ?? 'ADMIN'}</span>
            </div>
            <div style={{ ...S.mono, fontSize: 9, color: 'rgba(34,197,94,0.6)', letterSpacing: '0.1em', marginTop: 4 }}>
              ● SESSÃO ATIVA · Transição para Security Engineer
            </div>
          </div>
        </div>

        {/* Quick stats */}
        <div className="profile-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 28 }}>
          {QUICK_STATS.map(s => (
            <div key={s.label} style={{ ...S.card, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ color: s.color, flexShrink: 0 }}>{s.icon}</div>
              <div>
                <div style={{ ...S.grotesk, fontWeight: 700, fontSize: 18, color: '#f0eeff' }}>{s.value}</div>
                <div style={{ ...S.mono, fontSize: 9, color: 'rgba(155,176,198,0.4)', letterSpacing: '0.06em' }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Section tabs */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 24, borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 0 }}>
          {SECTIONS.map(s => (
            <button key={s.id} onClick={() => setActiveSection(s.id as any)} style={{
              padding: '9px 18px', background: 'none', border: 'none', cursor: 'pointer',
              ...S.grotesk, fontSize: 13, fontWeight: 600, transition: 'all 150ms',
              color: activeSection === s.id ? '#a78bfa' : 'rgba(155,176,198,0.45)',
              borderBottom: `2px solid ${activeSection === s.id ? '#8b5cf6' : 'transparent'}`,
              marginBottom: -1,
            }}>{s.label}</button>
          ))}
        </div>

        {/* ── OVERVIEW ── */}
        {activeSection === 'overview' && (
          <div className="profile-main" style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Progress towards SEC+ */}
              <div style={{ ...S.card, padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div style={{ ...S.grotesk, fontWeight: 700, fontSize: 15, color: '#f0eeff' }}>CompTIA Security+ SY0-701</div>
                  <span style={{ ...S.mono, fontSize: 10, color: '#3b82f6', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)', padding: '2px 8px', borderRadius: 4 }}>STUDYING</span>
                </div>
                <div style={{ marginBottom: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 12, color: 'rgba(155,176,198,0.5)' }}>Progresso</span>
                    <span style={{ ...S.mono, fontSize: 11, color: '#3b82f6', fontWeight: 600 }}>45%</span>
                  </div>
                  <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3 }}>
                    <div style={{ height: '100%', width: '45%', background: 'linear-gradient(90deg,#3b82f6,#8b5cf6)', borderRadius: 3 }} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 20, fontSize: 12, color: 'rgba(155,176,198,0.45)' }}>
                  <span>80h estudadas</span>
                  <span>~40h restantes</span>
                  <span>Meta: 90 dias</span>
                </div>
              </div>

              {/* Study plan preview */}
              <div style={{ ...S.card, padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div style={{ ...S.grotesk, fontWeight: 700, fontSize: 15, color: '#f0eeff' }}>Tarefas de Hoje</div>
                  <span style={{ ...S.mono, fontSize: 10, color: 'rgba(155,176,198,0.4)' }}>{completedTasks}/{tasks.length} · {totalHours}h</span>
                </div>
                {tasks.slice(0,4).map(t => (
                  <div key={t.id} onClick={() => toggleTask(t.id)} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '9px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer' }}>
                    <div style={{ color: t.done ? '#22c55e' : 'rgba(155,176,198,0.25)', flexShrink: 0, marginTop: 1 }}>
                      {t.done ? <CheckCircle size={16} /> : <Circle size={16} />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, color: t.done ? 'rgba(155,176,198,0.4)' : '#e6eef8', textDecoration: t.done ? 'line-through' : 'none' }}>{t.task}</div>
                      <div style={{ ...S.mono, fontSize: 10, color: 'rgba(155,176,198,0.35)', marginTop: 2 }}>{t.cert} · {t.hours}h</div>
                    </div>
                  </div>
                ))}
                <button onClick={() => setActiveSection('plan')} style={{ marginTop: 12, fontSize: 12, color: '#8b5cf6', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                  Ver plano completo →
                </button>
              </div>
            </div>

            {/* Sidebar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ ...S.card, padding: '16px' }}>
                <div style={{ ...S.mono, fontSize: 9, color: 'rgba(139,92,246,0.5)', letterSpacing: '0.12em', marginBottom: 12 }}>PRÓXIMOS PASSOS</div>
                {[
                  { n: 1, text: 'Completar Security+ (45% feito, ~40h)', color: '#3b82f6' },
                  { n: 2, text: 'Agendar exame (2-3 sem após conclusão)', color: '#f59e0b' },
                  { n: 3, text: 'Iniciar prep eJPT para red team básico', color: '#22c55e' },
                ].map(r => (
                  <div key={r.n} style={{ display: 'flex', gap: 10, padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <span style={{ ...S.mono, fontSize: 11, color: r.color, fontWeight: 700, minWidth: 16 }}>{r.n}.</span>
                    <span style={{ fontSize: 12, color: 'rgba(155,176,198,0.65)', lineHeight: 1.5 }}>{r.text}</span>
                  </div>
                ))}
              </div>
              <div style={{ ...S.card, padding: '16px' }}>
                <div style={{ ...S.mono, fontSize: 9, color: 'rgba(139,92,246,0.5)', letterSpacing: '0.12em', marginBottom: 12 }}>ACESSO RÁPIDO</div>
                {[
                  { href: '/certifications', label: 'Browse Certificações', icon: <Award size={12} /> },
                  { href: '/roadmap', label: 'Ver Roadmap', icon: <TrendingUp size={12} /> },
                  { href: '/resources', label: 'Study Resources', icon: <BookOpen size={12} /> },
                  { href: '/threat-universe', label: '← Threat Universe', icon: <Shield size={12} /> },
                ].map(l => (
                  <Link key={l.href} href={l.href} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', textDecoration: 'none', color: 'rgba(155,176,198,0.6)', fontSize: 13, transition: 'color 150ms' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#e6eef8'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(155,176,198,0.6)'}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>{l.icon}{l.label}</div>
                    <ChevronRight size={12} style={{ opacity: 0.4 }} />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── STUDY PLAN ── */}
        {activeSection === 'plan' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div>
                <div style={{ ...S.grotesk, fontWeight: 700, fontSize: 16, color: '#f0eeff' }}>Plano de Estudo Interativo</div>
                <div style={{ fontSize: 12, color: 'rgba(155,176,198,0.5)', marginTop: 2 }}>Clique em cada tarefa para marcar como concluída</div>
              </div>
              <div style={{ ...S.mono, fontSize: 11, color: '#22c55e' }}>{completedTasks}/{tasks.length} concluídas · {totalHours}h</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {tasks.map(t => (
                <div key={t.id} onClick={() => toggleTask(t.id)} style={{
                  ...S.card, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
                  background: t.done ? 'rgba(34,197,94,0.05)' : 'rgba(12,8,28,0.8)',
                  borderColor: t.done ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.07)',
                  transition: 'all 150ms',
                }}>
                  <div style={{ color: t.done ? '#22c55e' : 'rgba(155,176,198,0.3)', flexShrink: 0 }}>
                    {t.done ? <CheckCircle size={18} /> : <Circle size={18} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: t.done ? 'rgba(155,176,198,0.4)' : '#e6eef8', textDecoration: t.done ? 'line-through' : 'none' }}>{t.task}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
                    <span style={{ ...S.mono, fontSize: 10, color: 'rgba(139,92,246,0.6)', background: 'rgba(139,92,246,0.08)', padding: '2px 8px', borderRadius: 4 }}>{t.cert}</span>
                    <span style={{ ...S.mono, fontSize: 10, color: 'rgba(155,176,198,0.35)' }}>{t.hours}h</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── CERTS ── */}
        {activeSection === 'certs' && (
          <div>
            <div style={{ ...S.grotesk, fontWeight: 700, fontSize: 16, color: '#f0eeff', marginBottom: 16 }}>Minhas Certificações</div>
            {[
              { name: 'CompTIA Security+', provider: 'CompTIA', status: 'STUDYING', progress: 45, hours: 80 },
              { name: 'CEH', provider: 'EC-Council', status: 'INTERESTED', progress: 0, hours: 0 },
            ].map(c => (
              <div key={c.name} style={{ ...S.card, padding: '18px 20px', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: c.progress > 0 ? 12 : 0 }}>
                  <div>
                    <div style={{ ...S.grotesk, fontWeight: 600, fontSize: 15, color: '#f0eeff' }}>{c.name}</div>
                    <div style={{ fontSize: 12, color: 'rgba(155,176,198,0.45)', marginTop: 2 }}>{c.provider}</div>
                  </div>
                  <span style={{ ...S.mono, fontSize: 10, color: STATUS_COLOR[c.status], background: `${STATUS_COLOR[c.status]}18`, border: `1px solid ${STATUS_COLOR[c.status]}40`, padding: '3px 10px', borderRadius: 5 }}>
                    {STATUS_LABEL[c.status]}
                  </span>
                </div>
                {c.progress > 0 && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                      <span style={{ fontSize: 11, color: 'rgba(155,176,198,0.4)' }}>Progresso</span>
                      <span style={{ ...S.mono, fontSize: 11, color: STATUS_COLOR[c.status] }}>{c.progress}%</span>
                    </div>
                    <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2 }}>
                      <div style={{ height: '100%', width: `${c.progress}%`, background: STATUS_COLOR[c.status], borderRadius: 2, transition: 'width 0.6s ease' }} />
                    </div>
                    <div style={{ fontSize: 11, color: 'rgba(155,176,198,0.35)', marginTop: 6 }}>{c.hours}h estudadas</div>
                  </div>
                )}
              </div>
            ))}
            <Link href="/certifications" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 8, fontSize: 13, color: '#8b5cf6', textDecoration: 'none' }}>
              <Plus size={14} /> Adicionar certificação
            </Link>
          </div>
        )}

        {/* ── POSTURE ── */}
        {activeSection === 'posture' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
            {[
              { team: 'RED TEAM', label: 'Offensive', color: '#e53e3e', rgb: '229,62,62', level: 'Iniciante', score: 15, skills: ['Footprinting básico','Network scanning','Web vulns básicas'], next: 'Completar TryHackMe Jr Pen Tester' },
              { team: 'BLUE TEAM', label: 'Defensive', color: '#3b82f6', rgb: '59,130,246', level: 'Iniciante+', score: 30, skills: ['Log analysis','Incident triage','SIEM básico'], next: 'Completar Security+ SY0-701' },
              { team: 'PURPLE TEAM', label: 'Improve', color: '#8b5cf6', rgb: '139,92,246', level: 'Awareness', score: 20, skills: ['Threat modeling básico','Purple team concepts'], next: 'Fazer Tabletop Exercise intro' },
            ].map(t => (
              <div key={t.team} style={{ ...S.card, padding: '20px', borderColor: `rgba(${t.rgb},0.2)`, background: `rgba(${t.rgb},0.04)` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: t.color, boxShadow: `0 0 8px ${t.color}` }} />
                  <span style={{ ...S.grotesk, fontWeight: 700, fontSize: 13, color: t.color }}>{t.team}</span>
                </div>
                <div style={{ ...S.grotesk, fontWeight: 700, fontSize: 22, color: '#f0eeff', marginBottom: 2 }}>{t.level}</div>
                <div style={{ marginBottom: 14 }}>
                  <div style={{ height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 3, marginBottom: 4 }}>
                    <div style={{ height: '100%', width: `${t.score}%`, background: t.color, borderRadius: 3 }} />
                  </div>
                  <span style={{ ...S.mono, fontSize: 10, color: `${t.color}80` }}>{t.score}/100</span>
                </div>
                <div style={{ marginBottom: 12 }}>
                  {t.skills.map(s => (
                    <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 0' }}>
                      <div style={{ width: 4, height: 4, borderRadius: '50%', background: t.color, flexShrink: 0 }} />
                      <span style={{ fontSize: 11, color: 'rgba(155,176,198,0.6)' }}>{s}</span>
                    </div>
                  ))}
                </div>
                <div style={{ ...S.mono, fontSize: 9, color: `${t.color}70`, background: `rgba(${t.rgb},0.08)`, padding: '8px 10px', borderRadius: 6, lineHeight: 1.5 }}>
                  → {t.next}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
