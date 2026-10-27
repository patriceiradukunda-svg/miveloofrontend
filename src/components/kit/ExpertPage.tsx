import Link from 'next/link';
import { specs } from '@/config/page-specs';
import { loadRows } from '@/lib/page-data';
import { StatCard } from './Kit';
import { DataTable } from './DataTable';
import { Pipeline } from './Pipeline';
import type { Row } from './types';
import { cn } from '@/lib/utils';

function kpiValue(rows: Row[], rule: string): string {
  if (rule.startsWith('sum:') || rule.startsWith('money:')) {
    const key = rule.slice(rule.indexOf(':') + 1);
    const total = rows.reduce((s, r) => s + (Number(r[key]) || 0), 0).toLocaleString('en-GB');
    return rule.startsWith('money:') ? `${total} RWF` : total;
  }
  if (rule.includes('=')) {
    const [k, v] = rule.split('=');
    const set = (v ?? '').split('|');
    return String(rows.filter((r) => set.includes(String(r[k ?? '']))).length);
  }
  return String(rows.length);
}
const URGENT = /Low|Out of|Expir|Late|Overdue|Failed|Rejected|Critical|Denied|Urgent|Spoil|Over$|Disputed|No-show|Suspended|Variance|Rejected/;

export async function ExpertPage({ id }: { id: string }) {
  const s = specs[id];
  if (!s) throw new Error(`No page spec for ${id}`);
  const rows = await loadRows(id);
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wider text-teal">{s.who}</p>
          <h1 className="mt-1 text-2xl font-extrabold sm:text-3xl">{s.title}</h1>
          <p className="mt-1 max-w-2xl text-sm text-ink/70 sm:text-base">{s.goal}</p>
        </div>
        {s.actions?.length ? (
          <div className="flex flex-wrap gap-2">
            {s.actions.map((a, i) => (
              <Link key={a.href} href={a.href} className={cn('inline-flex min-h-11 items-center rounded-xl px-4 text-sm font-bold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal', i === 0 ? 'bg-teal text-cream hover:opacity-90' : 'border border-ink/15 bg-white hover:bg-cream-deep')}>{a.label}</Link>
            ))}
          </div>
        ) : null}
      </header>

      <section aria-label="Key figures" className={cn('grid grid-cols-2 gap-3', s.kpis.length === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4')}>
        {s.kpis.map((k) => { const v = kpiValue(rows, k.rule); return <StatCard key={k.label} label={k.label} value={v} hint={k.hint} alert={URGENT.test(k.rule) && v !== '0' && !v.startsWith('0 ')} />; })}
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_19rem]">
        <section aria-label={s.title} className="min-w-0">
          {s.view.t === 'table'
            ? <DataTable cols={s.view.cols} filters={s.view.filters} empty={s.view.empty} rows={rows} name={s.title} />
            : <Pipeline stages={s.view.stages} rows={rows} />}
        </section>
        <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start" aria-label="Guidance">
          <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm">
            <h2 className="text-sm font-extrabold">How a {s.who.split(' and ')[0]!.toLowerCase()} works here</h2>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-ink/80">{s.routine.map((r) => <li key={r}>{r}</li>)}</ol>
          </div>
          <div className="rounded-2xl border border-ink/10 bg-cream-deep/60 p-4">
            <h2 className="text-sm font-extrabold">Good practice</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-ink/80">{s.tips.map((t) => <li key={t}>{t}</li>)}</ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
