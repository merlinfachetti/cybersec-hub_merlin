import { NextResponse } from 'next/server';
import { getActiveSession, SESSION_COOKIE_NAME } from '@/lib/auth';

export async function GET(): Promise<NextResponse> {
  const session = await getActiveSession();
  if (!session) {
    const response = NextResponse.json({ valid: false }, { status: 401 });
    response.cookies.delete(SESSION_COOKIE_NAME);
    return response;
  }

  return NextResponse.json({
    valid: true,
    sessionId: session.sessionId,
  });
}
