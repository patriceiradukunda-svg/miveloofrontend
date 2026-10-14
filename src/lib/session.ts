import 'server-only';
import { cookies } from 'next/headers';
import { SESSION_COOKIE } from './constants';
import { site } from '@/config/site';
import { ROLES, type Role } from '@/config/roles';
import { api, hasBackend } from './api-client';

export type VerificationStatus = 'unverified' | 'pending' | 'verified';
export interface Session { userId: string; name: string; role: Role; verification: VerificationStatus; demo: boolean }

/**
 * Production: the backend owns the session and validates it on every call.
 * Demo: an UNSIGNED cookie, only honoured when DEMO_MODE=true and no backend is configured.
 */
export async function getSession(): Promise<Session | null> {
  const jar = await cookies();
  const raw = jar.get(SESSION_COOKIE)?.value;
  if (!raw) return null;
  if (hasBackend) {
    try { return await api<Session>('/auth/session', { cookie: `${SESSION_COOKIE}=${raw}` }); } catch { return null; }
  }
  if (!site.demoMode) return null;
  try {
    const d = JSON.parse(Buffer.from(raw, 'base64url').toString()) as Partial<Session>;
    if (!d.role || !ROLES.includes(d.role)) return null;
    return { userId: 'demo', name: d.name ?? 'Demo user', role: d.role, verification: d.verification ?? 'verified', demo: true };
  } catch { return null; }
}
