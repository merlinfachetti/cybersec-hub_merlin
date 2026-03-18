/**
 * middleware.ts
 * Proteção de rotas via JWT — Edge Runtime
 * Rotas protegidas: /portal/* e /api/* (exceto auth)
 */

import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const getSecret = () => new TextEncoder().encode(process.env.JWT_SECRET ?? 'dev-secret-change-in-prod');
const COOKIE_NAME = 'cp_session';

// Rotas públicas (não precisam de auth)
const PUBLIC_PATHS = [
  '/',
  '/auth/login',
  '/auth/register',
  '/api/auth/login',
];

function isPublic(pathname: string): boolean {
  return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'));
}

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  // Deixa passar arquivos estáticos e rotas públicas
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/public') ||
    isPublic(pathname)
  ) {
    return NextResponse.next();
  }

  // Verifica cookie de sessão
  const token = request.cookies.get(COOKIE_NAME)?.value;

  if (!token) {
    return redirectToLogin(request);
  }

  // Valida JWT
  try {
    await jwtVerify(token, getSecret());
    return NextResponse.next();
  } catch {
    // Token inválido ou expirado — limpa cookie e redireciona
    const response = redirectToLogin(request);
    response.cookies.delete(COOKIE_NAME);
    return response;
  }
}

function redirectToLogin(request: NextRequest): NextResponse {
  const loginUrl = new URL('/auth/login', request.url);
  loginUrl.searchParams.set('from', request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
