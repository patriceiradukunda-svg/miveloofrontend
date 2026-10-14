import { PERMISSIONS, type Permission } from '@/config/permissions';
import { PROTECTED_PREFIXES } from '@/config/routes';
import type { Role } from '@/config/roles';

export function can(role: Role | undefined, action: Permission): boolean {
  return !!role && (PERMISSIONS[action] as readonly Role[]).includes(role);
}

/** Result of a route check: 'allow', 'login' (no session) or 'denied' (wrong role). */
export function checkRouteAccess(pathname: string, role: Role | undefined): 'allow' | 'login' | 'denied' {
  const rule = PROTECTED_PREFIXES.find((r) => pathname === r.prefix || pathname.startsWith(r.prefix + '/'));
  if (!rule) return 'allow';
  if (!role) return 'login';
  return rule.role === 'any' || rule.role === role ? 'allow' : 'denied';
}
