"use client";
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { EmptyState } from '@/components/ui/empty-state';
import { SampleBadge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast';
import { formatNumber } from '@/lib/formatters';
import { catEmoji } from '../categories';
import { activeCount } from '../filters';
import type { ListingStatus, SupplierListing } from '../types';
import { useMarketUrl } from '../useMarketUrl';
import { FilterBar } from './FilterBar';
import { GalleryCard } from './GalleryCard';
import { I, ICON } from './icons';
import { ItemDrawer, priceText } from './ItemDrawer';
import { Lightbox } from './Lightbox';

const STATUS: Record<ListingStatus, { label: string; icon: readonly string[]; cls: string }> = {
  published: { label: 'Published', icon: ICON.check, cls: 'text-green-dark' }, draft: { label: 'Draft', icon: ICON.pencil, cls: 'text-gold-dark' }, unpublished: { label: 'Unpublished', icon: ICON.eyeOff, cls: 'text-ink-soft' },
};
const cmp = (a: number | null, b: number | null, d = 1) => (a == null ? (b == null ? 0 : 1) : b == null ? -1 : (a - b) * d);

/** Same gallery experience as the school marketplace, but showing only this supplier's own listings, by status. */
export function SupplierListings({ initial, sample, error }: { initial: SupplierListing[]; sample: boolean; error?: boolean }) {
  const toast = useToast(); const { f, set, clear } = useMarketUrl('newest');
  const [rows, setRows] = useState(initial); const [density, setDensity] = useState<'gallery' | 'compact'>('gallery');
  const [openId, setOpenId] = useState<string | null>(null); const [lbId, setLbId] = useState<string | null>(null);
  const count = (s: string) => rows.filter((r) => !s || r.status === s).length;
  const shown = useMemo(() => {
    const q = f.q.trim().toLowerCase();
    const out = rows.filter((r) => (!f.status || r.status === f.status) && (!f.category || r.category === f.category) && (!q || r.name.toLowerCase().includes(q)));
    return out.sort(f.sort === 'price-asc' ? (a, b) => cmp(a.price, b.price) : f.sort === 'price-desc' ? (a, b) => cmp(a.price, b.price, -1) : f.sort === 'stock' ? (a, b) => (b.qty ?? 0) - (a.qty ?? 0) : (a, b) => a.listedDaysAgo - b.listedDaysAgo);
  }, [rows, f]);
  const cats = useMemo(() => [...new Set(rows.map((r) => r.category))], [rows]);
  const opened = rows.find((r) => r.id === openId) ?? null; const lb = rows.find((r) => r.id === lbId) ?? null;
  const demo = sample ? ' Demo only: nothing is saved.' : '';
  const toggle = (l: SupplierListing) => {
    if (l.status === 'published') { setRows(rows.map((r) => (r.id === l.id ? { ...r, status: 'unpublished' } : r))); toast(`${l.name} unpublished. Schools no longer see it.${demo}`); return; }
    if (!l.photos.length || !l.qty) { toast('Add a photo and your stock before publishing.', 'error'); return; }
    setRows(rows.map((r) => (r.id === l.id ? { ...r, status: 'published' } : r))); toast(`${l.name} published. Verified schools can now see it.${demo}`);
  };
  const add = <Link href="/supplier/products/new" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-gold px-6 font-bold shadow hover:bg-gold-dark hover:text-white"><I d={ICON.plus} className="h-5 w-5" />Add listing</Link>;

  if (error) return <EmptyState title="We could not load your listings" body="Check your connection and try again." action={{ href: '/supplier/products', label: 'Try again' }} />;
  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div><h1 className="font-display text-4xl font-semibold tracking-tight text-teal-dark sm:text-5xl">My listings</h1><p className="mt-1 flex items-center gap-2 text-ink-soft">What schools can find, and what is still yours alone. {sample && <SampleBadge />}</p></div>
        {add}
      </header>

      {rows.length === 0 ? (
        <EmptyState title="Your first listing starts here" body="Add a photo, a price and your stock. Verified schools nearby will find it." action={{ href: '/supplier/products/new', label: 'Add listing' }} />
      ) : (
        <>
          <FilterBar mode="supplier" f={f} set={set} clear={clear} activeN={activeCount(f, 'newest')} cats={cats} count={shown.length} sorts={['newest', 'price-asc', 'price-desc', 'stock']} density={density} onDensity={setDensity}
            tabs={[{ key: '', label: 'All', icon: ICON.grid, count: count('') }, { key: 'published', label: 'Published', icon: ICON.check, count: count('published') }, { key: 'draft', label: 'Draft', icon: ICON.pencil, count: count('draft') }, { key: 'unpublished', label: 'Unpublished', icon: ICON.eyeOff, count: count('unpublished') }]} />
          {shown.length === 0 ? (
            <div className="space-y-3"><EmptyState title="No listings here" body="Try another status or clear the filters." /><div className="text-center"><button type="button" onClick={clear} className="min-h-11 rounded-full px-5 font-bold text-teal underline underline-offset-4">Clear filters</button></div></div>
          ) : (
            <ul className={density === 'gallery' ? 'grid gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4' : 'grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6'}>
              {shown.map((l, idx) => { const S = STATUS[l.status]; return (
                <li key={l.id}>
                  <GalleryCard compact={density === 'compact'} priority={idx < 3} name={l.name} photo={l.photos[0]} emoji={catEmoji(l.category)} dim={l.status === 'unpublished'} dashed={l.status === 'draft'} onOpen={() => setOpenId(l.id)}
                    ribbon={<span className={`inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-xs font-bold shadow ${S.cls}`}><I d={S.icon} className="h-3.5 w-3.5" />{S.label}</span>}
                    price={<>{priceText(l)}<span className="text-sm font-normal text-ink-soft">/{l.unit}</span></>}
                    meta={<><I d={ICON.box} className="h-4 w-4 shrink-0 text-gold-dark" /><span className={l.qty ? '' : 'font-bold text-red-dark'}>{l.qty ? `${formatNumber(l.qty)} ${l.unit}` : 'No stock'}</span></>}
                    actions={[
                      { key: 'view', label: `Preview ${l.name} as schools see it`, icon: ICON.eye, onClick: () => setOpenId(l.id) },
                      { key: 'edit', label: `Edit ${l.name}`, icon: ICON.pencil, href: `/supplier/products/${l.id}` },
                      { key: 'photos', label: `Photos of ${l.name}`, icon: ICON.image, onClick: () => setLbId(l.id) },
                      { key: 'toggle', label: l.status === 'published' ? `Unpublish ${l.name}` : `Publish ${l.name}`, icon: l.status === 'published' ? ICON.eyeOff : ICON.check, onClick: () => toggle(l) },
                    ]} />
                </li>); })}
            </ul>
          )}
        </>
      )}
      <Link href="/supplier/products/new" aria-label="Add listing" className="fixed bottom-4 right-4 z-30 inline-flex min-h-14 items-center gap-2 rounded-full bg-gold px-6 font-bold shadow-xl sm:hidden"><I d={ICON.plus} className="h-5 w-5" />Add</Link>

      <ItemDrawer mode="supplier" item={opened} onClose={() => setOpenId(null)} onPhotos={() => opened && setLbId(opened.id)}
        footer={opened && <><Link href={`/supplier/products/${opened.id}`} className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full border-2 border-teal px-5 font-bold text-teal hover:bg-teal-tint"><I d={ICON.pencil} className="h-4 w-4" />Edit</Link>
          <button type="button" onClick={() => toggle(opened)} className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-gold px-5 font-bold hover:bg-gold-dark hover:text-white"><I d={opened.status === 'published' ? ICON.eyeOff : ICON.check} className="h-4 w-4" />{opened.status === 'published' ? 'Unpublish' : 'Publish'}</button></>} />
      <Lightbox open={!!lb} onClose={() => setLbId(null)} name={lb?.name ?? ''} photos={lb?.photos ?? []} emoji={lb ? catEmoji(lb.category) : ''} sample={sample} />
    </div>
  );
}
