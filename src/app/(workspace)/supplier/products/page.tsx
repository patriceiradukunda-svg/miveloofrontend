import Link from 'next/link';
import { PageHeader } from '@/components/layout/PageHeader';
import { Table, Th, Td } from '@/components/ui/table';
import { ButtonLink } from '@/components/ui/button';
import { SampleBadge } from '@/components/ui/badge';
import { ProductStatusBadge } from '@/features/products/components/ProductStatusBadge';
import { ProductActions } from '@/features/products/components/ProductActions';
import { sampleProducts } from '@/lib/sample-data';
export const metadata = { title: 'My products' };
export default function Page() {
  const mine = sampleProducts.filter((p) => p.supplierId === 'sup-sample-1');
  return <div className="space-y-6"><PageHeader title="My products" lead="Create, edit, publish, pause and archive your listings." status="available"><ButtonLink href="/supplier/products/new" variant="gold">New listing</ButtonLink></PageHeader><SampleBadge />
    <Table caption="My listings"><thead><tr><Th>Product</Th><Th>Status</Th><Th>Quantity</Th><Th><span className="sr-only">Actions</span></Th></tr></thead>
      <tbody>{mine.map((p) => <tr key={p.id}><Td><Link className="font-bold underline" href={`/supplier/products/${p.id}`}>{p.name}</Link></Td><Td><ProductStatusBadge status="published" /></Td><Td>{p.availableQuantity} {p.unit}</Td><Td><ProductActions name={p.name} /></Td></tr>)}</tbody></Table></div>;
}
