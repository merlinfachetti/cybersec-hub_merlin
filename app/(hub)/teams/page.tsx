'use client';

import Link from 'next/link';
import { Shield, Sword, Zap, ChevronRight, Target, Eye, Wrench, BookOpen } from 'lucide-react';

const TEAMS = [
  {
    id: 'red',
    label: 'Red Team',
    tag: 'OFFENSIVE SECURITY',
    color: '#e53e3e',
    rgb: '229,62,62',
    icon: <Sword size={24} />,
    tagline: 'Think like the attacker.',
    description: 'O Red Team simula adversários reais para testar as defesas de uma organização. Não é vandalismo — é ciência. O objetivo é encontrar brechas antes que atacantes reais o façam.',
    does: [
      'Penetration testing em redes, aplicações e infraestrutura',
      'Engenharia social e phishing controlado',
      'Desenvolvimento de exploits e payloads customizados',
      'Simulação de APTs (Advanced Persistent Threats)',
      'Physical security testing',
      'Relatórios técnicos de vulnerabilidades e vetores de ataque',
    ],
    doesNot: [
      'Atacar sistemas sem autorização explícita',
      'Comprometer dados reais de usuários',
      'Agir fora do escopo definido no Rules of Engagement',
      'Trabalhar sem comunicação com o Blue Team (em purple exercises)',
    ],
    certs: ['eJPT', 'CEH', 'PNPT', 'OSCP', 'GPEN', 'CRTO'],
    roadmapHref: '/roadmap?path=pentest-red-team',
    skills: ['Network Pentesting', 'Web App Attacks', 'Active Directory', 'Malware Dev', 'OSINT', 'Social Engineering'],
  },
  {
    id: 'blue',
    label: 'Blue Team',
    tag: 'DEFENSIVE SECURITY',
    color: '#3b82f6',
    rgb: '59,130,246',
    icon: <Shield size={24} />,
    tagline: 'Detect. Respond. Harden.',
    description: 'O Blue Team é a linha de defesa. Monitora sistemas, detecta ameaças e responde a incidentes. É o time que mantém o mundo digital funcionando quando algo dá errado — e garante que dê errado o menos possível.',
    does: [
      'Monitoramento contínuo via SIEM (Splunk, Elastic, Microsoft Sentinel)',
      'Análise de logs, netflow e alertas de segurança',
      'Threat hunting proativo — busca ameaças sem alertas',
      'Incident Response — contenção, erradicação, recuperação',
      'Hardening de sistemas e configurações (CIS Benchmarks)',
      'Desenvolvimento de regras de detecção (SIGMA, YARA)',
      'Vulnerability management e patch prioritization',
    ],
    doesNot: [
      'Atacar sistemas, mesmo para testes (isso é Red Team)',
      'Ignorar alertas de baixa prioridade sem triagem',
      'Tomar decisões de negócio baseadas só em técnica',
    ],
    certs: ['Security+', 'CySA+', 'BTL1', 'GCIH', 'GCIA', 'CISSP'],
    roadmapHref: '/roadmap?path=foundations-to-soc',
    skills: ['SIEM Operations', 'Log Analysis', 'Threat Hunting', 'IR Playbooks', 'Hardening', 'Malware Triage'],
  },
  {
    id: 'purple',
    label: 'Purple Team',
    tag: 'CONTINUOUS IMPROVEMENT',
    color: '#8b5cf6',
    rgb: '139,92,246',
    icon: <Zap size={24} />,
    tagline: 'Red meets Blue. Everyone wins.',
    description: 'O Purple Team não é um time separado — é uma mentalidade de colaboração. Une Red e Blue em ciclos de feedback contínuo: ataque → detecção → melhoria → ataque melhorado → detecção melhorada.',
    does: [
      'Exercícios conjuntos Red + Blue para validar detecções',
      'Mapeamento de cobertura MITRE ATT&CK',
      'Análise de gap: o que o Red fez que o Blue não detectou?',
      'Criação de runbooks e playbooks de resposta',
      'Melhoria contínua de regras SIEM baseadas em TTPs reais',
      'Tabletop exercises e simulações de cenários',
      'Threat intelligence aplicada a detecções',
    ],
    doesNot: [
      'Substituir Red ou Blue — amplifica ambos',
      'Funcionar sem comunicação aberta entre os times',
      'Focar só em compliance sem aplicação prática',
    ],
    certs: ['GDAT', 'CISM', 'CISSP', 'CREST', 'Security+', 'CySA+'],
    roadmapHref: '/roadmap?path=architecture-leadership',
    skills: ['MITRE ATT&CK', 'Threat Intelligence', 'Detection Engineering', 'Purple Exercises', 'Tabletop', 'GRC'],
  },
];

