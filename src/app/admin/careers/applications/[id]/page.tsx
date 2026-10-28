import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Badge, EmptyState, toneFor } from '@/components/kit/Kit';
import { api, ApiError } from '@/lib/miveloo-client';
import { withBackendToken } from '@/lib/server/backend-session';
import { APP_STATUSES, careers } from '@/lib/server/careers-admin';
import { Demo, Flash, card, stars } from '../../_ui';
import { StageForm } from './StageForm';
import { addNote, scheduleInterview, sendReply, updateApplication, updateInterview } from './actions';

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
  return Number.isNaN(d.getTime()) ? s : d.toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Kigali' });
};
const input = 'w-full rounded-xl border border-ink/20 bg-white px-3 py-2 text-sm text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal';
const tall = `${input} min-h-11`;
const label = 'mb-1 block text-sm font-semibold';
const primary = 'inline-flex min-h-11 items-center rounded-xl bg-teal px-4 text-sm font-bold text-cream hover:bg-teal-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal';
const ghost = 'inline-flex min-h-11 items-center rounded-xl border border-ink/20 bg-white px-4 text-sm font-bold hover:bg-cream-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal';

function Field({ label: l, children }: { label: string; children: React.ReactNode }) {
  return <div className="min-w-0"><dt className="text-xs font-semibold uppercase tracking-wide text-ink/60">{l}</dt><dd className="mt-0.5 break-words text-sm">{children}</dd></div>;
}
function Section({ title, id, children }: { title: string; id?: string; children: React.ReactNode }) {
  return <section id={id} aria-label={title} className={`${card} scroll-mt-24 space-y-3`}><h2 className="text-sm font-extrabold">{title}</h2>{children}</section>;
}
const none = <span className="text-ink/40">Not given</span>;

