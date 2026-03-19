'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Clock, DollarSign, Target, BookOpen, CheckCircle, ArrowRight, Layers } from 'lucide-react';

// ── Career paths data ──────────────────────────────────────────────────────
const CAREER_PATHS = {
  beginner: {
    id: 'beginner',
    label: 'Beginner',
    color: '#22c55e',
    rgb: '34,197,94',
    desc: 'Sem experiência em security · 0–12 meses',
    icon: '🌱',
    goal: 'Primeira certificação + emprego entry-level',
    totalHours: '180–240h',
    totalCost: '$370–$600',
    steps: [
      {
        order: 1, name: 'CompTIA Security+', acronym: 'SEC+', slug: 'comptia-security-plus',
        provider: 'CompTIA', level: 'ENTRY', color: '#22c55e',
        hours: '80–120h', cost: '$392', duration: '2–3 meses',
        why: 'Certificação baseline mais reconhecida mundialmente. Exigida pelo DoD dos EUA. Abre portas para qualquer role entry-level em security.',
        topics: ['Threats & Attacks', 'Network Security', 'Cryptography', 'Identity Management', 'Risk Management'],
        resources: [
          { name: 'Professor Messer SY0-701', type: 'Vídeo Gratuito', url: 'https://www.professormesser.com/security-plus/sy0-701/sy0-701-video/', free: true },
          { name: 'CompTIA CertMaster Learn', type: 'Curso Oficial', url: 'https://www.comptia.org/training/certmaster-learn/security', free: false },
          { name: 'Jason Dion Practice Exams (Udemy)', type: 'Simulado', url: 'https://www.udemy.com/user/jasonrobertdion/', free: false },
        ],
        outcome: 'Analyst / SOC Tier 1 / IT Security Specialist',
      },
      {
        order: 2, name: 'eJPT', acronym: 'eJPT', slug: 'ejpt',
        provider: 'INE Security', level: 'ENTRY', color: '#22c55e',
        hours: '60–80h', cost: '$200', duration: '1–2 meses',
        why: 'Certificação prática de pentest para quem quer explorar o lado ofensivo. Exame 100% labs — sem questões de múltipla escolha.',
        topics: ['Networking Fundamentals', 'Web App Testing', 'Host Discovery', 'Exploitation Basics', 'Reporting'],
        resources: [
          { name: 'INE Starter Pass', type: 'Plataforma', url: 'https://ine.com/pages/cybersecurity', free: false },
          { name: 'TryHackMe — Pre-Security Path', type: 'Gratuito/Freemium', url: 'https://tryhackme.com/path/outline/presecurity', free: true },
          { name: 'HackTheBox Starting Point', type: 'Gratuito', url: 'https://www.hackthebox.com/starting-point', free: true },
        ],
        outcome: 'Junior Penetration Tester / Security Researcher',
      },
    ],
  },

  intermediate: {
    id: 'intermediate',
    label: 'Intermediate',
    color: '#3b82f6',
    rgb: '59,130,246',
    desc: '1–3 anos de experiência · SEC+ concluída',
    icon: '⚡',
    goal: 'Especialização + roles mais técnicos',
    totalHours: '300–500h',
    totalCost: '$1.000–$2.500',
    steps: [
      {
        order: 1, name: 'CompTIA CySA+', acronym: 'CySA+', slug: 'comptia-cysa-plus',
        provider: 'CompTIA', level: 'INTERMEDIATE', color: '#3b82f6',
        hours: '80–100h', cost: '$392', duration: '2–3 meses',
        why: 'Evolução natural da Security+. Foca em análise de ameaças, threat hunting e resposta a incidentes. Muito valorizado em SOC e Blue Team.',
        topics: ['Threat Intelligence', 'Vulnerability Management', 'Log Analysis', 'Incident Response', 'SIEM Operations'],
        resources: [
          { name: 'Jason Dion CySA+ Course (Udemy)', type: 'Curso', url: 'https://www.udemy.com/user/jasonrobertdion/', free: false },
          { name: 'Professor Messer CySA+', type: 'Vídeo', url: 'https://www.professormesser.com', free: true },
          { name: 'TryHackMe SOC Level 1', type: 'Lab', url: 'https://tryhackme.com/path/outline/soclevel1', free: false },
        ],
        outcome: 'SOC Analyst Tier 2 / Threat Hunter / IR Analyst',
      },
      {
        order: 2, name: 'CEH', acronym: 'CEH', slug: 'ceh-certified-ethical-hacker',
        provider: 'EC-Council', level: 'INTERMEDIATE', color: '#3b82f6',
        hours: '120–160h', cost: '$1.199', duration: '3–4 meses',
        why: 'Referência global em ethical hacking. Cobre as 20 disciplinas do hacking desde recon até análise de malware. Reconhecido por Fortune 500.',
        topics: ['Footprinting & Recon', 'Scanning', 'Exploitation', 'Malware Analysis', 'Social Engineering', 'Web App Hacking', 'SQL Injection'],
        resources: [
          { name: 'EC-Council Official Courseware', type: 'Oficial', url: 'https://www.eccouncil.org', free: false },
          { name: 'Zaid Sabih — CEH v12 (Udemy)', type: 'Curso', url: 'https://www.udemy.com', free: false },
          { name: 'OWASP Testing Guide', type: 'Gratuito', url: 'https://owasp.org/www-project-web-security-testing-guide/', free: true },
        ],
        outcome: 'Penetration Tester / Red Team Analyst / Security Consultant',
      },
      {
        order: 3, name: 'GPEN', acronym: 'GPEN', slug: 'gpen',
        provider: 'SANS / GIAC', level: 'INTERMEDIATE', color: '#3b82f6',
        hours: '120–140h', cost: '$979', duration: '3–4 meses',
        why: 'GIAC é uma das organizações mais respeitadas do setor. GPEN valida metodologia real de pentest com foco em Active Directory e ambientes corporativos.',
        topics: ['Pen Testing Methodology', 'Password Attacks', 'Reconnaissance', 'Web App Exploitation', 'Post-Exploitation', 'Active Directory Attacks'],
        resources: [
          { name: 'SANS SEC560: Enterprise Pen Testing', type: 'Oficial (caro)', url: 'https://www.sans.org/cyber-security-courses/network-penetration-testing-ethical-hacking/', free: false },
          { name: 'TCM Security PEH Course', type: 'Alternativa acessível', url: 'https://academy.tcm-sec.com', free: false },
          { name: 'HackTheBox Pro Labs', type: 'Lab', url: 'https://www.hackthebox.com/hacker/pro-labs', free: false },
        ],
        outcome: 'Senior Penetration Tester / Red Team Operator',
      },
    ],
  },

  'dev-security': {
    id: 'dev-security',
    label: 'Dev → Security',
    color: '#06b6d4',
    rgb: '6,182,212',
    desc: 'Dev com experiência · Transição de carreira',
    icon: '🔀',
    goal: 'Aproveitar background dev para entrar em security mais rápido',
    totalHours: '200–320h',
    totalCost: '$400–$1.200',
    steps: [
      {
        order: 1, name: 'ISC2 CC', acronym: 'CC', slug: 'isc2-cc',
        provider: '(ISC)²', level: 'ENTRY', color: '#06b6d4',
        hours: '40–60h', cost: 'GRÁTIS*', duration: '1–2 meses',
        why: 'Certificação gratuita da mesma organização do CISSP. Peso de marca enorme para iniciante. O exame foi gratuito até 2024 e ainda é muito acessível (~$200). Para um dev em transição, é a forma mais rápida de ter uma credencial reconhecida de security no currículo.',
        topics: ['Security Principles', 'Network Security', 'Access Controls', 'Security Operations', 'Incident Response'],
        resources: [
          { name: 'ISC2 CC Self-Paced Training (GRATUITO)', type: 'Curso Oficial', url: 'https://www.isc2.org/certifications/cc', free: true },
          { name: 'Thor Teaches — CC Prep (YouTube)', type: 'Vídeo Gratuito', url: 'https://www.youtube.com/@ThorTeaches', free: true },
          { name: 'ISC2 Official Practice Exams', type: 'Simulado', url: 'https://www.isc2.org/certifications/cc', free: false },
        ],
        outcome: 'Credencial de segurança imediata no LinkedIn · Base para CISSP no futuro',
      },
      {
        order: 2, name: 'Security+', acronym: 'SEC+', slug: 'comptia-security-plus',
        provider: 'CompTIA', level: 'ENTRY', color: '#06b6d4',
        hours: '80–100h', cost: '$392', duration: '2–3 meses',
        why: 'Pré-requisito implícito de 60% das vagas. Seu background de dev acelera muito — você já entende criptografia, redes e APIs. Foca no que é novo: threat modeling, compliance, IR.',
        topics: ['Threats & Attacks', 'Network Security', 'Cryptography', 'Identity Management', 'Risk Management'],
        resources: [
          { name: 'Professor Messer SY0-701 (GRATUITO)', type: 'Vídeo', url: 'https://www.professormesser.com/security-plus/sy0-701/sy0-701-video/', free: true },
          { name: 'Jason Dion Practice Exams (Udemy)', type: 'Simulado', url: 'https://www.udemy.com/user/jasonrobertdion/', free: false },
          { name: 'Darril Gibson SEC+ Book', type: 'Livro', url: 'https://www.amazon.com/CompTIA-Security-Get-Certified-Ahead/dp/1939136059', free: false },
        ],
        outcome: 'Base obrigatória · Abre vagas de Security Analyst / SOC',
      },
      {
        order: 3, name: 'Splunk Core Certified User', acronym: 'Splunk', slug: 'splunk-core',
        provider: 'Splunk', level: 'ENTRY', color: '#06b6d4',
        hours: '20–30h', cost: 'GRÁTIS', duration: '3–4 semanas',
        why: 'SIEM mais usado no mercado. Treinamento oficial gratuito no Splunk Training Portal. Colocar no currículo diferencia muito em vagas de SOC Analyst e Security Engineer. Seu background dev facilita — é basicamente query de logs.',
        topics: ['Splunk Interface', 'Search Processing Language (SPL)', 'Reports & Dashboards', 'Log Analysis', 'Alerts'],
        resources: [
          { name: 'Splunk Free Training (GRATUITO)', type: 'Curso Oficial', url: 'https://www.splunk.com/en_us/training/free-courses/splunk-fundamentals-1.html', free: true },
          { name: 'Boss of the SOC (CTF)', type: 'Lab Gratuito', url: 'https://bots.splunk.com/', free: true },
          { name: 'TryHackMe — Splunk rooms', type: 'Lab', url: 'https://tryhackme.com', free: false },
        ],
        outcome: 'Diferencial imediato em SOC · Base para blue team analytics',
      },
      {
        order: 4, name: 'PNPT', acronym: 'PNPT', slug: 'pnpt',
        provider: 'TCM Security', level: 'INTERMEDIATE', color: '#06b6d4',
        hours: '80–120h', cost: '$400', duration: '2–3 meses',
        why: 'Certificação 100% prática criada pelo TCM Security. Exame de 5 dias com relatório real de pentest. Muito mais respeitada tecnicamente que CEH. Recrutadores americanos já reconhecem. Seu background dev é uma enorme vantagem — você entende código, APIs e lógica de aplicação.',
        topics: ['Practical Ethical Hacking', 'Active Directory Attacks', 'Web App Pentesting', 'Report Writing', 'OSINT'],
        resources: [
          { name: 'TCM Security Academy — PEH Course', type: 'Curso', url: 'https://academy.tcm-sec.com/p/practical-ethical-hacking-the-complete-course', free: false },
          { name: 'TryHackMe Jr Pen Tester Path', type: 'Lab', url: 'https://tryhackme.com/path/outline/jrpenetrationtester', free: false },
          { name: 'HackTheBox Starting Point', type: 'Gratuito', url: 'https://www.hackthebox.com/starting-point', free: true },
        ],
        outcome: 'Junior Penetration Tester · Red Team Analyst · AppSec Engineer',
      },
    ],
  },

  advanced: {
    id: 'advanced',
    label: 'Advanced',
    color: '#f59e0b',
    rgb: '245,158,11',
    desc: '3–6 anos de experiência · múltiplas certs',
    icon: '🔥',
    goal: 'Credencial elite + liderança técnica',
    totalHours: '500–800h',
    totalCost: '$2.000–$6.000',
    steps: [
      {
        order: 1, name: 'OSCP', acronym: 'OSCP', slug: 'oscp',
        provider: 'Offensive Security', level: 'ADVANCED', color: '#f59e0b',
        hours: '300–500h', cost: '$1.499', duration: '3–6 meses',
        why: 'A certificação ofensiva mais respeitada do mercado. Exame prático de 24h em rede isolada. "Try Harder" é o mantra. Diferencia candidatos seriamente.',
        topics: ['Buffer Overflows', 'Active Directory Attacks', 'Web App Exploitation', 'Post-Exploitation', 'Pivoting & Tunneling', 'Privilege Escalation'],
        resources: [
          { name: 'OffSec PEN-200 (PWK)', type: 'Oficial', url: 'https://www.offensive-security.com/pwk-oscp/', free: false },
          { name: 'TJ Null OSCP Prep List', type: 'Gratuito — HTB/PG boxes', url: 'https://docs.google.com/spreadsheets/d/1dwSMIAPIam0PuRBkCiDI88pU3yzrqqHkDtBngUHNCw8', free: true },
          { name: 'ippsec YouTube', type: 'Gratuito — walkthroughs', url: 'https://www.youtube.com/@ippsec', free: true },
        ],
        outcome: 'Senior Pen Tester / Red Team Lead / Security Researcher',
      },
      {
        order: 2, name: 'CISSP', acronym: 'CISSP', slug: 'cissp',
        provider: '(ISC)²', level: 'ADVANCED', color: '#f59e0b',
        hours: '200–300h', cost: '$749', duration: '4–6 meses',
        why: 'O padrão ouro para liderança em security. Cobre 8 domínios completos. Exigido para roles de CISO, Security Architect e posições sênior em grandes empresas.',
        topics: ['Security & Risk Management', 'Asset Security', 'Security Architecture', 'Network Security', 'IAM', 'Security Assessment', 'Security Operations', 'Software Security'],
        resources: [
          { name: 'Destination Certification MindMap', type: 'Gratuito', url: 'https://www.destinationcertification.com', free: true },
          { name: 'Official ISC2 CISSP CBK', type: 'Livro Oficial', url: 'https://www.isc2.org/Training/Self-Study-Resources', free: false },
          { name: 'Larry Greenblatt CISSP (Udemy)', type: 'Curso', url: 'https://www.udemy.com', free: false },
        ],
        outcome: 'CISO / Security Architect / Security Director',
      },
      {
        order: 3, name: 'CISM', acronym: 'CISM', slug: 'cism',
        provider: 'ISACA', level: 'ADVANCED', color: '#f59e0b',
        hours: '150–200h', cost: '$575', duration: '3–4 meses',
        why: 'Complemento ao CISSP com foco em gestão. Muito valorizado em empresas europeias e em roles que combinam técnica com negócio.',
        topics: ['IS Governance', 'Risk Management', 'Security Program Development & Management', 'Incident Management'],
        resources: [
          { name: 'ISACA CISM Review Manual', type: 'Oficial', url: 'https://www.isaca.org/credentialing/cism/cism-exam-resources', free: false },
          { name: 'Hemang Doshi CISM (Udemy)', type: 'Curso', url: 'https://www.udemy.com', free: false },
          { name: 'ISACA Community Questions', type: 'Gratuito parcial', url: 'https://www.isaca.org', free: true },
        ],
        outcome: 'IS Manager / Risk Manager / GRC Lead',
      },
    ],
  },
};

