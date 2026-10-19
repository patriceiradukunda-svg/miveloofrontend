"use client";
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { EmptyState } from '@/components/ui/empty-state';
import { useToast } from '@/components/ui/toast';
import { placeOrdersAction } from '@/features/orders/actions';
import { nice, type Place } from '@/lib/places';
import { useT } from '@/providers/LocaleProvider';
import { catEmoji } from '../categories';
import { activeCount, rank } from '../filters';
import type { MarketItem } from '../types';
import { useBasket } from '../useBasket';
import { useMarketUrl } from '../useMarketUrl';
import { BasketDrawer } from './BasketDrawer';
import { FilterBar } from './FilterBar';
import { GalleryCard } from './GalleryCard';
import { I, ICON } from './icons';
import { ItemDrawer, priceText } from './ItemDrawer';
import { Lightbox } from './Lightbox';

const chip = 'inline-flex items-center rounded-full bg-white/95 px-3 py-1 text-xs font-bold shadow';

/** The school's private marketplace, designed as a gallery: big images, a few words, details on demand, nearest first. */
export function SchoolGallery({ items, place, error }: { items: MarketItem[]; place: Place | null; error?: boolean }) {
  const { t } = useT(); const toast = useToast();
  const { f, set, clear } = useMarketUrl('nearest'); const basket = useBasket();
  const me = place;
  const [density, setDensity] = useState<'gallery' | 'compact'>('gallery');
  const [openId, setOpenId] = useState<string | null>(null); const [lb, setLb] = useState<{ id: string } | null>(null);
  const [basketOpen, setBasketOpen] = useState(false); const [saved, setSaved] = useState<string[]>([]); const [sending, setSending] = useState(false);
  const ranked = useMemo(() => rank(items, f, me), [items, f, me]);
  const cats = useMemo(() => [...new Set(items.map((i) => i.category))], [items]);
  const opened = ranked.find((r) => r.item.id === openId) ?? null; const lbItem = items.find((i) => i.id === lb?.id) ?? null;
  const add = (i: MarketItem, qty = i.minOrder || 1) => { if (!i.supplierId) { toast('Supplier information is missing. This item cannot be ordered yet.', 'error'); return; } basket.set(i.id, (basket.lines[i.id] ?? 0) + qty); toast(`${i.name} added to basket`); };
  const hasGeo = me?.lat != null && me?.lng != null;
  const myPlace = me ? [me.village.n, me.cell.n, me.sector.n].map(nice).join(' / ') : 'School location not configured';

  if (error) return <EmptyState title="We could not load the marketplace" body="Check your connection and try again." action={{ href: '/school/marketplace', label: 'Try again' }} />;
  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-semibold tracking-tight text-teal-dark sm:text-5xl">{t('mk.title', 'Marketplace')}</h1>
          <p className="mt-1 flex items-center gap-2 text-ink-soft">{t('mk.sub', 'Food listings from the marketplace.')}</p>
        </div>
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => setBasketOpen(true)} aria-label={`Basket, ${basket.count} item${basket.count === 1 ? '' : 's'}`} className="relative grid h-12 w-12 place-items-center rounded-full border-2 border-teal text-teal hover:bg-teal-tint">
            <I d={ICON.cart} className="h-6 w-6" />{basket.count > 0 && <span className="absolute -right-1 -top-1 grid h-6 min-w-6 place-items-center rounded-full bg-gold px-1 text-xs font-bold text-ink">{basket.count}</span>}
          </button>
          <Link href="/school/requests/new" title="Tell us what you need" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-gold px-6 font-bold shadow hover:bg-gold-dark hover:text-white"><I d={ICON.clip} className="h-5 w-5" />{t('mk.request', 'Request')}</Link>
        </div>
      </header>

      <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-card">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-teal text-cream"><I d={ICON.pin} className="h-4 w-4" /></span>
        <p className="min-w-0 flex-1 text-sm"><strong className="block truncate">{myPlace}</strong><span className="text-ink-soft">{hasGeo ? t('mk.near', 'Distances are measured from here.') : me ? 'Confirmed coordinates are not available, so distances cannot be calculated.' : 'Add your confirmed school location to see distances.'}</span></p>
        {!me && <Link href="/school/profile" className="font-bold text-teal underline underline-offset-4">Add location</Link>}
      </div>

      <FilterBar mode="school" f={f} set={set} clear={clear} activeN={activeCount(f)} cats={cats} count={ranked.length} sorts={['nearest', 'price-asc', 'price-desc', 'newest']} density={density} onDensity={setDensity} />

      {ranked.length === 0 ? (
        <div className="space-y-3"><EmptyState title="Nothing matches" body="Try fewer filters, or tell us what you need and we will keep it on file." action={{ href: '/school/requests/new', label: 'Request' }} /><div className="text-center"><button type="button" onClick={clear} className="min-h-11 rounded-full px-5 font-bold text-teal underline underline-offset-4">Clear filters</button></div></div>
      ) : (
        <ul className={density === 'gallery' ? 'grid gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4' : 'grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6'}>
          {ranked.map(({ item, label }, idx) => {
            const featured = idx === 0 && f.sort === 'nearest' && density === 'gallery' && ranked.length > 2 && label.km != null;
            const ribbon = featured ? <span className={`${chip} text-teal-dark`}><I d={ICON.pin} className="mr-1 h-3 w-3" />Closest to you</span> : item.availability === 'limited' ? <span className={chip}>Few left</span> : item.availability === 'seasonal' ? <span className={chip}>Seasonal</span> : null;
            return (
              <li key={item.id} className={featured ? 'sm:col-span-2' : ''}>
                <GalleryCard featured={featured} compact={density === 'compact'} priority={idx < 3} name={item.name} photo={item.photos[0]} emoji={catEmoji(item.category)} ribbon={ribbon} onOpen={() => setOpenId(item.id)}
                  price={<>{priceText(item)}<span className="text-sm font-normal text-ink-soft">/{item.unit}</span></>}
                  meta={<><I d={ICON.pin} className="h-4 w-4 shrink-0 text-gold-dark" />{label.text && <span>{label.text}</span>}{label.distance && <span className="font-bold text-ink">{label.text ? '· ' : ''}{label.distance}</span>}{!label.text && !label.distance && <span>Distance unknown</span>}</>}
                  actions={[
                    { key: 'view', label: `View details of ${item.name}`, icon: ICON.eye, onClick: () => setOpenId(item.id) },
                    { key: 'cart', label: `Add ${item.name} to basket`, icon: ICON.cart, onClick: () => add(item) },
                    { key: 'photos', label: `More photos of ${item.name}`, icon: ICON.image, onClick: () => setLb({ id: item.id }) },
                  ]} />
              </li>
            );
          })}
        </ul>
      )}

      <Link href="/school/requests/new" aria-label="Request food" className="fixed bottom-4 right-4 z-30 inline-flex min-h-14 items-center gap-2 rounded-full bg-gold px-6 font-bold shadow-xl sm:hidden"><I d={ICON.clip} className="h-5 w-5" />{t('mk.request', 'Request')}</Link>

      <ItemDrawer mode="school" item={opened?.item ?? null} label={opened?.label} onClose={() => setOpenId(null)} onPhotos={() => opened && setLb({ id: opened.item.id })}
        onAdd={(q) => { if (opened) { add(opened.item, q); setOpenId(null); } }} saved={opened ? saved.includes(opened.item.supplierId) : false}
        onSave={() => opened?.item.supplierId && setSaved((s) => (s.includes(opened.item.supplierId) ? s.filter((x) => x !== opened.item.supplierId) : [...s, opened.item.supplierId]))} />
      <Lightbox open={!!lbItem} onClose={() => setLb(null)} name={lbItem?.name ?? ''} photos={lbItem?.photos ?? []} emoji={lbItem ? catEmoji(lbItem.category) : ''} sample={false} />
      <BasketDrawer
        open={basketOpen}
        onClose={() => setBasketOpen(false)}
        items={items}
        lines={basket.lines}
        onSet={basket.set}
        busy={sending}
        onSend={async () => {
          if (sending) return;
          const lines = items
            .filter((item) => (basket.lines[item.id] ?? 0) > 0)
            .map((item) => ({
              listingId: item.id,
              supplierId: item.supplierId,
              quantity: basket.lines[item.id] ?? 0,
            }));
          if (!lines.length) {
            toast('Your basket is empty.', 'error');
            return;
          }
          if (lines.some((line) => !line.supplierId)) {
            toast('A supplier is missing for one or more items. Remove those items before ordering.', 'error');
            return;
          }
          setSending(true);
          try {
            const result = await placeOrdersAction(lines);
            if (result.ok) {
              basket.clear();
              setBasketOpen(false);
              toast(`Purchase request sent. ${result.orders} supplier order${result.orders === 1 ? '' : 's'} created.`);
            } else {
              toast(
                result.placed > 0
                  ? `${result.error} ${result.placed} order(s) may already have been placed. Check Orders before retrying.`
                  : result.error,
                'error',
              );
            }
          } catch {
            toast('We could not submit your order. Check your Orders before retrying.', 'error');
          } finally {
            setSending(false);
          }
        }}
      />
    </div>
  );
}
