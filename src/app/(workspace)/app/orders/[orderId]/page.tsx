import { notFound } from 'next/navigation';
import { getSession } from '@/lib/session';
import { PageHeader } from '@/components/layout/PageHeader';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Table, Th, Td } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { OrderStatusBadge } from '@/features/orders/components/OrderStatusBadge';
import { OrderTimeline } from '@/features/orders/components/OrderTimeline';
import { nextStatuses, orderTotal, sampleOrders } from '@/features/orders/types';
import { formatQuantity, formatRWF } from '@/lib/formatters';

export default async function OrderPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params; const o = sampleOrders.find((x) => x.id === orderId); if (!o) notFound();
  const s = await getSession(); const actions = s ? nextStatuses(s.role, o.status) : [];
  return (
    <div className="space-y-6"><Breadcrumbs items={[{ href: '/app/orders', label: 'Orders' }, { label: o.id }]} />
      <PageHeader title={o.id} lead={`${o.buyer} → ${o.seller} · ${o.delivery}`}><OrderStatusBadge status={o.status} /></PageHeader>
      <OrderTimeline status={o.status} />
      <Table caption="Order items"><thead><tr><Th>Item</Th><Th>Quantity</Th><Th>Unit price</Th><Th>Line total</Th></tr></thead><tbody>{o.items.map((i) => <tr key={i.name}><Td>{i.name}</Td><Td>{formatQuantity(i.quantity, i.unit)}</Td><Td>{formatRWF(i.unitPriceRWF)}</Td><Td>{formatRWF(i.quantity * i.unitPriceRWF)}</Td></tr>)}</tbody></Table>
      <p className="text-right text-xl font-bold">Total {formatRWF(orderTotal(o))}</p>
      <section aria-label="Actions" className="rounded-2xl bg-white p-4"><h2 className="font-sans text-base font-bold">Available actions for your role</h2>
        {actions.length ? <div className="mt-3 flex flex-wrap gap-2">{actions.map((a) => <Button key={a} variant="secondary" disabled title="Demo: connect the backend to change status" className="capitalize">Mark {a}</Button>)}</div> : <p className="mt-1 text-ink-soft">None at this status.</p>}
        <p className="mt-2 text-xs text-ink-soft">Status changes are validated by the server using the same rules.</p></section>
    </div>
  );
}
