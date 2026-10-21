import Link from 'next/link';
import { PageHeader } from '@/components/layout/PageHeader';
import { careers, safe, qs, JOB_STATUSES, JOB_TYPES, type Job } from '@/lib/server/careers-admin';
import { bulkJobs } from '../actions';
import { Demo, Flash, Pager, StatusPill, btn, btnGhost, btnGold, card, day, field, td, th, when } from '../_ui';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Jobs' };
const LIMIT = 25;

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.p) || 1);
  const { data, error } = await safe(careers<{ total: number; items: Job[] }>(`/jobs${qs({ status: sp.status, q: sp.q, type: sp.type, sort: sp.sort, limit: LIMIT, offset: (page - 1) * LIMIT })}`));
  return (
    <div className="space-y-6">
      <PageHeader title="Jobs" lead="Create drafts, publish and unpublish roles, and see applicants per role."><Link href="/admin/careers/jobs/new" className={btnGold}>+ New job</Link></PageHeader>
      <Flash ok={sp.ok} error={error ?? sp.error} />
      <form method="get" className={`${card} grid gap-3 sm:grid-cols-5`}>
        <input name="q" defaultValue={sp.q} placeholder="Search title or address" aria-label="Search" className={`${field} sm:col-span-2`} />
        <select name="status" defaultValue={sp.status ?? ''} aria-label="Status" className={field}><option value="">All statuses</option>{JOB_STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
        <select name="type" defaultValue={sp.type ?? ''} aria-label="Type" className={field}><option value="">All types</option>{JOB_TYPES.map((s) => <option key={s}>{s}</option>)}</select>
        <select name="sort" defaultValue={sp.sort ?? 'updated'} aria-label="Sort" className={field}>{[['updated', 'Recently updated'], ['created', 'Newest'], ['closing', 'Closing soon'], ['title', 'Title']].map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
        <div className="flex gap-2 sm:col-span-5"><button className={btn}>Apply filters</button><Link href="/admin/careers/jobs" className={btnGhost}>Reset</Link></div>
      </form>
      {data && (
        <form action={bulkJobs} className="space-y-3">
          <input type="hidden" name="back" value="/admin/careers/jobs" />
          <div className="flex flex-wrap items-center gap-2">
            <select name="action" aria-label="Bulk action" className={`${field} max-w-48`}>{['publish', 'unpublish', 'close', 'reopen', 'archive', 'restore'].map((a) => <option key={a}>{a}</option>)}</select>
            <button className={btnGhost}>Apply to selected</button>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-ink/10 bg-white shadow-card">
            <table className="min-w-full">
              <thead className="bg-cream-deep"><tr><th className={th}><span className="sr-only">Select</span></th><th className={th}>Role</th><th className={th}>Status</th><th className={th}>Team / type</th><th className={th}>Closes</th><th className={th}>Applicants</th><th className={th}>Updated</th></tr></thead>
              <tbody className="divide-y divide-ink/10">
                {data.items.map((j) => (
                  <tr key={j.id}>
                    <td className={td}><input type="checkbox" name="ids" value={j.id} aria-label={`Select ${j.title}`} /></td>
                    <td className={td}><Link href={`/admin/careers/jobs/${j.id}`} className="font-semibold text-teal-dark underline">{j.title}</Link>{j.is_demo && <Demo />}<div className="text-xs text-ink-soft">/careers/{j.slug}</div></td>
                    <td className={td}><StatusPill status={j.status} /></td>
                    <td className={td}>{j.team ?? '—'}<div className="text-xs text-ink-soft">{j.type} · {j.work_mode}</div></td>
                    <td className={td}>{day(j.closes_on)}</td>
                    <td className={td}><Link className="underline" href={`/admin/careers/applications?job_id=${j.id}`}>{j.applications.total}</Link>{j.applications.new > 0 && <span className="ml-2 text-xs text-teal-dark">{j.applications.new} new</span>}</td>
                    <td className={td}>{when(j.updated_at)}</td>
                  </tr>))}
                {!data.items.length && <tr><td className={td} colSpan={7}>No jobs match.</td></tr>}
              </tbody>
            </table>
          </div>
          <Pager base="/admin/careers/jobs" sp={sp} page={page} total={data.total} limit={LIMIT} />
        </form>)}
    </div>
  );
}
