import 'server-only';
import { cookies } from 'next/headers';
import { SESSION_COOKIE } from './constants';
import { site } from '@/config/site';
import { ROLES, type Role } from '@/config/roles';
import { hasBackend } from './api-client';
import { ApiError, authMe, myOrganizations } from './miveloo-client';
import { ACCESS_COOKIE, withBackendToken } from '@/lib/server/backend-session';

export type VerificationStatus = 'unverified' | 'pending' | 'verified';
export interface Session {
  /** Historically the ORGANISATION id; kept so existing code keeps working. New code should use uid and orgId. */
  userId: string;
  name: string;
  role: Role;
  verification: VerificationStatus;
  demo: boolean;
  uid?: string;
  orgId?: string;
  orgType?: string;
  /** The backend role string (e.g. supplier_owner, support). */
  backendRole?: string;
  /** Backend permission list for the active membership: menus and buttons should be filtered by this. */
  permissions?: string[];
  email?: string;
  fullName?: string;
}

const ROLE_BY_ORG_TYPE: Record<string, Role> = {
  school: 'school',
  supplier: 'supplier',
  cooperative: 'group',
  government: 'institution',
  ngo: 'institution',
  platform: 'admin',
};

async function fromOrganizations(): Promise<Session | null> {
  const orgs = await withBackendToken(myOrganizations);
  const org = orgs[0];
  if (!org) return null;
  const role = ROLE_BY_ORG_TYPE[org.type];
  if (!role || !ROLES.includes(role)) return null;
  return { userId: org.id, name: org.name, role, verification: org.status === 'verified' ? 'verified' : 'pending', demo: false, orgId: org.id, orgType: org.type };
}

/**
 * Production sessions come from GET /auth/me: the user, every membership, the role and its permissions.
 * The active organisation is the backend's default (oldest membership), the same one the API authorises against.
 * Falls back to /organizations/mine only if the backend does not have /auth/me yet.
 * Demo cookies are accepted only when demo mode is enabled and no backend exists.
 */
export async function getSession(): Promise<Session | null> {
  const jar = await cookies();
  const raw = jar.get(SESSION_COOKIE)?.value;
  if (!raw) return null;

  if (hasBackend) {
    if (!jar.get(ACCESS_COOKIE)?.value && !jar.get('mv_refresh')?.value) return null;
    try {
      const me = await withBackendToken(authMe);
      const m = me.memberships.find((x) => x.org_id === me.default_org_id) ?? me.memberships[0];
      if (!m) return null;
      const role = ROLE_BY_ORG_TYPE[m.org_type];
      if (!role || !ROLES.includes(role)) return null;
      return {
        userId: m.org_id,
        name: m.org_name,
        role,
        verification: m.org_status === 'verified' ? 'verified' : 'pending',
        demo: false,
        uid: me.user.id,
        orgId: m.org_id,
        orgType: m.org_type,
        backendRole: m.role,
        permissions: m.permissions,
        email: me.user.email,
        fullName: me.user.full_name,
      };
    } catch (e) {
      if (e instanceof ApiError && e.status === 404) {
        try { return await fromOrganizations(); } catch { return null; }
      }
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
