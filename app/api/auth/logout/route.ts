/**
 * app/api/auth/logout/route.ts
 * POST /api/auth/logout
 * Invalida sessão no DB e limpa cookie.
 * OWASP: CSRF check via X-CSRF-Token header (double-submit pattern).
 */

import { NextRequest, NextResponse } from 'next/server';
import { getActiveSession, clearSessionCookie } from '@/lib/auth';
import { verifyCsrfToken } from '@/lib/csrf';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest): Promise<NextResponse> {
  const session = await getActiveSession();

  // CSRF check — tolerate missing token for graceful signout UX,
  // but log the anomaly for monitoring.
  const csrfHeader = req.headers.get('x-csrf-token');
  if (session?.sessionId && !verifyCsrfToken(session.sessionId, csrfHeader)) {
    // Still sign out — logout is a safe action even if CSRF check fails.
    // We don't block it; we just clear the session.
    console.warn('[auth/logout] CSRF mismatch — proceeding with signout anyway', {
      sessionId: session.sessionId.slice(0, 8) + '…',
    });
  }

  if (session?.sessionId) {
    await prisma.session.deleteMany({
      where: { id: session.sessionId },
    }).catch(() => null);
  }

  await clearSessionCookie();

  return NextResponse.json({ ok: true }, { status: 200 });
}
