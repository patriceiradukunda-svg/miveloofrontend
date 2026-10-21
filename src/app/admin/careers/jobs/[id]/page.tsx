import Link from 'next/link';
import { PageHeader } from '@/components/layout/PageHeader';
import { careers, safe, type Job } from '@/lib/server/careers-admin';
import { deleteJob, jobAction } from '../../actions';
import { JobForm } from '../../_job-form';
import { Demo, Flash, Section, StatusPill, btn, btnDanger, btnGhost, btnGold, day, when } from '../../_ui';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Edit job' };
const ALLOWED: Record<string, string[]> = { draft: ['publish', 'archive'], published: ['unpublish', 'close', 'archive'], unpublished: ['publish', 'close', 'archive'], closed: ['reopen', 'archive'], archived: ['restore'] };

export default async function Page({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<Record<string, string | undefined>> }) {
  const { id } = await params; const sp = await searchParams;
  const { data: job, error } = await safe(careers<Job>(`/jobs/${id}`));
  if (!job) return <div className="space-y-6"><PageHeader title="Job" /><Flash error={error} /></div>;
  const back = `/admin/careers/jobs/${job.id}`;
  const Act = ({ action, label, cls }: { action: string; label: string; cls: string }) => (
    <form action={jobAction}><input type="hidden" name="id" value={job.id} /><input type="hidden" name="action" value={action} /><input type="hidden" name="back" value={back} /><button className={cls}>{label}</button></form>);
  return (
    <div className="space-y-6">
      <PageHeader title={job.title}><p className="flex flex-wrap items-center gap-3 text-sm"><StatusPill status={job.status} />{job.is_demo && <Demo />}<span className="text-ink-soft">/careers/{job.slug} · version {job.version} · updated {when(job.updated_at)}</span></p></PageHeader>
      <Flash ok={sp.ok} error={sp.error} />
      <Section title="Publishing">
        <div className="flex flex-wrap gap-2">
          {(ALLOWED[job.status] ?? []).map((a) => <Act key={a} action={a} label={a[0]!.toUpperCase() + a.slice(1)} cls={a === 'publish' || a === 'reopen' ? btnGold : btnGhost} />)}
          <Act action="duplicate" label="Duplicate" cls={btnGhost} />
          <Link className={btnGhost} href={`/admin/careers/applications?job_id=${job.id}`}>Applicants ({job.applications.total}{job.applications.new ? `, ${job.applications.new} new` : ''})</Link>
        </div>
        {job.publish_problems.length > 0 && <div className="mt-3 rounded-xl bg-cream-deep p-3 text-sm"><p className="font-semibold text-teal-dark">Before this can be published:</p><ul className="mt-1 list-disc pl-5">{job.publish_problems.map((p) => <li key={p}>{p}</li>)}</ul></div>}
        {job.status === 'published' && <p className="mt-3 text-sm text-ink-soft">Live since {when(job.published_at)}{job.closes_on ? `, closes ${day(job.closes_on)}` : ''}. Editing a live job changes the public page immediately.</p>}
      </Section>
      <JobForm job={job} />
      <Section title="Preview of the saved version">
        <article className="space-y-3 text-sm">
          <h3 className="text-xl font-semibold text-teal-dark">{job.title}</h3>
          <p className="text-ink-soft">{[job.team, job.type, job.work_mode, job.location].filter(Boolean).join(' · ')}</p>
          <p>{job.summary}</p>
          {([['About the role', job.about], ['Responsibilities', job.responsibilities], ['Requirements', job.requirements], ['Nice to have', job.nice_to_have], ['Benefits', job.benefits]] as const).map(([t, a]) => a?.length ? (
            <div key={t}><h4 className="font-semibold text-teal-dark">{t}</h4><ul className="list-disc pl-5">{a.map((x) => <li key={x}>{x}</li>)}</ul></div>) : null)}
        </article>
      </Section>
      {(job.status === 'draft' || job.status === 'archived') && (
        <Section title="Delete">
          {job.applications.total > 0 ? <p className="text-sm text-ink-soft">This job has applications, so it can only be archived.</p> : (
            <form action={deleteJob} className="flex flex-wrap items-center gap-3"><input type="hidden" name="id" value={job.id} /><input type="hidden" name="back" value={back} />
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="confirm" required /> I understand this cannot be undone</label><button className={btnDanger}>Delete job</button></form>)}
        </Section>)}
      <p><Link className={btn} href="/admin/careers/jobs">Back to jobs</Link></p>
    </div>
  );
}
