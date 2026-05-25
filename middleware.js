import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

// This function can be marked `async` if using `await` inside
export async function middleware(request) {
  // 1. Admin Protection
  if (request.nextUrl.pathname.startsWith('/admin') && request.nextUrl.pathname !== '/admin/login') {
    const token = request.cookies.get('adminToken')?.value;
    if (!token) return NextResponse.redirect(new URL('/admin/login', request.url));
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret_key');
      await jwtVerify(token, secret);
      return NextResponse.next();
    } catch {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // 2. User Dashboard Protection (Handled implicitly by component API fetch)
  // Removed edge-runtime redundant jose checks which cause redirect loops

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/admin/:path*'
  ]
};
