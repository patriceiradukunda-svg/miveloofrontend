import Link from 'next/link';
import { PageHeader } from '@/components/layout/PageHeader';
import { content, qs, safe, POST_STATUSES, type AdminPost } from '@/lib/server/content-admin';
import { Demo, Flash, Pager, StatusPill, btn, btnGhost, btnGold, card, field, td, th, when } from '@/app/admin/content/_ui';

const LIMIT = 25;
export async function PostsAdmin({ kind, sp }: { kind: 'blog' | 'news'; sp: Record<string, string | undefined> }) {
  const page = Math.max(1, Number(sp.p) || 1);
  const base = `/admin/content/${kind}`;
  const { data, error } = await safe(content<{ items: AdminPost[]; total: number; counts: Record<string, number> }>(`/posts${qs({ kind, status: sp.status, q: sp.q, limit: LIMIT, offset: (page - 1) * LIMIT })}`));
  return (
    <div className="space-y-6">
      <PageHeader title={kind === 'blog' ? 'Blog' : 'News'} lead="Write, schedule and publish. Nothing is public until you publish it."><Link href={`${base}/new`} className={btnGold}>+ New</Link></PageHeader>
      <Flash ok={sp.ok} error={error ?? sp.error} />
      {data && (<>
        <ul className="flex flex-wrap gap-2">{POST_STATUSES.map((s) => <li key={s}><Link href={`${base}?status=${s}`} className={btnGhost}>{s} · {data.counts[s] ?? 0}</Link></li>)}</ul>
        <form method="get" className={`${card} grid gap-3 sm:grid-cols-4`}>
          <input name="q" defaultValue={sp.q} placeholder="Search title" aria-label="Search" className={`${field} sm:col-span-2`} />
          <select name="status" defaultValue={sp.status ?? ''} aria-label="Status" className={field}><option value="">All statuses</option>{POST_STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
          <div className="flex gap-2"><button className={btn}>Filter</button><Link href={base} className={btnGhost}>Reset</Link></div>
        </form>
        <div className="overflow-x-auto rounded-2xl border border-ink/10 bg-white shadow-card">
          <table className="min-w-full">
            <thead className="bg-cream-deep"><tr><th className={th}>Title</th><th className={th}>Status</th><th className={th}>Category</th><th className={th}>Updated</th></tr></thead>
            <tbody className="divide-y divide-ink/10">
              {data.items.map((p) => (
                <tr key={p.id}>
                  <td className={td}><Link href={`${base}/${p.id}`} className="font-semibold text-teal-dark underline">{p.title}</Link>{p.is_demo && <Demo />}<div className="text-xs text-ink-soft">/{p.slug}</div></td>
                  <td className={td}><StatusPill status={p.status} /></td>
                  <td className={td}>{p.category?.name ?? '—'}</td>
                  <td className={td}>{when(p.updated_at)}</td>
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
