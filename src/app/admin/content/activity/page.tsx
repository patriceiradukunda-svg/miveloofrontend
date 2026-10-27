import { PageHeader } from '@/components/layout/PageHeader';
import { content, qs, safe, type ActivityRow } from '@/lib/server/content-admin';
import { Demo, Flash, Pager, td, th, when } from '../_ui';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Content activity' };
const LIMIT = 50;
export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams; const page = Math.max(1, Number(sp.p) || 1);
  const { data, error } = await safe(content<{ items: ActivityRow[] }>(`/activity${qs({ limit: LIMIT, offset: (page - 1) * LIMIT })}`));
  const rows = data?.items ?? [];
  return (
    <div className="space-y-6">
      <PageHeader title="Content activity" lead="Who changed what, and when." />
      <Flash ok={sp.ok} error={error ?? sp.error} />
      <div className="overflow-x-auto rounded-2xl border border-ink/10 bg-white shadow-card"><table className="min-w-full">
        <thead className="bg-cream-deep"><tr><th className={th}>When</th><th className={th}>Who</th><th className={th}>What</th><th className={th}>On</th></tr></thead>
        <tbody className="divide-y divide-ink/10">{rows.map((a, i) => (
          <tr key={i}><td className={td}>{when(a.created_at)}</td><td className={td}>{a.actor_name ?? 'System'}{a.is_demo && <Demo />}</td><td className={td}>{a.action}</td><td className={td}>{a.entity_type}</td></tr>))}
          {!rows.length && <tr><td className={td} colSpan={4}>No activity yet.</td></tr>}</tbody></table></div>
      <Pager base="/admin/content/activity" sp={sp} page={page} total={rows.length === LIMIT ? page * LIMIT + 1 : (page - 1) * LIMIT + rows.length} limit={LIMIT} />
    </div>
  );
}
