/**
 * app/api/auth/login/route.ts
 * POST /api/auth/login
 *
 * OWASP compliance:
 * - Mensagem de erro neutra (sem revelar se email existe)
 * - Rate limiting por IP
 * - bcrypt com salt rounds ≥ 12
 * - httpOnly cookie via lib/auth.ts
 * - Validação com Zod
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import {
  createToken,
  setSessionCookie,
  hashToken,
  DEFAULT_SESSION_TTL_SECONDS,
  REMEMBER_DEVICE_TTL_SECONDS,
} from '@/lib/auth';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';
import { randomUUID } from 'crypto';

// ── Validation schema ──────────────────────────────────────────────────────

const LoginSchema = z.object({
  identifier: z
    .string()
    .min(1)
    .max(254)
    .toLowerCase()
    .trim(),
  passphrase: z
    .string()
    .min(1)
    .max(128),
});

// ── Neutral error (OWASP: no user enumeration) ────────────────────────────

const NEUTRAL_ERROR = {
  error: 'Could not verify credentials.',
  code: 'AUTH_FAILED',
};

// ── Constant-time comparison helper ──────────────────────────────────────

let dummyHashPromise: Promise<string> | null = null;

async function getDummyHash(): Promise<string> {
  if (!dummyHashPromise) {
    dummyHashPromise = bcrypt.hash('invalid-login-placeholder', 12);
  }
  return dummyHashPromise;
}

async function verifyPasswordSafe(input: string, hash: string): Promise<boolean> {
  const safeHash = hash || (await getDummyHash());
  return bcrypt.compare(input, safeHash);
}

// ── Handler ───────────────────────────────────────────────────────────────

export async function POST(request: NextRequest): Promise<NextResponse> {
  // 1. Rate limiting
  const ip = getClientIp(request);
  const { allowed, remaining, resetAt } = checkRateLimit(`login:${ip}`);

  if (!allowed) {
    return NextResponse.json(
      { error: 'Too many attempts. Try again later.', code: 'RATE_LIMITED' },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil((resetAt - Date.now()) / 1000)),
          'X-RateLimit-Remaining': '0',
        },
      }
    );
  }

  // 2. Parse + validate body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.', code: 'BAD_REQUEST' }, { status: 400 });
  }

  const parsed = LoginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(NEUTRAL_ERROR, { status: 401 });
  }

  const { identifier, passphrase } = parsed.data;
  const rememberDevice = typeof body === 'object' && body !== null && 'rememberDevice' in body
    ? Boolean((body as Record<string, unknown>).rememberDevice)
    : false;

  // 3. Lookup user
  const user = await prisma.user.findUnique({
    where: { email: identifier },
    select: {
      id: true,
      email: true,
      passwordHash: true,
      role: true,
      isActive: true,
      name: true,
    },
  });

  // 4. Verify password (always run bcrypt to prevent timing attacks)
  const isValid = await verifyPasswordSafe(passphrase, user?.passwordHash ?? '');

  if (!user || !isValid || !user.isActive) {
    return NextResponse.json(NEUTRAL_ERROR, { status: 401 });
  }

  // 5. Create session
  const sessionId = randomUUID();
  const sessionTtlSeconds = rememberDevice
    ? REMEMBER_DEVICE_TTL_SECONDS
    : DEFAULT_SESSION_TTL_SECONDS;

  const token = await createToken(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
      sessionId,
    },
    sessionTtlSeconds
  );

  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + sessionTtlSeconds * 1000);

  await prisma.session.create({
    data: {
      id: sessionId,
      userId: user.id,
      tokenHash,
      userAgent: request.headers.get('user-agent') ?? undefined,
      ipAddress: ip,
      expiresAt,
    },
  });

  // 6. Update lastLoginAt
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  // 7. Set httpOnly cookie
  await setSessionCookie(token, sessionTtlSeconds);

  return NextResponse.json(
    {
      ok: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    },
    {
      status: 200,
      headers: {
        'X-RateLimit-Remaining': String(remaining),
      },
    }
  );
}
