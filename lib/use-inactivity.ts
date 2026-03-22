'use client';

import { useEffect, useRef, useCallback } from 'react';

/**
 * Auto-logout por inatividade.
 * Monitora: mousemove, keydown, touchstart, scroll, click
 * Após `timeoutMs` sem atividade, chama onTimeout()
 */
export function useInactivity(
  timeoutMs: number = 30 * 60 * 1000, // 30 min default
  onTimeout?: () => void,
) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onTimeoutRef = useRef(onTimeout);
  onTimeoutRef.current = onTimeout;

  const reset = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      onTimeoutRef.current?.();
    }, timeoutMs);
  }, [timeoutMs]);

  useEffect(() => {
    const EVENTS = ['mousemove', 'keydown', 'touchstart', 'scroll', 'click'];
    const handler = () => reset();

    EVENTS.forEach(e => window.addEventListener(e, handler, { passive: true }));
    reset(); // start timer on mount

    return () => {
      EVENTS.forEach(e => window.removeEventListener(e, handler));
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [reset]);
}
