/**
 * Miveloo backend client (frontend adapts to the backend; the backend is not changed).
 * - Works on server and browser. No localStorage: authentication stays with your existing httpOnly-cookie flow.
 *   Pass `token` (access token read from the cookie on the server) for authenticated calls.
 * - Base URL: NEXT_PUBLIC_API_URL (e.g. https://miveloo-backend.onrender.com). The /api/v1 prefix is added here.
 */
const RAW = process.env.NEXT_PUBLIC_API_URL || '';
/** True only when NEXT_PUBLIC_API_URL is set; live API features require the backend. */
export const liveApi = RAW.length > 0;
export const API_ORIGIN = RAW.replace(/\/+$/, '').replace(/\/api\/v1$/, '');
export const API_BASE = `${API_ORIGIN}/api/v1`;

export class ApiError extends Error {
  status: number;
  code?: string;
  constructor(status: number, message: string, code?: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

type Opts = { method?: string; body?: unknown; token?: string | null; orgId?: string; headers?: Record<string, string>; cache?: RequestCache; revalidate?: number };

export async function api<T = unknown>(path: string, o: Opts = {}): Promise<T> {
  if (!liveApi) throw new ApiError(503, 'Live backend is not configured (set NEXT_PUBLIC_API_URL).');
  const headers: Record<string, string> = { Accept: 'application/json', ...(o.headers || {}) };
  let body: BodyInit | undefined;
  if (o.body instanceof FormData) body = o.body;
  else if (o.body !== undefined) { headers['Content-Type'] = 'application/json'; body = JSON.stringify(o.body); }
  if (o.token) headers.Authorization = `Bearer ${o.token}`;
  if (o.orgId) headers['X-Org-Id'] = o.orgId;
  const init: RequestInit & { next?: { revalidate: number } } = { method: o.method || 'GET', headers, body };
  if (o.cache) init.cache = o.cache;
  if (o.revalidate !== undefined) init.next = { revalidate: o.revalidate };
  const res = await fetch(`${API_BASE}${path}`, init);
  if (!res.ok) {
    const e = await res.json().catch(() => ({}));
    throw new ApiError(res.status, e?.error?.message || res.statusText, e?.error?.code);
  }
  return (res.status === 204 ? null : await res.json()) as T;
}

const qs = (o: Record<string, unknown>) => {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(o)) if (v !== undefined && v !== null && v !== '') p.set(k, String(v));
  const s = p.toString();
  return s ? `?${s}` : '';
};

/** Image URLs from the API are relative (/api/v1/media/<id>); this makes them absolute for <img>. */
export const imgUrl = (u?: string | null) => (u ? (u.startsWith('http') ? u : `${API_ORIGIN}${u}`) : null);

/* ---------- types (what the backend actually returns) ---------- */
export type Food = { id: string; code: string; name: string; name_rw: string | null; category: string; subcategory: string | null; origin: string | null; production_status: string | null; form: string | null; base_unit: string; shelf_life_days: number | null; season_note: string | null; image_url: string | null };
export type Listing = { id: string; supplier_org_id: string; food_id: string; title: string; unit: string; unit_price: string; currency: string; min_order_qty: string; status: string; expires_at: string | null; image_urls: string[] };
export type PricePoint = { month: string; avg: number; min: number; max: number; n: number; unit: string };
export type Forecast = { issued_at: string; target_start: string; target_end: string; horizon_days: number; value: number | null; lower: number | null; upper: number | null; interval_level: number | null; unit: string | null; model_version: string; serving_source: string; data_freshness: string; warnings: string[] | null };

/* ---------- public catalogue & market data ---------- */
export const categories = () => api<{ category: string; count: number; subcategories: { name: string; count: number }[] }[]>('/foods/categories', { revalidate: 300 });
export const searchFoods = (p: { q?: string; category?: string; subcategory?: string; origin?: 'local' | 'imported' | 'both'; limit?: number; offset?: number } = {}) =>
  api<{ items: Food[]; total: number; limit: number; offset: number }>(`/foods/search${qs(p)}`, { revalidate: 300 });
export const getFood = (id: string) => api<Food>(`/foods/${id}`, { revalidate: 300 });
export const priceHistory = (food_id: string, o: { market?: string; months?: number } = {}) => api<{ food_id: string; market: string | null; points: PricePoint[] }>(`/market/prices/history${qs({ food_id, ...o })}`, { revalidate: 300 });
export const latestPrices = (food_id: string) => api<{ as_of: string | null; markets: { market: string; price: number; unit: string }[] }>(`/market/prices/latest${qs({ food_id })}`, { revalidate: 300 });
export const forecast = (food_id: string) => api<{ forecasts: Forecast[] }>(`/market/forecast${qs({ food_id })}`, { revalidate: 300 });
export const forecastVsActual = (food_id: string, horizon_days = 30) => api<{ points: { target_month: string; forecast: number; lower: number; upper: number; actual: number; pct_error: number }[] }>(`/market/forecast/history${qs({ food_id, horizon_days })}`, { revalidate: 300 });
export const forecastAccuracy = (family = 'price_forecasting') => api<{ verified_outcomes: number; mape: number | null; bias: number | null; interval_coverage: number | null }>(`/ai/accuracy${qs({ family })}`, { revalidate: 300 });
export const listings = (p: { food_id?: string; max_price?: number; sort?: 'price' | '-price' | 'newest'; limit?: number; offset?: number } = {}) => api<Listing[]>(`/listings${qs(p)}`, { revalidate: 60 });
export const getListing = (id: string) => api<Listing>(`/listings/${id}`, { revalidate: 60 });

/* ---------- authenticated (pass the access token from your cookie) ---------- */
export const backendLogin = (email: string, password: string) => api<{ access_token: string; refresh_token: string; token_type: string }>('/auth/login', { method: 'POST', body: { email, password } });
export const backendRefresh = (refresh_token: string) => api<{ access_token: string; refresh_token: string }>('/auth/refresh', { method: 'POST', body: { refresh_token } });
export const backendRegister = (b: { email: string; password: string; full_name: string; phone?: string }) => api('/auth/register', { method: 'POST', body: b });
export const myOrganizations = (token: string) => api<{ id: string; type: string; name: string; status: string }[]>('/organizations/mine', { token });
export const createOrganization = (token: string, b: { type: 'school' | 'supplier' | 'cooperative' | 'government' | 'ngo'; name: string; registration_number?: string }) => api('/organizations', { method: 'POST', body: b, token });
export const createListing = (token: string, b: { food_id: string; title: string; unit: string; unit_price: string; currency?: string; min_order_qty?: string; location_id?: string; expires_at?: string }) => api<Listing>('/listings', { method: 'POST', body: b, token });
export const editListing = (token: string, id: string, b: { title?: string; unit_price?: string; min_order_qty?: string; expires_at?: string }) => api<Listing>(`/listings/${id}`, { method: 'PATCH', body: b, token });
export type InventoryLot = {
  id: string;
  food_id: string;
  unit: string;
  on_hand?: string;
  reserved?: string;
  available?: string;
  expires_on: string | null;
  /** not returned by the backend today; kept optional for forward compatibility */
  listing_id?: string | null;
  quantity?: string;
  status?: string;
};

export const myLots = (token: string) => api<InventoryLot[]>('/inventory/lots', { token });
export const addLot = (token: string, b: { food_id: string; listing_id?: string; unit: string; quantity: string; expires_on?: string }) => api('/inventory/lots', { method: 'POST', body: b, token });
export type Order = {
  id: string;
  status: string;
  total_amount?: string;
  currency?: string;
  created_at?: string;
  updated_at?: string;
  lines?: {
    id?: string;
    listing_id: string;
    quantity: string;
    unit_price?: string;
    total?: string;
  }[];
};

export const myOrders = (token: string) => api<Order[]>('/orders', { token });
export const placeOrder = (token: string, lines: { listing_id: string; quantity: string }[], delivery_location_id?: string) =>
  api('/orders', { method: 'POST', body: { lines, delivery_location_id }, token, headers: { 'Idempotency-Key': crypto.randomUUID() } });

/* ---------- photos: upload, then attach (order = display order, first = cover) ---------- */
export function uploadImage(token: string, file: File, purpose: 'listing' | 'food' | 'organization' = 'listing') {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('purpose', purpose);
  return api<{ id: string; url: string }>('/media', { method: 'POST', body: fd, token });
}
export const setListingImages = (token: string, listingId: string, media_ids: string[]) => api<{ image_urls: string[] }>(`/listings/${listingId}/images`, { method: 'PUT', body: { media_ids }, token });
export async function addListingPhotos(token: string, listingId: string, files: File[], keepIds: string[] = []) {
  const ids = [...keepIds];
  for (const f of files) ids.push((await uploadImage(token, f)).id);
  return setListingImages(token, listingId, ids);
}

/* ---------- identity: one call that says who the user is and what they may do ---------- */
export type Me = {
  user: { id: string; email: string; full_name: string; email_verified: boolean; mfa_enabled: boolean };
  memberships: { membership_id: string; org_id: string; org_name: string; org_type: string; org_status: string; role: string; position?: string | null; permissions: string[] }[];
  default_org_id: string | null;
};
export const authMe = (token: string) => api<Me>('/auth/me', { token, cache: 'no-store' });
export const backendLogout = (refresh_token: string) => api('/auth/logout', { method: 'POST', body: { refresh_token } });
