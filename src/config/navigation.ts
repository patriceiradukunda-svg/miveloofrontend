import type { Role } from './roles';
export interface NavLink { href: string; label: string }
const shared: NavLink[] = [
  { href: '/app/orders', label: 'Orders' }, { href: '/app/messages', label: 'Messages' }, { href: '/app/notifications', label: 'Notifications' },
  { href: '/app/ai-assistant', label: 'AI assistant' }, { href: '/app/analytics', label: 'Analytics' }, { href: '/app/reports', label: 'Reports' },
  { href: '/app/billing', label: 'Billing' }, { href: '/app/support', label: 'Support' }, { href: '/app/settings/profile', label: 'Settings' },
];
const own: Record<Role, NavLink[]> = {
  school: ['dashboard:Dashboard', 'marketplace:Marketplace', 'meal-planning:Meal planning', 'procurement:Procurement', 'budgets:Budgets', 'inventory:Inventory', 'suppliers:Suppliers', 'exchange:School exchange', 'deliveries:Deliveries', 'finances:Finances', 'price-history:Price history', 'profile:School profile'].map((s) => ({ href: `/school/${s.split(':')[0]}`, label: s.split(':')[1]! })),
  supplier: ['dashboard:Dashboard', 'products:Products', 'orders:Orders', 'buyers:Buyers', 'inventory:Inventory', 'deliveries:Deliveries', 'finances:Sales', 'analytics:Analytics', 'ai-insights:AI insights', 'performance:Performance', 'verification:Verification'].map((s) => ({ href: `/supplier/${s.split(':')[0]}`, label: s.split(':')[1]! })),
  group: ['dashboard:Dashboard', 'members:Members', 'inventory:Inventory', 'products:Listings', 'orders:Bulk orders', 'supply-planning:Supply planning', 'logistics:Logistics', 'payments:Payments', 'ai-insights:AI insights'].map((s) => ({ href: `/group/${s.split(':')[0]}`, label: s.split(':')[1]! })),
  institution: ['dashboard:Dashboard', 'intelligence:Intelligence', 'schools:Schools', 'programs:Programmes', 'forecasting:Forecasting', 'supply-gaps:Supply gaps', 'price-intelligence:Prices', 'supplier-network:Suppliers', 'reports:Reports', 'interventions:Interventions', 'data-access:Data access', 'billing:Billing'].map((s) => ({ href: `/institution/${s.split(':')[0]}`, label: s.split(':')[1]! })),
  admin: ['dashboard:Overview', 'careers:Careers', 'users:Users', 'organizations:Organisations', 'schools:Schools', 'suppliers:Suppliers', 'products:Products', 'marketplace:Marketplace', 'orders:Orders', 'billing:Billing', 'ai-monitoring:AI monitoring', 'data:Data', 'analytics:Analytics', 'support:Support', 'security:Security', 'settings:Settings'].map((s) => ({ href: `/admin/${s.split(':')[0]}`, label: s.split(':')[1]! })),
};
export function navFor(role: Role): NavLink[] { return role === 'admin' ? own.admin : [...own[role], ...shared]; }
