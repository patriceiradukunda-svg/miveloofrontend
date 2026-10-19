"use client";
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { formatNumber, formatRWF } from '@/lib/formatters';
import type { PlaceLabel } from '@/lib/places';
import { catEmoji, catLabel } from '../categories';
import type { MarketItem } from '../types';
import { I, ICON } from './icons';
import { Sheet } from './Sheet';

export const priceText = (i: { price: number | null; unit: string }) => (i.price == null ? 'Ask' : formatRWF(i.price));
const deliveryText = (d: MarketItem['delivery']) => !d
  ? 'Delivery details unavailable'
  : d.mode === 'pickup'
    ? 'Pickup only'
    : d.mode === 'deliver'
      ? `Delivers up to ${d.radiusKm ?? '?'} km`
      : `Pickup or delivery (${d.radiusKm ?? '?'} km)`;
const agoText = (n: number | null) => n == null ? 'Listing date unavailable' : n === 0 ? 'Listed today' : n === 1 ? 'Listed yesterday' : `Listed ${n} days ago`;
function Fact({ icon, text }: { icon: readonly string[]; text: string }) { return <li className="flex items-center gap-2.5 rounded-xl bg-white px-3 py-2.5 text-sm font-semibold"><span className="text-teal"><I d={icon} className="h-4 w-4" /></span>{text}</li>; }

interface Props { mode: 'school' | 'supplier'; item: MarketItem | null; label?: PlaceLabel; onClose: () => void; onPhotos: () => void; onAdd?: (qty: number) => void; saved?: boolean; onSave?: () => void; footer?: React.ReactNode }
/** Everything that is hidden on the card lives here: one tap or click away. */
export function ItemDrawer({ mode, item, label, onClose, onPhotos, onAdd, saved, onSave, footer }: Props) {
  const step = item?.minOrder || 1; const [qty, setQty] = useState(step);
  useEffect(() => setQty(step), [step, item?.id]);
  return (
    <Sheet open={!!item} onClose={onClose} label={item ? `Details of ${item.name}` : 'Details'}>
      {item && (
        <>
          <div className="min-h-0 flex-1 overflow-y-auto">
            <button type="button" onClick={onPhotos} aria-label={`Open photos of ${item.name}`} className="group relative block aspect-[4/3] w-full overflow-hidden bg-cream-deep">
              {item.photos[0] ? <Image src={item.photos[0]} alt="" fill sizes="30rem" className="object-cover transition-transform duration-700 group-hover:scale-105" /> : <span aria-hidden className="grid h-full place-items-center bg-gradient-to-br from-green-tint via-gold-tint to-teal-tint text-8xl">{catEmoji(item.category)}</span>}
              {item.photos.length > 1 && <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-sm font-bold"><I d={ICON.image} className="h-4 w-4" />{item.photos.length}</span>}
            </button>
            <div className="space-y-5 p-5">
              {mode === 'supplier' && <p className="rounded-xl bg-gold-tint px-3 py-2 text-sm font-semibold">Listing preview based on the information currently available.</p>}
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-gold-dark">{catLabel(item.category)}</p>
                <h2 className="mt-1 font-display text-3xl font-semibold leading-tight text-teal-dark">{item.name}</h2>
                <p className="mt-1 text-2xl font-bold">{priceText(item)}<span className="text-base font-semibold text-ink-soft"> / {item.unit}</span></p>
                {mode === 'school' && label && <p className="mt-2 flex flex-wrap items-center gap-x-1.5 text-ink-soft"><I d={ICON.pin} className="h-4 w-4 text-gold-dark" />{label.text && <span>{label.text}</span>}{label.distance && <span className="font-bold text-ink">{label.text ? '· ' : ''}{label.distance}</span>}</p>}
              </div>
              <p className="text-ink-soft">{item.description || "No description provided."}</p>
              <ul className="grid gap-2 sm:grid-cols-2">
                <Fact icon={ICON.box} text={item.qty == null ? 'Stock not provided' : item.qty === 0 ? 'No stock' : `${formatNumber(item.qty)} ${item.unit} available`} />
                {item.minOrder ? <Fact icon={ICON.plus} text={`Minimum ${formatNumber(item.minOrder)} ${item.unit}`} /> : null}
                <Fact icon={ICON.truck} text={deliveryText(item.delivery)} />
                {item.leadDays ? <Fact icon={ICON.clock} text={`Ready in ${item.leadDays} day${item.leadDays > 1 ? 's' : ''}`} /> : null}
                <Fact icon={ICON.clock} text={agoText(item.listedDaysAgo)} />
              </ul>
              {item.quality.length > 0 && <ul className="flex flex-wrap gap-2">{item.quality.map((q) => <li key={q} className="rounded-full bg-teal-tint px-3 py-1 text-sm font-semibold text-teal-dark">{q}</li>)}</ul>}
              {mode === 'school' && (
                <div className="flex items-center justify-between gap-3 rounded-2xl bg-white p-3">
                  <p className="text-sm">
                    <strong>{item.supplier.name || 'Supplier details unavailable'}</strong>
                    <span className="block text-ink-soft">
                      {item.supplier.kind === 'group' ? 'Cooperative' : item.supplier.kind === 'individual' ? 'Individual supplier' : 'Supplier type unavailable'}
                      {' · '}
                      {item.supplier.verified == null ? 'Verification status unavailable' : item.supplier.verified ? 'Verified' : 'Not verified'}
                    </span>
                  </p>
                  {item.supplier.name && <button type="button" onClick={onSave} aria-pressed={saved} aria-label={saved ? 'Remove from saved suppliers' : 'Save supplier'} className="grid h-11 w-11 place-items-center rounded-full border-2 border-ink/15 hover:border-red aria-pressed:border-red aria-pressed:bg-red-tint aria-pressed:text-red"><I d={ICON.heart} /></button>}
                </div>
              )}
              <p className="text-xs text-ink-soft">Indicative supplier price. The supplier confirms the final price and quantity.</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 border-t border-ink/10 bg-white p-4">
            {mode === 'school' ? (
              <>
                <div role="group" aria-label="Quantity" className="inline-flex items-center rounded-full border-2 border-ink/15">
                  <button type="button" aria-label="Less" className="grid h-11 w-11 place-items-center" onClick={() => setQty(Math.max(step, qty - step))}><I d={ICON.minus} className="h-4 w-4" /></button>
                  <span className="min-w-[4.5rem] text-center font-bold" aria-live="polite">{formatNumber(qty)} <span className="text-xs font-semibold text-ink-soft">{item.unit}</span></span>
                  <button type="button" aria-label="More" className="grid h-11 w-11 place-items-center" onClick={() => setQty(qty + step)}><I d={ICON.plus} className="h-4 w-4" /></button>
                </div>
                <button type="button" onClick={() => onAdd?.(qty)} className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-gold px-6 font-bold hover:bg-gold-dark hover:text-white"><I d={ICON.cart} className="h-5 w-5" />Add to basket</button>
              </>
            ) : footer}
            {mode === 'school' && <Link href="/school/requests/new" className="w-full text-center text-sm font-bold text-teal underline underline-offset-4">Need something else? Request it</Link>}
          </div>
        </>
      )}
    </Sheet>
  );
}
