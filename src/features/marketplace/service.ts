import 'server-only';

import {
  imgUrl,
  listings,
  liveApi,
  myLots,
  myOrganizations,
  searchFoods,
  type Food,
  type Listing,
} from '@/lib/miveloo-client';
import { withBackendToken } from '@/lib/server/backend-session';
import type { MarketItem, SupplierListing } from './types';

type FoodIndex = Map<string, Food>;

/** Backend catalogue category -> the category ids this UI uses (config/food-catalog.ts). Unknown stays 'other'. */
const CATEGORY_MAP: Record<string, string> = {
  cereals: 'cereals', breakfast: 'cereals', roots_tubers: 'roots', pulses: 'pulses', bananas: 'bananas', vegetables: 'vegetables', fruits: 'fruits',
  nuts_seeds: 'nuts-seeds', oils_fats: 'oils-fats', meat: 'meat', poultry: 'meat', eggs: 'eggs', dairy: 'dairy', fish_seafood: 'fish', honey: 'honey',
  salt_spices: 'spices-herbs', bakery: 'bakery', pasta_noodles: 'pasta-noodles', canned: 'canned', sauces: 'sauces', snacks: 'snacks',
  confectionery: 'confectionery', sweeteners: 'confectionery', beverages: 'beverages', traditional: 'traditional', ready_to_eat: 'ready-to-eat',
  frozen: 'frozen', plant_based: 'imported-specialty', baby_foods: 'imported-specialty', health_foods: 'imported-specialty', ingredients: 'ingredients',
};
export const marketCategory = (backendCategory?: string | null) => CATEGORY_MAP[backendCategory ?? ''] ?? 'other';

function numberOrNull(value: string | number | null | undefined): number | null {
  if (value == null || value === '') return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

/** Listings created by the demo seed are titled "<food> - <supplier>"; real listings usually have no suffix. */
function splitTitle(title: string): { name: string; supplier: string | null } {
  const i = title.indexOf(' - ');
  return i > 0 ? { name: title.slice(0, i), supplier: title.slice(i + 3) } : { name: title, supplier: null };
}

function mapListing(listing: Listing, foods: FoodIndex, quantity: number | null = null): SupplierListing {
  const food = foods.get(listing.food_id);
  const price = numberOrNull(listing.unit_price);
  const minOrder = numberOrNull(listing.min_order_qty);
  const { name, supplier } = splitTitle(listing.title || food?.name || 'Unnamed food listing');
  const demo = /\bdemo\b/i.test(listing.title);
  const about = [food?.name_rw, food?.subcategory].filter(Boolean).join(' · ');
  return {
    id: listing.id,
    supplierId: listing.supplier_org_id,
    name,
    category: marketCategory(food?.category),
    price,
    unit: listing.unit || food?.base_unit || 'unit',
    qty: quantity,
    ...(minOrder != null && minOrder > 0 ? { minOrder } : {}),
    photos: (listing.image_urls ?? []).map((url) => imgUrl(url)).filter((url): url is string => Boolean(url)),
    place: null,
    supplier: { name: supplier, kind: null, verified: null },
    description: [about, demo ? 'Demo data' : ''].filter(Boolean).join(' · ') || null,
    quality: [],
    delivery: null,
    leadDays: null,
    listedDaysAgo: null,
    availability: null,
    isSample: demo,
    status: (() => {
      const status = listing.status.toLowerCase();
      if (status === 'active' || status === 'published') return 'published';
      if (status === 'unpublished') return 'unpublished';
      if (status === 'draft') return 'draft';
      return 'unknown';
    })(),
  };
}

/** All catalogue foods (the API returns at most 200 per page). */
async function allFoods(): Promise<FoodIndex> {
  const foods: FoodIndex = new Map();
  for (let offset = 0; offset < 1000; offset += 200) {
    const page = await searchFoods({ limit: 200, offset });
    page.items.forEach((f) => foods.set(f.id, f));
    if (offset + 200 >= page.total) break;
  }
  return foods;
}
/** All active listings, paged (the API returns at most 200 per page). */
async function allListings(): Promise<Listing[]> {
  const rows: Listing[] = [];
  for (let offset = 0; offset < 1000; offset += 200) {
    const page = await listings({ limit: 200, offset, sort: 'newest' });
    rows.push(...page);
    if (page.length < 200) break;
  }
  return rows;
}

async function loadPublicData() {
  if (!liveApi) throw new Error('Live backend is not configured. Set NEXT_PUBLIC_API_URL.');
  const [listingRows, foods] = await Promise.all([allListings(), allFoods()]);
  return { listingRows, foods };
}

export async function loadSchoolMarket(): Promise<{
  items: MarketItem[];
  place: null;
  sample: false;
  error: boolean;
  previews: [];
}> {
  try {
    const { listingRows, foods } = await loadPublicData();
    const items = listingRows.map((listing) => mapListing(listing, foods));
    return { items, place: null, sample: false, error: false, previews: [] };
  } catch (e) {
    console.error('loadSchoolMarket failed:', e instanceof Error ? e.message : e);
    return { items: [], place: null, sample: false, error: true, previews: [] };
  }
}

/**
 * The backend's public listing endpoint only returns active, unexpired listings, so a supplier's drafts or
 * listings still awaiting approval cannot be shown here. Stock comes from /inventory/lots, which reports
 * food + unit + available quantity (not a listing id): a lot total is attached to a listing only when that
 * supplier has exactly one listing for that food and unit.
 */
export async function loadSupplierListings(): Promise<{
  items: SupplierListing[];
  sample: false;
  error: boolean;
}> {
  try {
    const { listingRows, foods } = await loadPublicData();
    const own = await withBackendToken(async (token) => {
      const orgs = await myOrganizations(token);
      const supplierOrgIds = new Set(orgs.filter((org) => ['supplier', 'cooperative'].includes(org.type.toLowerCase())).map((org) => org.id));
      const availableByFood = new Map<string, number>();
      for (const lot of await myLots(token)) {
        const qty = numberOrNull(lot.available ?? lot.quantity);
        if (qty == null || qty < 0) continue;
        const key = `${lot.food_id}|${lot.unit}`;
        availableByFood.set(key, (availableByFood.get(key) ?? 0) + qty);
      }
      return { supplierOrgIds, availableByFood };
    });

    const mine = listingRows.filter((l) => own.supplierOrgIds.has(l.supplier_org_id));
    const perKey = new Map<string, number>();
    mine.forEach((l) => perKey.set(`${l.food_id}|${l.unit}`, (perKey.get(`${l.food_id}|${l.unit}`) ?? 0) + 1));
    const items = mine.map((l) => {
      const key = `${l.food_id}|${l.unit}`;
      const qty = perKey.get(key) === 1 && own.availableByFood.has(key) ? own.availableByFood.get(key)! : null;
      return mapListing(l, foods, qty);
    });
    return { items, sample: false, error: false };
  } catch (e) {
    console.error('loadSupplierListings failed:', e instanceof Error ? e.message : e);
    return { items: [], sample: false, error: true };
  }
}
