'use client';
import { useMemo, useState } from 'react';
import { Badge, EmptyState, toneFor } from './Kit';
import { formatCell, type Col, type Filter, type Row } from './types';
import { cn } from '@/lib/utils';

const PAGE = 10;
const field = 'min-h-11 rounded-xl border border-ink/15 bg-white px-3 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal';

export function DataTable({ cols, rows, filters, empty, name }: { cols: Col[]; rows: Row[]; filters: Filter[]; empty: [string, string]; name: string }) {
  const [q, setQ] = useState('');
  const [f, setF] = useState<Record<string, string>>({});
  const [sort, setSort] = useState<{ k: string; d: 1 | -1 } | null>(null);
  const [page, setPage] = useState(0);

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    let r = rows.filter((row) =>
      (!needle || cols.some((c) => String(row[c.key] ?? '').toLowerCase().includes(needle))) &&
      filters.every((x) => !f[x.key] || String(row[x.key]) === f[x.key]));
    if (sort) {
      r = [...r].sort((a, b) => {
        const x = a[sort.k] ?? '', y = b[sort.k] ?? '';
        return (typeof x === 'number' && typeof y === 'number' ? x - y : String(x).localeCompare(String(y))) * sort.d;
      });
    }
    return r;
  }, [rows, q, f, sort, cols, filters]);

  const pages = Math.max(1, Math.ceil(shown.length / PAGE));
  const p = Math.min(page, pages - 1);
  const slice = shown.slice(p * PAGE, (p + 1) * PAGE);
  const noData = rows.length === 0;
  const cell = (r: Row, c: Col) => (c.kind === 'status' && r[c.key] ? <Badge tone={toneFor(String(r[c.key]))}>{String(r[c.key])}</Badge> : formatCell(r[c.key], c.kind));
  const clear = () => { setQ(''); setF({}); setPage(0); };

  function exportCsv() {
    const esc = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const csv = [cols.map((c) => esc(c.label)).join(','), ...shown.map((r) => cols.map((c) => esc(r[c.key])).join(','))].join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = `${name}.csv`; a.click(); URL.revokeObjectURL(a.href);
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <label className="min-w-0 flex-1 basis-48"><span className="sr-only">Search</span>
          <input type="search" value={q} disabled={noData} onChange={(e) => { setQ(e.target.value); setPage(0); }} placeholder="Search" className={cn(field, 'w-full disabled:opacity-50')} />
        </label>
        {filters.map((x) => (
          <label key={x.key}><span className="sr-only">{x.label}</span>
            <select value={f[x.key] ?? ''} disabled={noData} onChange={(e) => { setF({ ...f, [x.key]: e.target.value }); setPage(0); }} className={cn(field, 'disabled:opacity-50')}>
              <option value="">{x.label}: all</option>
              {x.options.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </label>
        ))}
        <button type="button" onClick={exportCsv} disabled={shown.length === 0} className={cn(field, 'font-bold hover:bg-cream-deep disabled:opacity-50')}>Export CSV</button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-sm">
        <div className="hidden overflow-x-auto md:block">
          <table className="min-w-full text-sm">
            <caption className="sr-only">{name}</caption>
            <thead className="bg-cream-deep text-left text-xs uppercase tracking-wide text-ink/70">
              <tr>{cols.map((c) => (
                <th key={c.key} scope="col" aria-sort={sort?.k === c.key ? (sort.d === 1 ? 'ascending' : 'descending') : 'none'} className={cn('px-4 py-3 font-bold', (c.kind === 'money' || c.kind === 'qty') && 'text-right')}>
                  <button type="button" onClick={() => setSort(sort?.k === c.key ? { k: c.key, d: sort.d === 1 ? -1 : 1 } : { k: c.key, d: 1 })} className="inline-flex min-h-8 items-center gap-1 uppercase focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal">
                    {c.label}<span aria-hidden="true" className="text-ink/40">{sort?.k === c.key ? (sort.d === 1 ? '▲' : '▼') : '↕'}</span>
                  </button>
                </th>))}
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10">
              {slice.map((r, i) => (
                <tr key={i} className="hover:bg-cream/60">
                  {cols.map((c, j) => <td key={c.key} className={cn('px-4 py-3', j === 0 && 'font-semibold', (c.kind === 'money' || c.kind === 'qty') && 'text-right tabular-nums')}>{cell(r, c)}</td>)}
                </tr>))}
            </tbody>
          </table>
        </div>
        <ul className="divide-y divide-ink/10 md:hidden">
          {slice.map((r, i) => (
            <li key={i} className="space-y-1.5 p-4">
              <p className="font-bold">{cell(r, cols[0]!)}</p>
              <dl className="grid grid-cols-2 gap-x-3 gap-y-1 text-sm">
                {cols.slice(1).map((c) => (<div key={c.key} className="min-w-0"><dt className="text-xs text-ink/60">{c.label}</dt><dd className="truncate">{cell(r, c)}</dd></div>))}
              </dl>
            </li>))}
        </ul>
        {shown.length === 0 ? (
          <div className="p-4">
            <EmptyState title={noData ? empty[0] : 'No matches'} hint={noData ? empty[1] : 'Nothing fits the current search and filters.'}>
              {!noData ? <button type="button" onClick={clear} className={cn(field, 'mt-4 font-bold hover:bg-cream-deep')}>Clear filters</button> : null}
            </EmptyState>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-3 border-t border-ink/10 px-4 py-3 text-sm">
            <p className="text-ink/70">Showing {p * PAGE + 1}–{Math.min((p + 1) * PAGE, shown.length)} of {shown.length}</p>
            <div className="flex gap-2">
              <button type="button" disabled={p === 0} onClick={() => setPage(p - 1)} className={cn(field, 'font-bold disabled:opacity-40')}>Previous</button>
              <button type="button" disabled={p >= pages - 1} onClick={() => setPage(p + 1)} className={cn(field, 'font-bold disabled:opacity-40')}>Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
