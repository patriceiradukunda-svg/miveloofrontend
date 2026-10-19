"use client";
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { EmptyState } from '@/components/ui/empty-state';
import { formatNumber } from '@/lib/formatters';
import { catEmoji } from '../categories';
import { activeCount } from '../filters';
import type { SupplierListing } from '../types';
import { useMarketUrl } from '../useMarketUrl';
import { FilterBar } from './FilterBar';
import { GalleryCard } from './GalleryCard';
import { I, ICON } from './icons';
import { ItemDrawer, priceText } from './ItemDrawer';
import { Lightbox } from './Lightbox';

const cmp = (a: number | null, b: number | null, d = 1) =>
  a == null ? (b == null ? 0 : 1) : b == null ? -1 : (a - b) * d;

/** This page only shows the supplier's active public listings returned by the backend. */
export function SupplierListings({ initial, error }: { initial: SupplierListing[]; error?: boolean }) {
  const { f, set, clear } = useMarketUrl('newest');
  const [density, setDensity] = useState<'gallery' | 'compact'>('gallery');
  const [openId, setOpenId] = useState<string | null>(null);
  const [lbId, setLbId] = useState<string | null>(null);
  const rows = initial;

  const shown = useMemo(() => {
    const q = f.q.trim().toLowerCase();
    const out = rows.filter((r) =>
      (!f.category || r.category === f.category) &&
      (!q || r.name.toLowerCase().includes(q)),
    );
    return out.sort(
      f.sort === 'price-asc'
        ? (a, b) => cmp(a.price, b.price)
        : f.sort === 'price-desc'
          ? (a, b) => cmp(a.price, b.price, -1)
          : f.sort === 'stock'
            ? (a, b) => cmp(a.qty, b.qty, -1)
            : (a, b) => cmp(a.listedDaysAgo, b.listedDaysAgo),
    );
  }, [rows, f]);

  const cats = useMemo(() => [...new Set(rows.map((r) => r.category))], [rows]);
  const opened = rows.find((r) => r.id === openId) ?? null;
  const lb = rows.find((r) => r.id === lbId) ?? null;
  const add = <Link href="/supplier/products/new" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-gold px-6 font-bold shadow hover:bg-gold-dark hover:text-white"><I d={ICON.plus} className="h-5 w-5" />Add listing</Link>;

  if (error) return <EmptyState title="We could not load your active listings" body="Check that you are signed in and the backend is available, then try again." action={{ href: '/supplier/products', label: 'Try again' }} />;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-semibold tracking-tight text-teal-dark sm:text-5xl">Your active public listings</h1>
          <p className="mt-1 text-ink-soft">Only active listings returned by the marketplace API appear here. Drafts and withdrawn listings are not included.</p>
        </div>
        {add}
      </header>

      {rows.length === 0 ? (
        <EmptyState title="No active public listings found" body="This does not show drafts or withdrawn listings. You can create a listing or check its status in the relevant product page." action={{ href: '/supplier/products/new', label: 'Add listing' }} />
      ) : (
        <>
          <FilterBar mode="supplier" f={f} set={set} clear={clear} activeN={activeCount(f, 'newest')} cats={cats} count={shown.length} sorts={['newest', 'price-asc', 'price-desc', 'stock']} density={density} onDensity={setDensity} />
          {shown.length === 0 ? (
            <div className="space-y-3">
              <EmptyState title="No listings match" body="Try another search or clear the filters." />
              <div className="text-center"><button type="button" onClick={clear} className="min-h-11 rounded-full px-5 font-bold text-teal underline underline-offset-4">Clear filters</button></div>
            </div>
          ) : (
            <ul className={density === 'gallery' ? 'grid gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4' : 'grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6'}>
              {shown.map((l, idx) => (
                <li key={l.id}>
                  <GalleryCard
                    compact={density === 'compact'}
                    priority={idx < 3}
                    name={l.name}
                    photo={l.photos[0]}
                    emoji={catEmoji(l.category)}
                    onOpen={() => setOpenId(l.id)}
                    ribbon={<span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-green-dark shadow"><I d={ICON.check} className="h-3.5 w-3.5" />Active public listing</span>}
                    price={<>{priceText(l)}<span className="text-sm font-normal text-ink-soft">/{l.unit}</span></>}
                    meta={<><I d={ICON.box} className="h-4 w-4 shrink-0 text-gold-dark" /><span>{l.qty == null ? 'Stock not provided' : l.qty === 0 ? 'No stock' : `${formatNumber(l.qty)} ${l.unit}`}</span></>}
                    actions={[
                      { key: 'view', label: `View ${l.name}`, icon: ICON.eye, onClick: () => setOpenId(l.id) },
                      { key: 'edit', label: `Edit ${l.name}`, icon: ICON.pencil, href: `/supplier/products/${l.id}` },
                      { key: 'photos', label: `Photos of ${l.name}`, icon: ICON.image, onClick: () => setLbId(l.id) },
                    ]}
                  />
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      <Link href="/supplier/products/new" aria-label="Add listing" className="fixed bottom-4 right-4 z-30 inline-flex min-h-14 items-center gap-2 rounded-full bg-gold px-6 font-bold shadow-xl sm:hidden"><I d={ICON.plus} className="h-5 w-5" />Add</Link>

      <ItemDrawer
        mode="supplier"
        item={opened}
        onClose={() => setOpenId(null)}
        onPhotos={() => opened && setLbId(opened.id)}
        footer={opened && <Link href={`/supplier/products/${opened.id}`} className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full border-2 border-teal px-5 font-bold text-teal hover:bg-teal-tint"><I d={ICON.pencil} className="h-4 w-4" />Edit</Link>}
      />
      <Lightbox open={!!lb} onClose={() => setLbId(null)} name={lb?.name ?? ''} photos={lb?.photos ?? []} emoji={lb ? catEmoji(lb.category) : ''} sample={false} />
    </div>
  );
}
