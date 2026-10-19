import type { Role } from '@/config/roles';

export const ORDER_STATUSES = [
  'draft',
  'submitted',
  'accepted',
  'rejected',
  'preparing',
  'dispatched',
  'delivered',
  'cancelled',
  'disputed',
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

/** Allowed transitions per acting role. The backend enforces the same table. */
const T: Record<string, Partial<Record<OrderStatus, OrderStatus[]>>> = {
  school: {
    draft: ['submitted', 'cancelled'],
    submitted: ['cancelled'],
    dispatched: ['delivered', 'disputed'],
    delivered: ['disputed'],
  },
  supplier: {
    submitted: ['accepted', 'rejected'],
    accepted: ['preparing', 'cancelled'],
    preparing: ['dispatched'],
  },
  group: {
    submitted: ['accepted', 'rejected'],
    accepted: ['preparing', 'cancelled'],
    preparing: ['dispatched'],
  },
  admin: {
    disputed: ['delivered', 'cancelled'],
  },
};

export function nextStatuses(role: Role, status: OrderStatus): OrderStatus[] {
  return T[role]?.[status] ?? [];
}

export interface OrderItem {
  name: string;
  quantity: number;
  unit: string;
  unitPriceRWF: number;
}

export interface Order {
  id: string;
  status: OrderStatus;
  buyer: string;
  seller: string;
  createdAt: string;
  items: OrderItem[];
  delivery: string;
}

export const orderTotal = (o: Order) =>
  o.items.reduce((sum, item) => sum + item.quantity * item.unitPriceRWF, 0);
