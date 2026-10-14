import { ProductCard } from './ProductCard';
import type { PublicProduct } from '@/types/product';
export function ProductGrid({ items }: { items: PublicProduct[] }) {
  return <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{items.map((p) => <li key={p.id} className="relative flex"><div className="flex w-full"><ProductCard p={p} /></div></li>)}</ul>;
}
