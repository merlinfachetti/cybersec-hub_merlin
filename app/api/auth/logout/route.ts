/**
 * app/api/auth/logout/route.ts
 * POST /api/auth/logout
 * Invalida sessão no DB e limpa cookie
 */

import { NextResponse } from 'next/server';
import { getActiveSession, clearSessionCookie } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(): Promise<NextResponse> {
  const session = await getActiveSession();

  if (session?.sessionId) {
    // Remove sessão do DB
    await prisma.session.deleteMany({
      where: { id: session.sessionId },
    }).catch(() => null); // Silent fail — cookie será limpo de qualquer forma
  }

  await clearSessionCookie();

  return NextResponse.json({ ok: true }, { status: 200 });
}
