/**
 * Which pages each position may open.
 * Admin positions list admin module names (e.g. 'careers'); other positions list area paths (e.g. 'school/inventory').
 * '*' means everything in their area. A position that is not listed is not restricted.
 */
const D = ['dashboard'];
const ALL = ['*'];
export const POSITION_MODULES: Record<string, readonly string[]> = {
  // Platform administration
  'admin-super-administrator': ALL,
  'admin-founder-executive': ALL,
  'admin-operations-manager': [...D, 'orders', 'organizations', 'schools', 'suppliers', 'products', 'marketplace', 'support', 'analytics', 'verification', 'reports', 'moderation'],
  'admin-verification-officer': [...D, 'verification', 'schools', 'suppliers', 'organizations'],
  'admin-access-administrator': [...D, 'users', 'access', 'security', 'audit'],
  'admin-marketplace-ops-manager': [...D, 'marketplace', 'products', 'orders', 'suppliers', 'moderation', 'analytics'],
  'admin-marketplace-moderator': [...D, 'moderation', 'marketplace', 'products'],
  'admin-support-agent': [...D, 'support', 'users', 'orders'],
  'admin-customer-success-manager': [...D, 'customer-success', 'support', 'schools', 'suppliers', 'organizations', 'analytics'],
  'admin-billing-administrator': [...D, 'billing', 'orders'],
  'admin-finance-manager': [...D, 'finance', 'billing', 'orders', 'reports', 'analytics'],
  'admin-hr-manager': [...D, 'careers', 'hr'],
  'admin-recruiter': [...D, 'careers'],
  'admin-content-creator': [...D, 'content'],
  'admin-content-editor': [...D, 'content'],
  'admin-content-publisher': [...D, 'content'],
  'admin-partnerships-manager': [...D, 'partnerships', 'organizations', 'reports'],
  'admin-seo-manager': [...D, 'seo', 'content'],
  'admin-data-engineer': [...D, 'data', 'ai-monitoring', '/ai-ops'],
  'admin-data-scientist': [...D, 'data', 'analytics', 'ai-monitoring', '/ai-ops'],
  'admin-ai-model-approver': [...D, 'ai-monitoring', '/ai-ops'],
  'admin-ai-ops-engineer': [...D, 'ai-monitoring', 'data', '/ai-ops'],
  'admin-data-governance-officer': [...D, 'data-governance', 'data', 'audit', 'security'],
  'admin-security-administrator': [...D, 'security', 'audit', 'users', 'access'],
  'admin-security-auditor': [...D, 'security', 'audit'],
  'admin-tech-ops-engineer': [...D, 'tech-ops', 'integrations', 'ai-monitoring', 'security', 'settings'],
  'admin-integration-manager': [...D, 'integrations', 'tech-ops', 'settings'],
  'admin-impact-analyst': [...D, 'reports', 'analytics', 'data'],
  'admin-readonly-executive': [...D, 'analytics', 'reports', 'audit', 'organizations'],
  // School
  'school-owner': ALL,
  'school-headteacher': ALL,
  'school-feeding-manager': ['school/meal-planning', 'school/nutrition', 'school/kitchen', 'school/inventory', 'school/waste-management', 'school/deliveries', 'school/orders', 'school/suppliers', 'school/reports', 'school/price-history'],
  'school-auditor': ['school/finances', 'school/budgets', 'school/orders', 'school/deliveries', 'school/procurement', 'school/reports'],
  'school-analyst': ['school/reports', 'school/price-history', 'school/nutrition', 'school/budgets', 'school/meal-planning', 'school/waste-management'],
  'school-procurement-officer': ['school/procurement', 'school/marketplace', 'school/shopping-requests', 'school/requests', 'school/orders', 'school/suppliers', 'school/price-history', 'school/exchange', 'school/deliveries', 'school/budgets'],
  'school-storekeeper': ['school/inventory', 'school/deliveries', 'school/waste-management', 'school/orders'],
  'school-cook': ['school/kitchen', 'school/meal-planning', 'school/nutrition', 'school/inventory'],
  'school-finance-officer': ['school/finances', 'school/budgets', 'school/budget-planning', 'school/orders', 'school/procurement', 'school/reports'],
  // Supplier
  'supplier-owner': ALL,
  'supplier-manager': ['supplier/products', 'supplier/inventory', 'supplier/orders', 'supplier/deliveries', 'supplier/buyers', 'supplier/customers', 'supplier/marketplace', 'supplier/analytics', 'supplier/forecasts', 'supplier/performance', 'supplier/production', 'supplier/reports', 'supplier/price-intelligence', 'supplier/ai-insights', 'supplier/finances', 'supplier/verification'],
  'supplier-sales-officer': ['supplier/orders', 'supplier/buyers', 'supplier/customers', 'supplier/marketplace', 'supplier/products', 'supplier/price-intelligence', 'supplier/performance'],
  'supplier-inventory-officer': ['supplier/inventory', 'supplier/products', 'supplier/production', 'supplier/deliveries', 'supplier/forecasts'],
  'supplier-finance-officer': ['supplier/finances', 'supplier/orders', 'supplier/reports'],
  'supplier-analyst': ['supplier/analytics', 'supplier/forecasts', 'supplier/performance', 'supplier/price-intelligence', 'supplier/ai-insights', 'supplier/reports'],
  // Cooperative and supplier group (two areas: group and cooperative)
  'coop-owner': ALL,
  'coop-manager': ALL,
  'coop-membership-officer': ['group/members', 'cooperative/members'],
  'coop-warehouse-officer': ['group/inventory', 'group/products', 'cooperative/warehouse', 'cooperative/supply'],
  'coop-sales-officer': ['group/orders', 'group/products', 'cooperative/marketplace', 'cooperative/contracts'],
  'coop-logistics-officer': ['group/logistics', 'group/orders', 'cooperative/logistics'],
  'coop-treasurer': ['group/payments', 'cooperative/profitability', 'cooperative/reports'],
  'coop-committee-approver': ['group/orders', 'group/payments', 'group/supply-planning', 'cooperative/contracts', 'cooperative/reports'],
  'coop-analyst': ['group/ai-insights', 'group/supply-planning', 'cooperative/reports', 'cooperative/production', 'cooperative/profitability'],
  'coop-member': ['group/products', 'group/inventory', 'cooperative/production', 'cooperative/supply'],
  // Institutions (areas: institution and intelligence)
  'inst-district-admin': ALL,
  'inst-org-director': ALL,
  'inst-sector-officer': ['institution/schools', 'institution/programs', 'institution/interventions', 'institution/supply-gaps', 'institution/supplier-network', 'intelligence/school-feeding', 'intelligence/availability'],
  'inst-district-analyst': ['institution/schools', 'institution/programs', 'institution/interventions', 'institution/supply-gaps', 'institution/price-intelligence', 'institution/forecasting', 'institution/reports', 'institution/data-access', 'institution/supplier-network', 'intelligence'],
  'inst-mineduc-analyst': ['institution/schools', 'institution/programs', 'institution/reports', 'institution/supply-gaps', 'institution/forecasting', 'institution/data-access', 'intelligence/school-feeding', 'intelligence/food-security', 'intelligence/reports'],
  'inst-national-policy-analyst': ['institution/forecasting', 'institution/price-intelligence', 'institution/reports', 'institution/interventions', 'institution/programs', 'institution/supply-gaps', 'institution/data-access', 'institution/supplier-network', 'intelligence'],
  'inst-readonly-decision-maker': ['institution/reports', 'institution/programs', 'institution/schools', 'intelligence/reports', 'intelligence/food-security'],
  'inst-ngo-analyst': ['institution/programs', 'institution/interventions', 'institution/schools', 'institution/reports', 'intelligence/food-security', 'intelligence/school-feeding', 'intelligence/reports'],
};

