// Adapts the Miveloo backend's responses to the types the existing UI components expect. The backend is not changed.
import { forecast as fetchForecast, getFood, getListing, listings as fetchListings, priceHistory, searchFoods, type Food, type Listing } from './miveloo-client';
import { imgUrl } from './miveloo-client';
import type { PublicProduct, PublicSupplier } from '@/types/product';

export type LiveProduct = PublicProduct & { imageUrl: string | null; supplierName: string; foodId: string; backendUnit: string; minOrder: number };

const CATEGORY_MAP: Record<string, string> = {
  cereals: 'grains', pulses: 'legumes', roots_tubers: 'tubers', vegetables: 'vegetables', fruits: 'fruits', bananas: 'fruits',
  dairy: 'dairy-eggs', eggs: 'dairy-eggs', meat: 'protein', poultry: 'protein', fish_seafood: 'protein', nuts_seeds: 'legumes',
};
const EMOJI: Record<string, string> = {
  grains: '🌾', legumes: '🫘', vegetables: '🥬', fruits: '🍌', tubers: '🥔', 'dairy-eggs': '🥛', protein: '🍗',
};
export const uiCategory = (backendCategory?: string | null) => CATEGORY_MAP[backendCategory ?? ''] ?? 'grains';

let cache: { at: number; map: Map<string, Food> } | null = null;
/** All catalogue foods (3 cached requests of 200) so listings can show category and Kinyarwanda names. */
export async function foodMap(): Promise<Map<string, Food>> {
  if (cache && Date.now() - cache.at < 5 * 60_000) return cache.map;
  const map = new Map<string, Food>();
  for (let offset = 0; offset < 1000; offset += 200) {
    const r = await searchFoods({ limit: 200, offset });
    r.items.forEach((f) => map.set(f.id, f));
    if (offset + 200 >= r.total) break;
  }
  cache = { at: Date.now(), map };
  return map;
}

function split(title: string): { name: string; supplier: string } {
  const i = title.indexOf(' - ');
  return i > 0 ? { name: title.slice(0, i), supplier: title.slice(i + 3) } : { name: title, supplier: 'Verified supplier' };
}

export function toProduct(l: Listing, foods: Map<string, Food>): LiveProduct {
  const f = foods.get(l.food_id);
  const cat = uiCategory(f?.category);
  const t = split(l.title);
  const price = Number(l.unit_price);
  return {
    id: l.id, name: t.name, description: f ? `${f.name}${f.name_rw ? ` (${f.name_rw})` : ''}. ${f.subcategory ?? f.category}.` : t.name,
    category: cat as PublicProduct['category'], unit: l.unit, indicativePriceRWF: Number.isFinite(price) ? price : null, availableQuantity: null,
    availability: 'in-stock' as PublicProduct['availability'], district: 'Rwanda', quality: 'Seller-stated', supplierId: l.supplier_org_id,
    isSample: /\bdemo\b/i.test(l.title), emoji: EMOJI[cat] ?? '🌾',
    imageUrl: imgUrl(l.image_urls?.[0]), supplierName: t.supplier, foodId: l.food_id, backendUnit: l.unit, minOrder: Number(l.min_order_qty) || 1,
  } as LiveProduct;
}

export async function loadLiveProducts(): Promise<LiveProduct[]> {
  const [rows, foods] = await Promise.all([fetchListings({ limit: 200, sort: 'newest' }), foodMap()]);
  return rows.map((l) => toProduct(l, foods));
}
export async function loadLiveProduct(id: string): Promise<LiveProduct | null> {
  try { const [l, foods] = await Promise.all([getListing(id), foodMap()]); return toProduct(l, foods); } catch { return null; }
}
export function suppliersFrom(products: LiveProduct[]): PublicSupplier[] {
  const m = new Map<string, PublicSupplier>();
  for (const p of products) {
    const s = m.get(p.supplierId);
    if (s) { if (!s.categories.includes(p.category)) s.categories.push(p.category); continue; }
    m.set(p.supplierId, { id: p.supplierId, name: p.supplierName, kind: 'individual', about: 'Supplier profile details are not published yet.', categories: [p.category], operatingArea: 'Rwanda', verified: true, isSample: p.isSample } as PublicSupplier);
  }
  return [...m.values()];
}

/* ---------- price chart series ---------- */
export type LiveSeries = { id: string; name: string; unit: string; observed: { label: string; value: number }[]; forecast: { label: string; low: number; mid: number; high: number; months: number }[]; model: string };
const monthLabel = (iso: string) => new Date(iso + 'T00:00:00Z').toLocaleDateString('en-GB', { month: 'short', year: '2-digit', timeZone: 'UTC' });

export async function loadLiveSeries(max = 8): Promise<LiveSeries[]> {
  const rows = await fetchListings({ limit: 200 });
  const ids = [...new Set(rows.map((l) => l.food_id))].slice(0, max);
  const out = await Promise.all(ids.map(async (id) => {
    const [food, hist, fc] = await Promise.all([getFood(id), priceHistory(id, { months: 12 }), fetchForecast(id)]);
    const seen = new Set<string>();
    const forecast = fc.forecasts.filter((f) => f.value != null).sort((a, b) => a.target_end.localeCompare(b.target_end))
      .map((f) => ({ label: monthLabel(f.target_end), low: f.lower ?? (f.value as number), mid: f.value as number, high: f.upper ?? (f.value as number), months: Math.max(1, Math.round(f.horizon_days / 30)) }))
      .filter((f) => (seen.has(f.label) ? false : (seen.add(f.label), true)));
    return { id, name: food.name, unit: `RWF/${food.base_unit}`, observed: hist.points.slice(-7).map((p) => ({ label: monthLabel(p.month), value: Math.round(p.avg) })), forecast, model: fc.forecasts[0]?.model_version ?? 'baseline-1' } as LiveSeries;
  }));
  return out.filter((s) => s.observed.length >= 3 && s.forecast.length > 0).sort((a, b) => a.name.localeCompare(b.name));
}
