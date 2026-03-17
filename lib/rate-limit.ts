/**
 * lib/rate-limit.ts
 * In-memory rate limiter para proteção do endpoint de login
 * OWASP: limita tentativas bruteforce por IP
 * Nota: em produção multi-instância, usar Redis (upstash/ioredis)
 */

interface Bucket {
  count: number;
  resetAt: number;
}

const store = new Map<string, Bucket>();

// Limpa buckets expirados a cada 5 minutos
setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of store.entries()) {
    if (now > bucket.resetAt) store.delete(key);
  }
}, 5 * 60 * 1000);

export interface RateLimitConfig {
  maxRequests: number;  // max tentativas
  windowMs: number;     // janela em ms
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

const LOGIN_CONFIG: RateLimitConfig = {
  maxRequests: 5,
  windowMs: 15 * 60 * 1000, // 15 minutos
};

export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = LOGIN_CONFIG
): RateLimitResult {
  const now = Date.now();
  const existing = store.get(identifier);

  if (!existing || now > existing.resetAt) {
    const bucket: Bucket = { count: 1, resetAt: now + config.windowMs };
    store.set(identifier, bucket);
    return { allowed: true, remaining: config.maxRequests - 1, resetAt: bucket.resetAt };
  }

  existing.count++;

  if (existing.count > config.maxRequests) {
    return { allowed: false, remaining: 0, resetAt: existing.resetAt };
  }

  return {
    allowed: true,
    remaining: config.maxRequests - existing.count,
    resetAt: existing.resetAt,
  };
}

export function getClientIp(request: Request): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown'
  );
}
