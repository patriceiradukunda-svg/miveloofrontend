import 'server-only';
import { cookies } from 'next/headers';
import { SESSION_COOKIE } from './constants';
import { site } from '@/config/site';
import { ROLES, type Role } from '@/config/roles';
import { hasBackend } from './api-client';
import { myOrganizations } from './miveloo-client';
import { ACCESS_COOKIE, withBackendToken } from '@/lib/server/backend-session';

export type VerificationStatus = 'unverified' | 'pending' | 'verified';
export interface Session {
  userId: string;
  name: string;
  role: Role;
  verification: VerificationStatus;
  demo: boolean;
}

const ROLE_BY_ORG_TYPE: Record<string, Role> = {
  school: 'school',
  supplier: 'supplier',
  cooperative: 'group',
  government: 'institution',
  ngo: 'institution',
  platform: 'admin',
};

/**
 * Production sessions are validated through the documented organizations endpoint
 * using the backend access token. The backend does not expose /auth/session.
 * Demo cookies are accepted only when demo mode is enabled and no backend exists.
 */
export async function getSession(): Promise<Session | null> {
  const jar = await cookies();
  const raw = jar.get(SESSION_COOKIE)?.value;
  if (!raw) return null;

  if (hasBackend) {
    if (!jar.get(ACCESS_COOKIE)?.value && !jar.get('mv_refresh')?.value) return null;
    try {
      const orgs = await withBackendToken(myOrganizations);
      const org = orgs[0];
      if (!org) return null;

      const role = ROLE_BY_ORG_TYPE[org.type];
      if (!role || !ROLES.includes(role)) return null;

      return {
        userId: org.id,
        name: org.name,
        role,
        verification: org.status === 'verified' ? 'verified' : 'pending',
        demo: false,
      };
    } catch {
      return null;
    }
  }

  if (!site.demoMode) return null;
  try {
    const d = JSON.parse(Buffer.from(raw, 'base64url').toString()) as Partial<Session>;
    if (!d.role || !ROLES.includes(d.role)) return null;
    return {
      userId: 'demo',
      name: d.name ?? 'Demo user',
      role: d.role,
      verification: d.verification ?? 'verified',
      demo: true,
    };
  } catch {
    return null;
  }
}
