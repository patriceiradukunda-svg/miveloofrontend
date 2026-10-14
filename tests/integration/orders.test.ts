import { describe, expect, it } from 'vitest';
import { nextStatuses, orderTotal, sampleOrders } from '@/features/orders/types';
describe('order lifecycle', () => {
  it('suppliers respond to submitted orders; schools cannot accept their own', () => {
    expect(nextStatuses('supplier', 'submitted')).toEqual(['accepted', 'rejected']);
    expect(nextStatuses('school', 'submitted')).toEqual(['cancelled']);
  });
  it('only the school confirms receipt', () => { expect(nextStatuses('school', 'dispatched')).toContain('delivered'); expect(nextStatuses('supplier', 'dispatched')).toEqual([]); });
  it('terminal statuses have no transitions', () => { for (const r of ['school', 'supplier', 'group'] as const) { expect(nextStatuses(r, 'rejected')).toEqual([]); expect(nextStatuses(r, 'cancelled')).toEqual([]); } });
  it('computes totals', () => { expect(orderTotal(sampleOrders[0]!)).toBe(500 * 650 + 200 * 900); });
});
