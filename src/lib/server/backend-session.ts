// Server-only helpers (used by server actions). Backend tokens live in httpOnly cookies and never reach client JavaScript.
import { cookies } from 'next/headers';
import { ApiError, backendRefresh } from '@/lib/miveloo-client';

export const ACCESS_COOKIE = 'mv_access';
export const REFRESH_COOKIE = 'mv_refresh';
const base = { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' as const, path: '/' };
export const accessOpts = { ...base, maxAge: 60 * 60 * 8 };      // the JWT itself expires sooner; we refresh on 401
export const refreshOpts = { ...base, maxAge: 60 * 60 * 24 * 14 };

/** Runs `fn` with the user's access token; on 401 it rotates tokens once using the refresh cookie and retries. */
export async function withBackendToken<T>(fn: (token: string) => Promise<T>): Promise<T> {
  const jar = await cookies();
  const access = jar.get(ACCESS_COOKIE)?.value;
  const refresh = jar.get(REFRESH_COOKIE)?.value;
  if (!access && !refresh) throw new ApiError(401, 'Please sign in again.');
  try {
    if (!access) throw new ApiError(401, 'expired');
    return await fn(access);
  } catch (e) {
    if (!(e instanceof ApiError) || e.status !== 401 || !refresh) throw e;
    const t = await backendRefresh(refresh);
    jar.set(ACCESS_COOKIE, t.access_token, accessOpts);
    jar.set(REFRESH_COOKIE, t.refresh_token, refreshOpts);
    return await fn(t.access_token);
  }
}
export function messageOf(e: unknown): string {
  if (e instanceof ApiError) return e.status === 401 ? 'Your session expired. Please sign in again.' : e.status === 403 ? 'Your account is not allowed to do that (is your organization verified?).' : e.message;
  return 'Something went wrong. Please try again.';
}
