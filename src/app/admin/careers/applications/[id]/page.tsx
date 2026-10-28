import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge, EmptyState, toneFor } from '@/components/kit/Kit';
import { api, ApiError } from '@/lib/miveloo-client';
import { withBackendToken } from '@/lib/server/backend-session';
import { Demo, card, stars } from '../../_ui';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Application' };

type Raw = Record<string, unknown>;
const str = (v: unknown): string => (v === null || v === undefined ? '' : typeof v === 'string' ? v : typeof v === 'number' || typeof v === 'boolean' ? String(v) : '');
const first = (o: Raw, ...keys: string[]): string => { for (const k of keys) { const s = str(o[k]); if (s) return s; } return ''; };
const list = (v: unknown): Raw[] => (Array.isArray(v) ? (v as unknown[]).filter((x): x is Raw => !!x && typeof x === 'object' && !Array.isArray(x)) : []);
const strs = (v: unknown): string[] => (Array.isArray(v) ? (v as unknown[]).map(str).filter(Boolean) : []);
const human = (k: string) => k.replace(/[_-]+/g, ' ').replace(/^./, (c) => c.toUpperCase());
const when = (v: unknown): string => {
  const s = str(v); if (!s) return '';
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? s : d.toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="min-w-0"><dt className="text-xs font-semibold uppercase tracking-wide text-ink/60">{label}</dt><dd className="mt-0.5 break-words text-sm">{children}</dd></div>;
}
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <section aria-label={title} className={`${card} space-y-3`}><h2 className="text-sm font-extrabold">{title}</h2>{children}</section>;
}
const none = <span className="text-ink/40">Not given</span>;

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const path = `/admin/careers/applications/${encodeURIComponent(id)}`;
  let raw: Raw | null = null;
  let error: string | null = null;
  try {
    raw = await withBackendToken((token) => api<Raw>(path, { token, cache: 'no-store' }));
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) notFound();
    error = e instanceof ApiError && e.status === 403 ? 'You do not have access to this application.' : 'This application could not be loaded. Try again in a moment.';
  }
  const back = <Link href="/admin/careers/pipeline" className="inline-flex min-h-11 items-center text-sm font-bold text-teal underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal">Back to the hiring pipeline</Link>;
  if (error || !raw) {
    return <div className="mx-auto max-w-3xl space-y-4">{back}<EmptyState title="Could not open this application" hint={error ?? 'Nothing was returned.'} /></div>;
  }

  const app: Raw = raw.application && typeof raw.application === 'object' && !Array.isArray(raw.application) ? (raw.application as Raw) : raw;
  const pickList = (...keys: string[]): Raw[] => { for (const o of [raw as Raw, app]) for (const k of keys) { const l = list(o[k]); if (l.length) return l; } return []; };
  const notes = pickList('notes');
  const interviews = pickList('interviews');
  const replies = pickList('replies', 'messages');
  const history = pickList('status_history', 'history', 'timeline');

  let docs: Raw[] = [];
  try {
    const d = await withBackendToken((token) => api<unknown>(`${path}/documents`, { token, cache: 'no-store' }));
    docs = list(Array.isArray(d) ? d : (d as Raw | null)?.items);
  } catch { docs = []; }

  const name = first(app, 'full_name', 'name') || 'Applicant';
  const status = first(app, 'status');
  const rating = Number(app.rating) || 0;
  const tags = strs(app.tags);
  const skills = strs(app.skills);
  const email = first(app, 'email'), phone = first(app, 'phone'), linkedin = first(app, 'linkedin_url');
  const answers = app.answers && typeof app.answers === 'object' && !Array.isArray(app.answers) ? Object.entries(app.answers as Raw) : [];
  const cover = first(app, 'cover_note');
  const summary = first(app, 'summary');

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {back}
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-extrabold sm:text-3xl">{name}</h1>
            {status ? <Badge tone={toneFor(status)}>{human(status)}</Badge> : null}
            {app.is_demo ? <Demo /> : null}
          </div>
          <p className="mt-1 text-sm text-ink/70">{first(app, 'job_title') || 'Role not shown'}{first(app, 'reference') ? ` · ${first(app, 'reference')}` : ''}{when(app.created_at) ? ` · Applied ${when(app.created_at)}` : ''}</p>
          {rating ? <p className="mt-1 text-sm text-gold-dark" aria-label={`Rated ${rating} out of 5`}>{stars(rating)}</p> : null}
        </div>
      </header>
      <p className="rounded-xl bg-cream-deep/70 px-4 py-3 text-sm text-ink/70">Review only for now. Changing the stage, adding notes, replying and scheduling interviews are the next step.</p>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <aside className="space-y-4 lg:col-start-2 lg:row-start-1" aria-label="Applicant details">
          <Section title="Contact">
            <dl className="space-y-3">
              <Field label="Email">{email ? <a className="underline" href={`mailto:${email}`}>{email}</a> : none}</Field>
              <Field label="Phone">{phone ? <a className="underline" href={`tel:${phone}`}>{phone}</a> : none}</Field>
              <Field label="Location">{first(app, 'location') || none}</Field>
              <Field label="LinkedIn">{linkedin ? <a className="break-all underline" href={linkedin} target="_blank" rel="noopener noreferrer">{linkedin}</a> : none}</Field>
            </dl>
          </Section>
          <Section title="Profile">
            <dl className="grid grid-cols-2 gap-3 lg:grid-cols-1">
              <Field label="Experience">{first(app, 'years_experience') ? `${first(app, 'years_experience')} years` : none}</Field>
              <Field label="Current situation">{first(app, 'current_status') || none}</Field>
              <Field label="Education">{[first(app, 'education_level'), first(app, 'field_of_study')].filter(Boolean).join(', ') || none}</Field>
              <Field label="Institution">{[first(app, 'institution'), first(app, 'graduation_year')].filter(Boolean).join(', ') || none}</Field>
              <Field label="Available from">{first(app, 'start_availability') || none}</Field>
              <Field label="Heard about us">{first(app, 'heard_from') || first(app, 'source') || none}</Field>
            </dl>
            {skills.length ? <ul className="flex flex-wrap gap-1.5 pt-1" aria-label="Skills">{skills.map((s) => <li key={s} className="rounded-full bg-cream-deep px-2.5 py-0.5 text-xs font-semibold">{s}</li>)}</ul> : null}
          </Section>
          <Section title={`Documents (${docs.length})`}>
            {docs.length ? (
              <ul className="space-y-2 text-sm">{docs.map((d, i) => <li key={i} className="flex items-center justify-between gap-2"><span className="min-w-0 truncate">{first(d, 'filename', 'name', 'original_name', 'label') || 'Document'}</span><span className="shrink-0 text-xs text-ink/60">{first(d, 'kind', 'doc_type', 'type')}</span></li>)}</ul>
            ) : <p className="text-sm text-ink/60">No documents uploaded.</p>}
          </Section>
          {tags.length ? <Section title="Tags"><ul className="flex flex-wrap gap-1.5">{tags.map((t) => <li key={t} className="rounded bg-cream-deep px-2 py-0.5 text-xs font-semibold">{t}</li>)}</ul></Section> : null}
        </aside>

        <div className="min-w-0 space-y-4 lg:col-start-1 lg:row-start-1">
          {summary ? <Section title="Summary"><p className="whitespace-pre-line text-sm">{summary}</p></Section> : null}
          <Section title="Cover note">{cover ? <p className="whitespace-pre-line text-sm">{cover}</p> : <p className="text-sm text-ink/60">No cover note.</p>}</Section>
          {answers.length ? (
            <Section title="Screening answers">
              <dl className="space-y-3">{answers.map(([k, v]) => <Field key={k} label={human(k)}>{str(v) || none}</Field>)}</dl>
            </Section>
          ) : null}
          <Section title={`Interviews (${interviews.length})`}>
            {interviews.length ? (
              <ul className="space-y-2">{interviews.map((iv, i) => (
                <li key={i} className="rounded-xl border border-ink/10 p-3 text-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2"><p className="font-semibold">{when(iv.scheduled_at ?? iv.starts_at ?? iv.when ?? iv.date) || 'Time not set'}</p>{first(iv, 'status') ? <Badge tone={toneFor(first(iv, 'status'))}>{human(first(iv, 'status'))}</Badge> : null}</div>
                  <p className="mt-1 text-ink/70">{[first(iv, 'mode', 'kind'), first(iv, 'location', 'link'), Array.isArray(iv.panel) ? strs(iv.panel).join(', ') : first(iv, 'panel', 'interviewers')].filter(Boolean).join(' · ') || 'No details'}</p>
                </li>))}</ul>
            ) : <p className="text-sm text-ink/60">No interviews yet.</p>}
          </Section>
          <Section title={`Notes (${notes.length})`}>
            {notes.length ? (
              <ul className="space-y-2">{notes.map((n, i) => (
                <li key={i} className="rounded-xl border border-ink/10 p-3 text-sm"><p className="whitespace-pre-line">{first(n, 'body', 'text', 'note', 'content')}</p><p className="mt-1 text-xs text-ink/60">{[first(n, 'author_name', 'author', 'created_by'), when(n.created_at)].filter(Boolean).join(' · ')}</p></li>))}</ul>
            ) : <p className="text-sm text-ink/60">No notes yet.</p>}
          </Section>
          <Section title={`Replies sent (${replies.length})`}>
            {replies.length ? (
              <ul className="space-y-2">{replies.map((r, i) => (
                <li key={i} className="rounded-xl border border-ink/10 p-3 text-sm"><p className="font-semibold">{first(r, 'subject') || 'Message'}</p><p className="mt-1 whitespace-pre-line text-ink/80">{first(r, 'body', 'text', 'message')}</p><p className="mt-1 text-xs text-ink/60">{when(r.sent_at ?? r.created_at)}</p></li>))}</ul>
            ) : <p className="text-sm text-ink/60">No replies sent yet.</p>}
          </Section>
          {history.length ? (
            <Section title="Stage history">
              <ol className="space-y-2 text-sm">{history.map((h, i) => (
                <li key={i} className="flex flex-wrap items-center gap-2"><span className="text-xs text-ink/60">{when(h.at ?? h.created_at)}</span>{first(h, 'from_status', 'from') ? <><Badge tone="neutral">{human(first(h, 'from_status', 'from'))}</Badge><span aria-hidden="true">to</span></> : null}<Badge tone={toneFor(first(h, 'to_status', 'status', 'to'))}>{human(first(h, 'to_status', 'status', 'to') || 'unknown')}</Badge>{first(h, 'reason', 'note') ? <span className="text-ink/70">{first(h, 'reason', 'note')}</span> : null}</li>))}</ol>
            </Section>
          ) : null}
        </div>
      </div>
    </div>
  );
}
