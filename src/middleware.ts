import { NextResponse, type NextRequest } from 'next/server';
import { PROTECTED_PREFIXES } from '@/config/routes';
import { SESSION_COOKIE } from '@/lib/constants';

// Early, cheap redirect only. Role checks happen server-side in layouts and again in the backend.
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const headers = new Headers(req.headers);
  headers.set('x-pathname', pathname);
  const isProtected = PROTECTED_PREFIXES.some((r) => pathname === r.prefix || pathname.startsWith(r.prefix + '/'));
  if (isProtected && !req.cookies.get(SESSION_COOKIE)) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.search = `?next=${encodeURIComponent(pathname)}`;
    return NextResponse.redirect(url);
  }
  return NextResponse.next({ request: { headers } });
}
export const config = { matcher: ['/((?!_next/|api/|.*\\..*).*)'] };
