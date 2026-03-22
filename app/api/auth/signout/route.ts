import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const COOKIE_NAME = 'cp_session';

/**
 * GET /api/auth/signout
 * Server-side logout: deletes DB session + clears cookie via Set-Cookie header
 * then redirects to /auth/login.
 * 
 * Uses GET (not POST) so it can be triggered via window.location.href
 * avoiding the fetch→redirect race condition.
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  // 1. Get session before clearing
  const session = await getSession();

  // 2. Delete from DB
  if (session?.sessionId) {
    await (prisma as any).session.deleteMany({
      where: { id: session.sessionId },
    }).catch(() => null);
  }

  // 3. Build redirect response with explicit cookie deletion in headers
  const response = NextResponse.redirect(new URL('/auth/login', request.url));

  // Delete cookie explicitly — both approaches for max compatibility
  response.cookies.set(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    path: '/',
    expires: new Date(0),
  });

  return response;
}
