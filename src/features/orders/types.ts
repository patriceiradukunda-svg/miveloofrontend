import type { Role } from '@/config/roles';

export const ORDER_STATUSES = ['draft', 'submitted', 'accepted', 'rejected', 'preparing', 'dispatched', 'delivered', 'cancelled', 'disputed'] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

/** Allowed transitions per acting role. The backend enforces the same table. */
const T: Record<string, Partial<Record<OrderStatus, OrderStatus[]>>> = {
  school: { draft: ['submitted', 'cancelled'], submitted: ['cancelled'], dispatched: ['delivered', 'disputed'], delivered: ['disputed'] },
  supplier: { submitted: ['accepted', 'rejected'], accepted: ['preparing', 'cancelled'], preparing: ['dispatched'] },
  group: { submitted: ['accepted', 'rejected'], accepted: ['preparing', 'cancelled'], preparing: ['dispatched'] },
  admin: { disputed: ['delivered', 'cancelled'] },
};
export function nextStatuses(role: Role, status: OrderStatus): OrderStatus[] {
  return T[role]?.[status] ?? [];
}
export interface OrderItem { name: string; quantity: number; unit: string; unitPriceRWF: number }
export interface Order { id: string; status: OrderStatus; buyer: string; seller: string; createdAt: string; items: OrderItem[]; delivery: string; isSample: boolean }
export const orderTotal = (o: Order) => o.items.reduce((s, i) => s + i.quantity * i.unitPriceRWF, 0);

export const sampleOrders: Order[] = [
  { id: 'ORD-SAMPLE-001', status: 'dispatched', buyer: 'Sample School', seller: 'Sample Cooperative', createdAt: '2026-10-02', delivery: 'Delivery to school gate', isSample: true, items: [{ name: 'Maize flour', quantity: 500, unit: 'kg', unitPriceRWF: 650 }, { name: 'Dry beans', quantity: 200, unit: 'kg', unitPriceRWF: 900 }] },
  { id: 'ORD-SAMPLE-002', status: 'submitted', buyer: 'Sample School', seller: 'Sample Hillside Farm', createdAt: '2026-10-09', delivery: 'Collection by school', isSample: true, items: [{ name: 'Irish potatoes', quantity: 300, unit: 'kg', unitPriceRWF: 420 }] },
  { id: 'ORD-SAMPLE-003', status: 'delivered', buyer: 'Sample School', seller: 'Sample Fresh Traders', createdAt: '2026-09-21', delivery: 'Delivery to school gate', isSample: true, items: [{ name: 'Bananas', quantity: 40, unit: 'bunch', unitPriceRWF: 2500 }] },
];
