'use server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { site } from '@/config/site';
import { ROLE_HOME } from '@/config/roles';
import { liveApi } from '@/lib/miveloo-client';
import { postGoogle, startSessionFromTokens, type Tokens } from '@/lib/server/google-session';
import { verifyGoogleCredential } from './google';

const PENDING = 'mv_google_pending';
const secure = process.env.NODE_ENV === 'production';
const pendingOpts = { httpOnly: true, secure, sameSite: 'lax' as const, path: '/', maxAge: 60 * 10 };

/** Sign in with Google. Backend POST /api/v1/auth/google re-verifies the token and answers:
 *  200 + {access_token, refresh_token} = signed in;  404 {"code":"NO_ACCOUNT"} = no account for this Google email;  401/400 = invalid token.
 *  A plain 404 (route missing) is treated as an error, never as "no account". */
export async function googleLoginAction(credential: string, next?: string): Promise<{ error: string }> {
  const who = await verifyGoogleCredential(credential);
  if (!who.ok) return { error: who.error };
  if (!liveApi) return { error: site.demoMode ? 'No backend is connected, so Google sign-in cannot start a session in this demo.' : 'Sign-in is not available yet because the service is not connected.' };

  let res: Response;
  try { res = await postGoogle('/auth/google', { credential }); }
  catch { return { error: 'The service is waking up. Please try again in a minute.' }; }

  const noAccount = res.status === 404 && ((await res.json().catch(() => ({}))) as { code?: string }).code === 'NO_ACCOUNT';
  if (noAccount) {
    // No account yet: do NOT create one. Keep the verified Google identity for 10 minutes and continue with the sign-up details.
    (await cookies()).set(PENDING, credential, pendingOpts);
    redirect('/register/google');
  }
  if (!res.ok) return { error: res.status === 429 ? 'Too many attempts. Please wait a few minutes.' : res.status === 503 ? 'The service is waking up. Please try again in a minute.' : 'We could not sign you in with Google. Please try again.' };

  let r: Awaited<ReturnType<typeof startSessionFromTokens>>;
  try { r = await startSessionFromTokens((await res.json()) as Tokens); }
  catch { r = { error: 'Sign-in did not complete. Please try again.' }; }
  if (r.error) return { error: r.error };

  const n = next ?? '';
  redirect(n.startsWith('/') && !n.startsWith('//') ? n : (r.role ? ROLE_HOME[r.role] : '/app'));
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
