/** Which admin areas each staff position may open. A position that is not listed here is not restricted by this map. */
const DASH = ['dashboard'];
export const POSITION_MODULES: Record<string, readonly string[]> = {
  'admin-super-administrator': ['*'],
  'admin-founder-executive': ['*'],
  'admin-operations-manager': [...DASH, 'orders', 'organizations', 'schools', 'suppliers', 'products', 'marketplace', 'support', 'analytics', 'verification', 'reports', 'moderation'],
  'admin-verification-officer': [...DASH, 'verification', 'schools', 'suppliers', 'organizations'],
  'admin-access-administrator': [...DASH, 'users', 'access', 'security', 'audit'],
  'admin-marketplace-ops-manager': [...DASH, 'marketplace', 'products', 'orders', 'suppliers', 'moderation', 'analytics'],
  'admin-marketplace-moderator': [...DASH, 'moderation', 'marketplace', 'products'],
  'admin-support-agent': [...DASH, 'support', 'users', 'orders'],
  'admin-customer-success-manager': [...DASH, 'customer-success', 'support', 'schools', 'suppliers', 'organizations', 'analytics'],
  'admin-billing-administrator': [...DASH, 'billing', 'orders'],
  'admin-finance-manager': [...DASH, 'finance', 'billing', 'orders', 'reports', 'analytics'],
  'admin-hr-manager': [...DASH, 'careers', 'hr'],
  'admin-recruiter': [...DASH, 'careers'],
  'admin-content-creator': [...DASH, 'content'],
  'admin-content-editor': [...DASH, 'content'],
  'admin-content-publisher': [...DASH, 'content'],
  'admin-partnerships-manager': [...DASH, 'partnerships', 'organizations', 'reports'],
  'admin-seo-manager': [...DASH, 'seo', 'content'],
  'admin-data-engineer': [...DASH, 'data', 'ai-monitoring', '/ai-ops'],
  'admin-data-scientist': [...DASH, 'data', 'analytics', 'ai-monitoring', '/ai-ops'],
  'admin-ai-model-approver': [...DASH, 'ai-monitoring', '/ai-ops'],
  'admin-ai-ops-engineer': [...DASH, 'ai-monitoring', 'data', '/ai-ops'],
  'admin-data-governance-officer': [...DASH, 'data-governance', 'data', 'audit', 'security'],
  'admin-security-administrator': [...DASH, 'security', 'audit', 'users', 'access'],
  'admin-security-auditor': [...DASH, 'security', 'audit'],
  'admin-tech-ops-engineer': [...DASH, 'tech-ops', 'integrations', 'ai-monitoring', 'security', 'settings'],
  'admin-integration-manager': [...DASH, 'integrations', 'tech-ops', 'settings'],
  'admin-impact-analyst': [...DASH, 'reports', 'analytics', 'data'],
  'admin-readonly-executive': [...DASH, 'analytics', 'reports', 'audit', 'organizations'],
};

export function positionAllows(position: string | undefined | null, pathname: string): boolean {
  if (!position) return true;
  const mods = POSITION_MODULES[position];
  if (!mods || mods.includes('*')) return true;
  if (pathname === '/ai-ops' || pathname.startsWith('/ai-ops/')) return mods.includes('/ai-ops');
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    const base = pathname.split('/')[2] ?? '';
    return base === '' || base === 'dashboard' || mods.includes(base);
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
].map(([k, label]) => ({ href: `/admin/${k}`, label: label as string })).concat([{ href: '/ai-ops/dashboard', label: 'AI operations' }]);

export function adminNavFor(position: string | undefined | null) {
  return ADMIN_NAV.filter((i) => positionAllows(position, i.href));
}
