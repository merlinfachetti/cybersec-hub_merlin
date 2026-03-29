'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowRight, ChevronRight, Compass, Layers } from 'lucide-react';
import {
  CAREER_PATHS,
  CAREER_PATH_LIST,
  CERTIFICATIONS,
  CONTENT_LAST_REVIEWED,
  getCareerStageMeta,
  resolveCareerPath,
} from '@/lib/content/career-guide';

const CERT_LEVELS = [
  {
    id: 'ENTRY',
    label: 'Entry',
    color: '#22c55e',
    bg: 'rgba(34,197,94,0.12)',
  },
  {
    id: 'INTERMEDIATE',
    label: 'Intermediate',
    color: '#3b82f6',
    bg: 'rgba(59,130,246,0.12)',
  },
  {
    id: 'ADVANCED',
    label: 'Advanced',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.12)',
  },
  {
    id: 'EXPERT',
    label: 'Expert',
    color: '#ef4444',
    bg: 'rgba(239,68,68,0.12)',
  },
];

type PathId = keyof typeof CAREER_PATHS;
const DEFAULT_PATH_ID: PathId = 'dev-to-security-engineer';

interface RoadmapUser {
  name: string | null;
  role: string;
  targetRole?: string | null;
  studyHoursPerWeek?: number | null;
}

function resolvePathId(hint?: string | null): PathId {
  const resolved = resolveCareerPath(hint);
  if (resolved?.id && resolved.id in CAREER_PATHS) {
    return resolved.id as PathId;
  }

  return DEFAULT_PATH_ID;
}

