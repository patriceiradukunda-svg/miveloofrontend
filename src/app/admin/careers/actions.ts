'use server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { ApiError } from '@/lib/miveloo-client';
import { careers, DOCS } from '@/lib/server/careers-admin';

const s = (fd: FormData, k: string) => String(fd.get(k) ?? '').trim();
const lines = (fd: FormData, k: string) => s(fd, k).split(/\r?\n/).map((x) => x.trim()).filter(Boolean);
const csv = (fd: FormData, k: string) => s(fd, k).split(',').map((x) => x.trim()).filter(Boolean);
const num = (fd: FormData, k: string): number | null => {
  const v = s(fd, k).replace(/[,\s]/g, ''); if (!v) return null;
  const n = Number(v); return Number.isFinite(n) ? Math.round(n) : null;
};
const backTo = (fd: FormData) => { const b = s(fd, 'back'); return b.startsWith('/admin/careers') ? b : '/admin/careers'; };
const add = (url: string, k: string, v: string) => `${url}${url.includes('?') ? '&' : '?'}${k}=${encodeURIComponent(v.slice(0, 300))}`;

async function run(fd: FormData, ok: string | (() => string), fn: () => Promise<string | void>): Promise<never> {
  const back = backTo(fd);
  let to = back; let err: string | null = null;
  try { const r = await fn(); if (typeof r === 'string') to = r; }
  catch (e) { err = e instanceof ApiError ? (e.status === 403 ? 'Not allowed: the platform_admin role is required.' : e.message) : 'Something went wrong. Please try again.'; }
  if (err) redirect(add(back, 'error', err));
  revalidatePath('/admin/careers', 'layout');
  redirect(add(to, 'ok', typeof ok === 'function' ? ok() : ok));
}
type BulkResult = { results: { ok: boolean; error?: string }[] };
const summarize = (r: BulkResult) => { const bad = r.results.filter((x) => !x.ok); return `${r.results.length - bad.length} done` + (bad.length ? `, ${bad.length} failed (${bad[0]?.error ?? 'error'})` : '.'); };

export async function jobAction(fd: FormData) {
  const id = s(fd, 'id'), action = s(fd, 'action');
  return run(fd, `Done: ${action}.`, async () => {
    const r = await careers<{ id: string }>(`/jobs/${id}/${action}`, { method: 'POST' });
    if (action === 'duplicate') return `/admin/careers/jobs/${r.id}`;
  });
}

export async function saveJob(fd: FormData) {
  const id = s(fd, 'id');
  return run(fd, id ? 'Job saved.' : 'Draft created.', async () => {
    const documents = DOCS.flatMap(([d]) => { const v = s(fd, `doc_${d}`); return v === 'required' || v === 'optional' ? [{ id: d, required: v === 'required' }] : []; });
    const seen = new Set<string>();
    const questions = lines(fd, 'questions').map((l, i) => {
      const required = l.endsWith('*'); const label = (required ? l.slice(0, -1) : l).trim();
      let qid = label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 34) || `q${i + 1}`;
      while (seen.has(qid)) qid = `${qid}-${i + 1}`;
      seen.add(qid); return { id: qid, label: label.slice(0, 300), required };
    });
    const rw: Record<string, unknown> = {};
    for (const k of ['title', 'summary']) if (s(fd, `rw_${k}`)) rw[k] = s(fd, `rw_${k}`);
    for (const k of ['about', 'responsibilities', 'requirements']) { const l = lines(fd, `rw_${k}`); if (l.length) rw[k] = l; }
    const body: Record<string, unknown> = {
      title: s(fd, 'title'), team: s(fd, 'team') || null, type: s(fd, 'type'), work_mode: s(fd, 'work_mode'), location: s(fd, 'location') || null,
      summary: s(fd, 'summary') || null, about: lines(fd, 'about'), responsibilities: lines(fd, 'responsibilities'), requirements: lines(fd, 'requirements'),
      nice_to_have: lines(fd, 'nice_to_have'), benefits: lines(fd, 'benefits'), documents, questions, rw,
      openings: num(fd, 'openings') ?? 1, salary_min: num(fd, 'salary_min'), salary_max: num(fd, 'salary_max'),
      salary_currency: (s(fd, 'salary_currency') || 'RWF').toUpperCase(), salary_visible: fd.get('salary_visible') === 'on', closes_on: s(fd, 'closes_on') || null,
    };
    const slug = s(fd, 'slug'); if (slug && slug !== s(fd, 'slug_current')) body.slug = slug;
    if (id) { await careers(`/jobs/${id}`, { method: 'PATCH', body }); return `/admin/careers/jobs/${id}`; }
    const j = await careers<{ id: string }>('/jobs', { method: 'POST', body });
    return `/admin/careers/jobs/${j.id}`;
  });
}

