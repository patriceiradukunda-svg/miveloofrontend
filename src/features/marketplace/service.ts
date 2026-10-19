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

function numberOrNull(value: string | number | null | undefined): number | null {
  if (value == null || value === '') return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function mapListing(
  listing: Listing,
  foods: FoodIndex,
  quantity: number | null = null,
): SupplierListing {
  const food = foods.get(listing.food_id);
  const price = numberOrNull(listing.unit_price);
  const minOrder = numberOrNull(listing.min_order_qty);
  return {
    id: listing.id,
    supplierId: listing.supplier_org_id,
    name: listing.title || food?.name || 'Unnamed food listing',
    category: food?.category || 'other',
    price,
    unit: listing.unit || food?.base_unit || 'unit',
    qty: quantity,
    ...(minOrder != null && minOrder > 0 ? { minOrder } : {}),
    photos: (listing.image_urls ?? []).map((url) => imgUrl(url)).filter((url): url is string => Boolean(url)),
    place: null,
    supplier: { name: null, kind: null, verified: null },
    description: null,
    quality: [],
    delivery: null,
    leadDays: null,
    listedDaysAgo: null,
    availability: null,
    isSample: false,
    status: (() => {
      const status = listing.status.toLowerCase();
      if (status === 'active' || status === 'published') return 'published';
      if (status === 'unpublished') return 'unpublished';
      if (status === 'draft') return 'draft';
      return 'unknown';
    })(),
  };
}

async function loadPublicData() {
  if (!liveApi) throw new Error('Live backend is not configured. Set NEXT_PUBLIC_API_URL.');
  const [listingRows, foodPage] = await Promise.all([
    listings({ limit: 100, sort: 'newest' }),
    searchFoods({ limit: 200, offset: 0 }),
  ]);
  return {
    listingRows,
    foods: new Map(foodPage.items.map((food) => [food.id, food])),
  };
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
  } catch {
    return { items: [], place: null, sample: false, error: true, previews: [] };
  }
}

/**
 * The backend's public listing endpoint only returns active, unexpired listings.
 * This view cannot represent a supplier's drafts or withdrawn listings.
 */
export async function loadSupplierListings(): Promise<{
  items: SupplierListing[];
  sample: false;
  error: boolean;
}> {
  try {
    if (!liveApi) throw new Error('Live backend is not configured.');

    const { listingRows, foods } = await loadPublicData();
    const ownIds = await withBackendToken(async (token) => {
      const orgs = await myOrganizations(token);
      const supplierOrgIds = new Set(
        orgs
          .filter((org) => ['supplier', 'cooperative'].includes(org.type.toLowerCase()))
          .map((org) => org.id),
      );
      const ownLots = await myLots(token);
      const quantities = new Map<string, number>();

      for (const lot of ownLots) {
        if (!lot.listing_id || (lot.status && lot.status.toLowerCase() !== 'active')) continue;
        const quantity = numberOrNull(lot.quantity);
        if (quantity == null || quantity < 0) continue;
        quantities.set(lot.listing_id, (quantities.get(lot.listing_id) ?? 0) + quantity);
      }

      return { supplierOrgIds, quantities };
    });

    const items = listingRows
      .filter((listing) => ownIds.supplierOrgIds.has(listing.supplier_org_id))
      .map((listing) => mapListing(
        listing,
        foods,
        ownIds.quantities.has(listing.id) ? ownIds.quantities.get(listing.id)! : null,
      ));

    return { items, sample: false, error: false };
  } catch {
    return { items: [], sample: false, error: true };
  }
}
