/**
 * app/api/auth/me/route.ts
 * GET /api/auth/me
 * Retorna dados do usuário autenticado (sem dados sensíveis)
 */

import { NextResponse } from 'next/server';
import { getActiveSession, SESSION_COOKIE_NAME } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(): Promise<NextResponse> {
  const session = await getActiveSession();

  if (!session) {
    const response = NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    response.cookies.delete(SESSION_COOKIE_NAME);
    return response;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      targetRole: true,
      location: true,
      avatarUrl: true,
      studyHoursPerWeek: true,
      createdAt: true,
    },
  });

  if (!user) {
    const response = NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    response.cookies.delete(SESSION_COOKIE_NAME);
    return response;
  }

  return NextResponse.json({ user }, { status: 200 });
}