export default async function Page({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<Record<string, string | undefined>> }) {
  const { id } = await params;
  const sp = await searchParams;
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
  let templates: Raw[] = [];
  try {
    const t = await careers<unknown>('/templates');
    templates = list(Array.isArray(t) ? t : (t as Raw | null)?.items).filter((x) => x.active !== false && first(x, 'key'));
  } catch { templates = []; }

  const name = first(app, 'full_name', 'name') || 'Applicant';
  const status = first(app, 'status');
  const rating = Number(app.rating) || 0;
  const tags = strs(app.tags);
  const skills = strs(app.skills);
  const email = first(app, 'email'), phone = first(app, 'phone'), linkedin = first(app, 'linkedin_url');
  const answers = app.answers && typeof app.answers === 'object' && !Array.isArray(app.answers) ? Object.entries(app.answers as Raw) : [];
  const cover = first(app, 'cover_note');
  const summary = first(app, 'summary');
  const isDemo = Boolean(app.is_demo);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {back}
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-extrabold sm:text-3xl">{name}</h1>
            {status ? <Badge tone={toneFor(status)}>{human(status)}</Badge> : null}
            {isDemo ? <Demo /> : null}
          </div>
          <p className="mt-1 text-sm text-ink/70">{first(app, 'job_title') || 'Role not shown'}{first(app, 'reference') ? ` · ${first(app, 'reference')}` : ''}{when(app.created_at) ? ` · Applied ${when(app.created_at)}` : ''}</p>
          {rating ? <p className="mt-1 text-sm text-gold-dark" aria-label={`Rated ${rating} out of 5`}>{stars(rating)}</p> : null}
        </div>
      </header>
      <Flash ok={sp.ok} error={sp.error} />
      {status === 'rejected' || status === 'withdrawn' ? (
        <p className="rounded-xl border border-amber-600/25 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          This application is closed. Candidates remember silence: <a className="font-bold underline" href="#reply">send a respectful reply</a> if you have not already.
        </p>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:grid-rows-[auto_auto_1fr] lg:items-start">
        <div className="order-1 lg:col-start-2 lg:row-start-1"><Section title="Stage"><StageForm id={id} current={status} statuses={[...APP_STATUSES]} /></Section></div>
        <div className="order-2 space-y-4 lg:col-start-2 lg:row-start-2" aria-label="Applicant details">
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
        </div>
        <aside className="order-4 space-y-4 lg:col-start-2 lg:row-start-3" aria-label="Rating and documents">
          <Section title="Rating and tags">
            <form action={updateApplication} className="space-y-3">
              <input type="hidden" name="id" value={id} />
              <div><label htmlFor="rating" className={label}>Rating</label>
                <select id="rating" name="rating" defaultValue={rating ? String(rating) : ''} className={tall}><option value="">Not rated</option>{[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n} of 5</option>)}</select></div>
              <div><label htmlFor="tags" className={label}>Tags (comma separated)</label><input id="tags" name="tags" defaultValue={tags.join(', ')} className={tall} placeholder="strong, follow-up" /></div>
              <label className="flex min-h-11 items-center gap-2 text-sm font-semibold"><input type="checkbox" name="starred" defaultChecked={Boolean(app.starred)} className="h-5 w-5" /> Starred</label>
              <button type="submit" className={primary}>Save</button>
            </form>
          </Section>
          <Section title={`Documents (${docs.length})`}>
            {docs.length ? (
              <ul className="space-y-2 text-sm">{docs.map((d, i) => <li key={i} className="flex items-center justify-between gap-2"><span className="min-w-0 truncate">{first(d, 'filename', 'name', 'original_name', 'label') || 'Document'}</span><span className="shrink-0 text-xs text-ink/60">{first(d, 'kind', 'doc_type', 'type')}</span></li>)}</ul>
            ) : <p className="text-sm text-ink/60">No documents uploaded.</p>}
          </Section>
        </aside>

        <div className="order-3 min-w-0 space-y-4 lg:col-start-1 lg:row-span-3 lg:row-start-1">
          {summary ? <Section title="Summary"><p className="whitespace-pre-line text-sm">{summary}</p></Section> : null}
          <Section title="Cover note">{cover ? <p className="whitespace-pre-line text-sm">{cover}</p> : <p className="text-sm text-ink/60">No cover note.</p>}</Section>
          {answers.length ? <Section title="Screening answers"><dl className="space-y-3">{answers.map(([k, v]) => <Field key={k} label={human(k)}>{str(v) || none}</Field>)}</dl></Section> : null}

          <Section title={`Interviews (${interviews.length})`}>
            {interviews.length ? (
              <ul className="space-y-3">{interviews.map((iv, i) => {
                const iid = first(iv, 'id'); const st = first(iv, 'status');
                return (
                  <li key={i} className="rounded-xl border border-ink/10 p-3 text-sm">
                    <div className="flex flex-wrap items-center justify-between gap-2"><p className="font-semibold">{when(iv.scheduled_at) || 'Time not set'}</p>{st ? <Badge tone={toneFor(st)}>{human(st)}</Badge> : null}</div>
                    <p className="mt-1 text-ink/70">{[human(first(iv, 'mode')), first(iv, 'location'), strs(iv.interviewers).join(', '), first(iv, 'duration_min') ? `${first(iv, 'duration_min')} min` : ''].filter((x) => x && x !== '').join(' · ') || 'No details'}</p>
                    {first(iv, 'score') ? <p className="mt-1 text-gold-dark" aria-label={`Score ${first(iv, 'score')} out of 5`}>{stars(Number(first(iv, 'score')))}</p> : null}
                    {first(iv, 'feedback') ? <p className="mt-1 whitespace-pre-line text-ink/80">{first(iv, 'feedback')}</p> : null}
                    {iid ? (
                      <details className="mt-3">
                        <summary className="min-h-11 cursor-pointer py-2 text-sm font-bold text-teal">Scorecard and status</summary>
                        <form action={updateInterview} className="mt-2 space-y-3">
                          <input type="hidden" name="id" value={id} /><input type="hidden" name="interview_id" value={iid} />
                          <div className="grid gap-3 sm:grid-cols-2">
                            <div><label className={label} htmlFor={`is-${i}`}>Status</label><select id={`is-${i}`} name="status" defaultValue={st} className={tall}>{['scheduled', 'completed', 'cancelled', 'no_show'].map((s) => <option key={s} value={s}>{human(s)}</option>)}</select></div>
                            <div><label className={label} htmlFor={`sc-${i}`}>Score</label><select id={`sc-${i}`} name="score" defaultValue={first(iv, 'score')} className={tall}><option value="">No score</option>{[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n} of 5</option>)}</select></div>
                          </div>
                          <div><label className={label} htmlFor={`fb-${i}`}>Feedback</label><textarea id={`fb-${i}`} name="feedback" rows={3} maxLength={4000} defaultValue={first(iv, 'feedback')} className={input} placeholder="Score against the same criteria for every candidate." /></div>
                          <button type="submit" className={primary}>Save scorecard</button>
                        </form>
                      </details>
                    ) : null}
                  </li>
                );
              })}</ul>
            ) : <p className="text-sm text-ink/60">No interviews yet.</p>}
            <details className="rounded-xl border border-dashed border-ink/20 p-3">
              <summary className="min-h-11 cursor-pointer py-2 text-sm font-bold text-teal">Schedule an interview</summary>
              <form action={scheduleInterview} className="mt-2 space-y-3">
                <input type="hidden" name="id" value={id} />
                <div className="grid gap-3 sm:grid-cols-2">
                  <div><label className={label} htmlFor="when">Date and time (Kigali)</label><input id="when" type="datetime-local" name="scheduled_at" required className={tall} /></div>
                  <div><label className={label} htmlFor="dur">Duration (minutes)</label><input id="dur" type="number" name="duration_min" defaultValue={45} min={10} max={480} className={tall} /></div>
                  <div><label className={label} htmlFor="mode">How</label><select id="mode" name="mode" defaultValue="video" className={tall}><option value="video">Video call</option><option value="phone">Phone</option><option value="in_person">In person</option></select></div>
                  <div><label className={label} htmlFor="loc">Link or place</label><input id="loc" name="location" maxLength={300} className={tall} /></div>
                </div>
                <div><label className={label} htmlFor="panel">Interviewers (comma separated)</label><input id="panel" name="interviewers" className={tall} /></div>
                <button type="submit" className={primary}>Schedule</button>
              </form>
            </details>
          </Section>

          <Section title={`Notes (${notes.length})`}>
            <form action={addNote} className="space-y-2">
              <input type="hidden" name="id" value={id} />
              <label className="sr-only" htmlFor="note-body">New note</label>
              <textarea id="note-body" name="body" required rows={3} maxLength={4000} className={input} placeholder="Add a note for the hiring team" />
              <button type="submit" className={primary}>Add note</button>
            </form>
            {notes.length ? (
              <ul className="space-y-2">{notes.map((n, i) => (
                <li key={i} className="rounded-xl border border-ink/10 p-3 text-sm"><p className="whitespace-pre-line">{first(n, 'body', 'text', 'note', 'content')}</p><p className="mt-1 text-xs text-ink/60">{[first(n, 'author', 'author_name'), when(n.created_at)].filter(Boolean).join(' · ')}</p></li>))}</ul>
            ) : <p className="text-sm text-ink/60">No notes yet.</p>}
          </Section>

          <Section title={`Replies (${replies.length})`} id="reply">
            <form className="space-y-3">
              <input type="hidden" name="id" value={id} />
              <div><label className={label} htmlFor="tpl">Template</label>
                <select id="tpl" name="template_key" defaultValue="" className={tall}><option value="">Write my own</option>{templates.map((t) => <option key={first(t, 'key')} value={first(t, 'key')}>{first(t, 'name') || first(t, 'key')}</option>)}</select></div>
              <div><label className={label} htmlFor="subj">Subject (needed when writing your own)</label><input id="subj" name="subject" maxLength={300} className={tall} /></div>
              <div><label className={label} htmlFor="msg">Message (needed when writing your own)</label><textarea id="msg" name="body" rows={5} maxLength={10000} className={input} /></div>
              {isDemo ? <p className="rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-900">This is a demo application. Sending emails the address on file, so use Save without sending while testing.</p> : null}
              <div className="flex flex-wrap gap-2">
                <button type="submit" formAction={sendReply} name="send" value="draft" className={ghost}>Save without sending</button>
                <button type="submit" formAction={sendReply} name="send" value="send" className={primary}>Send email</button>
              </div>
            </form>
            {replies.length ? (
              <ul className="space-y-2">{replies.map((r, i) => (
                <li key={i} className="rounded-xl border border-ink/10 p-3 text-sm"><div className="flex flex-wrap items-center justify-between gap-2"><p className="font-semibold">{first(r, 'subject') || 'Message'}</p>{first(r, 'status') ? <Badge tone={toneFor(first(r, 'status'))}>{human(first(r, 'status'))}</Badge> : null}</div><p className="mt-1 whitespace-pre-line text-ink/80">{first(r, 'body', 'text', 'message')}</p><p className="mt-1 text-xs text-ink/60">{[first(r, 'sent_by'), when(r.sent_at ?? r.created_at)].filter(Boolean).join(' · ')}</p></li>))}</ul>
            ) : <p className="text-sm text-ink/60">No replies yet.</p>}
          </Section>

          {history.length ? (
            <Section title="Stage history">
              <ol className="space-y-2 text-sm">{history.map((h, i) => (
                <li key={i} className="flex flex-wrap items-center gap-2"><span className="text-xs text-ink/60">{when(h.created_at ?? h.at)}</span>{first(h, 'from_status', 'from') ? <><Badge tone="neutral">{human(first(h, 'from_status', 'from'))}</Badge><span aria-hidden="true">to</span></> : null}<Badge tone={toneFor(first(h, 'to_status', 'status', 'to'))}>{human(first(h, 'to_status', 'status', 'to') || 'unknown')}</Badge>{first(h, 'note', 'reason') ? <span className="text-ink/70">{first(h, 'note', 'reason')}</span> : null}{first(h, 'changed_by') ? <span className="text-xs text-ink/50">by {first(h, 'changed_by')}</span> : null}</li>))}</ol>
            </Section>
          ) : null}
        </div>
      </div>
    </div>
  );
}
