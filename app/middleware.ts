import { getServerSession } from '@/app/lib/auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/app/lib/auth-options';
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const session = await getServerSession();
  const pathname = request.nextUrl.pathname
  const token = await getToken({ req: request })

  const isLoggedIn = !!session;
  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register');

  if (isAuthPage) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  if (!isLoggedIn) {
    let from = pathname;
    const searchParams = new URL(request.url).searchParams;
    if (searchParams.toString()) {
      from += `?${searchParams.toString()}`;
    }
    return NextResponse.redirect(
      new URL(`/login?from=${encodeURIComponent(from)}`, request.url)
    );
  }

    // Protect dashboard routes
  if (pathname.startsWith('/dashboard') && !token) {
    const url = new URL('/login', request.url)
    url.searchParams.set('from', pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};