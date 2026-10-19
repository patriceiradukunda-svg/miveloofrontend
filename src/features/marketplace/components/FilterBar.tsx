"use client";
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { useT } from '@/providers/LocaleProvider';
import { catEmoji, catLabel } from '../categories';
import { WITHIN_STEPS, type MarketFilters, type SortKey } from '../filters';
import { I, ICON } from './icons';

const SORT_META: Record<SortKey, { icon: readonly string[]; label: string }> = {
  nearest: { icon: ICON.pin, label: 'Nearest first' }, 'price-asc': { icon: ICON.tag, label: 'Price: low to high' }, 'price-desc': { icon: ICON.tag, label: 'Price: high to low' },
  newest: { icon: ICON.clock, label: 'Newest' }, stock: { icon: ICON.box, label: 'Most stock' },
};
const ctl = 'inline-flex min-h-11 items-center gap-2 whitespace-nowrap rounded-full border-2 border-ink/15 bg-white px-4 text-sm font-bold transition-colors hover:border-teal aria-pressed:border-teal aria-pressed:bg-teal aria-pressed:text-cream aria-expanded:border-teal';

function Pop({ icon, text, label, active, children }: { icon: readonly string[]; text: string; label: string; active?: boolean; children: (close: () => void) => React.ReactNode }) {
  const [open, setOpen] = useState(false); const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const down = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); }; const key = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', down); document.addEventListener('keydown', key); return () => { document.removeEventListener('mousedown', down); document.removeEventListener('keydown', key); };
  }, [open]);
  return (
    <div ref={ref} className="relative">
      <button type="button" title={label} aria-label={label} aria-haspopup="true" aria-expanded={open} aria-pressed={active ? true : undefined} onClick={() => setOpen(!open)} className={ctl}><I d={icon} className="h-4 w-4" />{text}</button>
      {open && <div className="absolute left-0 top-full z-30 mt-2 w-64 rounded-2xl border border-ink/10 bg-white p-3 shadow-xl sm:left-auto sm:right-0">{children(() => setOpen(false))}</div>}
    </div>
  );
}