export async function deleteJob(fd: FormData) {
  const id = s(fd, 'id');
  return run(fd, 'Job deleted.', async () => { await careers(`/jobs/${id}`, { method: 'DELETE' }); return '/admin/careers/jobs'; });
}

export async function bulkJobs(fd: FormData) {
  const ids = fd.getAll('ids').map(String); const action = s(fd, 'action'); let msg = 'Done.';
  return run(fd, () => msg, async () => {
    if (!ids.length) throw new ApiError(400, 'Select at least one job first.');
    msg = summarize(await careers<BulkResult>('/jobs-bulk', { method: 'POST', body: { ids, action } }));
  });
}

export async function setStatus(fd: FormData) {
  const id = s(fd, 'id');
  return run(fd, 'Status updated.', async () => {
    await careers(`/applications/${id}/status`, { method: 'POST', body: { status: s(fd, 'status'), note: s(fd, 'note') || undefined, reason: s(fd, 'reason') || undefined } });
  });
}

export async function bulkStatus(fd: FormData) {
  const ids = fd.getAll('ids').map(String); let msg = 'Done.';
  return run(fd, () => msg, async () => {
    if (!ids.length) throw new ApiError(400, 'Select at least one application first.');
    msg = summarize(await careers<BulkResult>('/applications-bulk/status', { method: 'POST', body: { ids, status: s(fd, 'status'), reason: s(fd, 'reason') || undefined } }));
  });
}

export async function patchApp(fd: FormData) {
  const id = s(fd, 'id');
  return run(fd, 'Saved.', async () => {
    await careers(`/applications/${id}`, { method: 'PATCH', body: { rating: num(fd, 'rating'), tags: csv(fd, 'tags').slice(0, 15).map((t) => t.slice(0, 32)), starred: fd.get('starred') === 'on' } });
  });
}

export async function addNote(fd: FormData) {
  return run(fd, 'Note added.', async () => { await careers(`/applications/${s(fd, 'id')}/notes`, { method: 'POST', body: { body: s(fd, 'body') } }); });
}
export async function deleteNote(fd: FormData) {
  return run(fd, 'Note deleted.', async () => { await careers(`/applications/${s(fd, 'id')}/notes/${s(fd, 'note_id')}`, { method: 'DELETE' }); });
}

export async function sendReply(fd: FormData) {
  const mode = s(fd, 'mode'); let msg = 'Reply recorded.';
  return run(fd, () => msg, async () => {
    const r = await careers<{ status: string; error: string | null }>(`/applications/${s(fd, 'id')}/replies`, { method: 'POST', body: {
      template_key: s(fd, 'template_key') || undefined, subject: s(fd, 'subject') || undefined, body: s(fd, 'body') || undefined,
      send: mode !== 'received', direction: mode === 'received' ? 'in' : 'out' } });
    msg = r.status === 'stubbed' ? 'Reply recorded. Email sending is in stub mode on the backend, so nothing was actually emailed.'
      : r.status === 'failed' ? `Reply saved but sending failed: ${r.error ?? 'provider error'}` : r.status === 'received' ? 'Applicant response logged.' : 'Reply sent.';
  });
}

export async function addInterview(fd: FormData) {
  return run(fd, 'Interview scheduled.', async () => {
    const raw = s(fd, 'scheduled_at'); if (!raw) throw new ApiError(400, 'Choose a date and time.');
    const at = `${raw.length === 16 ? raw + ':00' : raw}+02:00`;          // Rwanda time (UTC+2, no daylight saving)
    await careers(`/applications/${s(fd, 'id')}/interviews`, { method: 'POST', body: { scheduled_at: at, duration_min: num(fd, 'duration_min') ?? 45, mode: s(fd, 'mode') || 'video', location: s(fd, 'location') || null, interviewers: csv(fd, 'interviewers').slice(0, 10) } });
  });
}
export async function updateInterview(fd: FormData) {
  return run(fd, 'Interview updated.', async () => {
    await careers(`/interviews/${s(fd, 'interview_id')}`, { method: 'PATCH', body: { status: s(fd, 'status'), score: num(fd, 'score'), feedback: s(fd, 'feedback') || null } });
  });
}

export async function saveTemplate(fd: FormData) {
  const id = s(fd, 'id'); const active = fd.get('active') === 'on';
  return run(fd, 'Template saved.', async () => {
    if (id) await careers(`/templates/${id}`, { method: 'PATCH', body: { name: s(fd, 'name'), subject: s(fd, 'subject'), body: s(fd, 'body'), active } });
    else await careers('/templates', { method: 'POST', body: { key: s(fd, 'key'), name: s(fd, 'name'), subject: s(fd, 'subject'), body: s(fd, 'body'), active } });
  });
}
export async function deleteTemplate(fd: FormData) {
  return run(fd, 'Template deleted.', async () => { await careers(`/templates/${s(fd, 'id')}`, { method: 'DELETE' }); });
}
