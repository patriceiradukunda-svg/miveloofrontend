import { describe, expect, it } from 'vitest';
import { existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { GROUP_DEFS, activeOf, workspaceGroups, type Area } from '@/config/workspace-groups';

const root = (a: Area) => `src/app/(workspace)/${a}`;
function pages(a: Area): string[] {
  const out: string[] = [];
  const walk = (d: string, rel: string) => { for (const f of readdirSync(d)) { const p = join(d, f); const r = rel ? `${rel}/${f}` : f; if (statSync(p).isDirectory()) walk(p, r); else if (f === 'page.tsx' && rel) out.push(rel); } };
  walk(root(a), '');
  return out;
}
for (const area of ['school', 'supplier'] as const) {
  describe(`${area} workspace groups`, () => {
    const slugs = GROUP_DEFS[area].flatMap(([, , s]) => [...s]);
    it('lists each page once', () => { expect(new Set(slugs).size).toBe(slugs.length); });
    it('has a tab for every page folder', () => {
      for (const rel of pages(area)) expect(slugs.some((s) => rel === s || rel.startsWith(s + '/')), rel).toBe(true);
    });
    it('has no tab that points at a missing page', () => { for (const s of slugs) expect(existsSync(`${root(area)}/${s}/page.tsx`), s).toBe(true); });
  });
}
describe('workspaceGroups', () => {
  const L = (href: string, label = href) => ({ href, label });
  const g = workspaceGroups('supplier', [L('/supplier/orders'), L('/supplier/dashboard'), L('/app/messages', 'Messages'), L('/supplier/zzz', 'Zzz'), L('/school/orders')]);
  it('keeps group order, drops empty groups and other areas, and never hides a page', () => {
    expect(g.map((x) => x.name)).toEqual(['Overview', 'Selling', 'More', 'Account']);
    expect(g[0]!.items.map((i) => i.href)).toEqual(['/supplier/dashboard']);
    expect(g.flatMap((x) => x.items).some((i) => i.href === '/school/orders')).toBe(false);
  });
  it('lights up the parent tab for nested pages', () => {
    const gg = workspaceGroups('supplier', [L('/supplier/products'), L('/supplier/orders')]);
    expect(activeOf(gg, '/supplier/products/new').item?.href).toBe('/supplier/products');
    expect(activeOf(gg, '/supplier/orders').group?.name).toBe('Selling');
    expect(activeOf(gg, '/supplier/unknown').group).toBeUndefined();
  });
});
