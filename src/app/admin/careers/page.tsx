import Link from 'next/link';
import { PageHeader } from '@/components/layout/PageHeader';
import { careers, safe, APP_STATUSES, JOB_STATUSES, type Dashboard } from '@/lib/server/careers-admin';
import { Flash, Section, StatusPill, card, day, when } from './_ui';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Careers' };

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const { data: d, error } = await safe(careers<Dashboard>('/dashboard'));
  const max = Math.max(1, ...(d?.weekly_applications.map((w) => w.count) ?? [1]));
  return (
    <div className="space-y-8">
      <PageHeader title="Careers" lead="Postings, applicants, replies and activity in one place." />
      <Flash ok={sp.ok} error={error ?? sp.error} />
      {d && (<>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {([['New this week', d.new_last_7_days], ['New and waiting over 3 days', d.new_waiting_over_3_days], ['Total applications', d.applications_total], ['Average days to hire', d.avg_days_to_hire ?? '—']] as const).map(([l, v]) => (
            <li key={l} className={card}><p className="text-sm text-ink-soft">{l}</p><p className="mt-1 text-3xl font-semibold text-teal-dark">{v}</p></li>
          ))}
        </ul>
        <div className="grid gap-6 lg:grid-cols-2">
          <Section title="Jobs by status">
            <ul className="space-y-2">{JOB_STATUSES.map((s) => (
              <li key={s} className="flex items-center justify-between"><Link className="underline" href={`/admin/careers/jobs?status=${s}`}><StatusPill status={s} /></Link><span className="font-semibold">{d.jobs_by_status[s] ?? 0}</span></li>))}</ul>
          </Section>
          <Section title="Applications by stage">
            <ul className="space-y-2">{APP_STATUSES.map((s) => (
              <li key={s} className="flex items-center justify-between"><Link href={`/admin/careers/applications?status=${s}`}><StatusPill status={s} /></Link><span className="font-semibold">{d.applications_by_status[s] ?? 0}</span></li>))}</ul>
          </Section>
        </div>
        <Section title="Needs attention">
          {!d.closing_within_7_days.length && !d.published_but_expired.length && !d.published_without_applicants.length ? <p className="text-sm text-ink-soft">Nothing needs attention.</p> : (
            <ul className="space-y-2 text-sm">
              {d.published_but_expired.map((j) => <li key={`e${j.id}`}>⚠ <Link className="underline" href={`/admin/careers/jobs/${j.id}`}>{j.title}</Link> is published but its closing date ({day(j.closes_on)}) has passed.</li>)}
              {d.closing_within_7_days.map((j) => <li key={`c${j.id}`}>⏰ <Link className="underline" href={`/admin/careers/jobs/${j.id}`}>{j.title}</Link> closes {day(j.closes_on)}.</li>)}
              {d.published_without_applicants.map((j) => <li key={`n${j.id}`}>○ <Link className="underline" href={`/admin/careers/jobs/${j.id}`}>{j.title}</Link> is live with no applicants yet.</li>)}
            </ul>)}
        </Section>
        <div className="grid gap-6 lg:grid-cols-2">
          <Section title="Applications per week (last 8 weeks)">
            {d.weekly_applications.length ? <ul className="space-y-2">{d.weekly_applications.map((w) => (
              <li key={w.week} className="flex items-center gap-3 text-sm"><span className="w-24 shrink-0 text-ink-soft">{day(w.week)}</span>
                <span className="h-3 rounded-full bg-teal" style={{ width: `${(w.count / max) * 100}%`, minWidth: 6 }} /><span>{w.count}</span></li>))}</ul> : <p className="text-sm text-ink-soft">No applications yet.</p>}
          </Section>
          <Section title="Jobs with the most applicants">
            <ol className="space-y-2 text-sm">{d.top_jobs.map((j) => (
              <li key={j.id} className="flex items-center justify-between gap-3"><Link className="underline" href={`/admin/careers/jobs/${j.id}`}>{j.title}</Link><span><StatusPill status={j.status} /> <b className="ml-2">{j.applications}</b></span></li>))}</ol>
          </Section>
        </div>
        <Section title="Recent activity">
          <ul className="divide-y divide-ink/10 text-sm">{d.recent_activity.map((a, i) => (
            <li key={i} className="flex flex-wrap justify-between gap-2 py-2"><span><b>{a.action}</b> <span className="text-ink-soft">{a.entity_type}</span></span><span className="text-ink-soft">{when(a.created_at)}</span></li>))}</ul>
          <p className="mt-3"><Link className="underline" href="/admin/careers/activity">Open the full activity log</Link></p>
        </Section>
      </>)}
    </div>
  );
}
