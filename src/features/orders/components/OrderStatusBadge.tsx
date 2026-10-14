import type { OrderStatus } from '../types';
const S: Record<OrderStatus, [string, string]> = { draft: ['bg-ink/10', '✎'], submitted: ['bg-teal-tint', '➤'], accepted: ['bg-green-tint', '✓'], rejected: ['bg-red-tint', '✕'], preparing: ['bg-gold-tint', '◐'], dispatched: ['bg-gold-tint', '🚚'], delivered: ['bg-green-tint', '✔'], cancelled: ['bg-ink/10', '⊘'], disputed: ['bg-red-tint', '!'] };
export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold capitalize ${S[status][0]}`}><span aria-hidden>{S[status][1]}</span>{status}</span>;
}
