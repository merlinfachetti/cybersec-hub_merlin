'use client';

import { useState } from 'react';
import { TrendingUp, DollarSign, Globe, BarChart2, Briefcase, Award } from 'lucide-react';

const MARKET_DATA = {
  global: {
    openJobs: '3.5M+',
    avgSalaryUS: '$98,000',
    growth: '+35%',
    until: '2031',
    shortage: '3.4M',
  },
  certs: [
    { name: 'CISSP',    demand: 'CRITICAL', jobs: 65000, salaryUS: '$125k–$175k', salaryDE: '€85k–€120k', trend: '+12%', color: 'var(--ds-warn)' },
    { name: 'CISM',     demand: 'CRITICAL', jobs: 42000, salaryUS: '$115k–$160k', salaryDE: '€80k–€110k', trend: '+10%', color: 'var(--ds-warn)' },
    { name: 'Security+',demand: 'HIGH',     jobs: 45000, salaryUS: '$65k–$95k',  salaryDE: '€50k–€70k',  trend: '+8%',  color: '#3b82f6' },
    { name: 'CEH',      demand: 'HIGH',     jobs: 28000, salaryUS: '$85k–$125k', salaryDE: '€60k–€90k',  trend: '+15%', color: '#3b82f6' },
    { name: 'OSCP',     demand: 'HIGH',     jobs: 18000, salaryUS: '$95k–$145k', salaryDE: '€70k–€105k', trend: '+22%', color: '#3b82f6' },
    { name: 'CySA+',    demand: 'HIGH',     jobs: 22000, salaryUS: '$75k–$110k', salaryDE: '€55k–€80k',  trend: '+18%', color: '#3b82f6' },
    { name: 'eJPT',     demand: 'MEDIUM',   jobs: 8000,  salaryUS: '$55k–$75k',  salaryDE: '€40k–€58k',  trend: '+25%', color: 'var(--ds-ok)' },
    { name: 'GPEN',     demand: 'HIGH',     jobs: 12000, salaryUS: '$100k–$140k',salaryDE: '€75k–€100k', trend: '+20%', color: '#3b82f6' },
  ],
  roles: [
    { title: 'Security Analyst', level: 'Entry–Mid',  salaryUS: '$65k–$95k',  salaryDE: '€48k–€72k',  demand: 'CRITICAL', certs: ['Security+','CySA+'] },
    { title: 'SOC Analyst',      level: 'Entry–Mid',  salaryUS: '$55k–$85k',  salaryDE: '€42k–€65k',  demand: 'CRITICAL', certs: ['Security+','CySA+'] },
    { title: 'Penetration Tester',level: 'Mid–Senior',salaryUS: '$90k–$145k', salaryDE: '€65k–€110k', demand: 'HIGH',     certs: ['CEH','OSCP','GPEN'] },
    { title: 'Cloud Security Eng',level: 'Mid–Senior',salaryUS: '$110k–$160k',salaryDE: '€80k–€120k', demand: 'CRITICAL', certs: ['CISSP','AWS Security'] },
    { title: 'Security Architect',level: 'Senior',    salaryUS: '$140k–$200k',salaryDE: '€100k–€145k',demand: 'HIGH',     certs: ['CISSP','CISM'] },
    { title: 'CISO',             level: 'Executive',  salaryUS: '$200k–$350k',salaryDE: '€140k–€220k',demand: 'HIGH',     certs: ['CISSP','CISM'] },
    { title: 'GRC Analyst',      level: 'Mid',        salaryUS: '$75k–$110k', salaryDE: '€55k–€80k',  demand: 'HIGH',     certs: ['CISM','CISSP'] },
    { title: 'Threat Hunter',    level: 'Mid–Senior', salaryUS: '$100k–$150k',salaryDE: '€70k–€110k', demand: 'HIGH',     certs: ['CySA+','GPEN'] },
  ],
  regions: [
    { name: 'USA',     flag: '🇺🇸', demand: 'CRITICAL', avgSalary: '$105,000', jobs: '850k+',  growth: '+35%' },
    { name: 'Germany', flag: '🇩🇪', demand: 'CRITICAL', avgSalary: '€82,000',  jobs: '90k+',   growth: '+42%' },
    { name: 'UK',      flag: '🇬🇧', demand: 'HIGH',     avgSalary: '£75,000',  jobs: '120k+',  growth: '+28%' },
    { name: 'Brazil',  flag: '🇧🇷', demand: 'HIGH',     avgSalary: 'R$120k',   jobs: '45k+',   growth: '+65%' },
    { name: 'Canada',  flag: '🇨🇦', demand: 'CRITICAL', avgSalary: 'C$95,000', jobs: '110k+',  growth: '+30%' },
    { name: 'Australia',flag: '🇦🇺',demand: 'HIGH',     avgSalary: 'A$105,000',jobs: '60k+',   growth: '+32%' },
  ],
};