const CERT_LEVELS = [
  { id: 'ENTRY',        label: 'Entry',        color: '#22c55e' },
  { id: 'INTERMEDIATE', label: 'Intermediate', color: '#3b82f6' },
  { id: 'ADVANCED',     label: 'Advanced',     color: '#f59e0b' },
  { id: 'EXPERT',       label: 'Expert',       color: '#ef4444' },
];

const ALL_CERTS = [
  { name: 'Security+',  acronym: 'SEC+',  level: 'ENTRY',        category: 'DEFENSIVE_SECURITY',  slug: 'comptia-security-plus', provider: 'CompTIA',          cost: '$392',   hours: '80–120h' },
  { name: 'eJPT',       acronym: 'eJPT',  level: 'ENTRY',        category: 'OFFENSIVE_SECURITY',  slug: 'ejpt',                  provider: 'INE Security',     cost: '$200',   hours: '60–80h'  },
  { name: 'CySA+',      acronym: 'CySA+', level: 'INTERMEDIATE', category: 'DEFENSIVE_SECURITY',  slug: 'comptia-cysa-plus',     provider: 'CompTIA',          cost: '$392',   hours: '80–100h' },
  { name: 'CEH',        acronym: 'CEH',   level: 'INTERMEDIATE', category: 'OFFENSIVE_SECURITY',  slug: 'ceh-certified-ethical-hacker', provider: 'EC-Council', cost: '$1.199', hours: '120–160h' },
  { name: 'GPEN',       acronym: 'GPEN',  level: 'INTERMEDIATE', category: 'OFFENSIVE_SECURITY',  slug: 'gpen',                  provider: 'SANS/GIAC',        cost: '$979',   hours: '120–140h' },
  { name: 'OSCP',       acronym: 'OSCP',  level: 'ADVANCED',     category: 'OFFENSIVE_SECURITY',  slug: 'oscp',                  provider: 'Offensive Sec',    cost: '$1.499', hours: '300–500h' },
  { name: 'CISSP',      acronym: 'CISSP', level: 'ADVANCED',     category: 'GOVERNANCE_RISK',      slug: 'cissp',                 provider: '(ISC)²',           cost: '$749',   hours: '200–300h' },
  { name: 'CISM',       acronym: 'CISM',  level: 'ADVANCED',     category: 'GOVERNANCE_RISK',      slug: 'cism',                  provider: 'ISACA',            cost: '$575',   hours: '150–200h' },
];

