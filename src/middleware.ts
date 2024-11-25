import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token_atmosph')?.value;

  // Redirect users with a token away from /auth
  if (token && req.nextUrl.pathname === '/auth') {
    return NextResponse.redirect(new URL('/', req.url)); // Redirect to home page or another page
  }

  // Redirect users without a token to /auth if accessing protected routes
  if (!token && ['/career', '/portfolio', '/'].includes(req.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/auth', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",           // Protected route
    "/career",     // Protected route
    "/portfolio",  // Protected route
    "/auth",       // Check for redirect if token exists
  ],
};
