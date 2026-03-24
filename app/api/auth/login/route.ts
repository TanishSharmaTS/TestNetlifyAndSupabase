import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  const validUsername = process.env.ADMIN_USERNAME;
  const validPassword = process.env.ADMIN_PASSWORD;
  const secret = process.env.NEXTAUTH_SECRET;

  if (!validUsername || !validPassword || !secret) {
    return NextResponse.json(
      { error: 'Server misconfigured. Check environment variables.' },
      { status: 500 }
    );
  }

  if (username === validUsername && password === validPassword) {
    const response = NextResponse.json({ ok: true });
    response.cookies.set('admin_session', secret, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });
    return response;
  }

  return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
}
