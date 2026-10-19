import 'server-only';
import { cookies } from 'next/headers';
import { api, hasBackend } from '@/lib/api-client';
import { SESSION_COOKIE } from '@/lib/constants';
import { nice, type Place } from '@/lib/places';
import { MARKET_ITEMS, MY_LISTINGS } from './sample-items';
import { DEMO_SCHOOL_PLACES, PLACES } from './sample-places';
import type { MarketItem, SupplierListing } from './types';

const cookie = async () => { const v = (await cookies()).get(SESSION_COOKIE)?.value; return v ? `${SESSION_COOKIE}=${v}` : undefined; };

/** Expected contract (NOT yet verified against a backend): GET /school/marketplace -> { items: MarketItem[]; place: Place }.
 *  `place` is the school's registered, confirmed location. Without a backend, clearly labelled sample data is used. */
export async function loadSchoolMarket(): Promise<{ items: MarketItem[]; place: Place; sample: boolean; error: boolean; previews: { key: string; label: string; place: Place }[] }> {
  if (hasBackend) {
    try { const d = await api<{ items: MarketItem[]; place: Place }>('/school/marketplace', { cookie: await cookie() }); return { ...d, sample: false, error: false, previews: [] }; }
    catch { return { items: [], place: PLACES.abatuje, sample: false, error: true, previews: [] }; }
  }
  const previews = DEMO_SCHOOL_PLACES.slice(1).map((k) => { const p = PLACES[k]; return { key: k, label: `${nice(p.village.n)} · ${nice(p.cell.n)}, ${nice(p.district.n)}`, place: p }; });
  return { items: MARKET_ITEMS, place: PLACES.abatuje, sample: true, error: false, previews };
}
/** Expected contract (NOT yet verified): GET /supplier/listings -> { items: SupplierListing[] } (own listings only, any status). */
export async function loadSupplierListings(): Promise<{ items: SupplierListing[]; sample: boolean; error: boolean }> {
  if (hasBackend) {
    try { const d = await api<{ items: SupplierListing[] }>('/supplier/listings', { cookie: await cookie() }); return { items: d.items, sample: false, error: false }; }
    catch { return { items: [], sample: false, error: true }; }
  }
  return { items: MY_LISTINGS, sample: true, error: false };
}
