'use client';
import { useMemo, useState } from 'react';
import { EventCard } from './EventCard';
import type { LEvent } from './shared';

const chip = (on: boolean) => `min-h-11 rounded-full border px-4 text-sm font-semibold transition ${on ? 'border-teal bg-teal text-cream' : 'border-ink/15 bg-white text-teal-dark hover:bg-cream-deep'}`;
const t = (e: LEvent) => (e.starts_at ? new Date(e.starts_at).getTime() : Number.MAX_SAFE_INTEGER);

export function EventsBrowser({ items, hideId }: { items: LEvent[]; hideId?: string }) {
  const upcoming = useMemo(() => items.filter((e) => !e.is_past).sort((a, b) => t(a) - t(b)), [items]);
  const past = useMemo(() => items.filter((e) => e.is_past).sort((a, b) => t(b) - t(a)), [items]);
  const [tab, setTab] = useState<'upcoming' | 'past'>(upcoming.length || !past.length ? 'upcoming' : 'past');
  const [q, setQ] = useState(''); const [cat, setCat] = useState('all');
  const pool = tab === 'upcoming' ? upcoming : past;
  const cats = useMemo(() => { const m = new Map<string, string>(); items.forEach((e) => { if (e.category) m.set(e.category.slug, e.category.name); }); return [...m.entries()]; }, [items]);
  const n = q.trim().toLowerCase(); const filtering = !!n || cat !== 'all';
  const shown = pool.filter((e) => (filtering || tab === 'past' || e.id !== hideId) && (cat === 'all' || e.category?.slug === cat)
    && (!n || [e.title, e.summary ?? '', e.city ?? '', e.venue ?? '', e.category?.name ?? ''].join(' ').toLowerCase().includes(n)));
  if (!items.length) return null;
  return (
    <section className="mt-20" aria-labelledby="ev-h">
      <div className="max-w-3xl"><h2 id="ev-h" className="font-display text-3xl font-semibold text-teal-dark md:text-4xl">Explore events</h2><p className="mt-2 text-ink-soft">Find opportunities to learn, connect and collaborate.</p></div>
      <div role="tablist" aria-label="Upcoming or past events" className="mt-6 inline-flex rounded-full border border-ink/15 bg-white p-1">
        {([['upcoming', `Upcoming (${upcoming.length})`], ['past', `Past (${past.length})`]] as const).map(([k, l]) => (
          <button key={k} role="tab" type="button" aria-selected={tab === k} onClick={() => setTab(k)} className={`min-h-11 rounded-full px-5 text-sm font-bold ${tab === k ? 'bg-teal text-cream' : 'text-teal-dark'}`}>{l}</button>))}
      </div>
      <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-2">
          <button type="button" aria-pressed={cat === 'all'} className={chip(cat === 'all')} onClick={() => setCat('all')}>All</button>
          {cats.map(([slug, name]) => <button key={slug} type="button" aria-pressed={cat === slug} className={chip(cat === slug)} onClick={() => setCat(slug)}>{name}</button>)}
        </div>
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search events" placeholder="Search events, topics, places…" className="min-h-11 w-full rounded-full border border-ink/20 bg-white px-5 text-base text-ink md:w-80" />
      </div>
      <p aria-live="polite" className="mt-4 text-sm text-ink-soft">{filtering ? `${shown.length} ${shown.length === 1 ? 'result' : 'results'}` : ''}</p>
      {shown.length ? (
        <ul className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{shown.map((e) => <li key={e.id}><EventCard ev={e} href={`/events/${e.slug}`} /></li>)}</ul>
      ) : (
        <div className="mt-6 rounded-2xl border border-ink/10 bg-white p-8 text-center"><p className="font-semibold text-teal-dark">{filtering ? 'No events match your search.' : tab === 'upcoming' ? 'No upcoming events right now.' : 'No past events yet.'}</p>
          {filtering && <button type="button" className="mt-3 font-bold text-teal underline" onClick={() => { setQ(''); setCat('all'); }}>Clear filters</button>}</div>
      )}
    </section>
  );
}
