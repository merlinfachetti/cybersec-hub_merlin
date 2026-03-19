'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Award, TrendingUp, Clock, Target, BookOpen,
  Shield, Zap, Users, ChevronRight, Star,
} from 'lucide-react';

interface UserSession {
  name: string | null;
  email: string;
  role: string;
}

interface ProgressItem {
  id: string;
  certificationSlug: string;
  status: string;
  progressPercent: number;
  studyHours: number;
  certification?: { name: string; level: string; category: string } | null;
}

interface Stats {
  totalCertifications: number;
  inProgress: number;
  completed: number;
  totalStudyHours: number;
  averageProgress: number;
  upcomingExams: number;
}

const STATUS_COLOR: Record<string, string> = {
  STUDYING: '#3b82f6',
  INTERESTED: '#8b5cf6',
  SCHEDULED: '#f59e0b',
  PASSED: '#22c55e',
  FAILED: '#ef4444',
  EXPIRED: '#6b7280',
};

const STATUS_LABEL: Record<string, string> = {
  STUDYING: 'Studying',
  INTERESTED: 'Interested',
  SCHEDULED: 'Scheduled',
  PASSED: '✓ Passed',
  FAILED: 'Failed',
  EXPIRED: 'Expired',
};

export default function ProfilePage() {
  const [user, setUser] = useState<UserSession | null>(null);
  const [progress, setProgress] = useState<ProgressItem[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [meRes, progressRes] = await Promise.all([
          fetch('/api/auth/me'),
          fetch('/api/user/progress'),
        ]);
        if (meRes.ok) {
          const { user: u } = await meRes.json();
          setUser(u);
        }
        if (progressRes.ok) {
          const d = await progressRes.json();
          setProgress(d.data ?? []);
          setStats(d.stats ?? null);
        }
      } catch (e) {
        console.error('Profile load error:', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const S = { // shared styles
    card: { background: 'rgba(15,22,40,0.8)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '20px 24px' },
    label: { fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: '0.1em', color: 'rgba(155,176,198,0.6)', textTransform: 'uppercase' as const },
    val: { fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700, fontSize: 28, color: '#e6eef8' },
    sub: { fontFamily: '"Inter", sans-serif', fontSize: 12, color: 'rgba(155,176,198,0.5)', marginTop: 2 },
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#0b0f14', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 12, color: 'rgba(155,176,198,0.4)', letterSpacing: '0.1em' }}>
        loading profile...
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#0b0f14', color: '#e6eef8', fontFamily: '"Inter", sans-serif' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }}>

        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <span style={S.label}>profile</span>
          </div>
          <h1 style={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700, fontSize: 28, color: '#e6eef8', marginBottom: 4 }}>
            {user?.name ?? 'Merlin'}
          </h1>
          <p style={{ fontSize: 13, color: 'rgba(155,176,198,0.5)' }}>
            {user?.email} &nbsp;·&nbsp;
            <span style={{ color: '#8b5cf6', fontWeight: 600 }}>{user?.role?.toUpperCase() ?? 'ADMIN'}</span>
          </p>
        </div>

        {/* Stats grid */}
        {stats && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 32 }}>
            {[
              { icon: <Award size={16} />, label: 'Certifications', val: stats.totalCertifications, sub: `${stats.completed} completed` },
              { icon: <TrendingUp size={16} />, label: 'In Progress', val: stats.inProgress, sub: `${stats.averageProgress.toFixed(0)}% avg` },
              { icon: <Clock size={16} />, label: 'Study Hours', val: `${stats.totalStudyHours}h`, sub: 'total logged' },
              { icon: <Target size={16} />, label: 'Upcoming Exams', val: stats.upcomingExams, sub: 'scheduled' },
            ].map(item => (
              <div key={item.label} style={S.card}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <div style={{ color: '#8b5cf6' }}>{item.icon}</div>
                  <span style={S.label}>{item.label}</span>
                </div>
                <div style={S.val}>{item.val}</div>
                <div style={S.sub}>{item.sub}</div>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>

          {/* Left — certifications */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <BookOpen size={16} color="#8b5cf6" />
              <h2 style={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700, fontSize: 16 }}>My Certifications</h2>
            </div>

            {progress.length === 0 ? (
              <div style={{ ...S.card, textAlign: 'center', padding: '48px 24px' }}>
                <Award size={32} style={{ margin: '0 auto 12px', color: 'rgba(155,176,198,0.3)' }} />
                <p style={{ color: 'rgba(155,176,198,0.5)', fontSize: 14 }}>No certifications tracked yet</p>
                <Link href="/certifications" style={{ display: 'inline-block', marginTop: 16, fontSize: 13, color: '#8b5cf6', textDecoration: 'none' }}>
                  Browse certifications →
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {progress.map(item => {
                  const color = STATUS_COLOR[item.status] ?? '#6b7280';
                  return (
                    <div key={item.id} style={S.card}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                        <div>
                          <div style={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 600, fontSize: 14, marginBottom: 3 }}>
                            {item.certification?.name ?? item.certificationSlug}
                          </div>
                          <div style={{ display: 'flex', gap: 8 }}>
                            {item.certification?.level && (
                              <span style={{ fontSize: 11, background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.25)', borderRadius: 4, padding: '2px 8px', color: '#8b5cf6', fontFamily: '"JetBrains Mono", monospace' }}>
                                {item.certification.level}
                              </span>
                            )}
                            {item.certification?.category && (
                              <span style={{ fontSize: 11, color: 'rgba(155,176,198,0.5)', fontFamily: '"JetBrains Mono", monospace' }}>
                                {item.certification.category}
                              </span>
                            )}
                          </div>
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 600, color, background: `${color}22`, border: `1px solid ${color}44`, borderRadius: 6, padding: '3px 10px', fontFamily: '"JetBrains Mono", monospace', whiteSpace: 'nowrap' }}>
                          {STATUS_LABEL[item.status] ?? item.status}
                        </span>
                      </div>

                      {item.progressPercent > 0 && (
                        <div style={{ marginBottom: 8 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                            <span style={{ fontSize: 11, color: 'rgba(155,176,198,0.5)' }}>Progress</span>
                            <span style={{ fontSize: 11, color, fontWeight: 600 }}>{item.progressPercent}%</span>
                          </div>
                          <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2 }}>
                            <div style={{ height: '100%', width: `${item.progressPercent}%`, background: color, borderRadius: 2, transition: 'width 0.6s ease' }} />
                          </div>
                        </div>
                      )}

                      <div style={{ fontSize: 12, color: 'rgba(155,176,198,0.4)', display: 'flex', gap: 16 }}>
                        {item.studyHours > 0 && <span>⏱ {item.studyHours}h studied</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Posture */}
            <div style={S.card}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <Shield size={14} color="#8b5cf6" />
                <span style={S.label}>Security Posture</span>
              </div>
              {[
                { team: 'RED', label: 'Attack', color: '#e53e3e', val: 'Beginner' },
                { team: 'BLUE', label: 'Defend', color: '#3b82f6', val: 'Intermediate' },
                { team: 'PURPLE', label: 'Improve', color: '#8b5cf6', val: 'Active' },
              ].map(t => (
                <div key={t.team} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: t.color, boxShadow: `0 0 6px ${t.color}` }} />
                    <span style={{ fontSize: 12, color: 'rgba(155,176,198,0.7)' }}>{t.label}</span>
                  </div>
                  <span style={{ fontSize: 11, color: t.color, fontFamily: '"JetBrains Mono", monospace' }}>{t.val}</span>
                </div>
              ))}
            </div>

            {/* Recommended */}
            <div style={S.card}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <Star size={14} color="#f59e0b" />
                <span style={S.label}>Recommended Next</span>
              </div>
              {[
                'Complete Security+ (45% done, ~40h remaining)',
                'Schedule Security+ exam (2-3 weeks after completion)',
                'Start CEH preparation (3-4 month timeline)',
              ].map((rec, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, padding: '8px 0', borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                  <span style={{ color: '#8b5cf6', fontWeight: 700, fontSize: 12, minWidth: 16 }}>{i + 1}.</span>
                  <span style={{ fontSize: 12, color: 'rgba(155,176,198,0.7)', lineHeight: 1.5 }}>{rec}</span>
                </div>
              ))}
            </div>

            {/* Quick links */}
            <div style={S.card}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <Zap size={14} color="#3b82f6" />
                <span style={S.label}>Quick Access</span>
              </div>
              {[
                { href: '/certifications', label: 'Browse Certifications' },
                { href: '/roadmap', label: 'Career Roadmap' },
                { href: '/resources', label: 'Study Resources' },
                { href: '/market', label: 'Market Insights' },
                { href: '/portal', label: '← Threat Universe' },
              ].map(link => (
                <Link key={link.href} href={link.href} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', textDecoration: 'none', color: 'rgba(155,176,198,0.7)', fontSize: 13, transition: 'color 150ms' }}>
                  {link.label}
                  <ChevronRight size={12} style={{ opacity: 0.4 }} />
                </Link>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
