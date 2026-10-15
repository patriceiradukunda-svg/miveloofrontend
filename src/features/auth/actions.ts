"use server";
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { SESSION_COOKIE } from '@/lib/constants';
import { site } from '@/config/site';
import { hasBackend } from '@/lib/api-client';
import { ROLES, ROLE_HOME, type Role } from '@/config/roles';

const opts = { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' as const, path: '/', maxAge: 60 * 60 * 8 };

/** Demo only. Refuses to run unless DEMO_MODE=true and no backend is configured. */
export async function demoLogin(role: Role, verification: 'verified' | 'pending' = 'verified') {
  if (!site.demoMode || hasBackend || !ROLES.includes(role)) redirect('/access-denied');
  const value = Buffer.from(JSON.stringify({ role, verification, name: `Demo ${role}` })).toString('base64url');
  (await cookies()).set(SESSION_COOKIE, value, opts);
  redirect(ROLE_HOME[role]);
}
export async function logout() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect('/login');
}
export async function loginAction(_: { error?: string } | undefined, fd: FormData): Promise<{ error?: string }> {
  if (!hasBackend) return { error: site.demoMode ? 'No backend is connected. Use the demo buttons below.' : 'Sign-in is not available yet because the service is not connected. You can still read how Miveloo works.' };
  const res = await fetch(`${process.env.API_URL}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: fd.get('email'), password: fd.get('password') }) });
  if (!res.ok) return { error: res.status === 429 ? 'Too many attempts. Please wait a few minutes.' : 'That email and password do not match.' };
  const sc = res.headers.getSetCookie().find((c) => c.startsWith(`${SESSION_COOKIE}=`));
  if (sc) (await cookies()).set(SESSION_COOKIE, decodeURIComponent(sc.split(';')[0]!.split('=').slice(1).join('=')), opts);
  const next = String(fd.get('next') ?? '');
  redirect(next.startsWith('/') && !next.startsWith('//') ? next : '/app');
}
