'use client';

import { Suspense, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Clock, Search, Shield, TriangleAlert } from 'lucide-react';
import {
  CERTIFICATIONS,
  CONTENT_LAST_REVIEWED,
  resolveCareerPath,
} from '@/lib/content/career-guide';

const LEVELS = [
  { value: 'all', label: 'Todos os niveis' },
  { value: 'ENTRY', label: 'Entry', color: '#22c55e' },
  { value: 'INTERMEDIATE', label: 'Intermediate', color: '#3b82f6' },
  { value: 'ADVANCED', label: 'Advanced', color: '#f59e0b' },
  { value: 'EXPERT', label: 'Expert', color: '#ef4444' },
];

const LEVEL_ORDER = ['ENTRY', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'];

const CATEGORIES = [
  { value: 'all', label: 'Todas as categorias' },
  { value: 'DEFENSIVE_SECURITY', label: 'Defensive Security', color: '#3b82f6' },
  { value: 'OFFENSIVE_SECURITY', label: 'Offensive Security', color: '#ef4444' },
  { value: 'GOVERNANCE_RISK', label: 'Governance & Risk', color: '#8b5cf6' },
  { value: 'CLOUD_SECURITY', label: 'Cloud Security', color: '#06b6d4' },
  { value: 'APPLICATION_SECURITY', label: 'Application Security', color: '#22c55e' },
];

const LEVEL_META: Record<
  string,
  { color: string; bg: string; label: string; desc: string }
> = {
  ENTRY: {
    color: '#22c55e',
    bg: 'rgba(34,197,94,0.1)',
    label: 'Entry',
    desc: 'Base e primeira insercao',
  },
  INTERMEDIATE: {
    color: '#3b82f6',
    bg: 'rgba(59,130,246,0.1)',
    label: 'Intermediate',
    desc: 'Especialização funcional',
  },
  ADVANCED: {
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.1)',
    label: 'Advanced',
    desc: 'Profundidade ou senioridade',
  },
  EXPERT: {
    color: '#ef4444',
    bg: 'rgba(239,68,68,0.1)',
    label: 'Expert',
    desc: 'Referencia de mercado',
  },
};

function CertCard({
  cert,
}: {
  cert: (typeof CERTIFICATIONS)[number];
}) {
  const meta = LEVEL_META[cert.level] ?? LEVEL_META.ENTRY;
  const categoryColor =
    CATEGORIES.find((item) => item.value === cert.category)?.color ?? '#8b5cf6';

  return (
    <Link
      href={`/certifications/${cert.slug}`}
      style={{ textDecoration: 'none', display: 'block', height: '100%' }}
    >
      <div
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--ds-card)',
          border: '1px solid var(--ds-card-border)',
          borderRadius: 14,
          padding: '20px',
          cursor: 'pointer',
          transition: 'all 200ms ease',
          position: 'relative',
          overflow: 'hidden',
        }}
        onMouseEnter={(event) => {
          const element = event.currentTarget as HTMLElement;
          element.style.borderColor = `${meta.color}40`;
          element.style.transform = 'translateY(-2px)';
          element.style.boxShadow = `0 8px 32px rgba(0,0,0,0.35), 0 0 0 1px ${meta.color}20`;
        }}
        onMouseLeave={(event) => {
          const element = event.currentTarget as HTMLElement;
          element.style.borderColor = 'var(--ds-card-border)';
          element.style.transform = 'translateY(0)';
          element.style.boxShadow = 'none';
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            background: `linear-gradient(90deg, ${meta.color}60, ${categoryColor}35, transparent)`,
          }}
        />

        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 12,
            marginBottom: 14,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                padding: '2px 9px',
                borderRadius: 5,
                fontSize: 10,
                fontFamily: '"JetBrains Mono", monospace',
                letterSpacing: '0.08em',
                color: meta.color,
                background: meta.bg,
                border: `1px solid ${meta.color}30`,
              }}
            >
              {meta.label}
            </span>

            <div>
              <span
                style={{
                  fontFamily: '"Space Grotesk", sans-serif',
                  fontWeight: 700,
                  fontSize: 22,
                  color: 'var(--ds-title-card, #f0eeff)',
                }}
              >
                {cert.acronym}
              </span>
              <div
                style={{
                  fontFamily: '"Inter", sans-serif',
                  fontSize: 12,
                  color: 'var(--ds-body-dim)',
                  marginTop: 2,
                }}
              >
                {cert.provider}
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div
              style={{
                fontFamily: '"Space Grotesk", sans-serif',
                fontWeight: 700,
                fontSize: 16,
                color: meta.color,
              }}
            >
              {cert.searchCost}
            </div>
            <div
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: 9,
                color: 'var(--ds-mono-dim)',
                letterSpacing: '0.06em',
              }}
            >
              investimento
            </div>
          </div>
        </div>

        <p
          style={{
            fontSize: 12,
            color: 'var(--ds-body)',
            lineHeight: 1.65,
            marginBottom: 14,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {cert.description}
        </p>

        <div
          style={{
            padding: '10px 12px',
            borderRadius: 10,
            background: 'rgba(34,197,94,0.06)',
            border: '1px solid rgba(34,197,94,0.14)',
            marginBottom: 10,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 7,
            }}
          >
            <Shield size={13} style={{ color: '#22c55e', marginTop: 1 }} />
            <div>
              <div
                style={{
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: 9,
                  color: 'rgba(34,197,94,0.9)',
                  marginBottom: 3,
                }}
              >
                MELHOR PARA
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: 'var(--ds-body)',
                  lineHeight: 1.55,
                }}
              >
                {cert.bestFor}
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            padding: '10px 12px',
            borderRadius: 10,
            background: 'rgba(245,158,11,0.06)',
            border: '1px solid rgba(245,158,11,0.14)',
            marginBottom: 14,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 7,
            }}
          >
            <TriangleAlert size={13} style={{ color: '#f59e0b', marginTop: 1 }} />
            <div>
              <div
                style={{
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: 9,
                  color: 'rgba(245,158,11,0.95)',
                  marginBottom: 3,
                }}
              >
                CUIDADO
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: 'var(--ds-body-dim)',
                  lineHeight: 1.55,
                }}
              >
                {cert.caution}
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            gap: 14,
            flexWrap: 'wrap',
            borderTop: '1px solid var(--p-border-soft)',
            paddingTop: 12,
            marginTop: 'auto',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Clock size={11} style={{ color: 'var(--ds-mono-dim)' }} />
            <span
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: 10,
                color: 'var(--ds-body-dim)',
              }}
            >
              {cert.studyHours}
            </span>
          </div>
          <span
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 10,
              color: 'var(--ds-body-dim)',
            }}
          >
            {cert.validityLabel}
          </span>
          <div
            style={{
              marginLeft: 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <span
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: 9,
                color: `${categoryColor}80`,
              }}
            >
              {CATEGORIES.find((item) => item.value === cert.category)?.label ??
                cert.category}
            </span>
            <ChevronRight size={11} style={{ color: `${meta.color}60` }} />
          </div>
        </div>
      </div>
    </Link>
  );
}