function RoadmapPageContent() {
  const searchParams = useSearchParams();
  const queryPathId = resolvePathId(searchParams.get('path'));
  const [activeTab, setActiveTab] = useState<'paths' | 'all'>('paths');
  const [activePath, setActivePath] = useState<PathId>(queryPathId);
  const [openStep, setOpenStep] = useState<number | null>(0);
  const [allLevel, setAllLevel] = useState('ENTRY');
  const [user, setUser] = useState<RoadmapUser | null>(null);

  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include', cache: 'no-store' })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (data?.user) setUser(data.user);
      })
      .catch(() => null);
  }, []);

  useEffect(() => {
    const nextPathId = resolvePathId(searchParams.get('path') ?? user?.targetRole);

    setActivePath((current) => {
      if (current === nextPathId) return current;
      setOpenStep(0);
      return nextPathId;
    });
  }, [searchParams, user?.targetRole]);

  const path = CAREER_PATHS[activePath];
  const filteredAll = CERTIFICATIONS.filter((cert) => cert.level === allLevel);
  const pathStageMeta = getCareerStageMeta(path.stage);
  const recommendedPath = useMemo(() => {
    return CAREER_PATHS[resolvePathId(searchParams.get('path') ?? user?.targetRole)];
  }, [path, searchParams, user?.targetRole]);

  const S = {
    card: {
      background: 'var(--ds-card)',
      border: '1px solid var(--ds-card-border)',
      borderRadius: 12,
    },
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
            CAREERS / ROADMAPS
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
            Roadmaps por papel real
          </h1>
          <p
            style={{
              fontSize: 13,
              color: 'var(--ds-body-dim)',
              maxWidth: 760,
              lineHeight: 1.65,
            }}
          >
            Trilhas revisadas para refletir mais a carreira real do que uma
            simples escada de certificacoes. Conteudo editorial revisado em{' '}
            {CONTENT_LAST_REVIEWED}.
          </p>
        </div>

        <div
          style={{
            ...S.card,
            padding: '16px 18px',
            marginBottom: 18,
            borderColor: `${pathStageMeta.color}35`,
            background: `linear-gradient(135deg, ${pathStageMeta.bg}, rgba(139,92,246,0.05))`,
          }}
        >
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 12,
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ maxWidth: 760 }}>
              <div
                style={{
                  ...S.mono,
                  fontSize: 9,
                  color: `${pathStageMeta.color}`,
                  letterSpacing: '0.12em',
                  marginBottom: 6,
                }}
              >
                PERFIL E MERCADO
              </div>
              <div
                style={{
                  ...S.grotesk,
                  fontWeight: 700,
                  fontSize: 17,
                  color: 'var(--ds-title-card, #f0eeff)',
                  marginBottom: 4,
                }}
              >
                {recommendedPath.label}
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: 13,
                  lineHeight: 1.65,
                  color: 'var(--ds-body)',
                }}
              >
                {user?.targetRole
                  ? `Objetivo salvo no seu perfil: ${user.targetRole}.`
                  : 'Sem objetivo salvo no perfil ainda; usando a trilha atualmente aberta como referencia.'}{' '}
                Este caminho mira <strong>{recommendedPath.toRole}</strong> e
                foi organizado para <strong>{pathStageMeta.market}</strong>.
              </p>
            </div>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span
                style={{
                  ...S.mono,
                  fontSize: 10,
                  color: pathStageMeta.color,
                  background: pathStageMeta.bg,
                  border: `1px solid ${pathStageMeta.color}30`,
                  padding: '5px 10px',
                  borderRadius: 999,
                }}
              >
                {recommendedPath.stageLabel}
              </span>
              <span
                style={{
                  ...S.mono,
                  fontSize: 10,
                  color: path.color,
                  background: `rgba(${path.rgb},0.12)`,
                  border: `1px solid rgba(${path.rgb},0.28)`,
                  padding: '5px 10px',
                  borderRadius: 999,
                }}
              >
                {recommendedPath.team === 'hybrid'
                  ? 'Cross-team'
                  : `${recommendedPath.team.toUpperCase()} TEAM`}
              </span>
            </div>
          </div>
        </div>

        <div
          style={{
            ...S.card,
            padding: '16px 18px',
            marginBottom: 24,
            borderColor: 'rgba(6,182,212,0.22)',
            background:
              'linear-gradient(135deg, rgba(6,182,212,0.08), rgba(139,92,246,0.06))',
          }}
        >
          <div
            style={{
              ...S.mono,
              fontSize: 9,
              color: 'rgba(6,182,212,0.75)',
              letterSpacing: '0.12em',
              marginBottom: 6,
            }}
          >
            COMO LER ESTES ROADMAPS
          </div>
          <p
            style={{
              margin: 0,
              fontSize: 13,
              color: 'var(--ds-body)',
              lineHeight: 1.65,
            }}
          >
            Os caminhos abaixo misturam certificacao, pratica e especializacao
            por funcao. Quando uma etapa nao e um exame, ela aparece de
            proposito: em CyberSec, varios papeis dependem mais de portfolio,
            laboratorios e contexto operacional do que de acumular prova.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
          {[
            { id: 'paths', label: 'Career Paths', icon: <Compass size={14} /> },
            { id: 'all', label: 'Certification Catalog', icon: <Layers size={14} /> },
          ].map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'paths' | 'all')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 7,
                  padding: '10px 16px',
                  borderRadius: 9,
                  border: 'none',
                  cursor: 'pointer',
                  ...S.grotesk,
                  fontSize: 12,
                  fontWeight: 600,
                  background: active
                    ? 'rgba(139,92,246,0.15)'
                    : 'rgba(255,140,40,0.06)',
                  color: active ? '#a78bfa' : 'var(--ds-body-dim)',
                  boxShadow: active
                    ? '0 0 0 1px rgba(139,92,246,0.25)'
                    : '0 0 0 1px rgba(255,140,40,0.16)',
                }}
              >
                {tab.icon}
                {tab.label}
              </button>
            );
          })}
        </div>

        {activeTab === 'paths' && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(260px, 320px) 1fr',
              gap: 18,
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {CAREER_PATH_LIST.map((item) => {
                const active = activePath === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActivePath(item.id as PathId);
                      setOpenStep(0);
                    }}
                    style={{
                      ...S.card,
                      padding: '16px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      borderColor: active
                        ? `${item.color}55`
                        : 'var(--ds-card-border)',
                      background: active
                        ? `rgba(${item.rgb},0.09)`
                        : 'var(--p-surface)',
                      boxShadow: active
                        ? `0 0 24px rgba(${item.rgb},0.14)`
                        : 'none',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        marginBottom: 8,
                      }}
                    >
                      <span style={{ fontSize: 22 }}>{item.icon}</span>
                      <div>
                        <div
                          style={{
                            ...S.grotesk,
                            fontWeight: 700,
                            fontSize: 15,
                            color: active ? item.color : 'var(--ds-title-section)',
                          }}
                        >
                          {item.label}
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            color: 'var(--ds-body-dim)',
                            marginTop: 2,
                          }}
                        >
                          {item.desc}
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            gap: 6,
                            flexWrap: 'wrap',
                            marginTop: 8,
                          }}
                        >
                          <span
                            style={{
                              ...S.mono,
                              fontSize: 9,
                              color: getCareerStageMeta(item.stage).color,
                              background: getCareerStageMeta(item.stage).bg,
                              border: `1px solid ${getCareerStageMeta(item.stage).color}30`,
                              padding: '2px 7px',
                              borderRadius: 999,
                            }}
                          >
                            {item.stageLabel}
                          </span>
                          <span
                            style={{
                              ...S.mono,
                              fontSize: 9,
                              color: item.color,
                              background: `rgba(${item.rgb},0.12)`,
                              border: `1px solid rgba(${item.rgb},0.22)`,
                              padding: '2px 7px',
                              borderRadius: 999,
                            }}
                          >
                            {item.team === 'hybrid'
                              ? 'Cross-team'
                              : `${item.team.toUpperCase()} TEAM`}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: 'var(--ds-body)',
                        lineHeight: 1.6,
                        marginBottom: 10,
                      }}
                    >
                      {item.goal}
                    </div>
                    <div style={{ display: 'flex', gap: 12 }}>
                      <span
                        style={{
                          ...S.mono,
                          fontSize: 10,
                          color: item.color,
                        }}
                      >
                        {item.totalHours}
                      </span>
                      <span
                        style={{
                          ...S.mono,
                          fontSize: 10,
                          color: 'var(--ds-body-dim)',
                        }}
                      >
                        {item.totalCost}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div>
              <div
                style={{
                  ...S.card,
                  padding: '18px',
                  marginBottom: 14,
                  borderColor: `${path.color}30`,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 12,
                    marginBottom: 10,
                  }}
                >
                  <span style={{ fontSize: 26 }}>{path.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        ...S.grotesk,
                        fontWeight: 700,
                        fontSize: 18,
                        color: path.color,
                        marginBottom: 2,
                      }}
                    >
                      {path.label}
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        color: 'var(--ds-body)',
                        marginBottom: 6,
                      }}
                    >
                      {path.goal}
                    </div>
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
                          color: pathStageMeta.color,
                          background: pathStageMeta.bg,
                          border: `1px solid ${pathStageMeta.color}30`,
                          padding: '2px 8px',
                          borderRadius: 999,
                        }}
                      >
                        {pathStageMeta.market}
                      </span>
                      <span
                        style={{
                          ...S.mono,
                          fontSize: 9,
                          color: path.color,
                          background: `rgba(${path.rgb},0.12)`,
                          border: `1px solid rgba(${path.rgb},0.22)`,
                          padding: '2px 8px',
                          borderRadius: 999,
                        }}
                      >
                        {path.fromRole}
                        {' -> '}
                        {path.toRole}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                      <span
                        style={{
                          ...S.mono,
                          fontSize: 10,
                          color: path.color,
                        }}
                      >
                        {path.totalHours}
                      </span>
                      <span
                        style={{
                          ...S.mono,
                          fontSize: 10,
                          color: 'var(--ds-body-dim)',
                        }}
                      >
                        {path.totalCost}
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    padding: '12px 14px',
                    borderRadius: 10,
                    background: `rgba(${path.rgb},0.07)`,
                    border: `1px solid rgba(${path.rgb},0.16)`,
                  }}
                >
                  <div
                    style={{
                      ...S.mono,
                      fontSize: 9,
                      color: `${path.color}90`,
                      letterSpacing: '0.1em',
                      marginBottom: 5,
                    }}
                  >
                    REALITY CHECK
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: 'var(--ds-body)',
                      lineHeight: 1.6,
                      marginBottom: 10,
                    }}
                  >
                    {path.realityCheck}
                  </div>
                  <div
                    style={{
                      ...S.mono,
                      fontSize: 9,
                      color: 'var(--ds-mono-dim)',
                      letterSpacing: '0.04em',
                    }}
                  >
                    Melhor para: {path.audience}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {path.steps.map((step, index) => {
                  const isOpen = openStep === index;
                  const detailHref =
                    step.href ?? (step.slug ? `/certifications/${step.slug}` : undefined);

                  return (
                    <div
                      key={step.order}
                      style={{
                        ...S.card,
                        overflow: 'hidden',
                        borderColor: isOpen
                          ? `${step.color}35`
                          : 'var(--ds-card-border)',
                        transition: 'border-color 200ms',
                      }}
                    >
                      <button
                        onClick={() => setOpenStep(isOpen ? null : index)}
                        style={{
                          width: '100%',
                          padding: '16px 20px',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          textAlign: 'left',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 14,
                        }}
                      >
                        <div
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: '50%',
                            background: `rgba(${path.rgb},0.15)`,
                            border: `1.5px solid ${step.color}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <span
                            style={{
                              ...S.mono,
                              fontSize: 11,
                              color: step.color,
                              fontWeight: 700,
                            }}
                          >
                            {step.order}
                          </span>
                        </div>

                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 10,
                              flexWrap: 'wrap',
                            }}
                          >
                            <span
                              style={{
                                ...S.grotesk,
                                fontWeight: 700,
                                fontSize: 15,
                                color: 'var(--ds-title-card, #f0eeff)',
                              }}
                            >
                              {step.acronym}
                            </span>
                            <span
                              style={{
                                fontSize: 12,
                                color: 'var(--ds-body-dim)',
                              }}
                            >
                              {step.name}
                            </span>
                            <span
                              style={{
                                ...S.mono,
                                fontSize: 9,
                                color: 'var(--ds-mono-dim)',
                              }}
                            >
                              by {step.provider}
                            </span>
                          </div>
                        </div>

                        <div
                          className="step-header-meta"
                          style={{
                            display: 'flex',
                            gap: 16,
                            alignItems: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <span
                            style={{
                              ...S.mono,
                              fontSize: 11,
                              color: step.color,
                            }}
                          >
                            {step.cost}
                          </span>
                          <span
                            style={{
                              ...S.mono,
                              fontSize: 11,
                              color: 'var(--ds-body-dim)',
                            }}
                          >
                            {step.hours}
                          </span>
                          <span
                            style={{
                              ...S.mono,
                              fontSize: 11,
                              color: 'var(--ds-body-dim)',
                            }}
                          >
                            {step.duration}
                          </span>
                          <ChevronRight
                            size={14}
                            style={{
                              color: 'var(--ds-mono-dim)',
                              transform: isOpen ? 'rotate(90deg)' : 'none',
                              transition: 'transform 200ms',
                            }}
                          />
                        </div>
                      </button>

                      <div
                        style={{
                          maxHeight: isOpen ? '900px' : '0',
                          overflow: 'hidden',
                          transition:
                            'max-height 350ms cubic-bezier(0.4,0,0.2,1)',
                        }}
                      >
                        <div
                          style={{
                            padding: '0 20px 20px',
                            borderTop: '1px solid var(--p-border-soft)',
                          }}
                        >
                          <p
                            style={{
                              fontSize: 13,
                              color: 'var(--ds-body)',
                              lineHeight: 1.68,
                              margin: '14px 0 16px',
                            }}
                          >
                            {step.why}
                          </p>

                          <div
                            style={{
                              display: 'grid',
                              gridTemplateColumns: '1fr 1fr',
                              gap: 16,
                              marginBottom: 16,
                            }}
                          >
                            <div>
                              <div
                                style={{
                                  ...S.mono,
                                  fontSize: 9,
                                  color: `${step.color}85`,
                                  letterSpacing: '0.1em',
                                  marginBottom: 8,
                                }}
                              >
                                TÓPICOS COBERTOS
                              </div>
                              <div
                                style={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: 5,
                                }}
                              >
                                {step.topics.map((topic) => (
                                  <div
                                    key={topic}
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: 6,
                                    }}
                                  >
                                    <div
                                      style={{
                                        width: 4,
                                        height: 4,
                                        borderRadius: '50%',
                                        background: step.color,
                                        flexShrink: 0,
                                      }}
                                    />
                                    <span
                                      style={{
                                        fontSize: 12,
                                        color: 'var(--ds-body-muted)',
                                      }}
                                    >
                                      {topic}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div>
                              <div
                                style={{
                                  ...S.mono,
                                  fontSize: 9,
                                  color: `${step.color}85`,
                                  letterSpacing: '0.1em',
                                  marginBottom: 8,
                                }}
                              >
                                RECURSOS RECOMENDADOS
                              </div>
                              <div
                                style={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: 8,
                                }}
                              >
                                {step.resources.map((resource) => (
                                  <a
                                    key={resource.name}
                                    href={resource.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                      display: 'flex',
                                      alignItems: 'flex-start',
                                      gap: 8,
                                      textDecoration: 'none',
                                    }}
                                  >
                                    <span
                                      style={{
                                        fontSize: 10,
                                        padding: '1px 6px',
                                        borderRadius: 3,
                                        background: resource.free
                                          ? 'rgba(34,197,94,0.1)'
                                          : 'rgba(245,158,11,0.1)',
                                        color: resource.free
                                          ? '#22c55e'
                                          : '#f59e0b',
                                        ...S.mono,
                                        flexShrink: 0,
                                        marginTop: 1,
                                      }}
                                    >
                                      {resource.free ? 'FREE' : 'PAGO'}
                                    </span>
                                    <div>
                                      <div
                                        style={{
                                          fontSize: 12,
                                          color:
                                            'var(--ds-title-section, #e6eef8)',
                                        }}
                                      >
                                        {resource.name}
                                      </div>
                                      <div
                                        style={{
                                          ...S.mono,
                                          fontSize: 9,
                                          color: 'var(--ds-body-dim)',
                                        }}
                                      >
                                        {resource.type}
                                      </div>
                                    </div>
                                  </a>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: 16,
                              padding: '12px 16px',
                              borderRadius: 8,
                              background: `rgba(${path.rgb},0.06)`,
                              border: `1px solid rgba(${path.rgb},0.15)`,
                            }}
                          >
                            <div>
                              <div
                                style={{
                                  ...S.mono,
                                  fontSize: 9,
                                  color: `${step.color}80`,
                                  marginBottom: 4,
                                }}
                              >
                                ABRE PORTAS PARA
                              </div>
                              <div
                                style={{
                                  fontSize: 12,
                                  color: 'var(--ds-body)',
                                }}
                              >
                                {step.outcome}
                              </div>
                            </div>

                            {detailHref ? (
                              <Link
                                href={detailHref}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 6,
                                  padding: '7px 14px',
                                  borderRadius: 7,
                                  background: `rgba(${path.rgb},0.15)`,
                                  border: `1px solid rgba(${path.rgb},0.3)`,
                                  color: step.color,
                                  textDecoration: 'none',
                                  fontSize: 12,
                                  ...S.grotesk,
                                  fontWeight: 600,
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {step.linkLabel ?? 'Ver detalhes'}
                                <ArrowRight size={12} />
                              </Link>
                            ) : null}
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

        {activeTab === 'all' && (
          <div>
            <div style={{ display: 'flex', gap: 10, marginBottom: 22, flexWrap: 'wrap' }}>
              {CERT_LEVELS.map((level) => (
                <button
                  key={level.id}
                  onClick={() => setAllLevel(level.id)}
                  style={{
                    padding: '8px 18px',
                    borderRadius: 8,
                    border: 'none',
                    cursor: 'pointer',
                    ...S.grotesk,
                    fontSize: 12,
                    fontWeight: 600,
                    transition: 'all 150ms',
                    background:
                      allLevel === level.id ? level.bg : 'rgba(255,140,40,0.06)',
                    color:
                      allLevel === level.id
                        ? level.color
                        : 'var(--ds-body-dim)',
                    boxShadow:
                      allLevel === level.id
                        ? `0 0 0 1px ${level.color}40`
                        : '0 0 0 1px rgba(255,140,40,0.16)',
                  }}
                >
                  {level.label}
                </button>
              ))}
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: 14,
              }}
            >
              {filteredAll.map((cert) => {
                const levelMeta =
                  CERT_LEVELS.find((item) => item.id === cert.level) ??
                  CERT_LEVELS[0];

                return (
                  <Link
                    key={cert.slug}
                    href={`/certifications/${cert.slug}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <div
                      style={{
                        ...S.card,
                        padding: '18px',
                        cursor: 'pointer',
                        transition: 'all 200ms',
                        position: 'relative',
                        overflow: 'hidden',
                        height: '100%',
                      }}
                      onMouseEnter={(event) => {
                        const element = event.currentTarget as HTMLElement;
                        element.style.borderColor = `${levelMeta.color}40`;
                        element.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(event) => {
                        const element = event.currentTarget as HTMLElement;
                        element.style.borderColor = 'var(--ds-card-border)';
                        element.style.transform = 'none';
                      }}
                    >
                      <div
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          height: 2,
                          background: `linear-gradient(90deg,${levelMeta.color}60,transparent)`,
                        }}
                      />
                      <div
                        style={{
                          ...S.grotesk,
                          fontWeight: 700,
                          fontSize: 22,
                          color: 'var(--ds-title-card, #f0eeff)',
                          marginBottom: 2,
                        }}
                      >
                        {cert.acronym}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: 'var(--ds-body-dim)',
                          marginBottom: 10,
                        }}
                      >
                        {cert.provider}
                      </div>
                      <p
                        style={{
                          fontSize: 12,
                          color: 'var(--ds-body)',
                          lineHeight: 1.6,
                          minHeight: 58,
                        }}
                      >
                        {cert.description}
                      </p>
                      <div style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
                        <span
                          style={{
                            ...S.mono,
                            fontSize: 11,
                            color: levelMeta.color,
                          }}
                        >
                          {cert.searchCost}
                        </span>
                        <span
                          style={{
                            ...S.mono,
                            fontSize: 11,
                            color: 'var(--ds-body-dim)',
                          }}
                        >
                          {cert.studyHours}
                        </span>
                      </div>
                      <div
                        style={{
                          ...S.mono,
                          fontSize: 10,
                          color: 'var(--ds-mono-dim)',
                        }}
                      >
                        {cert.marketSignal}
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

export default function RoadmapPage() {
  return (
    <Suspense fallback={null}>
      <RoadmapPageContent />
    </Suspense>
  );
}
