import { describe, expect, it } from 'vitest';
import { nextStatuses, orderTotal, type Order } from '@/features/orders/types';
describe('order lifecycle', () => {
  it('suppliers respond to submitted orders; schools cannot accept their own', () => {
    expect(nextStatuses('supplier', 'submitted')).toEqual(['accepted', 'rejected']);
    expect(nextStatuses('school', 'submitted')).toEqual(['cancelled']);
  });
  it('only the school confirms receipt', () => { expect(nextStatuses('school', 'dispatched')).toContain('delivered'); expect(nextStatuses('supplier', 'dispatched')).toEqual([]); });
  it('terminal statuses have no transitions', () => { for (const r of ['school', 'supplier', 'group'] as const) { expect(nextStatuses(r, 'rejected')).toEqual([]); expect(nextStatuses(r, 'cancelled')).toEqual([]); } });
  it('computes order totals', () => {
    const order: Order = {
      id: 'test-order',
      status: 'submitted',
      buyer: 'Test buyer',
      seller: 'Test seller',
      createdAt: '2026-01-01',
      delivery: 'Test delivery',
      items: [
        { name: 'Item A', quantity: 2, unit: 'kg', unitPriceRWF: 650 },
        { name: 'Item B', quantity: 3, unit: 'kg', unitPriceRWF: 900 },
      ],
    };
    expect(orderTotal(order)).toBe(2 * 650 + 3 * 900);
  });
});
