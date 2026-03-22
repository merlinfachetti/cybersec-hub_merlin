import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const updated = await (prisma as any).user.updateMany({
      where: { email: 'merlin@cyberportal.dev' },
      data:  { email: 'merlinfachetti@gmail.com' },
    });

    if (updated.count === 0) {
      const users = await (prisma as any).user.findMany({
        select: { id: true, email: true, role: true },
      });
      return NextResponse.json({ message: 'Old email not found', currentUsers: users });
    }

    return NextResponse.json({
      ok: true, updated: updated.count,
      message: 'merlin@cyberportal.dev → merlinfachetti@gmail.com',
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
