'use client';

export const SESSION_ACTIVITY_KEY = 'cp_last_active';

export function touchSessionActivity(): void {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(SESSION_ACTIVITY_KEY, String(Date.now()));
  } catch {
    // ignore storage failures
  }
}

export function clearSessionActivity(): void {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.removeItem(SESSION_ACTIVITY_KEY);
  } catch {
    // ignore storage failures
  }
}