function CertificationsPageInner() {
  const searchParams = useSearchParams();
  const recommendedPath = useMemo(
    () => resolveCareerPath(searchParams.get('path')),
    [searchParams]
  );
  const [search, setSearch] = useState(() => searchParams.get('search') ?? '');
  const [level, setLevel] = useState('all');
  const [category, setCategory] = useState('all');

  const filtered = CERTIFICATIONS.filter((cert) => {
    if (level !== 'all' && cert.level !== level) return false;
    if (category !== 'all' && cert.category !== category) return false;

    if (!search) return true;

    const query = search.toLowerCase();
    return (
      cert.name.toLowerCase().includes(query) ||
      cert.fullName.toLowerCase().includes(query) ||
      cert.acronym.toLowerCase().includes(query) ||
      cert.description.toLowerCase().includes(query) ||
      cert.bestFor.toLowerCase().includes(query) ||
      cert.provider.toLowerCase().includes(query)
    );
  }).sort(
    (first, second) =>
      LEVEL_ORDER.indexOf(first.level) - LEVEL_ORDER.indexOf(second.level)
  );

  const counts = LEVELS.slice(1).reduce((accumulator, item) => {
    accumulator[item.value] = CERTIFICATIONS.filter(
      (cert) => cert.level === item.value
    ).length;
    return accumulator;
  }, {} as Record<string, number>);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--p-bg, #0b0f14)',
        color: 'var(--ds-title-section, #e6eef8)',
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: 'clamp(20px, 4vw, 40px) clamp(16px, 4vw, 24px)',
        }}
      >
        <div style={{ marginBottom: 28 }}>
          <div
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 10,
              color: 'var(--ds-purple)',
              letterSpacing: '0.14em',
              marginBottom: 8,
            }}
          >
            CAREERS / CERTIFICATIONS
          </div>
          <h1
            style={{
              fontFamily: '"Space Grotesk", sans-serif',
              fontWeight: 700,
              fontSize: 32,
              marginBottom: 8,
              color: 'var(--ds-title-card, #f0eeff)',
            }}
          >
            Certificacoes com contexto de carreira
          </h1>
          <p
            style={{
              fontSize: 14,
              color: 'var(--ds-body)',
              maxWidth: 760,
              lineHeight: 1.65,
            }}
          >
            Em vez de tratar toda certificação como igual, este catálogo mostra
            para quem cada uma faz sentido, onde ela ajuda no mercado e onde ela
            costuma ser superestimada. Revisado em {CONTENT_LAST_REVIEWED}.
          </p>
        </div>

        {recommendedPath && (
          <div
            style={{
              padding: '14px 16px',
              borderRadius: 12,
              background: `linear-gradient(135deg, rgba(${recommendedPath.rgb},0.12), rgba(34,197,94,0.05))`,
              border: `1px solid rgba(${recommendedPath.rgb},0.24)`,
              marginBottom: 18,
            }}
          >
            <div
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: 9,
                color: recommendedPath.color,
                letterSpacing: '0.12em',
                marginBottom: 6,
              }}
            >
              TRILHA ATIVA
            </div>
            <div
              style={{
                fontFamily: '"Space Grotesk", sans-serif',
                fontWeight: 700,
                fontSize: 16,
                color: 'var(--ds-title-card, #f0eeff)',
                marginBottom: 4,
              }}
            >
              {recommendedPath.label}
            </div>
            <p
              style={{
                margin: '0 0 10px',
                fontSize: 13,
                lineHeight: 1.6,
                color: 'var(--ds-body)',
              }}
            >
              Para chegar em <strong>{recommendedPath.toRole}</strong>, as
              certificacoes abaixo tendem a fazer mais sentido nesta ordem.
            </p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {recommendedPath.steps
                .filter((step) => step.slug)
                .map((step) => (
                  <Link
                    key={step.slug}
                    href={`/certifications/${step.slug}`}
                    style={{
                      textDecoration: 'none',
                      padding: '6px 10px',
                      borderRadius: 999,
                      border: `1px solid rgba(${recommendedPath.rgb},0.24)`,
                      background: `rgba(${recommendedPath.rgb},0.08)`,
                      color: 'var(--ds-title-section, #e6eef8)',
                      fontSize: 11,
                    }}
                  >
                    {step.acronym} · {step.name}
                  </Link>
                ))}
            </div>
          </div>
        )}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            gap: 12,
            alignItems: 'center',
            marginBottom: 22,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 12px',
              borderRadius: 10,
              background: 'var(--ds-input)',
              border: '1px solid var(--p-input-border)',
            }}
          >
            <Search size={14} style={{ color: 'var(--ds-mono-dim)' }} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por papel, nome, provider ou contexto..."
              style={{
                width: '100%',
                border: 'none',
                background: 'transparent',
                color: 'var(--ds-title-section)',
                fontSize: 13,
                outline: 'none',
              }}
            />
          </div>

          <div
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 11,
              color: 'var(--ds-mono-dim)',
              whiteSpace: 'nowrap',
            }}
          >
            {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
          {LEVELS.map((item) => {
            const active = level === item.value;
            const meta = item.value !== 'all' ? LEVEL_META[item.value] : null;
            return (
              <button
                key={item.value}
                onClick={() => setLevel(item.value)}
                style={{
                  padding: '7px 16px',
                  borderRadius: 8,
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: '"Space Grotesk", sans-serif',
                  fontSize: 12,
                  fontWeight: 600,
                  background: active
                    ? meta?.bg ?? 'rgba(139,92,246,0.15)'
                    : 'rgba(255,140,40,0.06)',
                  color: active
                    ? meta?.color ?? '#a78bfa'
                    : 'var(--ds-body-dim)',
                  boxShadow: active
                    ? `0 0 0 1px ${meta?.color ?? '#a78bfa'}40`
                    : '0 0 0 1px rgba(255,140,40,0.16)',
                }}
              >
                {item.label}
                {item.value !== 'all' ? ` · ${counts[item.value] ?? 0}` : ''}
              </button>
            );
          })}
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 24 }}>
          {CATEGORIES.map((item) => {
            const active = category === item.value;
            return (
              <button
                key={item.value}
                onClick={() => setCategory(item.value)}
                style={{
                  padding: '7px 16px',
                  borderRadius: 8,
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: 10,
                  letterSpacing: '0.05em',
                  background: active
                    ? `${item.color ?? '#8b5cf6'}18`
                    : 'rgba(255,140,40,0.06)',
                  color: active
                    ? item.color ?? '#a78bfa'
                    : 'var(--ds-body-dim)',
                  boxShadow: active
                    ? `0 0 0 1px ${(item.color ?? '#8b5cf6')}40`
                    : '0 0 0 1px rgba(255,140,40,0.16)',
                }}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(340px, 100%), 1fr))',
            gap: 18,
          }}
        >
          {filtered.map((cert) => (
            <CertCard key={cert.slug} cert={cert} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function CertificationsPage() {
  return (
    <Suspense fallback={null}>
      <CertificationsPageInner />
    </Suspense>
  );
}
