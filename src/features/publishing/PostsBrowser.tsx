'use client';
import { useMemo, useState } from 'react';
import { PostCard } from './PostCard';
import type { LPost } from './shared';

const chip = (on: boolean) => `min-h-11 rounded-full border px-4 text-sm font-semibold transition ${on ? 'border-teal bg-teal text-cream' : 'border-ink/15 bg-white text-teal-dark hover:bg-cream-deep'}`;

export function PostsBrowser({ items, basePath, hideId, heading, lead }: { items: LPost[]; basePath: string; hideId?: string; heading: string; lead: string }) {
  const [q, setQ] = useState(''); const [cat, setCat] = useState('all');
  const cats = useMemo(() => { const m = new Map<string, string>(); items.forEach((p) => { if (p.category) m.set(p.category.slug, p.category.name); }); return [...m.entries()]; }, [items]);
  const n = q.trim().toLowerCase(); const filtering = !!n || cat !== 'all';
  const shown = useMemo(() => items.filter((p) => (filtering || p.id !== hideId) && (cat === 'all' || p.category?.slug === cat)
    && (!n || [p.title, p.summary ?? '', p.category?.name ?? '', ...p.tags].join(' ').toLowerCase().includes(n))), [items, n, cat, hideId, filtering]);
  if (!items.some((p) => p.id !== hideId)) return null;
  return (
    <section className="mt-20" aria-labelledby="browse-h">
      <div className="max-w-3xl"><h2 id="browse-h" className="font-display text-3xl font-semibold text-teal-dark md:text-4xl">{heading}</h2><p className="mt-2 text-ink-soft">{lead}</p></div>
      <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-2">
          <button type="button" aria-pressed={cat === 'all'} className={chip(cat === 'all')} onClick={() => setCat('all')}>All</button>
          {cats.map(([slug, name]) => <button key={slug} type="button" aria-pressed={cat === slug} className={chip(cat === slug)} onClick={() => setCat(slug)}>{name}</button>)}
        </div>
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search" placeholder="Search…" className="min-h-11 w-full rounded-full border border-ink/20 bg-white px-5 text-base text-ink md:w-80" />
      </div>
      <p aria-live="polite" className="mt-4 text-sm text-ink-soft">{filtering ? `${shown.length} ${shown.length === 1 ? 'result' : 'results'}` : ''}</p>
      {shown.length ? (
        <ul className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{shown.map((p) => <li key={p.id}><PostCard post={p} href={`${basePath}/${p.slug}`} /></li>)}</ul>
      ) : (
        <div className="mt-6 rounded-2xl border border-ink/10 bg-white p-8 text-center"><p className="font-semibold text-teal-dark">Nothing matches your search.</p>
          <button type="button" className="mt-3 font-bold text-teal underline" onClick={() => { setQ(''); setCat('all'); }}>Clear filters</button></div>
      )}
    </section>
  );
}
