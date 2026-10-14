import type { Role } from './roles';

/** UI hints only. The backend must re-check every one of these on every request. */
export const PERMISSIONS = {
  'marketplace.browse.public': ['school', 'supplier', 'group', 'institution', 'admin'],
  'marketplace.buy': ['school'],
  'order.create': ['school'],
  'order.respond': ['supplier', 'group'],
  'listing.manage': ['supplier', 'group'],
  'group.allocate': ['group'],
  'intelligence.aggregate': ['institution', 'admin'],
  'admin.access': ['admin'],
  'verification.review': ['admin'],
  'audit.read': ['admin'],
} as const satisfies Record<string, readonly Role[]>;

export type Permission = keyof typeof PERMISSIONS;
