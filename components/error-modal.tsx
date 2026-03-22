'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { X, RefreshCw, ChevronDown, Terminal, Wifi, Lock, Server, AlertTriangle } from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────
export interface AppError {
  status?: number;
  title?: string;
  message?: string;
  action?: string;
  retry?: () => Promise<void> | void;
  context?: string;
  devDetails?: string | Record<string, unknown> | unknown[];
}

// ── Event bus ─────────────────────────────────────────────────────────────
type Listener = (err: AppError) => void;
const _listeners = new Set<Listener>();

export function triggerError(err: AppError): void {
  console.group(`%c⚠ APP ERROR${err.context ? ` [${err.context}]` : ''}`, 'color:#f59e0b;font-weight:bold');
  if (err.status)     console.error('Status:', err.status);
  if (err.message)    console.error('Message:', err.message);
  if (err.devDetails) console.error('Details:', err.devDetails);
  console.error('Time:', new Date().toISOString());
  console.groupEnd();
  _listeners.forEach(fn => fn(err));
}

export async function fetchSafe(url: string, opts?: RequestInit, ctx?: string): Promise<Response> {
  try {
    const res = await fetch(url, opts);
    if (!res.ok) {
      const body = await res.json().catch(() => ({})) as Record<string, unknown>;
      triggerError({
        status: res.status,
        message: typeof body.error === 'string' ? body.error : typeof body.message === 'string' ? body.message : undefined,
        context: ctx,
        devDetails: { url, status: res.status, body },
        retry: async () => { await fetchSafe(url, opts, ctx); },
      });
    }
    return res;
  } catch (e) {
    triggerError({ title: 'Sem conexão', message: 'Verifique sua conexão e tente novamente.', context: ctx, devDetails: String(e) });
    throw e;
  }
}

// ── Config ────────────────────────────────────────────────────────────────
type IconName = 'alert' | 'lock' | 'wifi' | 'server';

interface ErrorConfig { icon: IconName; title: string; msg: string; color: string; }

const ICONS: Record<IconName, React.ElementType> = {
  alert: AlertTriangle, lock: Lock, wifi: Wifi, server: Server,
};

const ERROR_MAP: Record<number, ErrorConfig> = {
  400: { icon: 'alert',  title: 'Requisição inválida',   msg: 'Os dados enviados não são válidos.',              color: '#f59e0b' },
  401: { icon: 'lock',   title: 'Sessão expirada',       msg: 'Faça login novamente para continuar.',            color: '#ef4444' },
  403: { icon: 'lock',   title: 'Acesso negado',         msg: 'Você não tem permissão para esta ação.',          color: '#ef4444' },
  404: { icon: 'wifi',   title: 'Não encontrado',        msg: 'O recurso solicitado não existe ou foi movido.',  color: '#3b82f6' },
  429: { icon: 'alert',  title: 'Muitas tentativas',     msg: 'Aguarde um momento antes de tentar novamente.',   color: '#f59e0b' },
  500: { icon: 'server', title: 'Erro interno',          msg: 'Algo deu errado no servidor.',                    color: '#ef4444' },
  503: { icon: 'server', title: 'Serviço indisponível',  msg: 'O serviço está temporariamente fora do ar.',     color: '#f59e0b' },
};

const DEFAULT_CFG: ErrorConfig = { icon: 'alert', title: 'Algo deu errado', msg: 'Ocorreu um erro inesperado.', color: '#f59e0b' };

