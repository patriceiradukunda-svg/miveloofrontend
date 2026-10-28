import { POSITION_MODULES } from './positions';

/**
 * Shared /app pages for job-title positions. Owners and managers ('*') keep everything and admin positions are not touched here.
 * Always open: notifications, messages, support and personal settings. Billing and team or organisation settings are owner-only.
 * Orders, marketplace and analytics-style pages open only when the position has a page of that kind of its own.
 */
const ALWAYS = /^\/app(\/(notifications|messages|support|settings\/(profile|preferences|security)))?$/;
const OWNER_ONLY = /^\/app\/(billing|settings\/(team|organization))(\/|$)/;
const has = (mods: readonly string[], re: RegExp) => mods.some((m) => re.test(m));

export function appPageAllowed(position: string | undefined | null, pathname: string): boolean {
  if (!position || position.startsWith('admin-')) return true;
  if (pathname !== '/app' && !pathname.startsWith('/app/')) return true;
  const mods = POSITION_MODULES[position];
  if (!mods || mods.includes('*')) return true;
  if (ALWAYS.test(pathname)) return true;
  if (OWNER_ONLY.test(pathname)) return false;
  if (/^\/app\/orders(\/|$)/.test(pathname)) return has(mods, /orders|procurement|contracts|quotations/);
  if (/^\/app\/marketplace(\/|$)/.test(pathname)) return has(mods, /marketplace/);
  if (/^\/app\/(analytics|reports|ai-assistant)(\/|$)/.test(pathname)) return has(mods, /reports|analytics|insights|forecast|performance|intelligence|trends|profitability/);
  return true;
}

/** Menu links for a position: hides shared pages it may not open and shows each label once. */
export function tidyLinks<T extends { href: string }>(position: string | undefined | null, links: T[]): T[] {
  if (!position) return links;
  const seen = new Set<string>();
  return links.filter((l) => {
    if (!appPageAllowed(position, l.href)) return false;
    const label = String((l as unknown as { label?: string }).label ?? l.href).toLowerCase();
    if (seen.has(label)) return false;
    seen.add(label);
    return true;
  });
}