export default function TeamsPage() {
  const S = {
    mono: { fontFamily: '"JetBrains Mono", monospace' as const },
    grotesk: { fontFamily: '"Space Grotesk", sans-serif' as const },
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0b0f14', color: '#e6eef8', fontFamily: '"Inter", sans-serif' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: 'clamp(24px,4vw,48px) clamp(16px,4vw,24px)' }}>

        {/* Header */}
        <div style={{ marginBottom: 48, textAlign: 'center' }}>
          <div style={{ ...S.mono, fontSize: 10, color: 'rgba(139,92,246,0.6)', letterSpacing: '0.14em', marginBottom: 10 }}>
            RED · BLUE · PURPLE
          </div>
          <h1 style={{ ...S.grotesk, fontWeight: 700, fontSize: 'clamp(24px,4vw,36px)', color: '#f0eeff', marginBottom: 12 }}>
            Os Times de Cybersecurity
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(155,176,198,0.6)', maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
            Entenda o que cada time faz, suas responsabilidades, o que nunca fazem, e qual trilha seguir para chegar lá.
          </p>
        </div>

        {/* Teams */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
          {TEAMS.map(team => (
            <div key={team.id} id={team.id} style={{
              background: 'var(--ds-card)',
              border: `1px solid rgba(${team.rgb},0.2)`,
              borderRadius: 16, overflow: 'hidden',
            }}>
              {/* Top accent */}
              <div style={{ height: 3, background: `linear-gradient(90deg, ${team.color}, ${team.color}60, transparent)` }} />

              {/* Header */}
              <div style={{ padding: '24px 28px', display: 'flex', alignItems: 'flex-start', gap: 20, flexWrap: 'wrap' }}>
                <div style={{ width: 52, height: 52, borderRadius: 12, background: `rgba(${team.rgb},0.12)`, border: `1px solid rgba(${team.rgb},0.3)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: team.color, flexShrink: 0 }}>
                  {team.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4, flexWrap: 'wrap' }}>
                    <h2 style={{ ...S.grotesk, fontWeight: 700, fontSize: 22, color: team.color, margin: 0 }}>{team.label}</h2>
                    <span style={{ ...S.mono, fontSize: 9, color: team.color, background: `rgba(${team.rgb},0.1)`, border: `1px solid rgba(${team.rgb},0.25)`, padding: '2px 8px', borderRadius: 4 }}>
                      {team.tag}
                    </span>
                  </div>
                  <p style={{ ...S.mono, fontSize: 12, color: `rgba(${team.rgb},0.8)`, margin: 0 }}>"{team.tagline}"</p>
                </div>
                <Link href={team.roadmapHref} style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '8px 16px', borderRadius: 8, textDecoration: 'none',
                  background: `rgba(${team.rgb},0.1)`, border: `1px solid rgba(${team.rgb},0.3)`,
                  color: team.color, ...S.grotesk, fontWeight: 600, fontSize: 12,
                  flexShrink: 0, transition: 'all 150ms',
                }}>
                  <BookOpen size={13} /> Ver Roadmap <ChevronRight size={12} />
                </Link>
              </div>

              <div style={{ padding: '0 28px 28px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px,100%), 1fr))', gap: 20 }}>

                {/* Description */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <p style={{ fontSize: 14, color: 'rgba(220,215,240,0.75)', lineHeight: 1.7, margin: 0 }}>
                    {team.description}
                  </p>
                </div>

                {/* Does */}
                <div style={{ background: `rgba(${team.rgb},0.05)`, border: `1px solid rgba(${team.rgb},0.12)`, borderRadius: 10, padding: '16px 18px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                    <Target size={13} style={{ color: team.color }} />
                    <span style={{ ...S.mono, fontSize: 9, color: team.color, letterSpacing: '0.1em' }}>FAZ</span>
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 7 }}>
                    {team.does.map(d => (
                      <li key={d} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                        <span style={{ color: team.color, flexShrink: 0, marginTop: 1 }}>✓</span>
                        <span style={{ fontSize: 13, color: 'rgba(200,195,225,0.75)', lineHeight: 1.45 }}>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Does not */}
                <div style={{ background: 'rgba(245,158,11,0.04)', border: '1px solid rgba(245,158,11,0.12)', borderRadius: 10, padding: '16px 18px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                    <Eye size={13} style={{ color: '#f59e0b' }} />
                    <span style={{ ...S.mono, fontSize: 9, color: '#f59e0b', letterSpacing: '0.1em' }}>NÃO FAZ</span>
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 7 }}>
                    {team.doesNot.map(d => (
                      <li key={d} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                        <span style={{ color: '#f59e0b', flexShrink: 0, marginTop: 1 }}>✗</span>
                        <span style={{ fontSize: 13, color: 'rgba(200,195,225,0.65)', lineHeight: 1.45 }}>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Skills + Certs */}
                <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ ...S.mono, fontSize: 9, color: 'rgba(155,176,198,0.4)', letterSpacing: '0.1em', marginBottom: 8 }}>SKILLS</div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {team.skills.map(s => (
                        <span key={s} style={{ ...S.mono, fontSize: 10, padding: '3px 9px', borderRadius: 5, background: `rgba(${team.rgb},0.08)`, border: `1px solid rgba(${team.rgb},0.2)`, color: team.color }}>
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div style={{ ...S.mono, fontSize: 9, color: 'rgba(155,176,198,0.4)', letterSpacing: '0.1em', marginBottom: 8 }}>CERTIFICAÇÕES</div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {team.certs.map(cert => (
                        <Link key={cert} href={`/certifications?search=${cert}`} style={{ textDecoration: 'none' }}>
                          <span style={{ ...S.mono, fontSize: 10, padding: '3px 9px', borderRadius: 5, background: 'rgba(34,197,94,0.07)', border: '1px solid rgba(34,197,94,0.25)', color: '#22c55e', cursor: 'pointer', transition: 'all 150ms' }}
                            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(34,197,94,0.16)'; el.style.borderColor = 'rgba(34,197,94,0.5)'; el.style.boxShadow = '0 0 8px rgba(34,197,94,0.15)'; }}
                            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(34,197,94,0.07)'; el.style.borderColor = 'rgba(34,197,94,0.25)'; el.style.boxShadow = 'none'; }}
                          >
                            {cert}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
