/**
 * lib/csrf.ts
 * CSRF token generation + verification using HMAC-SHA256.
 * Double-submit cookie pattern — no server-side state needed.
 *
 * Flow:
 *   1. GET /api/auth/csrf → issues cookie cp_csrf + JSON { csrfToken }
 *   2. Client sends X-CSRF-Token: <token> on POST/PUT/DELETE/PATCH
 *   3. Server calls verifyCsrfToken(sessionId, headerValue) before processing
 */

import { createHmac, timingSafeEqual } from 'crypto';

function getCsrfSecret(): string {
  const secret = process.env.CSRF_SECRET ?? process.env.JWT_SECRET;
  if (!secret) throw new Error('CSRF_SECRET (or JWT_SECRET) env var is missing');
  return secret;
}

export function generateCsrfToken(sessionId: string): string {
  return createHmac('sha256', getCsrfSecret())
    .update(sessionId)
    .digest('hex');
}

export function verifyCsrfToken(sessionId: string, token: string | null): boolean {
  if (!token) return false;
  try {
    const expected = generateCsrfToken(sessionId);
    const a = Buffer.from(expected, 'utf8');
    const b = Buffer.from(token,    'utf8');
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
