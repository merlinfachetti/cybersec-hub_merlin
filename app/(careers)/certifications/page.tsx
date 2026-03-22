'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, X, Shield, ChevronRight, ExternalLink, Clock, Award } from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────
interface Cost { region: string; currency: string; examCost: number; }
interface Provider { name: string; slug: string; }
interface Cert {
  id: string; slug: string; name: string; fullName?: string; acronym?: string;
  level: string; category: string; description: string;
  examDuration?: number; numberOfQuestions?: number; passingScore?: number;
  validityYears?: number; requiresRenewal?: boolean;
  provider: Provider; costs: Cost[]; _count?: { resources: number };
}

// ── Constants ──────────────────────────────────────────────────────────────
const LEVELS = [
  { value: 'all',         label: 'Todos os Níveis' },
  { value: 'ENTRY',       label: 'Entry Level',        color: 'var(--ds-ok)' },
  { value: 'INTERMEDIATE',label: 'Intermediate',        color: '#3b82f6' },
  { value: 'ADVANCED',    label: 'Advanced',            color: 'var(--ds-warn)' },
  { value: 'EXPERT',      label: 'Expert',              color: 'var(--ds-danger)' },
];

const LEVEL_ORDER = ['ENTRY', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'];

const CATEGORIES = [
  { value: 'all',                   label: 'Todas as Categorias' },
  { value: 'DEFENSIVE_SECURITY',    label: '🔵 Defensive Security',   color: '#3b82f6' },
  { value: 'OFFENSIVE_SECURITY',    label: '🔴 Offensive Security',   color: '#e53e3e' },
  { value: 'GOVERNANCE_RISK',       label: '🟣 Governance & Risk',    color: '#8b5cf6' },
  { value: 'CLOUD_SECURITY',        label: '☁️ Cloud Security',       color: '#06b6d4' },
  { value: 'NETWORK_SECURITY',      label: '🌐 Network Security',     color: '#10b981' },
  { value: 'INCIDENT_RESPONSE',     label: '🚨 Incident Response',    color: 'var(--ds-warn)' },
  { value: 'APPLICATION_SECURITY',  label: '🔒 App Security',         color: '#8b5cf6' },
  { value: 'FORENSICS',             label: '🔍 Forensics',            color: '#6b7280' },
  { value: 'THREAT_INTELLIGENCE',   label: '📡 Threat Intelligence',  color: '#e53e3e' },
];

const LEVEL_META: Record<string, { color: string; bg: string; label: string; desc: string }> = {
  ENTRY:        { color: 'var(--ds-ok)', bg: 'rgba(34,197,94,0.1)',    label: 'Entry',        desc: '0–2 anos · Primeira certificação' },
  INTERMEDIATE: { color: '#3b82f6', bg: 'rgba(59,130,246,0.1)',   label: 'Intermediate', desc: '2–5 anos · Crescimento técnico' },
  ADVANCED:     { color: 'var(--ds-warn)', bg: 'rgba(245,158,11,0.1)',   label: 'Advanced',     desc: '5+ anos · Especialista' },
  EXPERT:       { color: 'var(--ds-danger)', bg: 'rgba(239,68,68,0.1)',    label: 'Expert',       desc: '8+ anos · Referência da área' },
};

function formatCost(costs: Cost[]): string {
  const usd = costs.find(c => c.currency === 'USD');
  const eur = costs.find(c => c.currency === 'EUR');
  if (usd) return `$${usd.examCost.toLocaleString()}`;
  if (eur) return `€${eur.examCost.toLocaleString()}`;
  if (costs[0]) return `${costs[0].currency} ${costs[0].examCost}`;
  return 'Consultar';
}

// ── Static fallback data (shown if DB is empty) ────────────────────────────
const STATIC_CERTS: Cert[] = [
  { id: 'static-1', slug: 'comptia-security-plus', name: 'Security+', fullName: 'CompTIA Security+ SY0-701', acronym: 'SEC+', level: 'ENTRY', category: 'DEFENSIVE_SECURITY', description: 'Certificação baseline de cybersecurity. Cobre ameaças, criptografia, identidade e redes. Exigida pelo DoD dos EUA e reconhecida globalmente.', examDuration: 90, numberOfQuestions: 90, passingScore: 750, validityYears: 3, requiresRenewal: true, provider: { name: 'CompTIA', slug: 'comptia' }, costs: [{ region: 'NORTH_AMERICA', currency: 'USD', examCost: 392 }, { region: 'EUROPE', currency: 'EUR', examCost: 370 }], _count: { resources: 12 } },
  { id: 'static-2', slug: 'ejpt', name: 'eJPT', fullName: 'eLearnSecurity Junior Penetration Tester', acronym: 'eJPT', level: 'ENTRY', category: 'OFFENSIVE_SECURITY', description: 'Certificação prática de pentest para iniciantes. Exame 100% hands-on em laboratório. Melhor ponto de partida para red team.', examDuration: 1440, numberOfQuestions: 0, passingScore: 70, validityYears: 0, requiresRenewal: false, provider: { name: 'Offensive Security', slug: 'offensive-security' }, costs: [{ region: 'NORTH_AMERICA', currency: 'USD', examCost: 200 }], _count: { resources: 8 } },
  { id: 'static-3', slug: 'comptia-cysa-plus', name: 'CySA+', fullName: 'CompTIA Cybersecurity Analyst+', acronym: 'CySA+', level: 'INTERMEDIATE', category: 'DEFENSIVE_SECURITY', description: 'Análise comportamental para combater ameaças. Cobre threat intelligence, gestão de vulnerabilidades e resposta a incidentes.', examDuration: 165, numberOfQuestions: 85, passingScore: 750, validityYears: 3, requiresRenewal: true, provider: { name: 'CompTIA', slug: 'comptia' }, costs: [{ region: 'NORTH_AMERICA', currency: 'USD', examCost: 392 }], _count: { resources: 7 } },
  { id: 'static-4', slug: 'ceh-certified-ethical-hacker', name: 'CEH', fullName: 'Certified Ethical Hacker v12', acronym: 'CEH', level: 'INTERMEDIATE', category: 'OFFENSIVE_SECURITY', description: 'Metodologia de ethical hacking. Aprenda a pensar como um atacante para defender sistemas. Reconhecido mundialmente.', examDuration: 240, numberOfQuestions: 125, passingScore: 700, validityYears: 3, requiresRenewal: true, provider: { name: 'EC-Council', slug: 'ec-council' }, costs: [{ region: 'NORTH_AMERICA', currency: 'USD', examCost: 1199 }], _count: { resources: 10 } },
  { id: 'static-5', slug: 'gpen', name: 'GPEN', fullName: 'GIAC Penetration Tester', acronym: 'GPEN', level: 'INTERMEDIATE', category: 'OFFENSIVE_SECURITY', description: 'Certificação de pentest reconhecida pela indústria. Cobre metodologia completa, reconhecimento, exploração e AD attacks.', examDuration: 180, numberOfQuestions: 115, passingScore: 74, validityYears: 4, requiresRenewal: true, provider: { name: 'SANS Institute', slug: 'sans' }, costs: [{ region: 'NORTH_AMERICA', currency: 'USD', examCost: 979 }], _count: { resources: 6 } },
  { id: 'static-6', slug: 'oscp', name: 'OSCP', fullName: 'Offensive Security Certified Professional', acronym: 'OSCP', level: 'ADVANCED', category: 'OFFENSIVE_SECURITY', description: 'Exame prático de 24 horas em rede isolada. A certificação ofensiva mais respeitada. "Try Harder" é o mantra.', examDuration: 1440, numberOfQuestions: 0, passingScore: 70, validityYears: 0, requiresRenewal: false, provider: { name: 'Offensive Security', slug: 'offensive-security' }, costs: [{ region: 'NORTH_AMERICA', currency: 'USD', examCost: 1499 }], _count: { resources: 15 } },
  { id: 'static-7', slug: 'cism', name: 'CISM', fullName: 'Certified Information Security Manager', acronym: 'CISM', level: 'ADVANCED', category: 'GOVERNANCE_RISK', description: 'Gestão de segurança da informação. Governance, risk management e desenvolvimento de programas de segurança.', examDuration: 240, numberOfQuestions: 150, passingScore: 450, validityYears: 3, requiresRenewal: true, provider: { name: 'ISACA', slug: 'isaca' }, costs: [{ region: 'NORTH_AMERICA', currency: 'USD', examCost: 575 }], _count: { resources: 5 } },
  { id: 'static-9', slug: 'isc2-cc', name: 'CC', fullName: 'ISC2 Certified in Cybersecurity', acronym: 'CC', level: 'ENTRY', category: 'DEFENSIVE_SECURITY', description: 'Certificação entry-level da mesma organização do CISSP. Exame acessível (~$199), treinamento oficial GRATUITO. Para devs em transição, é a forma mais rápida de ter uma credencial (ISC)² no currículo.', examDuration: 120, numberOfQuestions: 100, passingScore: 700, validityYears: 3, requiresRenewal: true, provider: { name: '(ISC)²', slug: 'isc2' }, costs: [{ region: 'NORTH_AMERICA', currency: 'USD', examCost: 199 }], _count: { resources: 5 } },
  { id: 'static-10', slug: 'pnpt', name: 'PNPT', fullName: 'Practical Network Penetration Tester', acronym: 'PNPT', level: 'INTERMEDIATE', category: 'OFFENSIVE_SECURITY', description: 'Certificação 100% prática do TCM Security. Exame de 5 dias com relatório real. Muito mais respeitada tecnicamente que CEH. Ideal para devs em transição — o background de código é vantagem.', examDuration: 7200, numberOfQuestions: 0, passingScore: 70, validityYears: 0, requiresRenewal: false, provider: { name: 'TCM Security', slug: 'tcm-security' }, costs: [{ region: 'NORTH_AMERICA', currency: 'USD', examCost: 400 }], _count: { resources: 6 } },
  { id: 'static-11', slug: 'google-cybersecurity', name: 'Google Cyber', fullName: 'Google Cybersecurity Certificate', acronym: 'GCC', level: 'ENTRY', category: 'DEFENSIVE_SECURITY', description: 'Certificado do Google em parceria com o Coursera. 6 meses, ~$200 total. Reconhecido pelo Google e aceito como equivalente a experiência em muitas vagas entry. Excelente para o LinkedIn.', examDuration: 0, numberOfQuestions: 0, passingScore: 0, validityYears: 0, requiresRenewal: false, provider: { name: 'Google / Coursera', slug: 'google' }, costs: [{ region: 'NORTH_AMERICA', currency: 'USD', examCost: 200 }], _count: { resources: 4 } },
  { id: 'static-12', slug: 'htb-cpts', name: 'CPTS', fullName: 'HTB Certified Penetration Testing Specialist', acronym: 'CPTS', level: 'ADVANCED', category: 'OFFENSIVE_SECURITY', description: 'Certificação hands-on do HackTheBox lançada em 2023. Completamente prática, reconhecida pelo mercado técnico. Boa alternativa ao OSCP com preço mais acessível ($490).', examDuration: 10080, numberOfQuestions: 0, passingScore: 70, validityYears: 0, requiresRenewal: false, provider: { name: 'HackTheBox', slug: 'hackthebox' }, costs: [{ region: 'NORTH_AMERICA', currency: 'USD', examCost: 490 }], _count: { resources: 7 } },
  { id: 'static-13', slug: 'aws-security-specialty', name: 'AWS Security', fullName: 'AWS Certified Security - Specialty', acronym: 'AWS-SEC', level: 'ADVANCED', category: 'CLOUD_SECURITY', description: 'A certificação de cloud security mais pedida no mercado. 80% das vagas de Security Engineer envolvem cloud. Foco em IAM, encryption, logging e incident response na AWS.', examDuration: 170, numberOfQuestions: 65, passingScore: 750, validityYears: 3, requiresRenewal: true, provider: { name: 'Amazon Web Services', slug: 'aws' }, costs: [{ region: 'NORTH_AMERICA', currency: 'USD', examCost: 300 }], _count: { resources: 8 } },
  { id: 'static-8', slug: 'cissp', name: 'CISSP', fullName: 'Certified Information Systems Security Professional', acronym: 'CISSP', level: 'ADVANCED', category: 'GOVERNANCE_RISK', description: 'O padrão ouro em cybersecurity. Cobre todos os domínios desde risk management até criptografia e segurança de software.', examDuration: 360, numberOfQuestions: 125, passingScore: 700, validityYears: 3, requiresRenewal: true, provider: { name: '(ISC)²', slug: 'isc2' }, costs: [{ region: 'NORTH_AMERICA', currency: 'USD', examCost: 749 }], _count: { resources: 18 } },
];

// ── Card component ─────────────────────────────────────────────────────────
function CertCard({ cert }: { cert: Cert }) {
  const meta = LEVEL_META[cert.level] ?? LEVEL_META.ENTRY;
  const costStr = formatCost(cert.costs);
  const catColor = CATEGORIES.find(c => c.value === cert.category)?.color ?? '#8b5cf6';

  return (
    <Link href={`/certifications/${cert.slug}`} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
      <div style={{
        height: '100%', display: 'flex', flexDirection: 'column',
        background: 'var(--ds-card)', border: '1px solid var(--ds-card-border)',
        borderRadius: 14, padding: '20px', cursor: 'pointer',
        transition: 'all 200ms ease', position: 'relative', overflow: 'hidden',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = `${meta.color}40`;
        el.style.background = 'var(--ds-card)';
        el.style.transform = 'translateY(-2px)';
        el.style.boxShadow = `0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px ${meta.color}20`;
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = 'rgba(255,255,255,0.07)';
        el.style.background = 'var(--ds-card)';
        el.style.transform = 'translateY(0)';
        el.style.boxShadow = 'none';
      }}
      >
        {/* Top accent */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${meta.color}60, ${catColor}40, transparent)` }} />

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {/* Level badge */}
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              padding: '2px 9px', borderRadius: 5, fontSize: 10,
              fontFamily: '"JetBrains Mono", monospace', letterSpacing: '0.08em',
              color: meta.color, background: meta.bg, border: `1px solid ${meta.color}30`,
            }}>
              {meta.label}
            </span>
            {/* Name */}
            <div>
              <span style={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700, fontSize: 20, color: 'var(--ds-title-card, #f0eeff)' }}>
                {cert.acronym ?? cert.name}
              </span>
              {cert.acronym && (
                <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, color: 'var(--ds-body-dim)', marginTop: 1 }}>
                  {cert.provider.name}
                </div>
              )}
            </div>
          </div>
          {/* Cost */}
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700, fontSize: 16, color: meta.color }}>
              {costStr}
            </div>
            <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, color: 'var(--ds-mono-dim)', letterSpacing: '0.06em' }}>
              exam
            </div>
          </div>
        </div>

        {/* Description */}
        <p style={{ fontSize: 12, color: 'var(--ds-body-muted)', lineHeight: 1.65, flex: 1, marginBottom: 14, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {cert.description}
        </p>

        {/* Meta row */}
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 12 }}>
          {cert.examDuration && cert.examDuration > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Clock size={11} style={{ color: 'var(--ds-mono-dim)' }} />
              <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: 'var(--ds-body-dim)' }}>
                {cert.examDuration >= 1440 ? '24h prático' : `${cert.examDuration}min`}
              </span>
            </div>
          )}
          {cert.numberOfQuestions && cert.numberOfQuestions > 0 ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Award size={11} style={{ color: 'var(--ds-mono-dim)' }} />
              <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: 'var(--ds-body-dim)' }}>
                {cert.numberOfQuestions}q · {cert.passingScore}pts
              </span>
            </div>
          ) : null}
          {cert.validityYears && cert.validityYears > 0 ? (
            <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: 'var(--ds-body-dim)' }}>
              válido {cert.validityYears}a
            </span>
          ) : (
            <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: 'rgba(34,197,94,0.5)' }}>
              lifetime
            </span>
          )}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, color: `${catColor}80` }}>
              {CATEGORIES.find(c => c.value === cert.category)?.label?.replace(/^[^\s]+ /, '') ?? cert.category}
            </span>
            <ChevronRight size={11} style={{ color: `${meta.color}60` }} />
          </div>
        </div>
      </div>
    </Link>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────
function CertificationsPageInner() {
  const [certs, setCerts] = useState<Cert[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(() => searchParams.get('search') ?? '');
  const [level, setLevel] = useState('all');
  const [category, setCategory] = useState('all');

  useEffect(() => {
    fetch('/api/certifications?limit=50')
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        const data = d?.data ?? [];
        setCerts(data.length > 0 ? data : STATIC_CERTS);
      })
      .catch(() => setCerts(STATIC_CERTS))
      .finally(() => setLoading(false));
  }, []);

  // Filter + sort ENTRY → INTERMEDIATE → ADVANCED → EXPERT
  const filtered = certs
    .filter(c => {
      if (level !== 'all' && c.level !== level) return false;
      if (category !== 'all' && c.category !== category) return false;
      if (search) {
        const q = search.toLowerCase();
        return c.name.toLowerCase().includes(q) ||
          (c.fullName ?? '').toLowerCase().includes(q) ||
          (c.acronym ?? '').toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.provider.name.toLowerCase().includes(q);
      }
      return true;
    })
    .sort((a, b) => LEVEL_ORDER.indexOf(a.level) - LEVEL_ORDER.indexOf(b.level));

  const counts = LEVELS.slice(1).reduce((acc, l) => {
    acc[l.value] = certs.filter(c => c.level === l.value).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--p-bg, #0b0f14)', color: 'var(--ds-title-section, #e6eef8)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(20px, 4vw, 40px) clamp(16px, 4vw, 24px)' }}>

        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: 'rgba(139,92,246,0.6)', letterSpacing: '0.14em', marginBottom: 8 }}>
            CAREERS / CERTIFICAÇÕES
          </div>
          <h1 style={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700, fontSize: 32, marginBottom: 8, color: 'var(--ds-title-card, #f0eeff)' }}>
            Certificações de Cybersecurity
          </h1>
          <p style={{ fontSize: 14, color: 'var(--ds-body-muted)', maxWidth: 560 }}>
            Guia completo de certificações — do iniciante ao expert. Dados de exames, custos e reconhecimento de mercado.
          </p>
        </div>

        {/* Level pills — quick filter */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
          {LEVELS.map(l => {
            const active = level === l.value;
            const meta = l.value !== 'all' ? LEVEL_META[l.value] : null;
            return (
              <button key={l.value} onClick={() => setLevel(l.value)} style={{
                padding: '7px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
                fontFamily: '"Space Grotesk", sans-serif', fontSize: 12, fontWeight: 600,
                letterSpacing: '0.04em', transition: 'all 150ms',
                background: active ? (meta?.bg ?? 'rgba(139,92,246,0.15)') : 'rgba(255,255,255,0.04)',
                color: active ? (meta?.color ?? '#a78bfa') : 'rgba(155,176,198,0.5)',
                boxShadow: active ? `0 0 0 1px ${meta?.color ?? '#a78bfa'}40` : 'none',
              }}>
                {l.label}
                {l.value !== 'all' && counts[l.value] > 0 && (
                  <span style={{ marginLeft: 6, fontSize: 10, opacity: 0.7 }}>({counts[l.value]})</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Search + category filter */}
        <div className="cert-filters" style={{ display: 'flex', gap: 12, marginBottom: 32, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(139,92,246,0.5)', pointerEvents: 'none' }} />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Buscar por nome, provider, descrição..."
              style={{
                width: '100%', padding: '10px 36px 10px 36px', borderRadius: 10,
                background: 'rgba(15,10,35,0.8)', border: '1px solid rgba(139,92,246,0.2)',
                color: 'var(--ds-title-section, #e6eef8)', fontSize: 13, fontFamily: '"Inter", sans-serif', outline: 'none',
              }}
            />
            {search && (
              <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ds-body-dim)', fontSize: 16, padding: 2 }}>×</button>
            )}
          </div>
          <select
            value={category} onChange={e => setCategory(e.target.value)}
            style={{
              padding: '10px 14px', borderRadius: 10,
              background: 'rgba(15,10,35,0.8)', border: '1px solid rgba(139,92,246,0.2)',
              color: category === 'all' ? 'rgba(155,176,198,0.5)' : '#e6eef8',
              fontSize: 13, fontFamily: '"Inter", sans-serif', outline: 'none', minWidth: 200,
            }}
          >
            {CATEGORIES.map(c => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
          {(search || level !== 'all' || category !== 'all') && (
            <button onClick={() => { setSearch(''); setLevel('all'); setCategory('all'); }} style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '10px 14px', borderRadius: 10,
              background: 'rgba(229,62,62,0.1)', border: '1px solid rgba(229,62,62,0.2)',
              color: 'var(--ds-danger)', cursor: 'pointer', fontSize: 12,
            }}>
              <X size={12} /> Limpar
            </button>
          )}
        </div>

        {/* Results count */}
        {!loading && (
          <div style={{ marginBottom: 20, fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: 'var(--ds-body-dim)' }}>
            {filtered.length} certificaç{filtered.length === 1 ? 'ão' : 'ões'}
            {(search || level !== 'all' || category !== 'all') ? ' encontradas' : ' no catálogo'}
          </div>
        )}

        {/* Grid — grouped by level */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(300px, 100%), 1fr))', gap: 16 }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} style={{ height: 240, borderRadius: 14, background: 'rgba(255,255,255,0.03)', animation: 'pulse 1.5s ease-in-out infinite' }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 24px' }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>🔍</div>
            <p style={{ color: 'var(--ds-body-dim)', fontSize: 14 }}>Nenhuma certificação encontrada</p>
          </div>
        ) : (
          /* Group by level */
          LEVEL_ORDER.map(lvl => {
            const group = filtered.filter(c => c.level === lvl);
            if (group.length === 0) return null;
            const meta = LEVEL_META[lvl];
            return (
              <div key={lvl} style={{ marginBottom: 40 }}>
                {/* Level section header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: meta.color, boxShadow: `0 0 8px ${meta.color}` }} />
                  <span style={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700, fontSize: 15, color: meta.color }}>
                    {meta.label}
                  </span>
                  <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, color: 'var(--ds-body-dim)' }}>
                    — {meta.desc}
                  </span>
                  <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${meta.color}30, transparent)` }} />
                  <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: `${meta.color}60` }}>{group.length}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(300px, 100%), 1fr))', gap: 16 }}>
                  {group.map(cert => <CertCard key={cert.id} cert={cert} />)}
                </div>
              </div>
            );
          })
        )}
      </div>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:0.4} 50%{opacity:0.7} }
      `}</style>
    </div>
  );
}

export default function CertificationsPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: 'var(--p-bg, #0b0f14)' }} />}>
      <CertificationsPageInner />
    </Suspense>
  );
}
