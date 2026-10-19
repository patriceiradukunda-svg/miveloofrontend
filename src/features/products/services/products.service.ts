import { api, hasBackend } from '@/lib/api-client';
import { liveApi } from '@/lib/miveloo-client';
import { loadLiveProduct, loadLiveProducts, suppliersFrom } from '@/lib/live-adapters';
import { PAGE_SIZE } from '@/lib/constants';
import { sampleProducts, sampleSuppliers } from '@/lib/sample-data';
import type { PublicProduct, PublicSupplier } from '@/types/product';

export interface ProductQuery { q?: string; category?: string; district?: string; maxPrice?: number; availability?: string; page?: number }
export interface Paged<T> { items: T[]; total: number; page: number; pageSize: number }

export function filterProducts(all: PublicProduct[], f: ProductQuery): PublicProduct[] {
  const q = f.q?.trim().toLowerCase();
  return all.filter((p) =>
    (!q || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)) &&
    (!f.category || p.category === f.category) &&
    (!f.district || p.district === f.district) &&
    (!f.availability || p.availability === f.availability) &&
    (f.maxPrice == null || (p.indicativePriceRWF != null && p.indicativePriceRWF <= f.maxPrice)),
  );
}
export async function listPublicProducts(f: ProductQuery): Promise<Paged<PublicProduct>> {
  const page = Math.max(1, f.page ?? 1);
  if (liveApi) {
    try {
      const all = filterProducts(await loadLiveProducts(), { ...f, district: undefined });
      return { items: all.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), total: all.length, page, pageSize: PAGE_SIZE };
    } catch { /* backend asleep or unreachable: fall through to the labelled sample data */ }
  }
  if (hasBackend) {
    const qs = new URLSearchParams(Object.entries(f).filter(([, v]) => v != null && v !== '').map(([k, v]) => [k, String(v)]));
    return api<Paged<PublicProduct>>(`/public/products?${qs}`, { next: { revalidate: 60 } } as RequestInit);
  }
  const all = filterProducts(sampleProducts, f);
  return { items: all.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), total: all.length, page, pageSize: PAGE_SIZE };
}
export async function getPublicProduct(id: string) {
  if (liveApi) { const p = await loadLiveProduct(id); if (p) return p; }
  if (hasBackend) return api<PublicProduct>(`/public/products/${encodeURIComponent(id)}`).catch(() => null);
  return sampleProducts.find((p) => p.id === id) ?? null;
}
export async function getPublicSupplier(id: string) {
  if (liveApi) { try { return suppliersFrom(await loadLiveProducts()).find((s) => s.id === id) ?? null; } catch { /* fall through */ } }
  if (hasBackend) return api<PublicSupplier>(`/public/suppliers/${encodeURIComponent(id)}`).catch(() => null);
  return sampleSuppliers.find((s) => s.id === id) ?? null;
}
export async function listPublicSuppliers() {
  if (liveApi) { try { return suppliersFrom(await loadLiveProducts()); } catch { /* fall through */ } }
  return hasBackend ? api<PublicSupplier[]>('/public/suppliers') : sampleSuppliers;
}
