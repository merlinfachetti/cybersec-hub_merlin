import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest): Promise<NextResponse> {
  const { secret, newPassword } = await req.json().catch(() => ({})) as Record<string, string>;

  // Auth: first 16 chars of JWT_SECRET
  const expected = (process.env.JWT_SECRET ?? '').slice(0, 16);
  if (!secret || secret !== expected) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const hash = await bcrypt.hash(newPassword, 12);
  const user = await (prisma as any).user.update({
    where: { email: 'merlinfachetti@gmail.com' },
    data: { passwordHash: hash },
    select: { id: true, email: true, name: true },
  });

  return NextResponse.json({ ok: true, user });
}
