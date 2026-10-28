import Link from 'next/link';
import { PageHeader } from '@/components/layout/PageHeader';
import { EmptyState } from '@/components/ui/empty-state';
import { careers, safe, qs, type AppRow, type Dashboard, type Job } from '@/lib/server/careers-admin';
import { Demo, Flash, StatusPill, btnGhost, card, field, stars } from '../_ui';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Hiring pipeline' };

const STAGES = ['new', 'screening', 'shortlisted', 'interview', 'assessment', 'offer', 'hired'] as const;
const CLOSED = ['rejected', 'withdrawn'] as const;
const PER_COLUMN = 20;
const DAY = 86_400_000;
const daysSince = (iso: string) => Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / DAY));
const ago = (iso: string) => { const d = daysSince(iso); return d === 0 ? 'today' : d === 1 ? '1 day ago' : `${d} days ago`; };

function CandidateCard({ a }: { a: AppRow }) {
  const days = daysSince(a.last_activity_at);
  const late = a.status === 'new' && days > 3;
  return (
    <li>
      <Link href={`/admin/careers/applications/${a.id}`} className="block rounded-xl border border-ink/10 bg-white p-3 shadow-card transition hover:border-teal focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal">
        <div className="flex items-start justify-between gap-2">
          <p className="font-semibold text-teal-dark">{a.full_name}{a.starred && <span role="img" aria-label="Starred" className="ml-1 text-gold-dark">★</span>}</p>
          {a.is_demo && <Demo />}
        </div>
        <p className="mt-0.5 text-sm text-ink-soft">{a.job_title}</p>
        {a.rating ? <p className="mt-1 text-sm text-gold-dark" aria-label={`Rated ${a.rating} out of 5`}>{stars(a.rating)}</p> : null}
        {a.tags.length ? <p className="mt-2 flex flex-wrap gap-1">{a.tags.slice(0, 3).map((t) => <span key={t} className="rounded bg-cream-deep px-1.5 py-0.5 text-[11px] font-semibold text-teal-dark">{t}</span>)}{a.tags.length > 3 && <span className="text-[11px] text-ink-soft">+{a.tags.length - 3}</span>}</p> : null}
        <p className={`mt-2 text-xs ${late ? 'font-semibold text-red-700' : 'text-ink-soft'}`}>{late ? `Waiting ${days} days` : `Active ${ago(a.last_activity_at)}`} · {a.reference}</p>
      </Link>
    </li>
  );
}

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const jobId = sp.job_id || undefined;
  // The dashboard call goes first on its own: it renews an expired session before the parallel calls below.
  const dash = await safe(careers<Dashboard>('/dashboard'));
  const statuses = [...STAGES, ...CLOSED];
  const [jobsRes, stageRes] = await Promise.all([
    safe(careers<{ items: Job[] }>(`/jobs${qs({ limit: 50, sort: 'title' })}`)),
    Promise.all(statuses.map((s) => safe(careers<{ total: number; items: AppRow[] }>(`/applications${qs({ status: s, job_id: jobId, limit: (CLOSED as readonly string[]).includes(s) ? 1 : PER_COLUMN })}`)))),
  ]);
  const error = dash.error ?? stageRes.find((r) => r.error)?.error ?? null;
  const cols = STAGES.map((s, i) => ({ status: s, total: stageRes[i]?.data?.total ?? 0, items: stageRes[i]?.data?.items ?? [] }));
  const closed = CLOSED.map((s, k) => ({ status: s, total: stageRes[STAGES.length + k]?.data?.total ?? 0 }));
  const jobs = jobsRes.data?.items ?? [];
  const inPipeline = cols.filter((c) => c.status !== 'hired').reduce((n, c) => n + c.total, 0);
  const hired = cols.find((c) => c.status === 'hired')?.total ?? 0;
  const closedTotal = closed.reduce((n, c) => n + c.total, 0);
  const empty = !error && inPipeline + hired + closedTotal === 0;

  return (
    <div className="space-y-6">
      <PageHeader title="Hiring pipeline" lead="Every applicant by stage. Open a card to review, rate, reply or change their stage." />
      <Flash ok={sp.ok} error={error ?? sp.error} />
      <form method="get" className={`${card} flex flex-wrap items-end gap-3`}>
        <div className="min-w-[14rem] flex-1">
          <label htmlFor="job_id" className="mb-1 block text-sm font-semibold text-teal-dark">Job</label>
          <select id="job_id" name="job_id" defaultValue={jobId ?? ''} className={field}>
            <option value="">All jobs</option>
            {jobs.map((j) => <option key={j.id} value={j.id}>{j.title} ({j.status})</option>)}
          </select>
        </div>
        <button className={btnGhost}>Apply</button>
        {jobId && <Link href="/admin/careers/pipeline" className="pb-2 text-sm underline">Show all jobs</Link>}
      </form>
      <ul className="grid gap-4 sm:grid-cols-3">
        {([['In the pipeline', inPipeline], ['Hired', hired], ['Rejected or withdrawn', closedTotal]] as const).map(([l, v]) => (
          <li key={l} className={card}><p className="text-sm text-ink-soft">{l}</p><p className="mt-1 text-3xl font-semibold text-teal-dark">{v}</p></li>
        ))}
      </ul>
      {empty ? <EmptyState title="No applications yet" body="Applications appear here as soon as candidates apply for a published job." /> : (
        <>
          <div className="overflow-x-auto pb-3" role="region" aria-label="Hiring pipeline board" tabIndex={0}>
            <ol className="flex min-w-max gap-4">
              {cols.map((c) => (
                <li key={c.status} className="w-72 shrink-0 rounded-2xl bg-cream-deep p-3">
                  <div className="mb-3 flex items-center justify-between">
                    <Link href={`/admin/careers/applications${qs({ status: c.status, job_id: jobId })}`}><StatusPill status={c.status} /></Link>
                    <span className="text-sm font-bold text-teal-dark" aria-label={`${c.total} applications`}>{c.total}</span>
                  </div>
                  {c.items.length ? <ul className="space-y-3">{c.items.map((a) => <CandidateCard key={a.id} a={a} />)}</ul> : <p className="px-1 py-6 text-center text-sm text-ink-soft">Nothing here.</p>}
                  {c.total > c.items.length && <p className="mt-3 text-center text-sm"><Link className="underline" href={`/admin/careers/applications${qs({ status: c.status, job_id: jobId })}`}>View all {c.total}</Link></p>}
                </li>
              ))}
            </ol>
          </div>
          <p className="text-sm text-ink-soft">Closed: {closed.map((c, i) => (
            <span key={c.status}>{i > 0 && ' · '}<Link className="underline" href={`/admin/careers/applications${qs({ status: c.status, job_id: jobId })}`}>{c.status} {c.total}</Link></span>
          ))}</p>
        </>
      )}
    </div>
  );
}
