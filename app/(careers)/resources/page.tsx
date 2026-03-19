'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ExternalLink, Star, Clock, DollarSign, BookOpen, Monitor, FlaskConical, FileText } from 'lucide-react';

const RESOURCES = [
  // ── FREE ──────────────────────────────────────────────────────────────
  {
    id: 1, title: 'Professor Messer — Security+ SY0-701',
    provider: 'Professor Messer', type: 'VIDEO', cert: 'Security+',
    level: 'ENTRY', category: 'DEFENSIVE_SECURITY',
    cost: 0, rating: 4.9, hours: 14,
    desc: 'O melhor curso gratuito para Security+. Vídeos curtos e objetivos cobrindo todo o SY0-701. Acompanha notas de estudo e simulados pagos opcionais.',
    url: 'https://www.professormesser.com/security-plus/sy0-701/sy0-701-video/',
    tags: ['sec+', 'free', 'video'],
  },
  {
    id: 2, title: 'TryHackMe — Pre-Security Path',
    provider: 'TryHackMe', type: 'LAB', cert: 'Fundamentos',
    level: 'ENTRY', category: 'OFFENSIVE_SECURITY',
    cost: 0, rating: 4.8, hours: 40,
    desc: 'Caminho interativo para iniciantes em cybersecurity. Cobre networking, Linux, web basics e security fundamentals. Freemium — conteúdo básico gratuito.',
    url: 'https://tryhackme.com/path/outline/presecurity',
    tags: ['beginner', 'free', 'labs', 'hands-on'],
  },
  {
    id: 3, title: 'HackTheBox — Starting Point',
    provider: 'HackTheBox', type: 'LAB', cert: 'Pentest',
    level: 'ENTRY', category: 'OFFENSIVE_SECURITY',
    cost: 0, rating: 4.7, hours: 20,
    desc: 'Série de máquinas guiadas para iniciantes em HTB. Introduz metodologia de pentest real com writeups inclusos. Completamente gratuito.',
    url: 'https://www.hackthebox.com/starting-point',
    tags: ['free', 'pentest', 'labs', 'guided'],
  },
  {
    id: 4, title: 'OWASP Testing Guide v4',
    provider: 'OWASP', type: 'BOOK', cert: 'CEH / OSCP / Web App',
    level: 'INTERMEDIATE', category: 'APPLICATION_SECURITY',
    cost: 0, rating: 4.8, hours: 30,
    desc: 'Referência definitiva para testes em aplicações web. Cobre todos os vetores do OWASP Top 10 com metodologia prática. PDF gratuito oficial.',
    url: 'https://owasp.org/www-project-web-security-testing-guide/',
    tags: ['free', 'web', 'reference', 'pdf'],
  },
  {
    id: 5, title: 'ippsec — HackTheBox Walkthroughs',
    provider: 'ippsec (YouTube)', type: 'VIDEO', cert: 'OSCP',
    level: 'INTERMEDIATE', category: 'OFFENSIVE_SECURITY',
    cost: 0, rating: 4.9, hours: 200,
    desc: 'Canal do YouTube com walkthroughs detalhados de máquinas HTB. Essencial para preparação do OSCP. Explica o raciocínio passo a passo.',
    url: 'https://www.youtube.com/@ippsec',
    tags: ['free', 'oscp', 'youtube', 'walkthroughs'],
  },
  {
    id: 6, title: 'TJ Null\'s OSCP Prep List',
    provider: 'TJ Null', type: 'GUIDE', cert: 'OSCP',
    level: 'ADVANCED', category: 'OFFENSIVE_SECURITY',
    cost: 0, rating: 4.9, hours: 0,
    desc: 'Planilha curada com as melhores máquinas HTB e PG para preparação do OSCP. Atualizada regularmente. Referência usada por quase todos que passaram no OSCP.',
    url: 'https://docs.google.com/spreadsheets/d/1dwSMIAPIam0PuRBkCiDI88pU3yzrqqHkDtBngUHNCw8',
    tags: ['free', 'oscp', 'list', 'prep'],
  },
  {
    id: 7, title: 'Destination Certification — CISSP MindMap',
    provider: 'Destination Certification', type: 'VIDEO', cert: 'CISSP',
    level: 'ADVANCED', category: 'GOVERNANCE_RISK',
    cost: 0, rating: 4.8, hours: 25,
    desc: 'Série YouTube com mindmaps visuais para cada domínio do CISSP. Excelente para revisão e para entender o "big picture" antes de entrar nos detalhes.',
    url: 'https://www.youtube.com/@DestinationCertification',
    tags: ['free', 'cissp', 'mindmap', 'youtube'],
  },

  // ── PAID ──────────────────────────────────────────────────────────────
  {
    id: 8, title: 'Jason Dion — Security+ SY0-701 (Udemy)',
    provider: 'Udemy', type: 'VIDEO', cert: 'Security+',
    level: 'ENTRY', category: 'DEFENSIVE_SECURITY',
    cost: 15, rating: 4.7, hours: 27,
    desc: 'Curso mais vendido no Udemy para Security+. Inclui 5 simulados completos com mais de 500 questões. Jason Dion é ex-militar e explica de forma clara.',
    url: 'https://www.udemy.com/user/jasonrobertdion/',
    tags: ['paid', 'sec+', 'udemy', 'practice-exams'],
  },
  {
    id: 9, title: 'TCM Security — Practical Ethical Hacking',
    provider: 'TCM Security Academy', type: 'COURSE', cert: 'eJPT / CEH / OSCP',
    level: 'INTERMEDIATE', category: 'OFFENSIVE_SECURITY',
    cost: 30, rating: 4.9, hours: 25,
    desc: 'Um dos melhores cursos de ethical hacking disponíveis. Cobre desde fundamentos até Active Directory attacks. Excelente custo-benefício e comunidade ativa no Discord.',
    url: 'https://academy.tcm-sec.com',
    tags: ['paid', 'pentest', 'ad', 'best-value'],
  },
  {
    id: 10, title: 'INE Security — eJPT v2',
    provider: 'INE Security', type: 'COURSE', cert: 'eJPT',
    level: 'ENTRY', category: 'OFFENSIVE_SECURITY',
    cost: 49, rating: 4.6, hours: 40,
    desc: 'Plataforma oficial da certificação eJPT. Inclui labs interativos e o voucher do exame nas assinaturas mais completas. Starter Pass acessível.',
    url: 'https://ine.com/pages/cybersecurity',
    tags: ['paid', 'ejpt', 'official', 'labs'],
  },
  {
    id: 11, title: 'TryHackMe — SOC Level 1 Path',
    provider: 'TryHackMe', type: 'LAB', cert: 'CySA+',
    level: 'INTERMEDIATE', category: 'DEFENSIVE_SECURITY',
    cost: 14, rating: 4.7, hours: 60,
    desc: 'Caminho completo para analista de SOC. Cobre SIEM, Splunk, Elastic, threat hunting e IR. Assinatura mensal com acesso a todos os paths.',
    url: 'https://tryhackme.com/path/outline/soclevel1',
    tags: ['paid', 'soc', 'blue-team', 'cysa+'],
  },
  {
    id: 12, title: 'OffSec PEN-200 (PWK) — OSCP',
    provider: 'Offensive Security', type: 'COURSE', cert: 'OSCP',
    level: 'ADVANCED', category: 'OFFENSIVE_SECURITY',
    cost: 1499, rating: 4.9, hours: 400,
    desc: 'O curso oficial do OSCP. Inclui accesso ao lab por 90 dias e 1 tentativa de exame. O padrão ouro do pentest — "Try Harder" é o mantra.',
    url: 'https://www.offensive-security.com/pwk-oscp/',
    tags: ['paid', 'oscp', 'official', 'elite'],
  },
  {
    id: 13, title: 'HackTheBox Pro Labs — Offshore',
    provider: 'HackTheBox', type: 'LAB', cert: 'OSCP / GPEN',
    level: 'ADVANCED', category: 'OFFENSIVE_SECURITY',
    cost: 49, rating: 4.8, hours: 100,
    desc: 'Labs empresariais simulados com Active Directory complexo. Offshore simula uma rede corporativa real. Excelente prep para OSCP e para o mercado.',
    url: 'https://www.hackthebox.com/hacker/pro-labs',
    tags: ['paid', 'oscp', 'active-directory', 'labs'],
  },
  {
    id: 14, title: 'Larry Greenblatt — CISSP (Udemy)',
    provider: 'Udemy', type: 'VIDEO', cert: 'CISSP',
    level: 'ADVANCED', category: 'GOVERNANCE_RISK',
    cost: 15, rating: 4.8, hours: 37,
    desc: 'Curso de CISSP reconhecido como um dos melhores no Udemy. Larry tem décadas de experiência. Abordagem "think like a manager, not a technician".',
    url: 'https://www.udemy.com',
    tags: ['paid', 'cissp', 'udemy', 'management'],
  },
];

