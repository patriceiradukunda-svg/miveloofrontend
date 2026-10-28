'use server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { ApiError } from '@/lib/miveloo-client';
import { APP_STATUSES, careers } from '@/lib/server/careers-admin';

const f = (fd: FormData, k: string) => String(fd.get(k) ?? '').trim();
const base = (id: string) => `/admin/careers/applications/${encodeURIComponent(id)}`;

function explain(e: unknown): string {
  if (!(e instanceof ApiError)) return 'Could not reach the backend.';
  if (e.status === 401) return 'Your session expired. Sign in again.';
  if (e.status === 403) return 'You do not have permission to do that.';
  if (e.status === 404) return 'That record no longer exists.';
  if (e.status === 400 || e.status === 409 || e.status === 422) return 'The backend rejected that. Check the fields and try again.';
  return `Could not save (error ${e.status}).`;
}
/** Runs one backend call, then returns to the page with a message. redirect() sits outside try/catch on purpose. */
async function run(id: string, done: string, fn: () => Promise<unknown>): Promise<never> {
  let problem: string | null = null;
  try { await fn(); } catch (e) { problem = explain(e); }
  revalidatePath(base(id));
  redirect(`${base(id)}?${problem ? 'error=' + encodeURIComponent(problem) : 'ok=' + encodeURIComponent(done)}`);
}
const fail = (id: string, msg: string): never => redirect(`${base(id)}?error=${encodeURIComponent(msg)}`);

export async function changeStatus(fd: FormData) {
  const id = f(fd, 'id'), status = f(fd, 'status'), note = f(fd, 'note'), reason = f(fd, 'reason');
  if (!(APP_STATUSES as readonly string[]).includes(status)) fail(id, 'Pick a stage.');
  if ((status === 'rejected' || status === 'withdrawn') && !reason) fail(id, 'A reason is required when rejecting or withdrawing.');
  await run(id, `Moved to ${status}.`, () => careers(`/applications/${encodeURIComponent(id)}/status`, { method: 'POST', body: { status, note: note.slice(0, 1000) || undefined, reason: reason.slice(0, 500) || undefined } }));
}
export async function addNote(fd: FormData) {
  const id = f(fd, 'id'), body = f(fd, 'body');
  if (!body) fail(id, 'Write a note first.');
  await run(id, 'Note added.', () => careers(`/applications/${encodeURIComponent(id)}/notes`, { method: 'POST', body: { body: body.slice(0, 4000) } }));
}
export async function sendReply(fd: FormData) {
  const id = f(fd, 'id'), key = f(fd, 'template_key'), subject = f(fd, 'subject'), body = f(fd, 'body'), send = f(fd, 'send') === 'send';
  if (!key && (!subject || !body)) fail(id, 'Pick a template, or write a subject and a message.');
  await run(id, send ? 'Reply sent.' : 'Reply saved without sending.', () => careers(`/applications/${encodeURIComponent(id)}/replies`, { method: 'POST', body: { template_key: key || undefined, subject: subject.slice(0, 300) || undefined, body: body.slice(0, 10000) || undefined, send, direction: 'out' } }));
}
export async function scheduleInterview(fd: FormData) {
  const id = f(fd, 'id'), at = f(fd, 'scheduled_at'), mode = f(fd, 'mode'), loc = f(fd, 'location');
  const dur = Number(f(fd, 'duration_min') || 45);
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(at)) fail(id, 'Choose a date and time.');
  if (!['video', 'phone', 'in_person'].includes(mode)) fail(id, 'Choose how the interview will be held.');
  if (!Number.isInteger(dur) || dur < 10 || dur > 480) fail(id, 'Duration must be between 10 and 480 minutes.');
  const who = f(fd, 'interviewers').split(',').map((s) => s.trim().slice(0, 120)).filter(Boolean).slice(0, 10);
  await run(id, 'Interview scheduled.', () => careers(`/applications/${encodeURIComponent(id)}/interviews`, { method: 'POST', body: { scheduled_at: `${at.slice(0, 16)}:00+02:00`, duration_min: dur, mode, location: loc.slice(0, 300) || undefined, interviewers: who } }));
}
export async function updateInterview(fd: FormData) {
  const id = f(fd, 'id'), iid = f(fd, 'interview_id'), status = f(fd, 'status'), feedback = f(fd, 'feedback');
  const score = f(fd, 'score');
  if (!iid) fail(id, 'Interview not found.');
  if (status && !['scheduled', 'completed', 'cancelled', 'no_show'].includes(status)) fail(id, 'Unknown interview status.');
  if (score && !/^[1-5]$/.test(score)) fail(id, 'Score must be 1 to 5.');
  const body: Record<string, unknown> = {};
  if (status) body.status = status;
  if (score) body.score = Number(score);
  if (feedback) body.feedback = feedback.slice(0, 4000);
  if (!Object.keys(body).length) fail(id, 'Nothing to save.');
  await run(id, 'Interview updated.', () => careers(`/interviews/${encodeURIComponent(iid)}`, { method: 'PATCH', body }));
}
export async function updateApplication(fd: FormData) {
  const id = f(fd, 'id'), rating = f(fd, 'rating');
  if (rating && !/^[1-5]$/.test(rating)) fail(id, 'Rating must be 1 to 5.');
  const tags = f(fd, 'tags').split(',').map((s) => s.trim().slice(0, 32)).filter(Boolean).slice(0, 15);
  const body: Record<string, unknown> = { tags, starred: fd.get('starred') === 'on' };
  if (rating) body.rating = Number(rating);
  await run(id, 'Saved.', () => careers(`/applications/${encodeURIComponent(id)}`, { method: 'PATCH', body }));
}
