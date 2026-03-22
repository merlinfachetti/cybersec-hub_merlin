import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// One-time GET endpoint — remove after use
export async function GET(): Promise<NextResponse> {
  const hash = await bcrypt.hash('@Jully2026', 12);
  const user = await (prisma as any).user.update({
    where: { email: 'merlinfachetti@gmail.com' },
    data: { passwordHash: hash },
    select: { id: true, email: true, name: true },
  });
  return NextResponse.json({ ok: true, user, message: 'Password updated to @Jully2026' });
}
