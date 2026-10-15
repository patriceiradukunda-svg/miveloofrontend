"use client";
import Link from 'next/link';
import { useState } from 'react';
import { ProductCard } from '@/components/marketplace/ProductCard';
import { CATEGORY_LABEL } from '@/lib/sample-data';
import type { PublicProduct } from '@/types/product';
import { EmptyState } from '@/components/ui/empty-state';

export function CategoryPreview({ items }: { items: PublicProduct[] }) {
  const [c, setC] = useState(''); const shown = items.filter((p) => !c || p.category === c).slice(0, 6);
  const cats = Object.entries(CATEGORY_LABEL).filter(([k]) => items.some((p) => p.category === k));
  return (
    <div>
      <div role="group" aria-label="Filter by category" className="flex gap-2 overflow-x-auto pb-2">
        {[['', 'All'], ...cats].map(([k, l]) => <button key={k} type="button" aria-pressed={c === k} onClick={() => setC(k!)} className={`min-h-11 shrink-0 rounded-full border-2 px-4 font-bold ${c === k ? 'border-teal bg-teal text-cream' : 'border-ink/15 bg-white hover:border-teal'}`}>{l}</button>)}
      </div>
      <div className="mt-4" aria-live="polite">{shown.length ? <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{shown.map((p) => <li key={p.id} className="relative flex"><div className="flex w-full"><ProductCard p={p} /></div></li>)}</ul> : <EmptyState title="Nothing to preview" body="Listings will appear here once suppliers publish them." />}</div>
      <p className="mt-4"><Link className="font-bold text-teal underline underline-offset-4" href={c ? `/marketplace?category=${c}` : '/marketplace'}>Browse {c ? CATEGORY_LABEL[c] : 'all'} in the marketplace →</Link></p>
    </div>
  );
}
