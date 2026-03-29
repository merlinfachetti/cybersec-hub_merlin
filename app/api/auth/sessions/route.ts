/**
 * app/api/auth/sessions/route.ts
 * DELETE /api/auth/sessions — invalidate ALL sessions for the authenticated user.
 * Useful for "Sign out everywhere" / account compromise response.
 *
 * OWASP: requires valid CSRF token + active session. Returns neutral error on failure.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getActiveSession, clearSessionCookie } from '@/lib/auth';
import { verifyCsrfToken } from '@/lib/csrf';
import { prisma } from '@/lib/prisma';

const NEUTRAL_ERROR = { error: 'Could not complete request.' };

export async function DELETE(req: NextRequest): Promise<NextResponse> {
  const session = await getActiveSession();
  if (!session) {
    return NextResponse.json(NEUTRAL_ERROR, { status: 401 });
  }

  // CSRF check — must send X-CSRF-Token header
  const csrfHeader = req.headers.get('x-csrf-token');
  if (!verifyCsrfToken(session.sessionId, csrfHeader)) {
    return NextResponse.json(NEUTRAL_ERROR, { status: 403 });
  }

  try {
    // Invalidate all DB sessions for this user
    const { count } = await prisma.session.deleteMany({
      where: { userId: session.userId },
    });

    // Clear current session cookie
    await clearSessionCookie();

    return NextResponse.json({ invalidated: count });
  } catch {
    return NextResponse.json(NEUTRAL_ERROR, { status: 500 });
  }
}

/**
 * GET /api/auth/sessions — list active sessions for the current user.
 * Useful for a "Manage sessions" UI (future).
 */
export async function GET(): Promise<NextResponse> {
  const session = await getActiveSession();
  if (!session) {
    return NextResponse.json(NEUTRAL_ERROR, { status: 401 });
  }

  try {
    const sessions = await prisma.session.findMany({
      where: { userId: session.userId, expiresAt: { gt: new Date() } },
      select: { id: true, createdAt: true, expiresAt: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      current: session.sessionId,
      sessions: sessions.map((s: { id: string; createdAt: Date; expiresAt: Date }) => ({
        id: s.id,
        isCurrent: s.id === session.sessionId,
        createdAt: s.createdAt,
        expiresAt: s.expiresAt,
      })),
    });
  } catch {
    return NextResponse.json(NEUTRAL_ERROR, { status: 500 });
  }
}
