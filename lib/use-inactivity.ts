'use client';

import { useEffect, useRef, useCallback } from 'react';

const STORAGE_KEY = 'cp_last_active';

/**
 * Auto-logout por inatividade.
 * 
 * Persiste o timestamp da última atividade em localStorage.
 * Ao montar (inclusive após browser fechado e reaberto), verifica
 * se o tempo decorrido desde a última atividade excede o timeout.
 * 
 * Isso garante: se o usuário ficou 45min sem usar e voltou,
 * o check acontece no mount antes de qualquer interação.
 */
export function useInactivity(
  timeoutMs: number = 30 * 60 * 1000,
  onTimeout?: () => void,
) {
  const timerRef     = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onTimeoutRef = useRef(onTimeout);
  onTimeoutRef.current = onTimeout;

  const fire = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    onTimeoutRef.current?.();
  }, []);

  const reset = useCallback(() => {
    const now = Date.now();
    try { localStorage.setItem(STORAGE_KEY, String(now)); } catch {}
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(fire, timeoutMs);
  }, [timeoutMs, fire]);

  useEffect(() => {
    // ── CHECK ON MOUNT: tempo desde última atividade ──
    try {
      const last = parseInt(localStorage.getItem(STORAGE_KEY) ?? '0', 10);
      if (last > 0) {
        const elapsed = Date.now() - last;
        if (elapsed >= timeoutMs) {
          // Passou o timeout enquanto o browser estava fechado/suspenso
          fire();
          return; // Não registrar listeners — já está deslogando
        }
      }
    } catch {}

    // ── ACTIVITY LISTENERS ──
    const EVENTS = ['mousemove', 'keydown', 'touchstart', 'scroll', 'click'] as const;
    const handler = () => reset();
    EVENTS.forEach(e => window.addEventListener(e, handler, { passive: true }));

    // ── VISIBILITYCHANGE: ao voltar ao browser ──
    const onVisible = () => {
      if (document.visibilityState === 'visible') {
        try {
          const last = parseInt(localStorage.getItem(STORAGE_KEY) ?? '0', 10);
          if (last > 0) {
            const elapsed = Date.now() - last;
            if (elapsed >= timeoutMs) { fire(); return; }
            if (timerRef.current) clearTimeout(timerRef.current);
            timerRef.current = setTimeout(fire, timeoutMs - elapsed);
          }
        } catch {}
      } else {
        // Esconder aba: pausar timer mas manter timestamp
        if (timerRef.current) clearTimeout(timerRef.current);
      }
    };

    document.addEventListener('visibilitychange', onVisible);
    reset(); // Iniciar timer e registrar atividade inicial

    return () => {
      EVENTS.forEach(e => window.removeEventListener(e, handler));
      document.removeEventListener('visibilitychange', onVisible);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [reset, fire, timeoutMs]);
}