// ── Component ─────────────────────────────────────────────────────────────
export function ErrorModal() {
  const [error, setError]   = useState<AppError | null>(null);
  const [devOpen, setDevOpen] = useState(false);
  const [retrying, setRetrying] = useState(false);

  // Subscribe to error bus
  useEffect(() => {
    const handler = (err: AppError) => { setError(err); setDevOpen(false); };
    _listeners.add(handler);
    return () => { _listeners.delete(handler); };
  }, []);

  const close = useCallback(() => { setError(null); setDevOpen(false); }, []);

  // ESC closes
  useEffect(() => {
    if (!error) return;
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [error, close]);

  const handleRetry = useCallback(async () => {
    if (!error?.retry) return;
    setRetrying(true);
    try { await error.retry(); close(); }
    catch { /* stays open */ }
    finally { setRetrying(false); }
  }, [error, close]);

  if (!error) return null;

  const cfg  = (error.status && ERROR_MAP[error.status]) ? ERROR_MAP[error.status] : DEFAULT_CFG;
  const Icon = ICONS[cfg.icon];
  const c    = cfg.color;

  const devStr = error.devDetails
    ? (typeof error.devDetails === 'string' ? error.devDetails : JSON.stringify(error.devDetails, null, 2))
    : null;

  return (
    <div onClick={close} style={{
      position: 'fixed', inset: 0, zIndex: 99999,
      background: 'rgba(6,4,18,0.85)', backdropFilter: 'blur(12px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width: '100%', maxWidth: 420,
        background: 'var(--ds-card, rgba(12,8,28,0.98))',
        border: `1px solid ${c}35`, borderRadius: 16, overflow: 'hidden',
        boxShadow: `0 0 0 1px ${c}20, 0 32px 80px rgba(0,0,0,0.7)`,
        animation: 'err-slide 220ms cubic-bezier(0.4,0,0.2,1)',
      }}>
        {/* Accent */}
        <div style={{ height: 3, background: `linear-gradient(90deg,${c},${c}60,transparent)` }} />

        {/* Header */}
        <div style={{ padding: '20px 20px 0', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: `${c}18`, border: `1px solid ${c}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon size={18} style={{ color: c }} />
            </div>
            <div>
              <div style={{ fontFamily: '"JetBrains Mono",monospace', fontSize: 9, color: c, letterSpacing: '0.12em', marginBottom: 3 }}>
                {error.status ? `HTTP ${error.status}` : 'ERROR'}{error.context ? ` · ${error.context.toUpperCase()}` : ''}
              </div>
              <div style={{ fontFamily: '"Space Grotesk",sans-serif', fontWeight: 700, fontSize: 16, color: 'var(--ds-title-card,#f0eeff)' }}>
                {error.title ?? cfg.title}
              </div>
            </div>
          </div>
          <button onClick={close} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ds-body-dim,rgba(155,176,198,0.4))', padding: 4, marginTop: -2 }}>
            <X size={16} />
          </button>
        </div>

        {/* Message */}
        <div style={{ padding: '12px 20px 0' }}>
          <p style={{ fontSize: 13, color: 'var(--ds-body-muted,rgba(155,176,198,0.65))', lineHeight: 1.6, margin: 0 }}>
            {error.message ?? cfg.msg}
          </p>
        </div>

        {/* Dev details */}
        {devStr && (
          <div style={{ margin: '10px 20px 0' }}>
            <button onClick={() => setDevOpen(v => !v)} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'none', border: 'none', cursor: 'pointer', padding: '5px 0',
              color: 'var(--ds-body-faint,rgba(155,176,198,0.28))',
              fontSize: 11, fontFamily: '"JetBrains Mono",monospace',
            }}>
              <Terminal size={11} />
              Dev details
              <ChevronDown size={10} style={{ transform: devOpen ? 'rotate(180deg)' : 'none', transition: 'transform 150ms' }} />
            </button>
            {devOpen && (
              <pre style={{
                marginTop: 4, padding: '8px 10px', borderRadius: 7,
                background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.07)',
                fontSize: 10, fontFamily: '"JetBrains Mono",monospace',
                color: 'rgba(155,176,198,0.6)', overflow: 'auto', maxHeight: 150,
                whiteSpace: 'pre-wrap', wordBreak: 'break-all', margin: 0,
              }}>
                {devStr}
              </pre>
            )}
          </div>
        )}

        {/* Actions */}
        <div style={{ padding: '16px 20px 20px', display: 'flex', gap: 8 }}>
          {error.retry && (
            <button onClick={handleRetry} disabled={retrying} style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              padding: '10px 16px', borderRadius: 9, cursor: retrying ? 'default' : 'pointer',
              background: `linear-gradient(135deg,${c}25,${c}10)`,
              border: `1px solid ${c}40`, color: c,
              fontFamily: '"Space Grotesk",sans-serif', fontWeight: 600, fontSize: 13,
              opacity: retrying ? 0.6 : 1, transition: 'all 150ms',
            }}>
              <RefreshCw size={13} style={{ animation: retrying ? 'spin 0.8s linear infinite' : 'none' }} />
              {retrying ? 'Tentando...' : (error.action ?? 'Tentar novamente')}
            </button>
          )}
          <button onClick={close} style={{
            flex: error.retry ? '0 0 auto' : 1,
            padding: '10px 16px', borderRadius: 9, cursor: 'pointer',
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)',
            color: 'var(--ds-body-dim,rgba(155,176,198,0.5))',
            fontFamily: '"Space Grotesk",sans-serif', fontWeight: 600, fontSize: 13,
          }}>
            {error.retry ? 'Fechar' : 'Entendido'}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes err-slide { from{transform:translateY(14px);opacity:0} to{transform:none;opacity:1} }
        @keyframes spin { to{transform:rotate(360deg)} }
      `}</style>
    </div>
  );
}
