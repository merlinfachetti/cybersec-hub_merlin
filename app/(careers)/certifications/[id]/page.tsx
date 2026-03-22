'use client';

import { use, useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Clock, Award, DollarSign, CheckCircle, ChevronRight } from 'lucide-react';

// Dados estáticos completos para fallback
const CERT_DATA: Record<string, {
  name: string; fullName: string; acronym: string; provider: string;
  level: string; category: string; description: string;
  examDuration: number; numberOfQuestions: number; passingScore: number;
  validityYears: number; requiresRenewal: boolean;
  costs: { region: string; currency: string; examCost: number }[];
  objectives: string[]; topics: string[];
  officialUrl: string;
  resources: { name: string; url: string; free: boolean; type: string }[];
}> = {
  'comptia-security-plus': {
    name: 'Security+', fullName: 'CompTIA Security+ SY0-701', acronym: 'SEC+',
    provider: 'CompTIA', level: 'ENTRY', category: 'DEFENSIVE_SECURITY',
    description: 'Certificação baseline mais reconhecida mundialmente. Exigida pelo DoD dos EUA. Cobre ameaças, criptografia, identidade, redes e gestão de risco. Pré-requisito silencioso para 60% das vagas entry-level em security.',
    examDuration: 90, numberOfQuestions: 90, passingScore: 750, validityYears: 3, requiresRenewal: true,
    costs: [{ region: 'US', currency: 'USD', examCost: 392 }, { region: 'DE', currency: 'EUR', examCost: 370 }],
    objectives: ['Avaliar a postura de segurança de ambientes enterprise', 'Implementar soluções de segurança apropriadas', 'Monitorar e proteger ambientes híbridos', 'Identificar, analisar e responder a incidentes'],
    topics: ['Threats, Attacks & Vulnerabilities', 'Architecture & Design', 'Implementation', 'Operations & Incident Response', 'Governance, Risk & Compliance'],
    officialUrl: 'https://www.comptia.org/certifications/security',
    resources: [
      { name: 'Professor Messer SY0-701', url: 'https://www.professormesser.com/security-plus/sy0-701/sy0-701-video/', free: true, type: 'Vídeo' },
      { name: 'Jason Dion Practice Exams (Udemy)', url: 'https://www.udemy.com/user/jasonrobertdion/', free: false, type: 'Simulado' },
      { name: 'CompTIA Official Study Guide', url: 'https://www.comptia.org', free: false, type: 'Livro' },
    ],
  },
  'ejpt': {
    name: 'eJPT', fullName: 'eLearnSecurity Junior Penetration Tester v2', acronym: 'eJPT',
    provider: 'INE Security', level: 'ENTRY', category: 'OFFENSIVE_SECURITY',
    description: 'Certificação prática de pentest para iniciantes. Exame 100% hands-on em laboratório — sem questões de múltipla escolha. Melhor ponto de entrada para quem quer entrar em red team.',
    examDuration: 1440, numberOfQuestions: 0, passingScore: 70, validityYears: 0, requiresRenewal: false,
    costs: [{ region: 'US', currency: 'USD', examCost: 200 }],
    objectives: ['Reconhecimento e scanning de redes', 'Exploração de vulnerabilidades web básicas', 'Relatório de pentest', 'Metodologia de teste de intrusão'],
    topics: ['Networking Fundamentals', 'Web App Testing', 'Host & Network Penetration', 'Exploitation Basics', 'Reporting'],
    officialUrl: 'https://security.ine.com/certifications/ejpt-certification/',
    resources: [
      { name: 'INE Starter Pass', url: 'https://ine.com', free: false, type: 'Plataforma' },
      { name: 'TryHackMe Pre-Security', url: 'https://tryhackme.com/path/outline/presecurity', free: true, type: 'Lab' },
      { name: 'HackTheBox Starting Point', url: 'https://www.hackthebox.com/starting-point', free: true, type: 'Lab' },
    ],
  },
  'comptia-cysa-plus': {
    name: 'CySA+', fullName: 'CompTIA Cybersecurity Analyst+', acronym: 'CySA+',
    provider: 'CompTIA', level: 'INTERMEDIATE', category: 'DEFENSIVE_SECURITY',
    description: 'Análise comportamental para combater ameaças. Foca em threat intelligence, gestão de vulnerabilidades e resposta a incidentes. Muito pedido em SOC Tier 2 e Blue Team.',
    examDuration: 165, numberOfQuestions: 85, passingScore: 750, validityYears: 3, requiresRenewal: true,
    costs: [{ region: 'US', currency: 'USD', examCost: 392 }],
    objectives: ['Threat intelligence e threat hunting', 'Análise de logs e SIEM', 'Gestão de vulnerabilidades', 'Resposta a incidentes e forense básica'],
    topics: ['Threat Intelligence', 'Vulnerability Management', 'Security Engineering', 'Incident Response', 'Compliance & Assessment'],
    officialUrl: 'https://www.comptia.org/certifications/cybersecurity-analyst',
    resources: [
      { name: 'Jason Dion CySA+', url: 'https://www.udemy.com/user/jasonrobertdion/', free: false, type: 'Curso' },
      { name: 'TryHackMe SOC Level 1', url: 'https://tryhackme.com/path/outline/soclevel1', free: false, type: 'Lab' },
    ],
  },
  'ceh-certified-ethical-hacker': {
    name: 'CEH', fullName: 'Certified Ethical Hacker v12', acronym: 'CEH',
    provider: 'EC-Council', level: 'INTERMEDIATE', category: 'OFFENSIVE_SECURITY',
    description: 'Metodologia de ethical hacking com 20 disciplinas. Reconhecido por Fortune 500 mundialmente. Mais teórico que PNPT/OSCP mas com forte peso de mercado.',
    examDuration: 240, numberOfQuestions: 125, passingScore: 700, validityYears: 3, requiresRenewal: true,
    costs: [{ region: 'US', currency: 'USD', examCost: 1199 }],
    objectives: ['Footprinting e reconhecimento', 'Scanning e enumeração', 'Análise de vulnerabilidades', 'Hacking de aplicações web', 'Social engineering'],
    topics: ['Footprinting', 'Scanning Networks', 'Enumeration', 'Vulnerability Analysis', 'System Hacking', 'Malware Threats', 'Sniffing', 'SQL Injection', 'Session Hijacking'],
    officialUrl: 'https://www.eccouncil.org/train-certify/certified-ethical-hacker-ceh/',
    resources: [
      { name: 'EC-Council Official Courseware', url: 'https://www.eccouncil.org', free: false, type: 'Oficial' },
      { name: 'OWASP Testing Guide', url: 'https://owasp.org/www-project-web-security-testing-guide/', free: true, type: 'Guia' },
    ],
  },
  'gpen': {
    name: 'GPEN', fullName: 'GIAC Penetration Tester', acronym: 'GPEN',
    provider: 'SANS/GIAC', level: 'INTERMEDIATE', category: 'OFFENSIVE_SECURITY',
    description: 'Certificação de pentest reconhecida pela indústria. Cobre metodologia completa, AD attacks e ambientes corporativos. GIAC é uma das organizações mais respeitadas do setor.',
    examDuration: 180, numberOfQuestions: 115, passingScore: 74, validityYears: 4, requiresRenewal: true,
    costs: [{ region: 'US', currency: 'USD', examCost: 979 }],
    objectives: ['Metodologia completa de penetration testing', 'Active Directory attacks', 'Password attacks', 'Privilege escalation', 'Post-exploitation'],
    topics: ['Pen Testing Methodology', 'Reconnaissance', 'Scanning & Exploitation', 'Password Attacks', 'Web App Exploitation', 'Active Directory', 'Post-Exploitation'],
    officialUrl: 'https://www.giac.org/certifications/penetration-tester-gpen/',
    resources: [
      { name: 'TCM Security PEH Course', url: 'https://academy.tcm-sec.com', free: false, type: 'Curso' },
      { name: 'HackTheBox Pro Labs', url: 'https://www.hackthebox.com/hacker/pro-labs', free: false, type: 'Lab' },
    ],
  },
  'oscp': {
    name: 'OSCP', fullName: 'Offensive Security Certified Professional', acronym: 'OSCP',
    provider: 'Offensive Security', level: 'ADVANCED', category: 'OFFENSIVE_SECURITY',
    description: 'A certificação ofensiva mais respeitada do mercado. Exame prático de 24h em rede isolada com relatório de pentest real. "Try Harder" é o mantra. Diferencia candidatos de forma definitiva.',
    examDuration: 1440, numberOfQuestions: 0, passingScore: 70, validityYears: 0, requiresRenewal: false,
    costs: [{ region: 'US', currency: 'USD', examCost: 1499 }],
    objectives: ['Buffer overflows', 'Active Directory attacks completo', 'Web app exploitation avançado', 'Post-exploitation e pivoting', 'Relatório profissional de pentest'],
    topics: ['Buffer Overflows', 'Active Directory', 'Web App Exploitation', 'Post-Exploitation', 'Pivoting & Tunneling', 'Privilege Escalation', 'Report Writing'],
    officialUrl: 'https://www.offensive-security.com/pwk-oscp/',
    resources: [
      { name: 'OffSec PEN-200 (PWK) — Oficial', url: 'https://www.offensive-security.com/pwk-oscp/', free: false, type: 'Oficial' },
      { name: 'TJ Null OSCP Prep List', url: 'https://docs.google.com/spreadsheets/d/1dwSMIAPIam0PuRBkCiDI88pU3yzrqqHkDtBngUHNCw8', free: true, type: 'Lista' },
      { name: 'ippsec YouTube', url: 'https://www.youtube.com/@ippsec', free: true, type: 'Vídeo' },
    ],
  },
  'cissp': {
    name: 'CISSP', fullName: 'Certified Information Systems Security Professional', acronym: 'CISSP',
    provider: '(ISC)²', level: 'ADVANCED', category: 'GOVERNANCE_RISK',
    description: 'O padrão ouro para liderança em security. Cobre 8 domínios completos. Exigido para CISO, Security Architect e posições sênior. Requer 5 anos de experiência comprovada.',
    examDuration: 360, numberOfQuestions: 125, passingScore: 700, validityYears: 3, requiresRenewal: true,
    costs: [{ region: 'US', currency: 'USD', examCost: 749 }, { region: 'DE', currency: 'EUR', examCost: 699 }],
    objectives: ['Governance e gestão de risco', 'Arquitetura e engenharia de segurança', 'Segurança de redes e comunicações', 'Gestão de identidade e acesso', 'Operações de segurança'],
    topics: ['Security & Risk Management', 'Asset Security', 'Security Architecture', 'Network Security', 'IAM', 'Security Assessment', 'Security Operations', 'Software Security'],
    officialUrl: 'https://www.isc2.org/certifications/cissp',
    resources: [
      { name: 'Destination Certification MindMap', url: 'https://www.destinationcertification.com', free: true, type: 'Vídeo' },
      { name: 'Larry Greenblatt CISSP (Udemy)', url: 'https://www.udemy.com', free: false, type: 'Curso' },
    ],
  },
  'cism': {
    name: 'CISM', fullName: 'Certified Information Security Manager', acronym: 'CISM',
    provider: 'ISACA', level: 'ADVANCED', category: 'GOVERNANCE_RISK',
    description: 'Gestão de segurança da informação focada em governance e risk management. Muito valorizado na Europa e em roles que combinam técnica com negócio.',
    examDuration: 240, numberOfQuestions: 150, passingScore: 450, validityYears: 3, requiresRenewal: true,
    costs: [{ region: 'US', currency: 'USD', examCost: 575 }],
    objectives: ['Information security governance', 'Risk management', 'Desenvolvimento de programas de segurança', 'Gestão de incidentes'],
    topics: ['IS Governance', 'Risk Management', 'Security Program Development', 'Incident Management'],
    officialUrl: 'https://www.isaca.org/credentialing/cism',
    resources: [
      { name: 'ISACA CISM Review Manual', url: 'https://www.isaca.org', free: false, type: 'Oficial' },
      { name: 'Hemang Doshi CISM (Udemy)', url: 'https://www.udemy.com', free: false, type: 'Curso' },
    ],
  },
  'isc2-cc': {
    name: 'CC', fullName: 'ISC2 Certified in Cybersecurity', acronym: 'CC',
    provider: '(ISC)²', level: 'ENTRY', category: 'DEFENSIVE_SECURITY',
    description: 'Certificação entry-level da mesma organização do CISSP. Treinamento oficial gratuito. Peso de marca enorme para iniciantes. Ideal para devs em transição para security.',
    examDuration: 120, numberOfQuestions: 100, passingScore: 700, validityYears: 3, requiresRenewal: true,
    costs: [{ region: 'US', currency: 'USD', examCost: 199 }],
    objectives: ['Princípios de segurança', 'Segurança de rede', 'Controles de acesso', 'Operações de segurança', 'Resposta a incidentes'],
    topics: ['Security Principles', 'Network Security', 'Access Controls', 'Security Operations', 'Incident Response'],
    officialUrl: 'https://www.isc2.org/certifications/cc',
    resources: [
      { name: 'ISC2 CC Self-Paced Training (GRATUITO)', url: 'https://www.isc2.org/certifications/cc', free: true, type: 'Oficial' },
      { name: 'Thor Teaches — CC Prep', url: 'https://www.youtube.com/@ThorTeaches', free: true, type: 'Vídeo' },
    ],
  },
  'pnpt': {
    name: 'PNPT', fullName: 'Practical Network Penetration Tester', acronym: 'PNPT',
    provider: 'TCM Security', level: 'INTERMEDIATE', category: 'OFFENSIVE_SECURITY',
    description: 'Certificação 100% prática do TCM Security. Exame de 5 dias com relatório real de pentest. Muito mais respeitada tecnicamente que CEH. Background dev é vantagem direta.',
    examDuration: 7200, numberOfQuestions: 0, passingScore: 70, validityYears: 0, requiresRenewal: false,
    costs: [{ region: 'US', currency: 'USD', examCost: 400 }],
    objectives: ['Practical ethical hacking', 'Active Directory attacks', 'Web app pentesting', 'Report writing real', 'OSINT'],
    topics: ['Practical Ethical Hacking', 'Active Directory', 'Web App Testing', 'Report Writing', 'OSINT', 'Buffer Overflows'],
    officialUrl: 'https://tcm-sec.com/pnpt/',
    resources: [
      { name: 'TCM Academy — PEH Course', url: 'https://academy.tcm-sec.com', free: false, type: 'Curso' },
      { name: 'HackTheBox Starting Point', url: 'https://www.hackthebox.com/starting-point', free: true, type: 'Lab' },
    ],
  },
  'aws-security-specialty': {
    name: 'AWS Security', fullName: 'AWS Certified Security – Specialty', acronym: 'AWS-SEC',
    provider: 'Amazon Web Services', level: 'ADVANCED', category: 'CLOUD_SECURITY',
    description: 'A certificação de cloud security mais pedida. 80% das vagas de Security Engineer envolvem cloud. Foco em IAM, encryption, logging e IR na AWS.',
    examDuration: 170, numberOfQuestions: 65, passingScore: 750, validityYears: 3, requiresRenewal: true,
    costs: [{ region: 'US', currency: 'USD', examCost: 300 }],
    objectives: ['IAM avançado na AWS', 'Encryption e key management', 'Logging e monitoramento', 'Incident response na cloud', 'Infrastructure security'],
    topics: ['Incident Response', 'Logging & Monitoring', 'Infrastructure Security', 'Identity & Access Management', 'Data Protection'],
    officialUrl: 'https://aws.amazon.com/certification/certified-security-specialty/',
    resources: [
      { name: 'AWS Skill Builder', url: 'https://skillbuilder.aws', free: false, type: 'Oficial' },
      { name: 'Stephane Maarek AWS (Udemy)', url: 'https://www.udemy.com', free: false, type: 'Curso' },
    ],
  },
  'google-cybersecurity': {
    name: 'Google Cyber', fullName: 'Google Cybersecurity Certificate', acronym: 'GCC',
    provider: 'Google / Coursera', level: 'ENTRY', category: 'DEFENSIVE_SECURITY',
    description: 'Certificado do Google em parceria com o Coursera. 6 meses, ~$200 total. Aceito como equivalente a experiência em muitas vagas entry. Excelente para o LinkedIn.',
    examDuration: 0, numberOfQuestions: 0, passingScore: 0, validityYears: 0, requiresRenewal: false,
    costs: [{ region: 'US', currency: 'USD', examCost: 200 }],
    objectives: ['Fundamentos de segurança', 'Gerenciamento de riscos', 'Linux e SQL para security', 'Ferramentas de detecção', 'Resposta a incidentes'],
    topics: ['Security Fundamentals', 'Risk Management', 'Network Security', 'Linux & SQL', 'Detection Tools', 'Incident Response', 'Python for Security'],
    officialUrl: 'https://www.coursera.org/professional-certificates/google-cybersecurity',
    resources: [
      { name: 'Google Cybersecurity Certificate (Coursera)', url: 'https://www.coursera.org/professional-certificates/google-cybersecurity', free: false, type: 'Oficial' },
    ],
  },
  'htb-cpts': {
    name: 'CPTS', fullName: 'HTB Certified Penetration Testing Specialist', acronym: 'CPTS',
    provider: 'HackTheBox', level: 'ADVANCED', category: 'OFFENSIVE_SECURITY',
    description: 'Certificação hands-on do HackTheBox lançada em 2023. Completamente prática, reconhecida pelo mercado técnico. Boa alternativa ao OSCP com preço mais acessível.',
    examDuration: 10080, numberOfQuestions: 0, passingScore: 70, validityYears: 0, requiresRenewal: false,
    costs: [{ region: 'US', currency: 'USD', examCost: 490 }],
    objectives: ['Penetration testing completo', 'Active Directory exploitation', 'Web application attacks', 'Privilege escalation avançado', 'Report writing'],
    topics: ['Network Enumeration', 'Footprinting', 'Information Gathering', 'Vulnerability Assessment', 'Web Attacks', 'Exploitation', 'Active Directory', 'Pivoting', 'Post-Exploitation'],
    officialUrl: 'https://academy.hackthebox.com/preview/certifications/htb-certified-penetration-testing-specialist',
    resources: [
      { name: 'HTB Academy CPTS Path', url: 'https://academy.hackthebox.com', free: false, type: 'Oficial' },
      { name: 'HackTheBox Machines', url: 'https://www.hackthebox.com', free: false, type: 'Lab' },
    ],
  },
};

