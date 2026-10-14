import Link from 'next/link';
import { PageHeader } from '@/components/layout/PageHeader';
import { Table, Th, Td } from '@/components/ui/table';
import { SampleBadge } from '@/components/ui/badge';
import { OrderStatusBadge } from '@/features/orders/components/OrderStatusBadge';
import { orderTotal, sampleOrders } from '@/features/orders/types';
import { formatDate, formatRWF } from '@/lib/formatters';
export const metadata = { title: 'Orders' };
export default function Orders() {
  return <div className="space-y-6"><PageHeader title="Orders" lead="Every order follows the same lifecycle. Changes are recorded." status="available" /><SampleBadge />
    <Table caption="Orders"><thead><tr><Th>Order</Th><Th>Status</Th><Th>Seller</Th><Th>Date</Th><Th>Total</Th></tr></thead>
      <tbody>{sampleOrders.map((o) => <tr key={o.id}><Td><Link className="font-bold underline" href={`/app/orders/${o.id}`}>{o.id}</Link></Td><Td><OrderStatusBadge status={o.status} /></Td><Td>{o.seller}</Td><Td>{formatDate(o.createdAt)}</Td><Td>{formatRWF(orderTotal(o))}</Td></tr>)}</tbody></Table></div>;
}
