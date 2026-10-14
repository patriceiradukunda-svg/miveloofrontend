export const ROLES = ['school', 'supplier', 'group', 'institution', 'admin'] as const;
export type Role = (typeof ROLES)[number];

export const ROLE_HOME: Record<Role, string> = {
  school: '/school/dashboard',
  supplier: '/supplier/dashboard',
  group: '/group/dashboard',
  institution: '/institution/dashboard',
  admin: '/admin/dashboard',
};

export const ROLE_LABEL: Record<Role, string> = {
  school: 'School',
  supplier: 'Individual supplier',
  group: 'Cooperative / supplier group',
  institution: 'Institution, NGO or government partner',
  admin: 'Miveloo staff',
};

/** Account types a visitor may *request* at sign-up. Requesting is never granting. */
export const REGISTRABLE = ['school', 'supplier', 'group', 'institution'] as const satisfies readonly Role[];
export type Registrable = (typeof REGISTRABLE)[number];
