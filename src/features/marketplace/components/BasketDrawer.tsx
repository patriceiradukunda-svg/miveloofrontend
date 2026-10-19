"use client";
import Image from 'next/image';
import { formatNumber, formatRWF } from '@/lib/formatters';
import { catEmoji } from '../categories';
import type { MarketItem } from '../types';
import { I, ICON } from './icons';
import { Sheet } from './Sheet';

export function BasketDrawer({ open, onClose, items, lines, onSet, onSend, busy }: { open: boolean; onClose: () => void; items: MarketItem[]; lines: Record<string, number>; onSet: (id: string, qty: number) => void; onSend: () => void; busy: boolean }) {
  const rows = items.filter((i) => lines[i.id]); const total = rows.reduce((s, i) => s + (i.price ?? 0) * (lines[i.id] ?? 0), 0);
  return (
    <Sheet open={open} onClose={onClose} label="Basket">
      <div className="p-5 pb-3"><h2 className="font-display text-3xl font-semibold text-teal-dark">Basket</h2></div>
      <div className="min-h-0 flex-1 overflow-y-auto px-5">
        {rows.length === 0 ? <div className="grid place-items-center py-16 text-center text-ink-soft"><div><p aria-hidden className="text-5xl">🧺</p><p className="mt-2 font-semibold">Your basket is empty</p></div></div> : (
          <ul className="divide-y divide-ink/10">{rows.map((i) => { const step = i.minOrder || 1; return (
            <li key={i.id} className="flex items-center gap-3 py-3">
              <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-cream-deep">{i.photos[0] ? <Image src={i.photos[0]} alt="" fill sizes="64px" className="object-cover" /> : <span aria-hidden className="grid h-full place-items-center text-3xl">{catEmoji(i.category)}</span>}</span>
              <div className="min-w-0 flex-1"><p className="truncate font-semibold">{i.name}</p><p className="text-sm text-ink-soft">{formatRWF((i.price ?? 0) * (lines[i.id] ?? 0))}</p></div>
              <div role="group" aria-label={`Quantity of ${i.name}`} className="inline-flex items-center rounded-full border-2 border-ink/15">
                <button type="button" aria-label={`Less ${i.name}`} className="grid h-10 w-10 place-items-center" onClick={() => onSet(i.id, (lines[i.id] ?? 0) - step)}><I d={ICON.minus} className="h-4 w-4" /></button>
                <span className="min-w-[3.5rem] text-center text-sm font-bold">{formatNumber(lines[i.id] ?? 0)} {i.unit}</span>
                <button type="button" aria-label={`More ${i.name}`} className="grid h-10 w-10 place-items-center" onClick={() => onSet(i.id, (lines[i.id] ?? 0) + step)}><I d={ICON.plus} className="h-4 w-4" /></button>
              </div>
            </li>); })}</ul>
        )}
      </div>
      <div className="space-y-3 border-t border-ink/10 bg-white p-5">
        <p className="flex justify-between text-lg font-bold"><span>Estimated total</span><span>{formatRWF(total)}</span></p>
        <p className="text-xs text-ink-soft">Indicative prices. Suppliers confirm final price and quantity.</p>
        <button type="button" disabled={!rows.length || busy} onClick={onSend} className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-teal px-6 font-bold text-cream hover:bg-teal-dark disabled:opacity-50">{busy ? 'Sending…' : 'Send purchase request'}</button>
      </div>
    </Sheet>
  );
}