const AREAS = ['school', 'supplier', 'group', 'cooperative', 'institution', 'intelligence'];
const COMMON = ['dashboard', 'profile'];

export function positionAllows(position: string | undefined | null, pathname: string): boolean {
  if (!position) return true;
  const mods = POSITION_MODULES[position];
  if (!mods || mods.includes('*')) return true;
  if (pathname === '/ai-ops' || pathname.startsWith('/ai-ops/')) return mods.includes('/ai-ops');
  const [, seg = '', sub = ''] = pathname.split('/');
  if (seg === 'admin') return sub === '' || sub === 'dashboard' || mods.includes(sub);
  if (AREAS.includes(seg)) {
    if (sub === '' || COMMON.includes(sub)) return true;
    return mods.some((m) => pathname === '/' + m || pathname.startsWith('/' + m + '/'));
  }
  return true;
}

export const ADMIN_NAV: ReadonlyArray<{ href: string; label: string }> = [
  ['dashboard', 'Dashboard'], ['users', 'Users'], ['organizations', 'Organisations'], ['schools', 'Schools'], ['suppliers', 'Suppliers'],
  ['verification', 'Verification'], ['products', 'Products'], ['marketplace', 'Marketplace'], ['moderation', 'Moderation'], ['orders', 'Orders'],
  ['billing', 'Billing'], ['finance', 'Finance'], ['support', 'Support'], ['customer-success', 'Customer success'],
  ['careers', 'Careers: job posts'], ['careers/applications', 'Careers: applications'], ['careers/candidates', 'Careers: candidates'],
  ['careers/interviews', 'Careers: interviews'], ['careers/ideas', 'Careers: ideas'], ['hr', 'HR'],
  ['content', 'Content'], ['content/blog', 'Blog'], ['content/news', 'News'], ['content/events', 'Events'], ['content/media', 'Media library'],
  ['partnerships', 'Partnerships'], ['seo', 'SEO and website'], ['analytics', 'Analytics'], ['reports', 'Reports and impact'], ['data', 'Data'],
  ['data-governance', 'Data governance'], ['ai-monitoring', 'AI monitoring'], ['security', 'Security'], ['audit', 'Audit log'],
  ['access', 'Roles and access'], ['integrations', 'Integrations'], ['tech-ops', 'Technical operations'], ['settings', 'Settings'],
].map(([k, label]) => ({ href: `/admin/${k}`, label: label as string }));

/** Sidebar links for a position. Positions without an entry (or normal accounts) keep the standard role menu. */
export function navForPosition<T extends { href: string }>(position: string | undefined | null, base: T[]): T[] {
  if (!position) return base;
  const mods = POSITION_MODULES[position];
  if (!mods) return base;
  const isAdmin = position.startsWith('admin-');
  if (mods.includes('*')) {
    if (!isAdmin) return base;
    const have = new Set(base.map((b) => b.href));
    return [...base, ...(ADMIN_NAV.filter((i) => !have.has(i.href)) as unknown as T[])];
  }
  if (isAdmin) {
    const items = ADMIN_NAV.filter((i) => positionAllows(position, i.href)) as unknown as T[];
    const ai = base.filter((l) => l.href.startsWith('/ai-ops') && positionAllows(position, l.href));
    return [...items, ...ai];
  }
  return base.filter((l) => positionAllows(position, l.href));
}