const DEMAND_COLOR: Record<string, string> = {
  CRITICAL: '#ef4444', HIGH: '#f59e0b', MEDIUM: '#22c55e',
};
const DEMAND_BG: Record<string, string> = {
  CRITICAL: 'rgba(239,68,68,0.1)', HIGH: 'rgba(245,158,11,0.1)', MEDIUM: 'rgba(34,197,94,0.1)',
};

type Tab = 'overview' | 'certs' | 'roles' | 'regions';

export default function MarketPage() {
  const [tab, setTab] = useState<Tab>('overview');

  const S = {
    card: { background: 'rgba(12,8,28,0.8)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12 },
    mono: { fontFamily: '"JetBrains Mono", monospace' as const },
    grotesk: { fontFamily: '"Space Grotesk", sans-serif' as const },
  };

  const TABS = [
    { id: 'overview', label: 'Overview', icon: <TrendingUp size={13} /> },
    { id: 'certs',    label: 'Por Certificação', icon: <Award size={13} /> },
    { id: 'roles',    label: 'Por Cargo', icon: <Briefcase size={13} /> },
    { id: 'regions',  label: 'Por Região', icon: <Globe size={13} /> },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--p-bg, #0b0f14)', color: 'var(--ds-title-section, #e6eef8)', fontFamily: '"Inter", sans-serif' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: 'clamp(20px, 4vw, 40px) clamp(16px, 4vw, 24px)' }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ ...S.mono, fontSize: 10, color: 'rgba(139,92,246,0.6)', letterSpacing: '0.14em', marginBottom: 8 }}>CAREERS / MARKET ANALYSIS</div>
          <h1 style={{ ...S.grotesk, fontWeight: 700, fontSize: 30, color: 'var(--ds-title-card, #f0eeff)', marginBottom: 6 }}>Market Analysis</h1>
          <p style={{ fontSize: 13, color: 'var(--ds-body-dim)', maxWidth: 520 }}>
            Dados reais de mercado para cybersecurity — salários, demanda por certificação e oportunidades por região.
            <span style={{ ...S.mono, fontSize: 9, color: 'var(--ds-mono-dim)', marginLeft: 8 }}>Fontes: ISC2, CompTIA, LinkedIn, Glassdoor (2024–2025)</span>
          </p>
        </div>

        {/* Tabs */}
        <div className="market-tabs" style={{ display: 'flex', gap: 6, marginBottom: 24, borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 0 }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id as Tab)} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '9px 18px', background: 'none', border: 'none', cursor: 'pointer',
              ...S.grotesk, fontSize: 13, fontWeight: 600, transition: 'all 150ms',
              color: tab === t.id ? '#a78bfa' : 'rgba(155,176,198,0.45)',
              borderBottom: `2px solid ${tab === t.id ? '#8b5cf6' : 'transparent'}`,
              marginBottom: -1,
            }}>
              {t.icon}{t.label}
            </button>
          ))}
        </div>

        {/* ── OVERVIEW ── */}
        {tab === 'overview' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(220px,100%), 1fr))', gap: 14, marginBottom: 28 }}>
              {[
                { label: 'Vagas em aberto global', value: MARKET_DATA.global.openJobs, sub: 'worldwide', color: 'var(--ds-danger)', icon: <Briefcase size={16} /> },
                { label: 'Salário médio (US)', value: MARKET_DATA.global.avgSalaryUS, sub: 'security engineer', color: 'var(--ds-ok)', icon: <DollarSign size={16} /> },
                { label: 'Crescimento previsto', value: MARKET_DATA.global.growth, sub: `até ${MARKET_DATA.global.until}`, color: '#3b82f6', icon: <TrendingUp size={16} /> },
                { label: 'Déficit de profissionais', value: MARKET_DATA.global.shortage, sub: 'ISC2 Report 2024', color: 'var(--ds-warn)', icon: <BarChart2 size={16} /> },
              ].map(s => (
                <div key={s.label} style={{ ...S.card, padding: '18px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                    <div style={{ color: s.color }}>{s.icon}</div>
                    <span style={{ ...S.mono, fontSize: 9, color: 'var(--ds-body-dim)', letterSpacing: '0.08em' }}>{s.label.toUpperCase()}</span>
                  </div>
                  <div style={{ ...S.grotesk, fontWeight: 700, fontSize: 26, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: 'var(--ds-body-dim)', marginTop: 3 }}>{s.sub}</div>
                </div>
              ))}
            </div>

            {/* Top certs by demand */}
            <div style={{ ...S.card, padding: '20px' }}>
              <div style={{ ...S.grotesk, fontWeight: 700, fontSize: 15, color: 'var(--ds-title-card, #f0eeff)', marginBottom: 16 }}>Certificações mais demandadas (EUA)</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {MARKET_DATA.certs.slice(0,5).map(c => {
                  const pct = Math.round((c.jobs / 65000) * 100);
                  return (
                    <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <span style={{ ...S.grotesk, fontWeight: 700, fontSize: 13, color: 'var(--ds-title-card, #f0eeff)', minWidth: 90 }}>{c.name}</span>
                      <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 3 }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: `linear-gradient(90deg,${c.color},${c.color}80)`, borderRadius: 3, transition: 'width 0.6s ease' }} />
                      </div>
                      <span style={{ ...S.mono, fontSize: 10, color: 'var(--ds-body-dim)', minWidth: 60 }}>{c.jobs.toLocaleString()} vagas</span>
                      <span style={{ ...S.mono, fontSize: 10, color: 'var(--ds-ok)', minWidth: 40 }}>{c.trend}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── CERTS ── */}
        {tab === 'certs' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 14 }}>
            {MARKET_DATA.certs.map(c => (
              <div key={c.name} style={{ ...S.card, padding: '18px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${c.color}70,transparent)` }} />
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span style={{ ...S.grotesk, fontWeight: 700, fontSize: 20, color: 'var(--ds-title-card, #f0eeff)' }}>{c.name}</span>
                  <span style={{ ...S.mono, fontSize: 9, padding: '3px 8px', borderRadius: 4, background: DEMAND_BG[c.demand], color: DEMAND_COLOR[c.demand], border: `1px solid ${DEMAND_COLOR[c.demand]}30` }}>
                    {c.demand}
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 11, color: 'var(--ds-body-dim)' }}>🇺🇸 Salário (US)</span>
                    <span style={{ ...S.mono, fontSize: 11, color: 'var(--ds-ok)' }}>{c.salaryUS}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 11, color: 'var(--ds-body-dim)' }}>🇩🇪 Salário (DE)</span>
                    <span style={{ ...S.mono, fontSize: 11, color: '#3b82f6' }}>{c.salaryDE}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 11, color: 'var(--ds-body-dim)' }}>Vagas abertas</span>
                    <span style={{ ...S.mono, fontSize: 11, color: 'var(--ds-body-muted)' }}>{c.jobs.toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 11, color: 'var(--ds-body-dim)' }}>Crescimento YoY</span>
                    <span style={{ ...S.mono, fontSize: 11, color: 'var(--ds-warn)' }}>{c.trend}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── ROLES ── */}
        {tab === 'roles' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {MARKET_DATA.roles.map(r => (
              <div key={r.title} style={{ ...S.card, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ ...S.grotesk, fontWeight: 700, fontSize: 15, color: 'var(--ds-title-card, #f0eeff)' }}>{r.title}</div>
                  <div style={{ ...S.mono, fontSize: 10, color: 'var(--ds-body-dim)', marginTop: 2 }}>{r.level}</div>
                </div>
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 11, color: 'var(--ds-body-dim)', marginBottom: 2 }}>🇺🇸 US</div>
                    <div style={{ ...S.mono, fontSize: 12, color: 'var(--ds-ok)' }}>{r.salaryUS}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 11, color: 'var(--ds-body-dim)', marginBottom: 2 }}>🇩🇪 DE</div>
                    <div style={{ ...S.mono, fontSize: 12, color: '#3b82f6' }}>{r.salaryDE}</div>
                  </div>
                  <span style={{ ...S.mono, fontSize: 9, padding: '3px 8px', borderRadius: 4, background: DEMAND_BG[r.demand], color: DEMAND_COLOR[r.demand], border: `1px solid ${DEMAND_COLOR[r.demand]}30` }}>
                    {r.demand}
                  </span>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {r.certs.map(c => (
                      <span key={c} style={{ ...S.mono, fontSize: 9, padding: '2px 7px', borderRadius: 4, background: 'rgba(139,92,246,0.1)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.2)' }}>{c}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── REGIONS ── */}
        {tab === 'regions' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 14 }}>
            {MARKET_DATA.regions.map(r => (
              <div key={r.name} style={{ ...S.card, padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                  <span style={{ fontSize: 24 }}>{r.flag}</span>
                  <div>
                    <div style={{ ...S.grotesk, fontWeight: 700, fontSize: 16, color: 'var(--ds-title-card, #f0eeff)' }}>{r.name}</div>
                    <span style={{ ...S.mono, fontSize: 9, padding: '2px 7px', borderRadius: 3, background: DEMAND_BG[r.demand], color: DEMAND_COLOR[r.demand] }}>{r.demand}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 12, color: 'var(--ds-body-dim)' }}>Salário médio</span>
                    <span style={{ ...S.mono, fontSize: 12, color: 'var(--ds-ok)' }}>{r.avgSalary}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 12, color: 'var(--ds-body-dim)' }}>Vagas abertas</span>
                    <span style={{ ...S.mono, fontSize: 12, color: 'var(--ds-body-muted)' }}>{r.jobs}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 12, color: 'var(--ds-body-dim)' }}>Crescimento</span>
                    <span style={{ ...S.mono, fontSize: 12, color: 'var(--ds-warn)' }}>{r.growth}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