const TYPES = [
  { id: 'all',    label: 'Todos',    icon: null },
  { id: 'VIDEO',  label: 'Vídeo',   icon: <Monitor size={12} /> },
  { id: 'COURSE', label: 'Curso',   icon: <BookOpen size={12} /> },
  { id: 'LAB',    label: 'Lab',     icon: <FlaskConical size={12} /> },
  { id: 'BOOK',   label: 'Livro',   icon: <FileText size={12} /> },
  { id: 'GUIDE',  label: 'Guia',    icon: <FileText size={12} /> },
];

const LEVELS_F = [
  { id: 'all',         label: 'Todos os Níveis' },
  { id: 'ENTRY',       label: 'Entry',          color: '#22c55e' },
  { id: 'INTERMEDIATE',label: 'Intermediate',   color: '#3b82f6' },
  { id: 'ADVANCED',    label: 'Advanced',       color: '#f59e0b' },
];

export default function ResourcesPage() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(() => searchParams.get('search') ?? '');
  const [freeOnly, setFreeOnly] = useState(false);
  const [type, setType] = useState('all');
  const [level, setLevel] = useState('all');

  const filtered = RESOURCES.filter(r => {
    if (freeOnly && r.cost > 0) return false;
    if (type !== 'all' && r.type !== type) return false;
    if (level !== 'all' && r.level !== level) return false;
    if (search) {
      const q = search.toLowerCase();
      return r.title.toLowerCase().includes(q) ||
        r.provider.toLowerCase().includes(q) ||
        r.cert.toLowerCase().includes(q) ||
        r.desc.toLowerCase().includes(q) ||
        r.tags.some(t => t.includes(q));
    }
    return true;
  });

  const S = {
    mono: { fontFamily: '"JetBrains Mono", monospace' },
    grotesk: { fontFamily: '"Space Grotesk", sans-serif' },
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0b0f14', color: '#e6eef8', fontFamily: '"Inter", sans-serif' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: 'clamp(20px, 4vw, 40px) clamp(16px, 4vw, 24px)' }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ ...S.mono, fontSize: 10, color: 'rgba(139,92,246,0.6)', letterSpacing: '0.14em', marginBottom: 8 }}>CAREERS / STUDY RESOURCES</div>
          <h1 style={{ ...S.grotesk, fontWeight: 700, fontSize: 30, color: '#f0eeff', marginBottom: 6 }}>Study Resources</h1>
          <p style={{ fontSize: 13, color: 'rgba(155,176,198,0.5)', maxWidth: 520 }}>
            Recursos curados — cursos, labs e guias para cada certificação. Dados baseados em avaliações reais da comunidade.
          </p>
        </div>

        {/* Filters */}
        <div className="cert-filters" style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Buscar por cert, provider, tipo..."
              style={{ width: '100%', padding: '9px 12px', borderRadius: 9, background: 'rgba(15,10,35,0.8)', border: '1px solid rgba(139,92,246,0.2)', color: '#e6eef8', fontSize: 13, fontFamily: '"Inter", sans-serif', outline: 'none' }}
            />
          </div>
          {/* Type */}
          {TYPES.map(t => (
            <button key={t.id} onClick={() => setType(t.id)} style={{
              display: 'flex', alignItems: 'center', gap: 5, padding: '8px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
              ...S.grotesk, fontSize: 12, fontWeight: 600, transition: 'all 150ms',
              background: type === t.id ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.04)',
              color: type === t.id ? '#a78bfa' : 'rgba(155,176,198,0.5)',
            }}>
              {t.icon}{t.label}
            </button>
          ))}
          {/* Free toggle */}
          <button onClick={() => setFreeOnly(v => !v)} style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
            ...S.grotesk, fontSize: 12, fontWeight: 600, transition: 'all 150ms',
            background: freeOnly ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.04)',
            color: freeOnly ? '#22c55e' : 'rgba(155,176,198,0.5)',
            boxShadow: freeOnly ? '0 0 0 1px rgba(34,197,94,0.3)' : 'none',
          }}>
            🆓 Gratuitos
          </button>
        </div>

        {/* Level pills */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          {LEVELS_F.map(l => (
            <button key={l.id} onClick={() => setLevel(l.id)} style={{
              padding: '6px 14px', borderRadius: 7, border: 'none', cursor: 'pointer',
              ...S.mono, fontSize: 10, letterSpacing: '0.06em', transition: 'all 150ms',
              background: level === l.id ? (l.color ? `${l.color}20` : 'rgba(139,92,246,0.15)') : 'rgba(255,255,255,0.04)',
              color: level === l.id ? (l.color ?? '#a78bfa') : 'rgba(155,176,198,0.4)',
              boxShadow: level === l.id ? `0 0 0 1px ${l.color ?? '#a78bfa'}40` : 'none',
            }}>{l.label}</button>
          ))}
        </div>

        {/* Count */}
        <div style={{ ...S.mono, fontSize: 11, color: 'rgba(155,176,198,0.35)', marginBottom: 20 }}>
          {filtered.length} recurso{filtered.length !== 1 ? 's' : ''} · {filtered.filter(r => r.cost === 0).length} gratuitos
        </div>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(320px, 100%), 1fr))', gap: 16 }}>
          {filtered.map(r => {
            const lvlColor = r.level === 'ENTRY' ? '#22c55e' : r.level === 'INTERMEDIATE' ? '#3b82f6' : '#f59e0b';
            return (
              <a key={r.id} href={r.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
                <div style={{
                  height: '100%', display: 'flex', flexDirection: 'column',
                  background: 'rgba(12,8,28,0.8)', border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 12, padding: '18px', cursor: 'pointer',
                  transition: 'all 200ms', position: 'relative', overflow: 'hidden',
                }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = lvlColor + '35'; el.style.transform = 'translateY(-2px)'; el.style.boxShadow = `0 8px 24px rgba(0,0,0,0.4)`; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(255,255,255,0.07)'; el.style.transform = 'none'; el.style.boxShadow = 'none'; }}
                >
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${lvlColor}50,transparent)` }} />

                  {/* Header */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ ...S.mono, fontSize: 9, padding: '2px 7px', borderRadius: 4, background: r.cost === 0 ? 'rgba(34,197,94,0.12)' : 'rgba(245,158,11,0.1)', color: r.cost === 0 ? '#22c55e' : '#f59e0b', border: `1px solid ${r.cost === 0 ? 'rgba(34,197,94,0.25)' : 'rgba(245,158,11,0.25)'}` }}>
                        {r.cost === 0 ? 'FREE' : `$${r.cost}`}
                      </span>
                      <span style={{ ...S.mono, fontSize: 9, padding: '2px 7px', borderRadius: 4, background: 'rgba(255,255,255,0.05)', color: 'rgba(155,176,198,0.5)' }}>
                        {r.type}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Star size={11} style={{ color: '#f59e0b' }} />
                      <span style={{ ...S.mono, fontSize: 10, color: '#f59e0b' }}>{r.rating}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <div style={{ ...S.grotesk, fontWeight: 700, fontSize: 14, color: '#f0eeff', marginBottom: 3, lineHeight: 1.3 }}>{r.title}</div>
                  <div style={{ fontSize: 11, color: 'rgba(155,176,198,0.45)', marginBottom: 8 }}>{r.provider} · {r.cert}</div>

                  {/* Description */}
                  <p style={{ fontSize: 12, color: 'rgba(155,176,198,0.6)', lineHeight: 1.6, flex: 1, marginBottom: 12, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {r.desc}
                  </p>

                  {/* Footer */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', gap: 12 }}>
                      {r.hours > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Clock size={11} style={{ color: 'rgba(155,176,198,0.35)' }} />
                          <span style={{ ...S.mono, fontSize: 10, color: 'rgba(155,176,198,0.4)' }}>{r.hours}h</span>
                        </div>
                      )}
                    </div>
                    <ExternalLink size={12} style={{ color: lvlColor + '60' }} />
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
