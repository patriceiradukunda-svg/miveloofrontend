import type { Metadata } from 'next';
import Link from 'next/link';
import { listPublicSuppliers } from '@/features/products/services/products.service';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/card';
import { SampleBadge, Badge } from '@/components/ui/badge';
export const metadata: Metadata = { title: 'Suppliers', alternates: { canonical: '/suppliers' } };
export default async function Suppliers() {
  const list = await listPublicSuppliers();
  return (
    <div className="container-page py-12"><PageHeader title="Suppliers on Miveloo" lead="Public profiles show what a supplier has chosen to share. Verification status is shown only where it has been completed." />
      <ul className="mt-8 grid gap-5 md:grid-cols-3">{list.map((s) => (
        <li key={s.id}><Card className="h-full space-y-2"><div className="flex flex-wrap gap-2">{s.isSample && <SampleBadge />}<Badge>{s.kind === 'group' ? 'Cooperative / group' : 'Individual'}</Badge></div>
          <h2 className="text-xl font-semibold"><Link className="hover:underline" href={`/suppliers/${s.id}`}>{s.name}</Link></h2><p className="text-sm text-ink-soft">{s.operatingArea}</p></Card></li>))}</ul></div>
  );
}
