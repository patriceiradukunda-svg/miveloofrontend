'use server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { SESSION_COOKIE } from '@/lib/constants';
import { site } from '@/config/site';
import { hasBackend } from '@/lib/api-client';
import { verifyGoogleCredential } from './google';

const BASE = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? '';
const PENDING = 'mv_google_pending';
const secure = process.env.NODE_ENV === 'production';
const sessionOpts = { httpOnly: true, secure, sameSite: 'lax' as const, path: '/', maxAge: 60 * 60 * 8 };
const pendingOpts = { httpOnly: true, secure, sameSite: 'lax' as const, path: '/', maxAge: 60 * 10 };

/** Sign in with Google. The backend (POST /auth/google) re-verifies the token and answers:
 *  200 + Set-Cookie mv_session = signed in;  404 {"code":"NO_ACCOUNT"} = no account for this Google email;  401/400 = invalid token.
 *  A plain 404 (route missing) is treated as an error, never as "no account". */
export async function googleLoginAction(credential: string, next?: string): Promise<{ error: string }> {
  const who = await verifyGoogleCredential(credential);
  if (!who.ok) return { error: who.error };
  if (!hasBackend) return { error: site.demoMode ? 'No backend is connected, so Google sign-in cannot start a session in this demo.' : 'Sign-in is not available yet because the service is not connected.' };
  const res = await fetch(`${BASE}/auth/google`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ credential }) });
  const code = res.status === 404 ? ((await res.json().catch(() => ({}))) as { code?: string }).code : undefined;
  if (code === 'NO_ACCOUNT') {
    // No account yet: do NOT create one. Keep the verified Google identity for 10 minutes and continue with the sign-up details.
    (await cookies()).set(PENDING, credential, pendingOpts);
    redirect('/register/google');
  }
  if (!res.ok) return { error: res.status === 429 ? 'Too many attempts. Please wait a few minutes.' : 'We could not sign you in with Google. Please try again.' };
  const sc = res.headers.getSetCookie().find((c) => c.startsWith(`${SESSION_COOKIE}=`));
  if (!sc) return { error: 'Sign-in did not complete. Please try again.' };
  (await cookies()).set(SESSION_COOKIE, decodeURIComponent(sc.split(';')[0]!.split('=').slice(1).join('=')), sessionOpts);
  const n = next ?? '';
  redirect(n.startsWith('/') && !n.startsWith('//') ? n : '/app');
}

/** The verified Google identity saved by a sign-in attempt with no account (null if none or expired). */
export async function readPendingGoogle(): Promise<{ credential: string; email: string; name: string } | null> {
  const c = (await cookies()).get(PENDING)?.value;
  if (!c) return null;
  const r = await verifyGoogleCredential(c);
  return r.ok ? { credential: c, email: r.email, name: r.name } : null;
}
export async function clearPendingGoogle(): Promise<void> {
  (await cookies()).delete(PENDING);
}
