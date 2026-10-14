import { describe, expect, it } from 'vitest';
import { filterProducts, listPublicProducts } from '@/features/products/services/products.service';
import { sampleProducts } from '@/lib/sample-data';

describe('public marketplace', () => {
  it('filters by search, category, price and availability', () => {
    expect(filterProducts(sampleProducts, { q: 'bean' }).map((p) => p.id)).toEqual(['prd-2']);
    expect(filterProducts(sampleProducts, { category: 'grains' }).length).toBe(2);
    expect(filterProducts(sampleProducts, { maxPrice: 500 }).every((p) => (p.indicativePriceRWF ?? 0) <= 500)).toBe(true);
    expect(filterProducts(sampleProducts, { availability: 'limited' }).length).toBe(2);
  });
  it('never exposes private fields on public products', async () => {
    const { items } = await listPublicProducts({});
    for (const p of items) { const k = Object.keys(p).join(); expect(k).not.toMatch(/phone|email|school|cost|margin/i); }
  });
  it('flags sample listings', async () => { expect((await listPublicProducts({})).items.every((p) => p.isSample)).toBe(true); });
});
