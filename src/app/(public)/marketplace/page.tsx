import type { Metadata } from 'next';
import { Suspense } from 'react';
import { listPublicProducts } from '@/features/products/services/products.service';
import { ProductFilters } from '@/components/marketplace/ProductFilters';
import { ProductGrid } from '@/components/marketplace/ProductGrid';
import { PageHeader } from '@/components/layout/PageHeader';
import { EmptyState } from '@/components/ui/empty-state';
import { Pagination } from '@/components/ui/pagination';
import { getT } from '@/i18n/server';
import { hasBackend } from '@/lib/api-client';

export const metadata: Metadata = { title: 'Marketplace', description: 'Browse food listings published by suppliers on Miveloo.', alternates: { canonical: '/marketplace' } };
type SP = Promise<Record<string, string | undefined>>;

export default async function MarketplacePage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams; const { t } = await getT();
  const page = Number(sp.page) || 1; const maxPrice = sp.maxPrice ? Number(sp.maxPrice) : undefined;
  const data = await listPublicProducts({ q: sp.q, category: sp.category, district: sp.district, availability: sp.availability, maxPrice, page }).catch(() => null);
  if (!data) return <div className="container-page py-12"><PageHeader title="Food listings from suppliers" /><div className="mt-8"><EmptyState title="Marketplace temporarily unavailable" body="We could not load listings just now. Please try again in a moment." action={{ href: '/marketplace', label: 'Try again' }} /></div></div>;
  const qs = (p: number) => { const n = new URLSearchParams(Object.entries(sp).filter(([, v]) => v) as [string, string][]); n.set('page', String(p)); return `/marketplace?${n}`; };
  return (
    <div className="container-page py-12">
      <PageHeader eyebrow={t('nav.marketplace')} title="Food listings from suppliers" lead="Anyone can look. Prices shown are indicative, set by suppliers. Ordering is for verified schools, inside their own workspace." />
      {!hasBackend && <p className="mt-4 rounded-xl bg-gold-tint px-4 py-3 text-sm font-semibold">{t('home.sampleNote')}</p>}
      <div className="mt-8 grid gap-8 lg:grid-cols-[18rem_1fr]">
        <Suspense><ProductFilters /></Suspense>
        <section aria-live="polite" aria-label="Results">
          <p className="mb-4 text-sm text-ink-soft">{data.total} listing{data.total === 1 ? '' : 's'}</p>
          {data.items.length ? <ProductGrid items={data.items} /> : <EmptyState title={t('market.empty')} body="Try removing a filter or searching a different word." action={{ href: '/marketplace', label: t('market.clear') }} />}
          <Pagination page={data.page} total={data.total} pageSize={data.pageSize} hrefFor={qs} />
        </section>
      </div>
    </div>
  );
}
