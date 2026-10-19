import { placeLabel, type Place, type PlaceLabel } from '@/lib/places';
import { catLabel } from './categories';
import type { MarketItem } from './types';

export type SortKey = 'nearest' | 'price-asc' | 'price-desc' | 'newest' | 'stock';
export interface MarketFilters {
  q: string;
  category: string;
  within: number | null;
  max: number | null;
  stock: boolean;
  sort: SortKey;
  status: string;
}
export const WITHIN_STEPS: (number | null)[] = [null, 5, 10, 25, 50, 100];
export const SORTS: SortKey[] = ['nearest', 'price-asc', 'price-desc', 'newest', 'stock'];
export const defaultFilters = (sort: SortKey = 'nearest'): MarketFilters => ({
  q: '', category: '', within: null, max: null, stock: false, sort, status: '',
});

const num = (v: string | null) => {
  const n = Number(v);
  return v && Number.isFinite(n) && n > 0 ? n : null;
};

export function parseFilters(get: (k: string) => string | null, defSort: SortKey = 'nearest'): MarketFilters {
  const s = get('sort') as SortKey | null;
  return {
    q: (get('q') ?? '').slice(0, 80),
    category: get('category') ?? '',
    within: num(get('within')),
    max: num(get('max')),
    stock: get('stock') === '1',
    sort: s && SORTS.includes(s) ? s : defSort,
    status: get('status') ?? '',
  };
}

export function toQuery(f: MarketFilters, defSort: SortKey = 'nearest'): string {
  const p = new URLSearchParams();
  if (f.q) p.set('q', f.q);
  if (f.category) p.set('category', f.category);
  if (f.within) p.set('within', String(f.within));
  if (f.max) p.set('max', String(f.max));
  if (f.stock) p.set('stock', '1');
  if (f.sort !== defSort) p.set('sort', f.sort);
  if (f.status) p.set('status', f.status);
  return p.toString();
}

export const matchLink = (f: Partial<MarketFilters>): string => {
  const q = toQuery({ ...defaultFilters(), ...f });
  return `/school/marketplace${q ? `?${q}` : ''}`;
};
export const activeCount = (f: MarketFilters, defSort: SortKey = 'nearest') =>
  [f.q, f.category, f.within, f.max, f.stock, f.sort !== defSort, f.status].filter(Boolean).length;

export interface Ranked {
  item: MarketItem;
  label: PlaceLabel;
}
const cmpNull = (a: number | null, b: number | null, dir = 1) =>
  a == null ? (b == null ? 0 : 1) : b == null ? -1 : (a - b) * dir;

const unknownLabel: PlaceLabel = {
  relation: 'country',
  parts: [],
  km: null,
  text: '',
  distance: '',
};

/** Unknown location, price, stock and listing age remain unknown rather than being guessed. */
export function rank(items: MarketItem[], f: MarketFilters, user: Place | null): Ranked[] {
  const q = f.q.trim().toLowerCase();
  const rows = items
    .map((item) => ({
      item,
      label: user && item.place ? placeLabel(user, item.place) : unknownLabel,
    }))
    .filter(({ item, label }) =>
      (!q ||
        item.name.toLowerCase().includes(q) ||
        (item.supplier.name ?? '').toLowerCase().includes(q) ||
        catLabel(item.category).toLowerCase().includes(q)) &&
      (!f.category || item.category === f.category) &&
      (!f.within || (label.km != null && label.km <= f.within)) &&
      (!f.max || (item.price != null && item.price <= f.max)) &&
      (!f.stock || (item.qty != null && item.qty > 0 && item.availability !== 'seasonal')),
    );

  const by: Record<SortKey, (a: Ranked, b: Ranked) => number> = {
    nearest: (a, b) => cmpNull(a.label.km, b.label.km) || a.item.name.localeCompare(b.item.name),
    'price-asc': (a, b) => cmpNull(a.item.price, b.item.price),
    'price-desc': (a, b) => cmpNull(a.item.price, b.item.price, -1),
    newest: (a, b) => cmpNull(a.item.listedDaysAgo, b.item.listedDaysAgo),
    stock: (a, b) => cmpNull(a.item.qty, b.item.qty, -1),
  };
  return rows.sort(by[f.sort]);
}
