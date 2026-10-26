import type { Role } from './roles';
export interface NavLink { href: string; label: string }
/** Optional session facts that narrow a menu beyond the UI role (the backend role comes from /auth/me). */
export interface NavContext { backendRole?: string }

const shared: NavLink[] = [
  { href: '/app/orders', label: 'Orders' }, { href: '/app/messages', label: 'Messages' }, { href: '/app/notifications', label: 'Notifications' },
  { href: '/app/ai-assistant', label: 'AI assistant' }, { href: '/app/analytics', label: 'Analytics' }, { href: '/app/reports', label: 'Reports' },
  { href: '/app/billing', label: 'Billing' }, { href: '/app/support', label: 'Support' }, { href: '/app/settings/profile', label: 'Settings' },
];
/** "slug:Label" pairs under a base path. */
const mk = (base: string, items: string[]): NavLink[] => items.map((s) => ({ href: `${base}/${s.split(':')[0]}`, label: s.split(':')[1]! }));

const own: Record<Role, NavLink[]> = {
  school: [
    ...mk('/school', ['dashboard:Dashboard', 'marketplace:Marketplace', 'meal-planning:Meal planning', 'procurement:Procurement', 'budgets:Budgets', 'inventory:Inventory', 'suppliers:Suppliers', 'exchange:School exchange', 'deliveries:Deliveries', 'finances:Finances', 'price-history:Price history', 'profile:School profile']),
    ...mk('/school', ['shopping-requests:Shopping requests', 'nutrition:Nutrition', 'kitchen:Kitchen', 'budget-planning:Budget planning', 'waste-management:Waste management']),
  ],
  supplier: [
    ...mk('/supplier', ['dashboard:Dashboard', 'products:Products', 'orders:Orders', 'buyers:Buyers', 'inventory:Inventory', 'deliveries:Deliveries', 'finances:Sales', 'analytics:Analytics', 'ai-insights:AI insights', 'performance:Performance', 'verification:Verification']),
    ...mk('/supplier', ['forecasts:Forecasts', 'price-intelligence:Price intelligence', 'production:Production', 'marketplace:Marketplace']),
  ],
  group: [
    ...mk('/group', ['dashboard:Dashboard', 'members:Members', 'inventory:Inventory', 'products:Listings', 'orders:Bulk orders', 'supply-planning:Supply planning', 'logistics:Logistics', 'payments:Payments', 'ai-insights:AI insights']),
    ...mk('/cooperative', ['contracts:Contracts', 'production:Production', 'warehouse:Warehouse', 'profitability:Profitability', 'reports:Cooperative reports']),
  ],
  institution: [
    ...mk('/institution', ['dashboard:Dashboard', 'intelligence:Intelligence', 'schools:Schools', 'programs:Programmes', 'forecasting:Forecasting', 'supply-gaps:Supply gaps', 'price-intelligence:Prices', 'supplier-network:Suppliers', 'reports:Reports', 'interventions:Interventions', 'data-access:Data access', 'billing:Billing']),
    ...mk('/intelligence', ['dashboard:Intelligence hub', 'food-prices:Food prices', 'supply-demand:Supply and demand', 'food-security:Food security', 'school-feeding:School feeding', 'availability:Food availability', 'agriculture:Agriculture', 'geography:Geography', 'scenarios:Scenarios', 'reports:Intelligence reports']),
  ],
  admin: [
    ...mk('/admin', ['dashboard:Overview', 'careers:Careers', 'users:Users', 'organizations:Organisations', 'schools:Schools', 'suppliers:Suppliers', 'products:Products', 'marketplace:Marketplace', 'orders:Orders', 'billing:Billing', 'ai-monitoring:AI monitoring', 'data:Data', 'analytics:Analytics', 'support:Support', 'security:Security', 'settings:Settings']),
    ...mk('/ai-ops', ['dashboard:AI ops overview', 'model-registry:Model registry', 'deployments:Deployments', 'drift-monitoring:Drift monitoring', 'evaluations:Evaluations', 'experiments:Experiments', 'pipelines:Pipelines', 'data-quality:Data quality', 'data-sources:Data sources (AI)', 'audit:AI audit']),
  ],
};

/** Backend "support" staff hold a single permission (support:view_ticket): they get the support desk only. */
const SUPPORT_ONLY = ['/admin/dashboard', '/admin/support'];

export function navFor(role: Role, ctx?: NavContext): NavLink[] {
  if (role === 'admin') return ctx?.backendRole === 'support' ? own.admin.filter((l) => SUPPORT_ONLY.includes(l.href)) : own.admin;
  return [...own[role], ...shared];
}
