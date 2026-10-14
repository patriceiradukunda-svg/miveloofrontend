import Link from 'next/link';
export function Pagination({ page, total, pageSize, hrefFor }: { page: number; total: number; pageSize: number; hrefFor: (p: number) => string }) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  if (pages <= 1) return null;
  const cls = 'inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-ink/20 px-4 font-bold';
  return (
    <nav aria-label="Pagination" className="mt-8 flex items-center justify-center gap-3">
      {page > 1 ? <Link className={cls} href={hrefFor(page - 1)} rel="prev">Previous</Link> : <span className={cls + ' opacity-40'} aria-disabled>Previous</span>}
      <span aria-current="page" className="text-sm">Page {page} of {pages}</span>
      {page < pages ? <Link className={cls} href={hrefFor(page + 1)} rel="next">Next</Link> : <span className={cls + ' opacity-40'} aria-disabled>Next</span>}
    </nav>
  );
}
