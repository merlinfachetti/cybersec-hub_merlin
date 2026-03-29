/**
 * app/api/auth/csrf/route.ts
 * GET /api/auth/csrf — issues a signed CSRF token tied to the current session.
 *
 * OWASP CSRF mitigation strategy:
 * - Token is HMAC-SHA256(sessionId, CSRF_SECRET)
 * - Client reads it, sends it back as X-CSRF-Token header on state-mutating requests
 * - Server verifies via lib/csrf.ts before processing
 * - httpOnly=false so JS can read it (by design for this pattern)
 */

import { NextResponse } from 'next/server';
import { getActiveSession } from '@/lib/auth';
import { generateCsrfToken } from '@/lib/csrf';

export async function GET(): Promise<NextResponse> {
  const session = await getActiveSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const token = generateCsrfToken(session.sessionId);

  const res = NextResponse.json({ csrfToken: token });
  // Readable by JS (not httpOnly) — that's intentional for the double-submit pattern
  res.cookies.set('cp_csrf', token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60, // 1h — short-lived
    path: '/',
  });

  return res;
}
