/**
 * lib/auth.ts
 * JWT custom com jose (Edge Runtime compatível)
 * OWASP: httpOnly cookie, SameSite=Strict, token rotation, sem user enumeration
 */

import { SignJWT, jwtVerify, type JWTPayload } from 'jose';
import { cookies } from 'next/headers';
import { createHash } from 'crypto';
import { prisma } from '@/lib/prisma';

// ── Constants ──────────────────────────────────────────────────────────────

// Lazy — evaluated at request time, not build time
function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET env var is missing');
  return new TextEncoder().encode(secret);
}

export const SESSION_COOKIE_NAME = 'cp_session';
export const DEFAULT_SESSION_TTL_SECONDS = 8 * 60 * 60; // 8h
export const REMEMBER_DEVICE_TTL_SECONDS = 7 * 24 * 60 * 60; // 7d

// ── Types ──────────────────────────────────────────────────────────────────

export interface SessionPayload extends JWTPayload {
  sub: string;        // userId
  email: string;
  role: string;
  sessionId: string;
}

export interface AuthResult {
  userId: string;
  email: string;
  role: string;
  sessionId: string;
}

// ── Token creation ─────────────────────────────────────────────────────────

export async function createToken(
  payload: Omit<SessionPayload, 'iat' | 'exp'>,
  ttlSeconds: number = DEFAULT_SESSION_TTL_SECONDS
): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${ttlSeconds}s`)
    .sign(getJwtSecret());
}

export async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    return payload as SessionPayload;
  } catch {
    return null;
  }
}

// ── Cookie management ──────────────────────────────────────────────────────

export async function setSessionCookie(
  token: string,
  customMaxAge: number = DEFAULT_SESSION_TTL_SECONDS
): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: customMaxAge,
    path: '/',
  });
}

export async function getSessionCookie(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE_NAME)?.value;
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

// ── Session validation (used by middleware + server components) ────────────

export async function getSession(): Promise<AuthResult | null> {
  const token = await getSessionCookie();
  if (!token) return null;

  const payload = await verifyToken(token);
  if (!payload || !payload.sub || !payload.email || !payload.sessionId) return null;

  return {
    userId: payload.sub,
    email: payload.email,
    role: payload.role,
    sessionId: payload.sessionId,
  };
}

export async function getActiveSession(): Promise<AuthResult | null> {
  const session = await getSession();
  if (!session) return null;

  const dbSession = await prisma.session.findUnique({
    where: { id: session.sessionId },
    select: {
      id: true,
      expiresAt: true,
      userId: true,
      user: {
        select: {
          isActive: true,
        },
      },
    },
  });

  if (!dbSession) return null;
  if (dbSession.userId !== session.userId) return null;
  if (!dbSession.user.isActive) return null;
  if (dbSession.expiresAt <= new Date()) return null;

  return session;
}

// ── Token hash (for DB storage — we store hash, not raw token) ────────────

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}
