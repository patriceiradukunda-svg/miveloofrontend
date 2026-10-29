import type { NavLink } from './navigation';

export type Area = 'school' | 'supplier';
export type GroupIcon = 'home' | 'box' | 'cart' | 'truck' | 'wallet' | 'building' | 'book' | 'users' | 'user';
export interface WsGroup { name: string; icon: GroupIcon; items: NavLink[] }
type Def = readonly [name: string, icon: GroupIcon, slugs: readonly string[]];

/** Sidebar groups and top tabs per workspace. A slug is the page path below /school or /supplier. */
export const GROUP_DEFS: Record<Area, readonly Def[]> = {
  supplier: [
    ['Overview', 'home', ['dashboard', 'analytics', 'ai-insights', 'reports', 'performance']],
    ['Products', 'box', ['products', 'inventory', 'stock-counts', 'stock-alerts', 'quality-checks', 'spoilage', 'production', 'forecasts']],
    ['Selling', 'cart', ['marketplace', 'orders', 'buyers', 'customers', 'enquiries', 'quotations', 'sales-targets', 'price-intelligence', 'demand-trends', 'seasonality', 'buyer-segments']],
    ['Delivery', 'truck', ['deliveries', 'delivery-planning', 'disputes-returns', 'approvals']],
    ['Money', 'wallet', ['finances', 'invoices', 'payouts', 'payments-received', 'outstanding', 'reconciliation']],
    ['Business', 'building', ['verification', 'business-profile', 'documents', 'settings']],
  ],
  school: [
    ['Overview', 'home', ['dashboard', 'reports', 'trends-forecasts', 'price-history']],
    ['Kitchen & menu', 'book', ['meal-planning', 'recipes', 'nutrition', 'dietary-requirements', 'kitchen', 'meals-served', 'cost-per-meal', 'food-safety']],
    ['Buying', 'cart', ['marketplace', 'requests/new', 'shopping-requests', 'orders', 'recurring-orders', 'quotations', 'procurement', 'exchange']],
    ['Our suppliers', 'users', ['suppliers', 'supplier-comparison', 'supplier-ratings', 'supplier-performance']],
    ['Receiving & stock', 'box', ['deliveries', 'goods-received', 'inventory', 'stock-counts', 'stock-issues', 'stock-alerts', 'waste-management']],
    ['Money', 'wallet', ['finances', 'budgets', 'budget-planning', 'funding-sources', 'invoices', 'payments', 'reconciliation', 'variance-flags']],
    ['School', 'building', ['approvals', 'disputes-returns', 'audit-trail', 'document-archive', 'profile']],
  ],
};

/** Turns the links a user may open into groups. Pages without a group go to "More"; shared /app links go to "Account". */
export function workspaceGroups(area: Area, links: NavLink[]): WsGroup[] {
  const prefix = `/${area}/`;
  const byHref = new Map(links.map((l) => [l.href, l]));
  const placed = new Set<string>();
  const out: WsGroup[] = [];
  for (const [name, icon, slugs] of GROUP_DEFS[area]) {
    const items: NavLink[] = [];
    for (const s of slugs) { const l = byHref.get(prefix + s); if (l) { items.push(l); placed.add(l.href); } }
    if (items.length) out.push({ name, icon, items });
  }
  const rest = links.filter((l) => !placed.has(l.href));
  const more = rest.filter((l) => l.href.startsWith(prefix));
  const account = rest.filter((l) => l.href.startsWith('/app/'));
  if (more.length) out.push({ name: 'More', icon: 'box', items: more });
  if (account.length) out.push({ name: 'Account', icon: 'user', items: account });
  return out;
}

/** The group and tab that match the current URL (longest matching link wins, so /supplier/products/new lights up Products). */
export function activeOf(groups: WsGroup[], path: string): { group: WsGroup | undefined; item: NavLink | undefined } {
  let best: { group: WsGroup; item: NavLink } | undefined;
  for (const group of groups) for (const item of group.items) {
    if ((path === item.href || path.startsWith(item.href + '/')) && (!best || item.href.length > best.item.href.length)) best = { group, item };
  }
  return { group: best?.group, item: best?.item };
}