const LEVEL_META: Record<string, { color: string; bg: string; label: string }> = {
  ENTRY:        { color: '#22c55e', bg: 'rgba(34,197,94,0.1)',  label: 'Entry Level' },
  INTERMEDIATE: { color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', label: 'Intermediate' },
  ADVANCED:     { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', label: 'Advanced' },
  EXPERT:       { color: '#ef4444', bg: 'rgba(239,68,68,0.1)',  label: 'Expert' },
};

const CAT_LABEL: Record<string, string> = {
  DEFENSIVE_SECURITY:   '🔵 Defensive Security',
  OFFENSIVE_SECURITY:   '🔴 Offensive Security',
  GOVERNANCE_RISK:      '🟣 Governance & Risk',
  CLOUD_SECURITY:       '☁️ Cloud Security',
  APPLICATION_SECURITY: '🔒 App Security',
};

function CertDetailContent({ slug }: { slug: string }) {
  const cert = CERT_DATA[slug];
  const S = {
    mono: { fontFamily: '"JetBrains Mono", monospace' as const },
    grotesk: { fontFamily: '"Space Grotesk", sans-serif' as const },
    card: { background: 'var(--ds-card)', border: '1px solid var(--ds-card-border)', borderRadius: 12, padding: '20px' },
  };

  if (!cert) {
    return (
      <div style={{ minHeight: '100vh', background: '#0b0f14', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e6eef8', fontFamily: '"Inter", sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>🔍</div>
          <h2 style={{ ...S.grotesk, fontSize: 20, fontWeight: 700, marginBottom: 8, color: '#f0eeff' }}>Certificação não encontrada</h2>
          <p style={{ color: 'rgba(155,176,198,0.5)', marginBottom: 20 }}>Slug: {slug}</p>
          <Link href="/certifications" style={{ color: '#8b5cf6', textDecoration: 'none', ...S.grotesk, fontWeight: 600 }}>← Voltar ao catálogo</Link>
        </div>
      </div>
    );
  }

  const meta = LEVEL_META[cert.level] ?? LEVEL_META.ENTRY;

  return (
    <div style={{ minHeight: '100vh', background: '#0b0f14', color: '#e6eef8', fontFamily: '"Inter", sans-serif' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: 'clamp(20px,4vw,40px) clamp(16px,4vw,24px)' }}>

        {/* Back */}
        <Link href="/certifications" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'rgba(155,176,198,0.5)', textDecoration: 'none', fontSize: 13, marginBottom: 24, ...S.mono }}>
          <ArrowLeft size={14} /> Voltar ao catálogo
        </Link>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 32 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8, flexWrap: 'wrap' }}>
              <span style={{ ...S.mono, fontSize: 10, color: meta.color, background: meta.bg, border: `1px solid ${meta.color}30`, padding: '3px 10px', borderRadius: 5 }}>{meta.label}</span>
              <span style={{ ...S.mono, fontSize: 10, color: 'rgba(155,176,198,0.45)' }}>{CAT_LABEL[cert.category] ?? cert.category}</span>
              <span style={{ ...S.mono, fontSize: 10, color: 'rgba(155,176,198,0.4)' }}>{cert.provider}</span>
            </div>
            <h1 style={{ ...S.grotesk, fontWeight: 700, fontSize: 'clamp(24px,5vw,36px)', color: '#f0eeff', margin: 0 }}>
              {cert.acronym} <span style={{ fontWeight: 400, color: 'rgba(155,176,198,0.6)', fontSize: 'clamp(16px,3vw,24px)' }}>{cert.name !== cert.acronym ? `· ${cert.name}` : ''}</span>
            </h1>
            <p style={{ fontSize: 13, color: 'rgba(155,176,198,0.5)', marginTop: 4 }}>{cert.fullName}</p>
          </div>
          <a href={cert.officialUrl} target="_blank" rel="noopener noreferrer" style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '10px 16px', borderRadius: 9,
            background: `${meta.color}18`, border: `1px solid ${meta.color}40`, color: meta.color,
            textDecoration: 'none', fontSize: 13, ...S.grotesk, fontWeight: 600, flexShrink: 0,
          }}>
            Site Oficial <ExternalLink size={13} />
          </a>
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 28 }}>
          {[
            { icon: <DollarSign size={14} />, label: 'Custo exame', value: cert.costs.map(c => `${c.currency === 'USD' ? '$' : '€'}${c.examCost}`).join(' · ') },
            { icon: <Clock size={14} />, label: 'Duração', value: cert.examDuration >= 1440 ? `${cert.examDuration / 1440}d prático` : cert.examDuration > 0 ? `${cert.examDuration} min` : 'Auto-paced' },
            { icon: <Award size={14} />, label: 'Questões', value: cert.numberOfQuestions > 0 ? `${cert.numberOfQuestions} questões` : 'Exame prático' },
            { icon: <CheckCircle size={14} />, label: 'Score mínimo', value: cert.passingScore > 0 ? `${cert.passingScore}${cert.passingScore < 100 ? '%' : '/900'}` : 'Relatório avaliado' },
            { icon: <Award size={14} />, label: 'Validade', value: cert.validityYears > 0 ? `${cert.validityYears} anos` : 'Lifetime' },
          ].map(s => (
            <div key={s.label} style={{ ...S.card, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10, flex: '1 1 160px' }}>
              <div style={{ color: meta.color, flexShrink: 0 }}>{s.icon}</div>
              <div>
                <div style={{ ...S.mono, fontSize: 9, color: 'rgba(155,176,198,0.4)', letterSpacing: '0.06em', marginBottom: 2 }}>{s.label.toUpperCase()}</div>
                <div style={{ ...S.grotesk, fontWeight: 600, fontSize: 13, color: '#f0eeff' }}>{s.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Description */}
        <div style={{ ...S.card, marginBottom: 20 }}>
          <div style={{ ...S.mono, fontSize: 9, color: meta.color + '80', letterSpacing: '0.1em', marginBottom: 10 }}>SOBRE</div>
          <p style={{ fontSize: 14, color: 'rgba(210,205,235,0.8)', lineHeight: 1.7 }}>{cert.description}</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(300px,100%), 1fr))', gap: 16, marginBottom: 20 }}>
          {/* Objectives */}
          <div style={S.card}>
            <div style={{ ...S.mono, fontSize: 9, color: meta.color + '80', letterSpacing: '0.1em', marginBottom: 12 }}>OBJETIVOS DO EXAME</div>
            {cert.objectives.map((obj, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 10 }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: meta.bg, border: `1px solid ${meta.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ ...S.mono, fontSize: 9, color: meta.color, fontWeight: 700 }}>{i + 1}</span>
                </div>
                <span style={{ fontSize: 13, color: 'rgba(210,205,235,0.75)', lineHeight: 1.5 }}>{obj}</span>
              </div>
            ))}
          </div>

          {/* Topics */}
          <div style={S.card}>
            <div style={{ ...S.mono, fontSize: 9, color: meta.color + '80', letterSpacing: '0.1em', marginBottom: 12 }}>TÓPICOS COBERTOS</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {cert.topics.map(t => (
                <span key={t} style={{ fontSize: 11, padding: '4px 10px', borderRadius: 6, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(155,176,198,0.7)' }}>{t}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Resources */}
        <div style={{ ...S.card, marginBottom: 20 }}>
          <div style={{ ...S.mono, fontSize: 9, color: meta.color + '80', letterSpacing: '0.1em', marginBottom: 14 }}>RECURSOS RECOMENDADOS</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {cert.resources.map(r => (
              <a key={r.name} href={r.url} target="_blank" rel="noopener noreferrer" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                padding: '12px 14px', borderRadius: 9,
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
                textDecoration: 'none', transition: 'border-color 150ms',
              }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = meta.color + '30'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                  <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, flexShrink: 0, ...S.mono, background: r.free ? 'rgba(34,197,94,0.1)' : 'rgba(245,158,11,0.1)', color: r.free ? '#22c55e' : '#f59e0b', border: `1px solid ${r.free ? 'rgba(34,197,94,0.25)' : 'rgba(245,158,11,0.25)'}` }}>
                    {r.free ? 'FREE' : 'PAGO'}
                  </span>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ ...S.grotesk, fontWeight: 600, fontSize: 13, color: '#e6eef8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.name}</div>
                    <div style={{ ...S.mono, fontSize: 10, color: 'rgba(155,176,198,0.4)' }}>{r.type}</div>
                  </div>
                </div>
                <ExternalLink size={13} style={{ color: 'rgba(155,176,198,0.3)', flexShrink: 0 }} />
              </a>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link href="/roadmap" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px', borderRadius: 9, background: `${meta.color}18`, border: `1px solid ${meta.color}35`, color: meta.color, textDecoration: 'none', ...S.grotesk, fontWeight: 600, fontSize: 13 }}>
            Ver no Roadmap <ChevronRight size={14} />
          </Link>
          <Link href="/resources" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px', borderRadius: 9, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(155,176,198,0.7)', textDecoration: 'none', ...S.grotesk, fontWeight: 600, fontSize: 13 }}>
            Study Resources <ChevronRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CertificationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#0b0f14' }} />}>
      <CertDetailContent slug={resolvedParams.id} />
    </Suspense>
  );
}
