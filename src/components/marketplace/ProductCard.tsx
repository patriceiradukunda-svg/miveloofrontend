import Link from 'next/link';
import { formatRWF } from '@/lib/formatters';
import { CATEGORY_LABEL } from '@/lib/sample-data';
import { SampleBadge, Badge } from '@/components/ui/badge';
import type { PublicProduct } from '@/types/product';

const AV = { 'in-stock': 'In stock', limited: 'Limited stock', seasonal: 'Seasonal' } as const;
/** Public card: NO purchasing controls, by design. Buying lives at /school/marketplace. */
export function ProductCard({ p }: { p: PublicProduct }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-card transition-transform hover:-translate-y-0.5">
      <div aria-hidden className="grid h-36 place-items-center bg-gradient-to-br from-green-tint via-gold-tint to-teal-tint text-6xl">{p.emoji}</div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex flex-wrap gap-2"><Badge>{CATEGORY_LABEL[p.category]}</Badge>{p.isSample && <SampleBadge />}</div>
        <h3 className="text-xl font-semibold"><Link href={`/marketplace/${p.id}`} className="after:absolute after:inset-0 relative hover:underline">{p.name}</Link></h3>
        <p className="text-sm text-ink-soft">{p.district} · {AV[p.availability]}</p>
        <p className="mt-auto pt-2 text-lg font-bold text-teal-dark">
          {p.indicativePriceRWF != null ? <>{formatRWF(p.indicativePriceRWF)} <span className="text-sm font-semibold text-ink-soft">/ {p.unit} · indicative</span></> : <span className="text-sm">Price on request</span>}
        </p>
      </div>
    </article>
  );
}
