import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { oldEmail, newEmail, secret } = await req.json();
    if (secret !== process.env.JWT_SECRET?.slice(0, 16)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const user = await (prisma as any).user.update({
      where: { email: oldEmail },
      data: { email: newEmail },
      select: { id: true, email: true, name: true },
    });
    return NextResponse.json({ ok: true, user });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
