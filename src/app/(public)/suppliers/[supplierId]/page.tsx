import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPublicSupplier, listPublicProducts } from '@/features/products/services/products.service';
import { ProductGrid } from '@/components/marketplace/ProductGrid';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Badge, SampleBadge } from '@/components/ui/badge';
import { CATEGORY_LABEL } from '@/lib/sample-data';

type P = { params: Promise<{ supplierId: string }> };
export async function generateMetadata({ params }: P): Promise<Metadata> {
  const s = await getPublicSupplier((await params).supplierId); return s ? { title: s.name, description: s.about, robots: s.isSample ? { index: false } : undefined } : { title: 'Not found' };
}
export default async function SupplierPage({ params }: P) {
  const s = await getPublicSupplier((await params).supplierId); if (!s) notFound();
  const all = await listPublicProducts({}); const items = all.items.filter((p) => p.supplierId === s.id);
  return (
    <div className="container-page py-10 space-y-6">
      <Breadcrumbs items={[{ href: '/suppliers', label: 'Suppliers' }, { label: s.name }]} />
      <header className="space-y-3"><div className="flex flex-wrap gap-2">{s.isSample && <SampleBadge />}<Badge>{s.verified ? '✔ Verified' : 'Not yet verified'}</Badge></div>
        <h1 className="text-4xl font-semibold text-teal-dark">{s.name}</h1><p className="max-w-2xl text-lg text-ink-soft">{s.about}</p>
        <p className="text-sm"><strong>Operating area:</strong> {s.operatingArea} · <strong>Categories:</strong> {s.categories.map((c) => CATEGORY_LABEL[c]).join(', ')}</p></header>
      <h2 className="text-2xl font-semibold">Published listings</h2><ProductGrid items={items} />
    </div>
  );
}