export interface FilterBarProps {
  mode: 'school' | 'supplier'; f: MarketFilters; set: (p: Partial<MarketFilters>) => void; clear: () => void; activeN: number; cats: string[]; count: number;
  sorts: SortKey[]; density: 'gallery' | 'compact'; onDensity: (d: 'gallery' | 'compact') => void; tabs?: { key: string; label: string; icon: readonly string[]; count: number }[];
}
export function FilterBar({ mode, f, set, clear, activeN, cats, count, sorts, density, onDensity, tabs }: FilterBarProps) {
  const { t } = useT(); const [q, setQ] = useState(f.q);
  useEffect(() => {
    const id = setTimeout(() => { if (q !== f.q) set({ q }); }, 300);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);
  useEffect(() => setQ(f.q), [f.q]);
  const within = f.within; const nextWithin = () => { const i = WITHIN_STEPS.indexOf(within); set({ within: WITHIN_STEPS[(i + 1) % WITHIN_STEPS.length] ?? null }); };
  const SM = SORT_META[f.sort];
  return (
    <section aria-label="Filters" className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <label className="relative min-w-[12rem] flex-1">
          <span className="sr-only">{t('mk.search', 'Search food')}</span>
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft"><I d={ICON.search} /></span>
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('mk.search', 'Search food')} className="field !rounded-full !pl-12" />
        </label>
        {mode === 'school' && (
          <>
            <button type="button" title="Distance" aria-label={`Distance limit: ${within ? `${within} km` : 'any'}. Press to change.`} aria-pressed={within ? true : undefined} onClick={nextWithin} className={ctl}><I d={ICON.ruler} className="h-4 w-4" />{within ? `≤ ${within} km` : 'Any'}</button>
            <Pop icon={ICON.tag} text={f.max ? `≤ ${f.max}` : 'RWF'} label="Highest price" active={!!f.max}>{(close) => (
              <div className="space-y-2"><label className="block text-sm font-bold">Highest price (RWF)<input inputMode="numeric" className="field mt-1" defaultValue={f.max ?? ''} onKeyDown={(e) => { if (e.key === 'Enter') { set({ max: Number((e.target as HTMLInputElement).value.replace(/\D/g, '')) || null }); close(); } }} onBlur={(e) => set({ max: Number(e.target.value.replace(/\D/g, '')) || null })} /></label>
                <div className="flex flex-wrap gap-2">{[500, 1000, 2000].map((n) => <button key={n} type="button" className="min-h-10 rounded-full bg-cream-deep px-3 text-sm font-bold hover:bg-gold-tint" onClick={() => { set({ max: n }); close(); }}>≤ {n}</button>)}<button type="button" className="min-h-10 rounded-full px-3 text-sm font-bold text-red-dark hover:bg-red-tint" onClick={() => { set({ max: null }); close(); }}>Clear</button></div></div>
            )}</Pop>
            <button type="button" title="In stock only" aria-label="In stock only" aria-pressed={f.stock} onClick={() => set({ stock: !f.stock })} className={ctl}><I d={ICON.check} className="h-4 w-4" />Stock</button>
          </>
        )}
        <Pop icon={SM.icon} text="" label={`Sort: ${SM.label}`}>{(close) => (
          <ul className="space-y-1">{sorts.map((s) => <li key={s}><button type="button" aria-pressed={f.sort === s} onClick={() => { set({ sort: s }); close(); }} className={cn('flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-left font-semibold hover:bg-cream-deep', f.sort === s && 'bg-teal-tint text-teal-dark')}><I d={SORT_META[s].icon} className="h-4 w-4" />{SORT_META[s].label}</button></li>)}</ul>
        )}</Pop>
        <div role="group" aria-label="Card size" className="hidden items-center rounded-full border-2 border-ink/15 bg-white p-0.5 sm:inline-flex">
          {(['gallery', 'compact'] as const).map((d) => <button key={d} type="button" title={d === 'gallery' ? 'Large cards' : 'Compact'} aria-label={d === 'gallery' ? 'Large cards' : 'Compact cards'} aria-pressed={density === d} onClick={() => onDensity(d)} className={cn('grid h-10 w-10 place-items-center rounded-full', density === d ? 'bg-teal text-cream' : 'text-ink-soft hover:bg-cream-deep')}><I d={d === 'gallery' ? ICON.rows : ICON.grid} className="h-4 w-4" /></button>)}
        </div>
      </div>

      {tabs && (
        <div role="group" aria-label="Listing status" className="flex flex-wrap gap-2">
          {tabs.map((tab) => <button key={tab.key} type="button" aria-pressed={f.status === tab.key} onClick={() => set({ status: tab.key })} className={ctl}><I d={tab.icon} className="h-4 w-4" />{tab.label}<span className="rounded-full bg-ink/10 px-2 text-xs">{tab.count}</span></button>)}
        </div>
      )}

      <div role="group" aria-label="Food category" className="-mx-1 flex snap-x gap-2 overflow-x-auto px-1 pb-1">
        {[{ id: '', label: t('mk.all', 'All'), emoji: '✨' }, ...cats.map((id) => ({ id, label: catLabel(id).split(' &')[0] ?? '', emoji: catEmoji(id) }))].map((c) => (
          <button key={c.id || 'all'} type="button" aria-pressed={f.category === c.id} onClick={() => set({ category: c.id })} title={c.label}
            className={cn('flex min-w-[4.25rem] shrink-0 snap-start flex-col items-center gap-0.5 rounded-2xl border-2 px-2 py-2 transition-colors', f.category === c.id ? 'border-teal bg-teal text-cream' : 'border-transparent bg-white hover:border-gold')}>
            <span aria-hidden className="text-2xl leading-none">{c.emoji}</span><span className="max-w-[4.5rem] truncate text-[11px] font-bold">{c.label}</span>
          </button>))}
      </div>

      <div className="flex min-h-8 flex-wrap items-center gap-2 text-sm" aria-live="polite">
        <span className="font-bold text-ink-soft">{count} {count === 1 ? 'item' : 'items'}</span>
        {activeN > 0 && <button type="button" onClick={clear} className="inline-flex min-h-8 items-center gap-1 rounded-full px-3 font-bold text-teal underline underline-offset-4 hover:bg-teal-tint"><I d={ICON.x} className="h-3.5 w-3.5" />Clear</button>}
      </div>
    </section>
  );
}
