import Link from 'next/link';
import { PageHeader } from '@/components/layout/PageHeader';
import { content, qs, safe, EVENT_STATUSES, type AdminEvent } from '@/lib/server/content-admin';
import { Demo, Flash, Pager, StatusPill, btn, btnGhost, btnGold, card, field, td, th, when } from '@/app/admin/content/_ui';

const LIMIT = 25;
export async function EventsAdmin({ sp }: { sp: Record<string, string | undefined> }) {
  const page = Math.max(1, Number(sp.p) || 1);
  const base = '/admin/content/events';
  const { data, error } = await safe(content<{ items: AdminEvent[]; total: number; counts: Record<string, number> }>(`/events${qs({ status: sp.status, q: sp.q, when: sp.when, limit: LIMIT, offset: (page - 1) * LIMIT })}`));
  return (
    <div className="space-y-6">
      <PageHeader title="Events" lead="Create events, open registration, and manage who is coming."><Link href={`${base}/new`} className={btnGold}>+ New event</Link></PageHeader>
      <Flash ok={sp.ok} error={error ?? sp.error} />
      {data && (<>
        <ul className="flex flex-wrap gap-2">{EVENT_STATUSES.map((s) => <li key={s}><Link href={`${base}?status=${s}`} className={btnGhost}>{s} · {data.counts[s] ?? 0}</Link></li>)}</ul>
        <form method="get" className={`${card} grid gap-3 sm:grid-cols-5`}>
          <input name="q" defaultValue={sp.q} placeholder="Search title" aria-label="Search" className={`${field} sm:col-span-2`} />
          <select name="status" defaultValue={sp.status ?? ''} aria-label="Status" className={field}><option value="">All statuses</option>{EVENT_STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
          <select name="when" defaultValue={sp.when ?? 'all'} aria-label="When" className={field}><option value="all">All dates</option><option value="upcoming">Upcoming</option><option value="past">Past</option></select>
          <div className="flex gap-2"><button className={btn}>Filter</button><Link href={base} className={btnGhost}>Reset</Link></div>
        </form>
        <div className="overflow-x-auto rounded-2xl border border-ink/10 bg-white shadow-card">
          <table className="min-w-full">
            <thead className="bg-cream-deep"><tr><th className={th}>Event</th><th className={th}>Status</th><th className={th}>When</th><th className={th}>Category</th></tr></thead>
            <tbody className="divide-y divide-ink/10">
              {data.items.map((e) => (
                <tr key={e.id}>
                  <td className={td}><Link href={`${base}/${e.id}`} className="font-semibold text-teal-dark underline">{e.title}</Link>{e.is_demo && <Demo />}<div className="text-xs text-ink-soft">/{e.slug}</div></td>
                  <td className={td}><StatusPill status={e.status} /></td>
                  <td className={td}>{e.starts_at ? when(e.starts_at) : e.date_note ?? '—'}</td>
                  <td className={td}>{e.category?.name ?? '—'}</td>
                </tr>
              ))}
              {!data.items.length && <tr><td className={td} colSpan={4}>Nothing here yet.</td></tr>}
            </tbody>
          </table>
        </div>
        <Pager base={base} sp={sp} page={page} total={data.total} limit={LIMIT} />
      </>)}
    </div>
  );
}
