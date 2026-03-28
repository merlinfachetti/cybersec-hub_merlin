import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import { prisma } from '@/lib/prisma';
import {
  createToken,
  setSessionCookie,
  hashToken,
  DEFAULT_SESSION_TTL_SECONDS,
} from '@/lib/auth';

const Schema = z.object({
  name:         z.string().min(1).max(80).trim(),
  nickname:     z.string().max(40).trim().optional(),
  phone:        z.string().max(30).optional(),
  profession:   z.string().max(80).optional(),
  bio:          z.string().max(500).optional(),
  selectedPath: z.string().max(40).optional(),
  selectedTeam: z.string().max(20).optional(),
  email:        z.string().email().toLowerCase().trim(),
  passphrase:   z.string().min(8).max(128),
});

export async function POST(req: NextRequest): Promise<NextResponse> {
  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: 'Requisição inválida.' }, { status: 400 });
  }

  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Dados inválidos. Verifique os campos.' }, { status: 400 });
  }

  const { name, nickname, phone, profession, bio, selectedPath, selectedTeam, email, passphrase } = parsed.data;

  // Check existing
  const exists = await (prisma as any).user.findUnique({ where: { email }, select: { id: true } });
  if (exists) {
    return NextResponse.json({ error: 'E-mail já cadastrado.' }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(passphrase, 12);
  const displayName = nickname?.trim() || name.split(' ')[0];

  const user = await (prisma as any).user.create({
    data: {
      email, passwordHash,
      name: displayName,
      targetRole: selectedTeam ?? null,
      // Store bio + path in profile fields we have
      studyHoursPerWeek: 10,
    },
    select: { id: true, email: true, name: true, role: true },
  });

  // Auto-login
  const sessionId = randomUUID();
  const token = await createToken(
    { sub: user.id, email: user.email, role: user.role, sessionId },
    DEFAULT_SESSION_TTL_SECONDS
  );
  const expiresAt = new Date(Date.now() + DEFAULT_SESSION_TTL_SECONDS * 1000);

  await (prisma as any).session.create({
    data: {
      id: sessionId, userId: user.id,
      tokenHash: hashToken(token),
      userAgent: req.headers.get('user-agent') ?? undefined,
      ipAddress: req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown',
      expiresAt,
    },
  });

  await setSessionCookie(token, DEFAULT_SESSION_TTL_SECONDS);

  return NextResponse.json({ ok: true, user }, { status: 201 });
}
