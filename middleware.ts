/**
 * middleware.ts — Next.js Edge Middleware
 * Protege rotas via JWT cookie
 * DEVE ter export default ou export { middleware } para Next.js reconhecer
 */

import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const getSecret = () => new TextEncoder().encode(
  process.env.JWT_SECRET ?? 'dev-secret-change-in-prod'
);

const COOKIE_NAME = 'cp_session';

// Rotas que NÃO precisam de autenticação
const PUBLIC_PATHS = [
  '/auth/login',
  '/auth/register',
  '/api/auth/login',
  '/api/auth/logout',
];

function isPublic(pathname: string): boolean {
  // Arquivos estáticos sempre públicos
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/logo') ||
    pathname.startsWith('/merlin') ||
    pathname.match(/\.(png|jpg|jpeg|gif|webp|svg|ico|css|js|woff|woff2)$/)
  ) return true;

  return PUBLIC_PATHS.some(p => pathname === p || pathname.startsWith(p + '/'));
}

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  if (isPublic(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get(COOKIE_NAME)?.value;

  if (!token) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    await jwtVerify(token, getSecret());
    return NextResponse.next();
  } catch {
    const response = NextResponse.redirect(new URL('/auth/login', request.url));
    response.cookies.delete(COOKIE_NAME);
    return response;
  }
}

export const config = {
  matcher: [
    // Match all routes except static files
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg)$).*)',
  ],
};
