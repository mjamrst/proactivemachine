import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const AUTH_COOKIE_NAME = 'idea_machine_auth';
const JWT_SECRET = process.env.JWT_SECRET || 'idea-machine-secret-key-change-in-production';

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

// Routes that don't require authentication
const publicRoutes = ['/login', '/api/auth/login', '/changelog'];

// Routes that require admin role
const adminRoutes = ['/admin'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip API routes except auth-related ones that need protection
  if (pathname.startsWith('/api/') && !pathname.startsWith('/api/admin/')) {
    return NextResponse.next();
  }

  // Allow public routes
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    // If already logged in and trying to access login, redirect to home
    const user = await verifyTokenFromCookie(request);
    if (user && pathname === '/login') {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  // Check authentication for protected routes
  const user = await verifyTokenFromCookie(request);

  if (!user) {
    // Not logged in, redirect to login
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Check admin routes
  if (adminRoutes.some(route => pathname.startsWith(route))) {
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
