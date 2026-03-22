import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(): Promise<NextResponse> {
  const session = await getSession();
  if (!session) return NextResponse.json({ valid: false }, { status: 401 });

  const dbSession = await (prisma as any).session.findUnique({
    where: { id: session.sessionId },
    select: { id: true, expiresAt: true },
  });

  if (!dbSession || dbSession.expiresAt < new Date()) {
    return NextResponse.json({ valid: false }, { status: 401 });
  }

  return NextResponse.json({ valid: true });
}