type PathId = keyof typeof CAREER_PATHS;

export default function RoadmapPage() {
  const [activeTab, setActiveTab] = useState<'paths' | 'all'>('paths');
  const [activePath, setActivePath] = useState<PathId>('dev-security');
  const [openStep, setOpenStep] = useState<number | null>(0);
  const [allLevel, setAllLevel] = useState('ENTRY');

  const path = CAREER_PATHS[activePath];
  const filteredAll = ALL_CERTS.filter(c => c.level === allLevel);

  const S = {
    card: { background: 'rgba(12,8,28,0.8)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12 },
    mono: { fontFamily: '"JetBrains Mono", monospace' },
    grotesk: { fontFamily: '"Space Grotesk", sans-serif' },
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0b0f14', color: '#e6eef8', fontFamily: '"Inter", sans-serif' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: 'clamp(20px, 4vw, 40px) clamp(16px, 4vw, 24px)' }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ ...S.mono, fontSize: 10, color: 'rgba(139,92,246,0.6)', letterSpacing: '0.14em', marginBottom: 8 }}>
            CAREERS / ROADMAP
          </div>
          <h1 style={{ ...S.grotesk, fontWeight: 700, fontSize: 30, color: '#f0eeff', marginBottom: 6 }}>
            Certification Roadmap
          </h1>
          <p style={{ fontSize: 13, color: 'rgba(155,176,198,0.55)', maxWidth: 540 }}>
            Planos de carreira baseados no mercado real — do iniciante ao especialista. Cada passo tem recursos, custos e horas estimadas.
          </p>
        </div>

        {/* Tab switcher */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
          {[
            { id: 'paths', label: 'Career Paths' },
            { id: 'all',   label: 'All Certifications' },
          ].map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id as any)} style={{
              padding: '8px 20px', borderRadius: 8, border: 'none', cursor: 'pointer',
              ...S.grotesk, fontSize: 13, fontWeight: 600, transition: 'all 150ms',
              background: activeTab === t.id ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.04)',
              color: activeTab === t.id ? '#a78bfa' : 'rgba(155,176,198,0.5)',
              boxShadow: activeTab === t.id ? '0 0 0 1px rgba(139,92,246,0.3)' : 'none',
            }}>{t.label}</button>
          ))}
        </div>

        {/* ── CAREER PATHS TAB ── */}
        {activeTab === 'paths' && (
          <div className="roadmap-grid" style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 24, alignItems: 'start' }}>

            {/* Left: path selector */}
            <div className="roadmap-selector" style={{ display: 'flex', flexDirection: 'column', gap: 10, position: 'sticky', top: 24 }}>
              {(Object.values(CAREER_PATHS) as typeof path[]).map(p => (
                <button key={p.id} onClick={() => { setActivePath(p.id as PathId); setOpenStep(0); }} style={{
                  padding: '14px 16px', borderRadius: 10, border: `1px solid ${activePath === p.id ? p.color + '50' : 'rgba(255,255,255,0.07)'}`,
                  background: activePath === p.id ? `rgba(${p.rgb},0.1)` : 'rgba(12,8,28,0.6)',
                  cursor: 'pointer', textAlign: 'left', transition: 'all 150ms',
                  boxShadow: activePath === p.id ? `0 0 20px rgba(${p.rgb},0.15)` : 'none',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 16 }}>{p.icon}</span>
                    <span style={{ ...S.grotesk, fontWeight: 700, fontSize: 14, color: activePath === p.id ? p.color : '#e6eef8' }}>{p.label}</span>
                  </div>
                  <div style={{ ...S.mono, fontSize: 9, color: 'rgba(155,176,198,0.45)', letterSpacing: '0.04em', lineHeight: 1.5 }}>{p.desc}</div>
                  <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                    <span style={{ ...S.mono, fontSize: 9, color: `${p.color}80` }}>{p.totalHours}</span>
                    <span style={{ ...S.mono, fontSize: 9, color: `${p.color}80` }}>{p.totalCost}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Right: steps */}
            <div>
              <div style={{ ...S.card, padding: '16px 20px', marginBottom: 16, borderColor: `${path.color}25`, background: `rgba(${path.rgb},0.05)` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 24 }}>{path.icon}</span>
                  <div>
                    <div style={{ ...S.grotesk, fontWeight: 700, fontSize: 16, color: path.color }}>{path.label} Path</div>
                    <div style={{ fontSize: 12, color: 'rgba(155,176,198,0.55)', marginTop: 2 }}>{path.goal}</div>
                  </div>
                  <div style={{ marginLeft: 'auto', display: 'flex', gap: 16 }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ ...S.mono, fontSize: 11, color: path.color }}>{path.totalHours}</div>
                      <div style={{ ...S.mono, fontSize: 9, color: 'rgba(155,176,198,0.35)' }}>total horas</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ ...S.mono, fontSize: 11, color: path.color }}>{path.totalCost}</div>
                      <div style={{ ...S.mono, fontSize: 9, color: 'rgba(155,176,198,0.35)' }}>total custo</div>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {path.steps.map((step, i) => {
                  const isOpen = openStep === i;
                  return (
                    <div key={step.order} style={{ ...S.card, overflow: 'hidden', borderColor: isOpen ? `${step.color}35` : 'rgba(255,255,255,0.07)', transition: 'border-color 200ms' }}>
                      {/* Step header — always visible */}
                      <button onClick={() => setOpenStep(isOpen ? null : i)} style={{
                        width: '100%', padding: '16px 20px', background: 'none', border: 'none',
                        cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 14,
                      }}>
                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: `rgba(${path.rgb},0.15)`, border: `1.5px solid ${step.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <span style={{ ...S.mono, fontSize: 11, color: step.color, fontWeight: 700 }}>{step.order}</span>
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <span style={{ ...S.grotesk, fontWeight: 700, fontSize: 15, color: '#f0eeff' }}>{step.acronym}</span>
                            <span style={{ fontSize: 12, color: 'rgba(155,176,198,0.5)' }}>{step.name}</span>
                            <span style={{ ...S.mono, fontSize: 9, color: 'rgba(155,176,198,0.35)' }}>by {step.provider}</span>
                          </div>
                        </div>
                        <div className="step-header-meta" style={{ display: 'flex', gap: 16, alignItems: 'center', flexShrink: 0 }}>
                          <span style={{ ...S.mono, fontSize: 11, color: step.color }}>{step.cost}</span>
                          <span style={{ ...S.mono, fontSize: 11, color: 'rgba(155,176,198,0.4)' }}>{step.hours}</span>
                          <span style={{ ...S.mono, fontSize: 11, color: 'rgba(155,176,198,0.4)' }}>{step.duration}</span>
                          <ChevronRight size={14} style={{ color: 'rgba(155,176,198,0.3)', transform: isOpen ? 'rotate(90deg)' : 'none', transition: 'transform 200ms' }} />
                        </div>
                      </button>

                      {/* Expanded content */}
                      <div style={{ maxHeight: isOpen ? '800px' : '0', overflow: 'hidden', transition: 'max-height 350ms cubic-bezier(0.4,0,0.2,1)' }}>
                        <div style={{ padding: '0 20px 20px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                          <p style={{ fontSize: 13, color: 'rgba(220,215,240,0.7)', lineHeight: 1.65, margin: '14px 0 16px' }}>{step.why}</p>

                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                            {/* Topics */}
                            <div>
                              <div style={{ ...S.mono, fontSize: 9, color: `${step.color}70`, letterSpacing: '0.1em', marginBottom: 8 }}>TÓPICOS COBERTOS</div>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                {step.topics.map(t => (
                                  <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <div style={{ width: 4, height: 4, borderRadius: '50%', background: step.color, flexShrink: 0 }} />
                                    <span style={{ fontSize: 12, color: 'rgba(155,176,198,0.65)' }}>{t}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            {/* Resources */}
                            <div>
                              <div style={{ ...S.mono, fontSize: 9, color: `${step.color}70`, letterSpacing: '0.1em', marginBottom: 8 }}>RECURSOS RECOMENDADOS</div>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {step.resources.map(r => (
                                  <a key={r.name} href={r.url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'flex-start', gap: 8, textDecoration: 'none' }}>
                                    <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 3, background: r.free ? 'rgba(34,197,94,0.1)' : 'rgba(245,158,11,0.1)', color: r.free ? '#22c55e' : '#f59e0b', ...S.mono, flexShrink: 0, marginTop: 1 }}>
                                      {r.free ? 'FREE' : 'PAGO'}
                                    </span>
                                    <div>
                                      <div style={{ fontSize: 12, color: '#e6eef8' }}>{r.name}</div>
                                      <div style={{ ...S.mono, fontSize: 9, color: 'rgba(155,176,198,0.4)' }}>{r.type}</div>
                                    </div>
                                  </a>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Outcome + CTA */}
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: 8, background: `rgba(${path.rgb},0.06)`, border: `1px solid rgba(${path.rgb},0.15)` }}>
                            <div>
                              <div style={{ ...S.mono, fontSize: 9, color: `${step.color}70`, marginBottom: 4 }}>ABRE PORTAS PARA</div>
                              <div style={{ fontSize: 12, color: 'rgba(220,215,240,0.8)' }}>{step.outcome}</div>
                            </div>
                            <Link href={`/certifications/${step.slug}`} style={{
                              display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 7,
                              background: `rgba(${path.rgb},0.15)`, border: `1px solid rgba(${path.rgb},0.3)`,
                              color: step.color, textDecoration: 'none', fontSize: 12, ...S.grotesk, fontWeight: 600,
                            }}>
                              Ver detalhes <ArrowRight size={12} />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── ALL CERTIFICATIONS TAB ── */}
        {activeTab === 'all' && (
          <div>
            {/* Level filter */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
              {CERT_LEVELS.map(l => (
                <button key={l.id} onClick={() => setAllLevel(l.id)} style={{
                  padding: '8px 18px', borderRadius: 8, border: 'none', cursor: 'pointer',
                  ...S.grotesk, fontSize: 12, fontWeight: 600, transition: 'all 150ms',
                  background: allLevel === l.id ? `rgba(${l.color.replace('#','')},0.15)` : 'rgba(255,255,255,0.04)',
                  color: allLevel === l.id ? l.color : 'rgba(155,176,198,0.5)',
                  boxShadow: allLevel === l.id ? `0 0 0 1px ${l.color}40` : 'none',
                }}>{l.label}</button>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
              {filteredAll.map(cert => {
                const lvlColor = CERT_LEVELS.find(l => l.id === cert.level)?.color ?? '#8b5cf6';
                return (
                  <Link key={cert.slug} href={`/certifications/${cert.slug}`} style={{ textDecoration: 'none' }}>
                    <div style={{
                      ...S.card, padding: '18px', cursor: 'pointer', transition: 'all 200ms', position: 'relative', overflow: 'hidden',
                    }}
                    onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = lvlColor + '40'; el.style.transform = 'translateY(-2px)'; }}
                    onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(255,255,255,0.07)'; el.style.transform = 'none'; }}
                    >
                      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${lvlColor}60,transparent)` }} />
                      <div style={{ ...S.grotesk, fontWeight: 700, fontSize: 22, color: '#f0eeff', marginBottom: 2 }}>{cert.acronym}</div>
                      <div style={{ fontSize: 12, color: 'rgba(155,176,198,0.5)', marginBottom: 10 }}>{cert.provider}</div>
                      <div style={{ display: 'flex', gap: 12 }}>
                        <span style={{ ...S.mono, fontSize: 11, color: lvlColor }}>{cert.cost}</span>
                        <span style={{ ...S.mono, fontSize: 11, color: 'rgba(155,176,198,0.4)' }}>{cert.hours}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
