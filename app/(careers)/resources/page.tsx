'use client';

import { Suspense, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  BookOpen,
  ExternalLink,
  FileText,
  FlaskConical,
  Monitor,
  ShieldCheck,
  TriangleAlert,
} from 'lucide-react';
import {
  CONTENT_LAST_REVIEWED,
  resolveCareerPath,
  STUDY_RESOURCES,
} from '@/lib/content/career-guide';

const TYPES = [
  { id: 'all', label: 'Todos', icon: null },
  { id: 'VIDEO', label: 'Video', icon: <Monitor size={12} /> },
  { id: 'COURSE', label: 'Curso', icon: <BookOpen size={12} /> },
  { id: 'LAB', label: 'Lab', icon: <FlaskConical size={12} /> },
  { id: 'BOOK', label: 'Livro', icon: <FileText size={12} /> },
  { id: 'GUIDE', label: 'Guia', icon: <FileText size={12} /> },
];

const LEVELS = [
  { id: 'all', label: 'Todos os niveis' },
  { id: 'ENTRY', label: 'Entry', color: '#22c55e' },
  { id: 'INTERMEDIATE', label: 'Intermediate', color: '#3b82f6' },
  { id: 'ADVANCED', label: 'Advanced', color: '#f59e0b' },
];

function ResourcesPageInner() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(() => searchParams.get('search') ?? '');
  const [freeOnly, setFreeOnly] = useState(false);
  const [type, setType] = useState('all');
  const [level, setLevel] = useState('all');
  const recommendedPath = useMemo(
    () => resolveCareerPath(searchParams.get('path')),
    [searchParams]
  );

  const filtered = STUDY_RESOURCES.filter((resource) => {
    if (freeOnly && resource.cost > 0) return false;
    if (type !== 'all' && resource.type !== type) return false;
    if (level !== 'all' && resource.level !== level) return false;

    if (!search) return true;

    const query = search.toLowerCase();
    return (
      resource.title.toLowerCase().includes(query) ||
      resource.provider.toLowerCase().includes(query) ||
      resource.cert.toLowerCase().includes(query) ||
      resource.desc.toLowerCase().includes(query) ||
      resource.bestFor.toLowerCase().includes(query) ||
      resource.tags.some((tag) => tag.includes(query))
    );
  });

  const S = {
    mono: { fontFamily: '"JetBrains Mono", monospace' as const },
    grotesk: { fontFamily: '"Space Grotesk", sans-serif' as const },
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--p-bg, #0b0f14)',
        color: 'var(--ds-title-section, #e6eef8)',
        fontFamily: '"Inter", sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: 1120,
          margin: '0 auto',
          padding: 'clamp(20px, 4vw, 40px) clamp(16px, 4vw, 24px)',
        }}
      >
        <div style={{ marginBottom: 28 }}>
          <div
            style={{
              ...S.mono,
              fontSize: 10,
              color: 'var(--ds-purple)',
              letterSpacing: '0.14em',
              marginBottom: 8,
            }}
          >
            CAREERS / STUDY RESOURCES
          </div>
          <h1
            style={{
              ...S.grotesk,
              fontWeight: 700,
              fontSize: 30,
              color: 'var(--ds-title-card, #f0eeff)',
              marginBottom: 6,
            }}
          >
            Recursos curados para aprender de verdade
          </h1>
          <p
            style={{
              fontSize: 13,
              color: 'var(--ds-body-dim)',
              maxWidth: 760,
              lineHeight: 1.65,
            }}
          >
            Em vez de listar qualquer curso popular, esta tela prioriza recurso
            por contexto de carreira. Revisado editorialmente em{' '}
            {CONTENT_LAST_REVIEWED}.
          </p>
        </div>

        {recommendedPath && (
          <div
            style={{
              padding: '14px 16px',
              borderRadius: 12,
              background: `linear-gradient(135deg, rgba(${recommendedPath.rgb},0.12), rgba(139,92,246,0.05))`,
              border: `1px solid rgba(${recommendedPath.rgb},0.24)`,
              marginBottom: 18,
            }}
          >
            <div
              style={{
                ...S.mono,
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
                ...S.grotesk,
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
              De <strong>{recommendedPath.fromRole}</strong> para{' '}
              <strong>{recommendedPath.toRole}</strong>. Os recursos abaixo fazem
              mais sentido quando ajudam a cumprir essa migração.
            </p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {recommendedPath.steps.slice(0, 4).map((step) => (
                <a
                  key={`${recommendedPath.id}-${step.order}`}
                  href={step.resources[0]?.url ?? '#'}
                  target="_blank"
                  rel="noopener noreferrer"
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
                </a>
              ))}
            </div>
          </div>
        )}

        <div
          style={{
            padding: '14px 16px',
            borderRadius: 12,
            background:
              'linear-gradient(135deg, rgba(34,197,94,0.07), rgba(59,130,246,0.07))',
            border: '1px solid rgba(59,130,246,0.18)',
            marginBottom: 22,
          }}
        >
          <div
            style={{
              ...S.mono,
              fontSize: 9,
              color: 'rgba(59,130,246,0.8)',
              letterSpacing: '0.12em',
              marginBottom: 6,
            }}
          >
            COMO USAR ESTA CURADORIA
          </div>
          <p
            style={{
              margin: 0,
              fontSize: 13,
              color: 'var(--ds-body)',
              lineHeight: 1.65,
            }}
          >
            Cada card mostra quando o recurso realmente ajuda e quando ele pode
            ser usado fora de hora. Isso evita montar trilhas bonitas no papel,
            mas ruins para a prática.
          </p>
        </div>

        <div
          className="resource-filters"
          style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 18 }}
        >
          <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por papel, cert, provider, stack..."
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: 9,
                background: 'var(--ds-input)',
                border: '1px solid var(--p-input-border)',
                color: 'var(--ds-title-section)',
                fontSize: 13,
                outline: 'none',
              }}
            />
          </div>

          {TYPES.map((item) => (
            <button
              key={item.id}
              onClick={() => setType(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                padding: '8px 14px',
                borderRadius: 8,
                border: 'none',
                cursor: 'pointer',
                ...S.grotesk,
                fontSize: 12,
                fontWeight: 600,
                background:
                  type === item.id
                    ? item.id === 'all'
                      ? 'rgba(139,92,246,0.15)'
                      : 'rgba(255,140,40,0.12)'
                    : 'rgba(255,140,40,0.06)',
                color:
                  type === item.id
                    ? item.id === 'all'
                      ? '#a78bfa'
                      : 'rgba(255,140,40,0.95)'
                    : 'rgba(255,140,40,0.85)',
                boxShadow:
                  type === item.id
                    ? `0 0 0 1px ${item.id === 'all' ? 'rgba(139,92,246,0.3)' : 'rgba(255,140,40,0.28)'}`
                    : '0 0 0 1px rgba(255,140,40,0.16)',
              }}
            >
              {item.icon}
              {item.label}
            </button>
          ))}

          <button
            onClick={() => setFreeOnly((current) => !current)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 14px',
              borderRadius: 8,
              border: 'none',
              cursor: 'pointer',
              ...S.grotesk,
              fontSize: 12,
              fontWeight: 600,
              background: freeOnly
                ? 'rgba(34,197,94,0.15)'
                : 'rgba(255,140,40,0.06)',
              color: freeOnly ? '#22c55e' : 'rgba(255,140,40,0.85)',
              boxShadow: freeOnly
                ? '0 0 0 1px rgba(34,197,94,0.28)'
                : '0 0 0 1px rgba(255,140,40,0.16)',
            }}
          >
            Gratis
          </button>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
          {LEVELS.map((item) => (
            <button
              key={item.id}
              onClick={() => setLevel(item.id)}
              style={{
                padding: '6px 14px',
                borderRadius: 7,
                border: 'none',
                cursor: 'pointer',
                ...S.mono,
                fontSize: 10,
                letterSpacing: '0.06em',
                background:
                  level === item.id
                    ? `${item.color ?? '#8b5cf6'}20`
                    : 'rgba(255,140,40,0.06)',
                color:
                  level === item.id
                    ? item.color ?? '#a78bfa'
                    : 'var(--ds-body-dim)',
                boxShadow:
                  level === item.id
                    ? `0 0 0 1px ${item.color ?? '#a78bfa'}40`
                    : '0 0 0 1px rgba(255,140,40,0.16)',
              }}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div
          style={{
            ...S.mono,
            fontSize: 11,
            color: 'var(--ds-mono-dim)',
            marginBottom: 18,
          }}
        >
          {filtered.length} recurso{filtered.length !== 1 ? 's' : ''} ·{' '}
          {filtered.filter((resource) => resource.cost === 0).length} gratuitos
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(340px, 100%), 1fr))',
            gap: 16,
          }}
        >
          {filtered.map((resource) => {
            const levelColor =
              resource.level === 'ENTRY'
                ? '#22c55e'
                : resource.level === 'INTERMEDIATE'
                  ? '#3b82f6'
                  : '#f59e0b';

            return (
              <a
                key={resource.id}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'none', display: 'block', height: '100%' }}
              >
                <div
                  style={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    background: 'var(--ds-card)',
                    border: '1px solid var(--ds-card-border)',
                    borderRadius: 12,
                    padding: '18px',
                    transition: 'all 200ms',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                  onMouseEnter={(event) => {
                    const element = event.currentTarget as HTMLElement;
                    element.style.borderColor = `${levelColor}35`;
                    element.style.transform = 'translateY(-2px)';
                    element.style.boxShadow = '0 8px 24px rgba(0,0,0,0.35)';
                  }}
                  onMouseLeave={(event) => {
                    const element = event.currentTarget as HTMLElement;
                    element.style.borderColor = 'var(--ds-card-border)';
                    element.style.transform = 'none';
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
                      background: `linear-gradient(90deg, ${levelColor}55, transparent)`,
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
                    <div>
                      <div
                        style={{
                          display: 'flex',
                          gap: 8,
                          flexWrap: 'wrap',
                          marginBottom: 8,
                        }}
                      >
                        <span
                          style={{
                            ...S.mono,
                            fontSize: 9,
                            padding: '2px 8px',
                            borderRadius: 999,
                            color: levelColor,
                            background: `${levelColor}18`,
                            border: `1px solid ${levelColor}30`,
                          }}
                        >
                          {resource.level}
                        </span>
                        <span
                          style={{
                            ...S.mono,
                            fontSize: 9,
                            padding: '2px 8px',
                            borderRadius: 999,
                            color: 'var(--ds-mono-dim)',
                            background: 'var(--p-surface)',
                            border: '1px solid var(--p-border-soft)',
                          }}
                        >
                          {resource.cert}
                        </span>
                      </div>
                      <div
                        style={{
                          ...S.grotesk,
                          fontWeight: 700,
                          fontSize: 18,
                          color: 'var(--ds-title-card, #f0eeff)',
                          marginBottom: 3,
                        }}
                      >
                        {resource.title}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: 'var(--ds-body-dim)',
                        }}
                      >
                        {resource.provider}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div
                        style={{
                          ...S.grotesk,
                          fontWeight: 700,
                          fontSize: 15,
                          color: resource.cost === 0 ? '#22c55e' : levelColor,
                        }}
                      >
                        {resource.cost === 0 ? 'Gratis' : `$${resource.cost}`}
                      </div>
                      <div
                        style={{
                          ...S.mono,
                          fontSize: 9,
                          color: 'var(--ds-mono-dim)',
                        }}
                      >
                        {resource.hours}h
                      </div>
                    </div>
                  </div>

                  <p
                    style={{
                      fontSize: 12,
                      color: 'var(--ds-body)',
                      lineHeight: 1.65,
                      marginBottom: 14,
                    }}
                  >
                    {resource.desc}
                  </p>

                  <div
                    style={{
                      display: 'grid',
                      gap: 10,
                      marginTop: 'auto',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        gap: 8,
                        alignItems: 'flex-start',
                        padding: '10px 12px',
                        borderRadius: 10,
                        background: 'rgba(34,197,94,0.07)',
                        border: '1px solid rgba(34,197,94,0.15)',
                      }}
                    >
                      <ShieldCheck size={14} style={{ color: '#22c55e', marginTop: 1 }} />
                      <div>
                        <div
                          style={{
                            ...S.mono,
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
                          {resource.bestFor}
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        gap: 8,
                        alignItems: 'flex-start',
                        padding: '10px 12px',
                        borderRadius: 10,
                        background: 'rgba(245,158,11,0.07)',
                        border: '1px solid rgba(245,158,11,0.15)',
                      }}
                    >
                      <TriangleAlert size={14} style={{ color: '#f59e0b', marginTop: 1 }} />
                      <div>
                        <div
                          style={{
                            ...S.mono,
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
                          {resource.caution}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      marginTop: 14,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div
                      style={{
                        ...S.mono,
                        fontSize: 10,
                        color: 'var(--ds-mono-dim)',
                      }}
                    >
                      rating {resource.rating.toFixed(1)}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        color: levelColor,
                        ...S.grotesk,
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      Acessar
                      <ExternalLink size={13} />
                    </div>
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

export default function ResourcesPage() {
  return (
    <Suspense fallback={null}>
      <ResourcesPageInner />
    </Suspense>
  );
}
