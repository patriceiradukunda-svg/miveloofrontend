import type { OrderStatus } from '../types';
const FLOW: OrderStatus[] = ['submitted', 'accepted', 'preparing', 'dispatched', 'delivered'];
export function OrderTimeline({ status }: { status: OrderStatus }) {
  const idx = FLOW.indexOf(status);
  return <ol className="flex flex-wrap gap-2" aria-label="Order progress">{FLOW.map((s, i) => <li key={s} aria-current={i === idx ? 'step' : undefined} className={`rounded-full px-3 py-1.5 text-sm font-bold capitalize ${i <= idx ? 'bg-teal text-cream' : 'bg-ink/10 text-ink-soft'}`}>{i < idx ? '✓ ' : ''}{s}</li>)}</ol>;
}
