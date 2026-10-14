import Link from 'next/link';
export function Breadcrumbs({ items }: { items: { href?: string; label: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-ink-soft">
      <ol className="flex flex-wrap gap-1.5">{items.map((i, n) => <li key={i.label} className="flex gap-1.5">{n > 0 && <span aria-hidden>/</span>}{i.href ? <Link className="underline" href={i.href}>{i.label}</Link> : <span aria-current="page">{i.label}</span>}</li>)}</ol>
    </nav>
  );
}
