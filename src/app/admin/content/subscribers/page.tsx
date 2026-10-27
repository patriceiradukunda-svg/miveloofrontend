import { PageHeader } from '@/components/layout/PageHeader';
import { content, qs, safe, type Subscriber } from '@/lib/server/content-admin';
import { deleteSubscriber, setSubscriber } from '../actions';
import { Demo, Flash, Hidden, Pager, StatusPill, btn, btnDanger, btnGhost, card, day, field, td, th } from '../_ui';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Newsletter subscribers' };
const LIMIT = 50;
export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.p) || 1); const back = '/admin/content/subscribers';
  const { data, error } = await safe(content<{ total: number; items: Subscriber[] }>(`/subscribers${qs({ status: sp.status, q: sp.q, limit: LIMIT, offset: (page - 1) * LIMIT })}`));
  return (
    <div className="space-y-6">
      <PageHeader title="Newsletter subscribers" lead="People who asked for updates. Treat this list as private."><a className={btnGhost} href="/admin/content/export?what=subscribers">Download CSV</a></PageHeader>
      <Flash ok={sp.ok} error={error ?? sp.error} />
      <form method="get" className={`${card} grid gap-3 sm:grid-cols-4`}>
        <input name="q" defaultValue={sp.q} placeholder="Search email" aria-label="Search" className={`${field} sm:col-span-2`} />
        <select name="status" defaultValue={sp.status ?? ''} aria-label="Status" className={field}><option value="">All</option><option value="subscribed">subscribed</option><option value="unsubscribed">unsubscribed</option></select>
        <button className={btn}>Filter</button>
      </form>
      {data && (<>
        <div className="overflow-x-auto rounded-2xl border border-ink/10 bg-white shadow-card"><table className="min-w-full">
          <thead className="bg-cream-deep"><tr><th className={th}>Email</th><th className={th}>Language</th><th className={th}>Status</th><th className={th}>Joined</th><th className={th}><span className="sr-only">Actions</span></th></tr></thead>
          <tbody className="divide-y divide-ink/10">{data.items.map((x) => (
            <tr key={x.id}>
              <td className={td}>{x.email}{x.is_demo && <Demo />}<div className="text-xs text-ink-soft">{x.name ?? ''}</div></td>
              <td className={td}>{x.language}</td><td className={td}><StatusPill status={x.status} /></td><td className={td}>{day(x.created_at)}</td>
              <td className={`${td} flex gap-2`}>
                <form action={setSubscriber}><Hidden values={{ id: x.id, back, status: x.status === 'subscribed' ? 'unsubscribed' : 'subscribed' }} /><button className={btnGhost}>{x.status === 'subscribed' ? 'Unsubscribe' : 'Resubscribe'}</button></form>
                <form action={deleteSubscriber}><Hidden values={{ id: x.id, back }} /><button className={btnDanger}>Delete</button></form>
              </td>
            </tr>))}
            {!data.items.length && <tr><td className={td} colSpan={5}>No subscribers yet.</td></tr>}</tbody></table></div>
        <Pager base={back} sp={sp} page={page} total={data.total} limit={LIMIT} />
      </>)}
    </div>
  );
}
