"use server";
import { ApiError, placeOrder } from '@/lib/miveloo-client';
import { messageOf, withBackendToken } from '@/lib/server/backend-session';

export interface OrderLineInput { listingId: string; supplierId: string; quantity: number }
export type PlaceOrdersResult = { ok: true; orders: number } | { ok: false; error: string; placed: number };

/** One backend order per supplier (the backend requires every order to come from exactly one supplier). */
export async function placeOrdersAction(lines: OrderLineInput[]): Promise<PlaceOrdersResult> {
  const clean = lines.filter((l) => l.quantity > 0 && l.listingId);
  if (!clean.length) return { ok: false, error: 'Enter a quantity for at least one product.', placed: 0 };
  const bySupplier = new Map<string, OrderLineInput[]>();
  for (const l of clean) bySupplier.set(l.supplierId, [...(bySupplier.get(l.supplierId) ?? []), l]);
  let placed = 0;
  try {
    for (const group of bySupplier.values()) {
      await withBackendToken((t) => placeOrder(t, group.map((g) => ({ listing_id: g.listingId, quantity: String(g.quantity) }))));
      placed += 1;
    }
    return { ok: true, orders: placed };
  } catch (e) {
    const detail = e instanceof ApiError && e.code === 'insufficient_stock' ? 'Not enough stock for one of the products.' : messageOf(e);
    return { ok: false, error: detail, placed };
  }
}
