'use client';

import { useEffect, useRef, useCallback } from 'react';

/**
 * Auto-logout por inatividade.
 * 
 * Monitora:
 * - Eventos de usuário: mousemove, keydown, touchstart, scroll, click
 * - visibilitychange: detecta quando o browser/aba volta ao foco
 *   (captura o caso de computador suspenso/desbloqueado)
 * 
 * Após `timeoutMs` sem atividade → chama onTimeout()
 * Se o usuário está ativo → timer reseta continuamente, nunca expira
 */
export function useInactivity(
  timeoutMs: number = 30 * 60 * 1000,
  onTimeout?: () => void,
) {
  const timerRef     = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastActive   = useRef<number>(Date.now());
  const onTimeoutRef = useRef(onTimeout);
  onTimeoutRef.current = onTimeout;

  const fire = useCallback(() => {
    onTimeoutRef.current?.();
  }, []);

  const reset = useCallback(() => {
    lastActive.current = Date.now();
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(fire, timeoutMs);
  }, [timeoutMs, fire]);

  useEffect(() => {
    const EVENTS = ['mousemove', 'keydown', 'touchstart', 'scroll', 'click'] as const;
    const handler = () => reset();

    EVENTS.forEach(e => window.addEventListener(e, handler, { passive: true }));

    // visibilitychange: quando o usuário volta à aba/computador,
    // verificar se o tempo decorrido já ultrapassou o timeout
    const onVisible = () => {
      if (document.visibilityState === 'visible') {
        const elapsed = Date.now() - lastActive.current;
        if (elapsed >= timeoutMs) {
          fire();
        } else {
          // Reagendar com o tempo restante
          if (timerRef.current) clearTimeout(timerRef.current);
          timerRef.current = setTimeout(fire, timeoutMs - elapsed);
        }
      } else {
        // Aba escondida — pausar o timer (não desperdiçar)
        if (timerRef.current) clearTimeout(timerRef.current);
      }
    };

    document.addEventListener('visibilitychange', onVisible);
    reset(); // inicia o timer

    return () => {
      EVENTS.forEach(e => window.removeEventListener(e, handler));
      document.removeEventListener('visibilitychange', onVisible);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [reset, fire, timeoutMs]);
}
