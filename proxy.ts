/**
 * proxy.ts — Next.js 16 Edge Middleware
 * Protege rotas via JWT cookie
 */

import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const getSecret = () => new TextEncoder().encode(
  process.env.JWT_SECRET ?? 'dev-secret-change-in-prod'
);

const COOKIE_NAME = 'cp_session';

const PUBLIC_PATHS = [
  '/auth/login',
  '/auth/register',
  '/api/auth/login',
  '/api/auth/logout',
  '/api/admin/migrate-email',
];

function isPublic(pathname: string): boolean {
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.match(/\.(png|jpg|jpeg|gif|webp|svg|ico|woff|woff2|css|js)$/)
  ) return true;
  return PUBLIC_PATHS.some(p => pathname === p || pathname.startsWith(p + '/'));
}

async function handler(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  // Se autenticado e tenta acessar login → redirecionar para /home
  if (pathname === '/auth/login' || pathname === '/auth/register') {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    if (token) {
      try {
        await jwtVerify(token, getSecret());
        return NextResponse.redirect(new URL('/home', request.url));
      } catch {
        // token inválido, deixar ir para o login
      }
    }
    return NextResponse.next();
  }

  if (isPublic(pathname)) return NextResponse.next();

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
    const res = NextResponse.redirect(new URL('/auth/login', request.url));
    res.cookies.delete(COOKIE_NAME);
    return res;
  }
}

// Next.js 16 proxy.ts requires named export 'proxy'
export { handler as proxy };

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg)$).*)',
  ],
};
