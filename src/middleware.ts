import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const AUTH_COOKIE_NAME = 'idea_machine_auth';

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}
const JWT_SECRET = process.env.JWT_SECRET;

interface JWTPayload {
  userId: string;
  username: string;
  displayName: string;
  role: 'admin' | 'user';
}

async function verifyTokenFromCookie(request: NextRequest): Promise<JWTPayload | null> {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

// API routes that don't require authentication
const publicApiRoutes = ['/api/auth/login', '/api/auth/logout'];

// Page routes that don't require authentication
const publicPageRoutes = ['/login', '/changelog'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle API routes
  if (pathname.startsWith('/api/')) {
    // Allow public API routes without auth
    if (publicApiRoutes.some(route => pathname === route)) {
      return NextResponse.next();
    }

    // All other API routes require authentication
    const user = await verifyTokenFromCookie(request);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Admin API routes require admin role
    if (pathname.startsWith('/api/admin/')) {
      if (user.role !== 'admin') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    return NextResponse.next();
  }

  // Handle page routes
  // Allow public page routes
  if (publicPageRoutes.some(route => pathname.startsWith(route))) {
    // If already logged in and trying to access login, redirect to home
    const user = await verifyTokenFromCookie(request);
    if (user && pathname === '/login') {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  // Check authentication for protected page routes
  const user = await verifyTokenFromCookie(request);

  if (!user) {
    // Not logged in, redirect to login
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Check admin page routes
  if (pathname.startsWith('/admin')) {
    if (user.role !== 'admin') {
      // Not an admin, redirect to home
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
