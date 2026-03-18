/**
 * lib/auth.ts
 * JWT custom com jose (Edge Runtime compatível)
 * OWASP: httpOnly cookie, SameSite=Strict, token rotation, sem user enumeration
 */

import { SignJWT, jwtVerify, type JWTPayload } from 'jose';
import { cookies } from 'next/headers';
import { createHash } from 'crypto';

// ── Constants ──────────────────────────────────────────────────────────────

// Lazy — evaluated at request time, not build time
function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET env var is missing');
  return new TextEncoder().encode(secret);
}

const COOKIE_NAME = 'cp_session';
const TOKEN_TTL_SECONDS = 60 * 60 * 8; // 8h
const COOKIE_MAX_AGE = TOKEN_TTL_SECONDS;

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

export async function createToken(payload: Omit<SessionPayload, 'iat' | 'exp'>): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${TOKEN_TTL_SECONDS}s`)
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

export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  });
}

export async function getSessionCookie(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value;
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
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

// ── Token hash (for DB storage — we store hash, not raw token) ────────────

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}
