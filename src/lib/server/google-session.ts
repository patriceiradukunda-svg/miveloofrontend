import 'server-only';
import { cookies } from 'next/headers';
import { SESSION_COOKIE } from '@/lib/constants';
import { ROLES, type Role } from '@/config/roles';
import { API_BASE, myOrganizations } from '@/lib/miveloo-client';
import { ACCESS_COOKIE, REFRESH_COOKIE, accessOpts, refreshOpts } from '@/lib/server/backend-session';

export interface Tokens { access_token: string; refresh_token: string }

const ROLE_BY_ORG_TYPE: Record<string, string> = {
  school: 'school', supplier: 'supplier', cooperative: 'group', government: 'institution', ngo: 'institution', platform: 'admin',
};
const uiOpts = { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' as const, path: '/', maxAge: 60 * 60 * 8 };

/** POST a Google credential to the backend. Server-side only; never exposed as a server action. */
export function postGoogle(path: '/auth/google' | '/auth/google/register', body: Record<string, unknown>): Promise<Response> {
  return fetch(`${API_BASE}${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), cache: 'no-store' });
}

/** Same cookies as the password login: access, refresh, and the UI-routing cookie. */
export async function startSessionFromTokens(t: Tokens): Promise<{ error?: string; role?: Role }> {
  const orgs = await myOrganizations(t.access_token);
  const org = orgs[0];
  if (!org) return { error: 'Your account has no organization yet. Register your school, supplier or cooperative first.' };
  const role = ROLE_BY_ORG_TYPE[org.type] as Role | undefined;
  if (!role || !(ROLES as readonly string[]).includes(role)) return { error: `This app has no role for organization type "${org.type}" yet.` };
  const jar = await cookies();
  jar.set(ACCESS_COOKIE, t.access_token, accessOpts);
  jar.set(REFRESH_COOKIE, t.refresh_token, refreshOpts);
  const ui = { role, verification: org.status === 'verified' ? 'verified' : 'pending', name: org.name, live: true };
  jar.set(SESSION_COOKIE, Buffer.from(JSON.stringify(ui)).toString('base64url'), uiOpts);
  return { role };
}
