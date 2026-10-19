"use server";
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { SESSION_COOKIE } from '@/lib/constants';
import { site } from '@/config/site';
import { hasBackend } from '@/lib/api-client';
import { ROLES, ROLE_HOME, type Role } from '@/config/roles';
import { ApiError, backendLogin, liveApi, myOrganizations } from '@/lib/miveloo-client';
import { ACCESS_COOKIE, REFRESH_COOKIE, accessOpts, refreshOpts } from '@/lib/server/backend-session';

const opts = { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' as const, path: '/', maxAge: 60 * 60 * 8 };

/** Demo only. Refuses to run unless DEMO_MODE=true and no backend is configured. */
export async function demoLogin(role: Role, verification: 'verified' | 'pending' = 'verified') {
  if (!site.demoMode || hasBackend || !ROLES.includes(role)) redirect('/access-denied');
  const value = Buffer.from(JSON.stringify({ role, verification, name: `Demo ${role}` })).toString('base64url');
  (await cookies()).set(SESSION_COOKIE, value, opts);
  redirect(ROLE_HOME[role]);
}
export async function logout() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE); jar.delete(ACCESS_COOKIE); jar.delete(REFRESH_COOKIE);
  redirect('/login');
}

// Backend organization type -> UI role. We pick the first candidate that exists in this app's ROLES list.
const ROLE_CANDIDATES: Record<string, string[]> = {
  school: ['school', 'school_admin', 'school_buyer', 'buyer'],
  supplier: ['supplier', 'individual_supplier', 'supplier_owner'],
  cooperative: ['cooperative', 'cooperative_manager'],
  government: ['institution', 'institutional_analyst', 'government', 'analyst'],
  ngo: ['institution', 'institutional_analyst', 'ngo', 'analyst'],
  platform: ['admin', 'platform_admin', 'support'],
};
function pickRole(orgType: string): Role | undefined {
  const all = ROLES as readonly string[];
  const hit = (ROLE_CANDIDATES[orgType] ?? []).find((c) => all.includes(c));
  return hit as Role | undefined;
}

async function liveLogin(fd: FormData): Promise<{ error?: string; role?: Role; next?: string }> {
  try {
    const t = await backendLogin(String(fd.get('email') ?? ''), String(fd.get('password') ?? ''));
    const orgs = await myOrganizations(t.access_token);
    const org = orgs[0];
    if (!org) return { error: 'Your account has no organization yet. Register your school, supplier or cooperative first.' };
    const role = pickRole(org.type);
    if (!role) return { error: `This app has no role for organization type "${org.type}" yet.` };
    const jar = await cookies();
    jar.set(ACCESS_COOKIE, t.access_token, accessOpts);
    jar.set(REFRESH_COOKIE, t.refresh_token, refreshOpts);
    // UI-routing cookie only (same shape the layouts already read). Every data call is re-checked by the backend with the token above.
    const ui = { role, verification: org.status === 'verified' ? 'verified' : 'pending', name: org.name, live: true };
    jar.set(SESSION_COOKIE, Buffer.from(JSON.stringify(ui)).toString('base64url'), opts);
    return { role };
  } catch (e) {
    if (e instanceof ApiError) return { error: e.status === 429 ? 'Too many attempts. Please wait a few minutes.' : e.status === 401 ? 'That email and password do not match.' : e.status === 503 ? 'The service is waking up. Please try again in a minute.' : 'Sign-in failed. Please try again.' };
    return { error: 'Sign-in failed. Please try again.' };
  }
}

export async function loginAction(_: { error?: string } | undefined, fd: FormData): Promise<{ error?: string }> {
  const next = String(fd.get('next') ?? '');
  const safeNext = next.startsWith('/') && !next.startsWith('//') ? next : '';
  if (liveApi) {
    const r = await liveLogin(fd);
    if (r.error) return { error: r.error };
    redirect(safeNext || (r.role ? ROLE_HOME[r.role] : '/app'));
  }
  if (!hasBackend) return { error: site.demoMode ? 'No backend is connected. Use the demo buttons below.' : 'Sign-in is not available yet because the service is not connected. You can still read how Miveloo works.' };
  const res = await fetch(`${process.env.API_URL}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: fd.get('email'), password: fd.get('password') }) });
  if (!res.ok) return { error: res.status === 429 ? 'Too many attempts. Please wait a few minutes.' : 'That email and password do not match.' };
  const sc = res.headers.getSetCookie().find((c) => c.startsWith(`${SESSION_COOKIE}=`));
  if (sc) (await cookies()).set(SESSION_COOKIE, decodeURIComponent(sc.split(';')[0]!.split('=').slice(1).join('=')), opts);
  redirect(safeNext || '/app');
}
