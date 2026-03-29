'use client';

import { Suspense, use } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle,
  ExternalLink,
  ShieldCheck,
  TriangleAlert,
} from 'lucide-react';
import {
  CERTIFICATION_MAP,
  CONTENT_LAST_REVIEWED,
} from '@/lib/content/career-guide';

const LEVEL_META: Record<string, { color: string; bg: string; label: string }> = {
  ENTRY: { color: '#22c55e', bg: 'rgba(34,197,94,0.1)', label: 'Entry' },
  INTERMEDIATE: {
    color: '#3b82f6',
    bg: 'rgba(59,130,246,0.1)',
    label: 'Intermediate',
  },
  ADVANCED: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', label: 'Advanced' },
  EXPERT: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)', label: 'Expert' },
};

const CATEGORY_LABELS: Record<string, string> = {
  DEFENSIVE_SECURITY: 'Defensive Security',
  OFFENSIVE_SECURITY: 'Offensive Security',
  GOVERNANCE_RISK: 'Governance & Risk',
  CLOUD_SECURITY: 'Cloud Security',
  APPLICATION_SECURITY: 'Application Security',
};

function CertDetailContent({ slug }: { slug: string }) {
  const cert = CERTIFICATION_MAP[slug];

  const S = {
    mono: { fontFamily: '"JetBrains Mono", monospace' as const },
    grotesk: { fontFamily: '"Space Grotesk", sans-serif' as const },
    card: {
      background: 'var(--ds-card)',
      border: '1px solid var(--ds-card-border)',
      borderRadius: 12,
      padding: '20px',
    },
  };

  if (!cert) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#0b0f14',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#e6eef8',
          fontFamily: '"Inter", sans-serif',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>🔍</div>
          <h2
            style={{
              ...S.grotesk,
              fontSize: 20,
              fontWeight: 700,
              marginBottom: 8,
              color: '#f0eeff',
            }}
          >
            Certificação não encontrada
          </h2>
          <p style={{ color: 'rgba(155,176,198,0.5)', marginBottom: 20 }}>
            Slug: {slug}
          </p>
          <Link
            href="/certifications"
            style={{
              color: '#8b5cf6',
              textDecoration: 'none',
              ...S.grotesk,
              fontWeight: 600,
            }}
          >
            Voltar ao catalogo
          </Link>
        </div>
      </div>
    );
  }

  const meta = LEVEL_META[cert.level] ?? LEVEL_META.ENTRY;
  const durationLabel =
    cert.examDuration >= 1440
      ? `${Math.round(cert.examDuration / 1440)}d pratico`
      : cert.examDuration > 0
        ? `${cert.examDuration} min`
        : 'Formato modular';

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0b0f14',
        color: '#e6eef8',
        fontFamily: '"Inter", sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: 1040,
          margin: '0 auto',
          padding: 'clamp(20px,4vw,40px) clamp(16px,4vw,24px)',
        }}
      >
        <Link
          href="/certifications"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            color: 'rgba(155,176,198,0.5)',
            textDecoration: 'none',
            fontSize: 13,
            marginBottom: 24,
            ...S.mono,
          }}
        >
          <ArrowLeft size={14} />
          Voltar ao catalogo
        </Link>

        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 16,
            flexWrap: 'wrap',
            marginBottom: 28,
          }}
        >
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                marginBottom: 8,
                flexWrap: 'wrap',
              }}
            >
              <span
                style={{
                  ...S.mono,
                  fontSize: 10,
                  color: meta.color,
                  background: meta.bg,
                  border: `1px solid ${meta.color}30`,
                  padding: '3px 10px',
                  borderRadius: 5,
                }}
              >
                {meta.label}
              </span>
              <span
                style={{
                  ...S.mono,
                  fontSize: 10,
                  color: 'rgba(155,176,198,0.45)',
                }}
              >
                {CATEGORY_LABELS[cert.category] ?? cert.category}
              </span>
              <span
                style={{
                  ...S.mono,
                  fontSize: 10,
                  color: 'rgba(155,176,198,0.4)',
                }}
              >
                {cert.provider}
              </span>
            </div>

            <h1
              style={{
                ...S.grotesk,
                fontWeight: 700,
                fontSize: 'clamp(24px,5vw,36px)',
                color: '#f0eeff',
                margin: 0,
              }}
            >
              {cert.acronym}{' '}
              <span
                style={{
                  fontWeight: 400,
                  color: 'rgba(155,176,198,0.6)',
                  fontSize: 'clamp(16px,3vw,24px)',
                }}
              >
                {cert.name !== cert.acronym ? `· ${cert.name}` : ''}
              </span>
            </h1>
            <p
              style={{
                fontSize: 13,
                color: 'rgba(155,176,198,0.52)',
                marginTop: 4,
                marginBottom: 8,
              }}
            >
              {cert.fullName}
            </p>
            <p
              style={{
                fontSize: 13,
                color: 'rgba(220,230,245,0.8)',
                maxWidth: 760,
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              {cert.description}
            </p>
          </div>

          <a
            href={cert.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '10px 16px',
              borderRadius: 9,
              background: `${meta.color}18`,
              border: `1px solid ${meta.color}40`,
              color: meta.color,
              textDecoration: 'none',
              fontSize: 13,
              ...S.grotesk,
              fontWeight: 600,
              flexShrink: 0,
            }}
          >
            Site oficial
            <ExternalLink size={13} />
          </a>
        </div>

        <div
          style={{
            ...S.card,
            marginBottom: 18,
            borderColor: 'rgba(6,182,212,0.2)',
            background:
              'linear-gradient(135deg, rgba(6,182,212,0.08), rgba(139,92,246,0.05))',
          }}
        >
          <div
            style={{
              ...S.mono,
              fontSize: 9,
              color: 'rgba(6,182,212,0.85)',
              letterSpacing: '0.12em',
              marginBottom: 6,
            }}
          >
            NOTA EDITORIAL
          </div>
          <p
            style={{
              margin: 0,
              fontSize: 13,
              color: 'rgba(220,230,245,0.82)',
              lineHeight: 1.65,
            }}
          >
            Este resumo foi revisado em {CONTENT_LAST_REVIEWED} para reduzir
            exageros comuns de marketing. Antes de comprar, sempre confirme
            preco e politica atual no provedor oficial.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 12,
            marginBottom: 24,
          }}
        >
          {[
            {
              label: 'Investimento',
              value: cert.searchCost,
            },
            {
              label: 'Tempo de estudo',
              value: cert.studyHours,
            },
            {
              label: 'Formato de exame',
              value: cert.numberOfQuestions > 0
                ? `${cert.numberOfQuestions} questoes`
                : 'Exame pratico',
            },
            {
              label: 'Duracao',
              value: durationLabel,
            },
            {
              label: 'Score / criterio',
              value: cert.passingScoreLabel,
            },
            {
              label: 'Validade',
              value: cert.validityLabel,
            },
          ].map((item) => (
            <div key={item.label} style={S.card}>
              <div
                style={{
                  ...S.mono,
                  fontSize: 9,
                  color: 'var(--ds-mono-dim)',
                  marginBottom: 6,
                  letterSpacing: '0.08em',
                }}
              >
                {item.label.toUpperCase()}
              </div>
              <div
                style={{
                  ...S.grotesk,
                  fontSize: 16,
                  fontWeight: 700,
                  color: 'var(--ds-title-card, #f0eeff)',
                }}
              >
                {item.value}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 16,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              ...S.card,
              background: 'rgba(34,197,94,0.06)',
              borderColor: 'rgba(34,197,94,0.16)',
            }}
          >
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <ShieldCheck size={16} style={{ color: '#22c55e', marginTop: 1 }} />
              <div>
                <div
                  style={{
                    ...S.mono,
                    fontSize: 9,
                    color: 'rgba(34,197,94,0.9)',
                    marginBottom: 5,
                    letterSpacing: '0.1em',
                  }}
                >
                  MELHOR PARA
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: 'rgba(220,230,245,0.84)',
                    lineHeight: 1.65,
                  }}
                >
                  {cert.bestFor}
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              ...S.card,
              background: 'rgba(245,158,11,0.06)',
              borderColor: 'rgba(245,158,11,0.16)',
            }}
          >
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <TriangleAlert
                size={16}
                style={{ color: '#f59e0b', marginTop: 1 }}
              />
              <div>
                <div
                  style={{
                    ...S.mono,
                    fontSize: 9,
                    color: 'rgba(245,158,11,0.95)',
                    marginBottom: 5,
                    letterSpacing: '0.1em',
                  }}
                >
                  CUIDADO
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: 'rgba(220,230,245,0.8)',
                    lineHeight: 1.65,
                  }}
                >
                  {cert.caution}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            ...S.card,
            marginBottom: 24,
            borderColor: `${meta.color}28`,
          }}
        >
          <div
            style={{
              ...S.mono,
              fontSize: 9,
              color: `${meta.color}95`,
              marginBottom: 6,
              letterSpacing: '0.12em',
            }}
          >
            MARKET SIGNAL
          </div>
          <div
            style={{
              fontSize: 13,
              color: 'rgba(220,230,245,0.82)',
              lineHeight: 1.65,
              marginBottom: 10,
            }}
          >
            {cert.marketSignal}
          </div>
          <div
            style={{
              ...S.mono,
              fontSize: 10,
              color: 'var(--ds-mono-dim)',
            }}
          >
            experiencia recomendada: {cert.recommendedExperience}
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 1fr',
            gap: 16,
            marginBottom: 24,
          }}
        >
          <div style={S.card}>
            <div
              style={{
                ...S.mono,
                fontSize: 9,
                color: `${meta.color}95`,
                marginBottom: 8,
                letterSpacing: '0.12em',
              }}
            >
              OBJETIVOS
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {cert.objectives.map((objective) => (
                <div
                  key={objective}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 8,
                  }}
                >
                  <CheckCircle size={14} style={{ color: meta.color, marginTop: 2 }} />
                  <span
                    style={{
                      fontSize: 13,
                      color: 'rgba(220,230,245,0.8)',
                      lineHeight: 1.6,
                    }}
                  >
                    {objective}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div style={S.card}>
            <div
              style={{
                ...S.mono,
                fontSize: 9,
                color: `${meta.color}95`,
                marginBottom: 8,
                letterSpacing: '0.12em',
              }}
            >
              TOPICOS PRINCIPAIS
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {cert.topics.map((topic) => (
                <span
                  key={topic}
                  style={{
                    padding: '6px 10px',
                    borderRadius: 999,
                    fontSize: 11,
                    color: 'rgba(220,230,245,0.8)',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div style={S.card}>
          <div
            style={{
              ...S.mono,
              fontSize: 9,
              color: `${meta.color}95`,
              marginBottom: 10,
              letterSpacing: '0.12em',
            }}
          >
            RECURSOS RECOMENDADOS
          </div>
          <div style={{ display: 'grid', gap: 12 }}>
            {cert.resources.map((resource) => (
              <a
                key={resource.name}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 14,
                  padding: '12px 14px',
                  borderRadius: 10,
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  textDecoration: 'none',
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 13,
                      color: 'var(--ds-title-card, #f0eeff)',
                      marginBottom: 4,
                    }}
                  >
                    {resource.name}
                  </div>
                  <div
                    style={{
                      ...S.mono,
                      fontSize: 10,
                      color: 'var(--ds-body-dim)',
                    }}
                  >
                    {resource.type} · {resource.free ? 'gratuito' : 'pago'}
                  </div>
                </div>
                <ExternalLink size={14} style={{ color: meta.color }} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CertificationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <Suspense fallback={null}>
      <CertDetailContent slug={id} />
    </Suspense>
  );
}
