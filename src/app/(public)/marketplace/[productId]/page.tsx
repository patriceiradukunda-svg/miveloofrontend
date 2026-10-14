import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPublicProduct, getPublicSupplier } from '@/features/products/services/products.service';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { SampleBadge } from '@/components/ui/badge';
import { ButtonLink } from '@/components/ui/button';
import { formatQuantity, formatRWF } from '@/lib/formatters';
import { CATEGORY_LABEL } from '@/lib/sample-data';

type P = { params: Promise<{ productId: string }> };
export async function generateMetadata({ params }: P): Promise<Metadata> {
  const p = await getPublicProduct((await params).productId);
  return p ? { title: p.name, description: p.description, alternates: { canonical: `/marketplace/${p.id}` }, robots: p.isSample ? { index: false } : undefined } : { title: 'Not found' };
}
export default async function ProductPage({ params }: P) {
  const p = await getPublicProduct((await params).productId); if (!p) notFound();
  const s = await getPublicSupplier(p.supplierId);
  const rows: [string, string][] = [['Category', CATEGORY_LABEL[p.category] ?? p.category], ['Unit', p.unit], ['General location', p.district], ['Quality information', p.quality],
    ['Available quantity', p.availableQuantity != null ? formatQuantity(p.availableQuantity, p.unit) : 'Not published']];
  return (
    <div className="container-page py-10">
      <Breadcrumbs items={[{ href: '/marketplace', label: 'Marketplace' }, { label: p.name }]} />
      <div className="mt-6 grid gap-8 md:grid-cols-2">
        <div aria-hidden className="grid aspect-[4/3] place-items-center rounded-3xl bg-gradient-to-br from-green-tint via-gold-tint to-teal-tint text-9xl">{p.emoji}</div>
        <div className="space-y-4">
          {p.isSample && <SampleBadge />}
          <h1 className="text-4xl font-semibold text-teal-dark">{p.name}</h1>
          <p className="text-lg text-ink-soft">{p.description}</p>
          <p className="text-3xl font-bold">{p.indicativePriceRWF != null ? <>{formatRWF(p.indicativePriceRWF)} <span className="text-base font-semibold text-ink-soft">per {p.unit} · indicative</span></> : 'Price on request'}</p>
          <dl className="divide-y divide-ink/10 rounded-2xl border border-ink/10 bg-white">{rows.map(([k, v]) => <div key={k} className="flex justify-between gap-4 px-4 py-3"><dt className="font-semibold">{k}</dt><dd className="text-right text-ink-soft">{v}</dd></div>)}</dl>
          {s && <p>Supplied by <Link className="font-bold underline" href={`/suppliers/${s.id}`}>{s.name}</Link> {s.verified ? '(verified)' : '(not yet verified)'}</p>}
          <div className="rounded-2xl bg-teal-tint p-4">
            <p className="font-bold">Want to order this?</p>
            <p className="text-sm text-ink-soft">Orders are placed by verified schools inside their Miveloo workspace. Suppliers&rsquo; private contact details are not shown publicly.</p>
            <div className="mt-3 flex flex-wrap gap-3"><ButtonLink href="/login?next=/school/marketplace">School login</ButtonLink><ButtonLink variant="secondary" href="/register/school">Register your school</ButtonLink></div>
          </div>
        </div>
      </div>
    </div>
  );
}
