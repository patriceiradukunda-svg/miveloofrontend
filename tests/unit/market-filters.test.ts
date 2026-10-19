import { describe, expect, it } from 'vitest';
import { defaultFilters, matchLink, parseFilters, rank, toQuery } from '@/features/marketplace/filters';
import { MARKET_ITEMS } from '@/features/marketplace/sample-items';
import { PLACES } from '@/features/marketplace/sample-places';

const me = PLACES.abatuje;
describe('marketplace ranking', () => {
  it('nearest first by default; the same-village item leads', () => {
    const r = rank(MARKET_ITEMS, defaultFilters(), me); expect(r[0]!.item.id).toBe('m-01');
    const km = r.map((x) => x.label.km!); expect([...km].sort((a, b) => a - b)).toEqual(km);
  });
  it('filters by category, price, stock and radius', () => {
    expect(rank(MARKET_ITEMS, { ...defaultFilters(), category: 'cereals' }, me).every((x) => x.item.category === 'cereals')).toBe(true);
    expect(rank(MARKET_ITEMS, { ...defaultFilters(), max: 500 }, me).every((x) => (x.item.price ?? 0) <= 500)).toBe(true);
    expect(rank(MARKET_ITEMS, { ...defaultFilters(), stock: true }, me).every((x) => x.item.availability !== 'seasonal')).toBe(true);
    expect(rank(MARKET_ITEMS, { ...defaultFilters(), within: 5 }, me).every((x) => x.label.km! <= 5)).toBe(true);
  });
  it('sorts by price and search matches names and suppliers', () => {
    const p = rank(MARKET_ITEMS, { ...defaultFilters(), sort: 'price-asc' }, me).map((x) => x.item.price!); expect([...p].sort((a, b) => a - b)).toEqual(p);
    expect(rank(MARKET_ITEMS, { ...defaultFilters(), q: 'climbing' }, me).map((x) => x.item.id)).toEqual(['m-02']);
    expect(rank(MARKET_ITEMS, { ...defaultFilters(), q: 'beans' }, me).map((x) => x.item.id)).toContain('m-02');
  });
  it('items without coordinates sort last and are hidden by a radius filter', () => {
    const noGeo = MARKET_ITEMS.map((i, n) => (n === 0 ? { ...i, place: null } : i));
    expect(rank(noGeo, defaultFilters(), me).at(-1)!.item.id).toBe('m-01'); expect(rank(noGeo, { ...defaultFilters(), within: 100 }, me).some((x) => x.item.id === 'm-01')).toBe(false);
  });
});
describe('filter links', () => {
  it('round-trips through the URL and builds notification links', () => {
    const f = { ...defaultFilters(), q: 'maize', category: 'cereals', max: 800, within: 25, stock: true, sort: 'price-asc' as const };
    const sp = new URLSearchParams(toQuery(f)); expect(parseFilters((k) => sp.get(k))).toEqual(f);
    expect(matchLink({ category: 'cereals', max: 800 })).toBe('/school/marketplace?category=cereals&max=800'); expect(matchLink({})).toBe('/school/marketplace');
  });
  it('ignores junk in the URL', () => { const sp = new URLSearchParams('sort=hack&within=-5&max=abc'); const f = parseFilters((k) => sp.get(k)); expect(f.sort).toBe('nearest'); expect(f.within).toBeNull(); expect(f.max).toBeNull(); });
});
