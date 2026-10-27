'use server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { content, errorText } from '@/lib/server/content-admin';

class FormError extends Error {}
const s = (fd: FormData, k: string) => String(fd.get(k) ?? '').trim();
const csv = (v: string) => v.split(',').map((x) => x.trim()).filter(Boolean);
const kigali = (v: string) => (!v ? null : v.length === 16 ? `${v}:00+02:00` : v); // datetime-local fields are Kigali time
const add = (url: string, k: string, v: string) => `${url}${url.includes('?') ? '&' : '?'}${k}=${encodeURIComponent(v.slice(0, 300))}`;
const backTo = (fd: FormData, fallback: string) => { const b = s(fd, 'back'); return b.startsWith('/admin/content') ? b : fallback; };
const kindOf = (fd: FormData) => (s(fd, 'kind') === 'news' ? 'news' : 'blog');
const rwOf = (fd: FormData) => { const o: Record<string, string> = {}; for (const k of ['title', 'summary', 'body']) { const v = s(fd, `rw_${k}`); if (v) o[k] = v; } return o; };
const refs = (b: Record<string, unknown>, fd: FormData) => { for (const k of ['slug', 'category_id', 'cover_media_id', 'cover_url']) if (s(fd, k)) b[k] = s(fd, k); return b; };

async function run(fd: FormData, fallback: string, ok: string, fn: () => Promise<string | void>): Promise<never> {
  const back = backTo(fd, fallback);
  let to = back; let err: string | null = null;
  try { const r = await fn(); if (typeof r === 'string') to = r; }
  catch (e) { err = e instanceof FormError ? e.message : errorText(e); }
  if (err) redirect(add(back, 'error', err));
  revalidatePath('/admin/content', 'layout');
  redirect(add(to, 'ok', ok));
}

// ---- posts (blog and news) ----
export async function savePost(fd: FormData) {
  const id = s(fd, 'id'), kind = kindOf(fd), list = `/admin/content/${kind}`;
  const body = refs({ title: s(fd, 'title'), summary: s(fd, 'summary'), body: s(fd, 'body'), cover_alt: s(fd, 'cover_alt'), author_name: s(fd, 'author_name'),
    tags: csv(s(fd, 'tags')), seo_title: s(fd, 'seo_title'), seo_description: s(fd, 'seo_description'), rw: rwOf(fd) }, fd);
  return run(fd, list, id ? 'Saved.' : 'Draft created.', async () => {
    if (id) { await content(`/posts/${encodeURIComponent(id)}`, { method: 'PATCH', body }); return `${list}/${id}`; }
    const r = await content<{ id: string }>('/posts', { method: 'POST', body: { ...body, kind } });
    return `${list}/${r.id}`;
  });
}
export async function postAction(fd: FormData) {
  const id = s(fd, 'id'), action = s(fd, 'action'), kind = kindOf(fd);
  return run(fd, `/admin/content/${kind}`, `Done: ${action}.`, async () => {
    const r = await content<{ id?: string } | null>(`/posts/${encodeURIComponent(id)}/${encodeURIComponent(action)}`, { method: 'POST' });
    if (action === 'duplicate' && r?.id) return `/admin/content/${kind}/${r.id}`;
  });
}
export async function schedulePost(fd: FormData) {
  const id = s(fd, 'id'), kind = kindOf(fd);
  return run(fd, `/admin/content/${kind}/${id}`, 'Scheduled.', async () => { await content(`/posts/${encodeURIComponent(id)}/schedule`, { method: 'POST', body: { scheduled_for: kigali(s(fd, 'scheduled_for')) } }); });
}
export async function deletePost(fd: FormData) {
  const id = s(fd, 'id'), kind = kindOf(fd);
  return run(fd, `/admin/content/${kind}/${id}`, 'Deleted.', async () => { await content(`/posts/${encodeURIComponent(id)}`, { method: 'DELETE' }); return `/admin/content/${kind}`; });
}

// ---- events ----
export async function saveEvent(fd: FormData) {
  const id = s(fd, 'id'), list = '/admin/content/events';
  const cap = Number(s(fd, 'capacity').replace(/[,\s]/g, ''));
  const body = refs({ title: s(fd, 'title'), summary: s(fd, 'summary'), body: s(fd, 'body'), cover_alt: s(fd, 'cover_alt'), date_note: s(fd, 'date_note'),
    venue: s(fd, 'venue'), city: s(fd, 'city'), address: s(fd, 'address'), online_url: s(fd, 'online_url'), contact_email: s(fd, 'contact_email') || null,
    format: s(fd, 'format') || 'tbc', registration_mode: s(fd, 'registration_mode') || 'none', registration_note: s(fd, 'registration_note'),
    starts_at: kigali(s(fd, 'starts_at')), ends_at: kigali(s(fd, 'ends_at')), registration_opens_at: kigali(s(fd, 'registration_opens_at')),
    registration_closes_at: kigali(s(fd, 'registration_closes_at')), capacity: s(fd, 'capacity') && Number.isFinite(cap) && cap > 0 ? Math.round(cap) : null,
    waitlist_enabled: fd.get('waitlist_enabled') === 'on', seo_title: s(fd, 'seo_title'), seo_description: s(fd, 'seo_description'), rw: rwOf(fd) }, fd);
  return run(fd, list, id ? 'Saved.' : 'Draft created.', async () => {
    if (id) { await content(`/events/${encodeURIComponent(id)}`, { method: 'PATCH', body }); return `${list}/${id}`; }
    const r = await content<{ id: string }>('/events', { method: 'POST', body });
    return `${list}/${r.id}`;
  });
}
export async function eventAction(fd: FormData) {
  const id = s(fd, 'id'), action = s(fd, 'action');
  return run(fd, '/admin/content/events', `Done: ${action}.`, async () => { await content(`/events/${encodeURIComponent(id)}/${encodeURIComponent(action)}`, { method: 'POST' }); });
}
export async function scheduleEvent(fd: FormData) {
  const id = s(fd, 'id');
  return run(fd, `/admin/content/events/${id}`, 'Scheduled.', async () => { await content(`/events/${encodeURIComponent(id)}/schedule`, { method: 'POST', body: { scheduled_for: kigali(s(fd, 'scheduled_for')) } }); });
}
export async function deleteEvent(fd: FormData) {
  const id = s(fd, 'id'), force = fd.get('force') === 'on';
  return run(fd, `/admin/content/events/${id}`, 'Deleted.', async () => { await content(`/events/${encodeURIComponent(id)}${force ? '?force=true' : ''}`, { method: 'DELETE' }); return '/admin/content/events'; });
}
export async function patchRegistration(fd: FormData) {
  return run(fd, '/admin/content/events', 'Registration updated.', async () => {
    await content(`/registrations/${encodeURIComponent(s(fd, 'id'))}`, { method: 'PATCH', body: { status: s(fd, 'status'), staff_note: s(fd, 'staff_note'), force: fd.get('force') === 'on' } });
  });
}
export async function deleteRegistration(fd: FormData) {
  return run(fd, '/admin/content/events', 'Registration deleted.', async () => { await content(`/registrations/${encodeURIComponent(s(fd, 'id'))}`, { method: 'DELETE' }); });
}

// ---- media, categories, subscribers ----
export async function uploadMedia(fd: FormData) {
  return run(fd, '/admin/content/media', 'Image uploaded.', async () => {
    const f = fd.get('file');
    if (!(f instanceof File) || f.size === 0) throw new FormError('Choose an image first.');
    const out = new FormData(); out.append('file', f, f.name); out.append('alt', s(fd, 'alt')); out.append('credit', s(fd, 'credit'));
    await content('/media', { method: 'POST', body: out });
  });
}
export async function patchMedia(fd: FormData) {
  return run(fd, '/admin/content/media', 'Saved.', async () => { await content(`/media/${encodeURIComponent(s(fd, 'id'))}`, { method: 'PATCH', body: { alt: s(fd, 'alt'), credit: s(fd, 'credit') } }); });
}
export async function deleteMedia(fd: FormData) {
  return run(fd, '/admin/content/media', 'Image deleted.', async () => { await content(`/media/${encodeURIComponent(s(fd, 'id'))}`, { method: 'DELETE' }); });
}
export async function saveCategory(fd: FormData) {
  const id = s(fd, 'id');
  return run(fd, '/admin/content/categories', id ? 'Saved.' : 'Category added.', async () => {
    if (id) await content(`/categories/${encodeURIComponent(id)}`, { method: 'PATCH', body: { name: s(fd, 'name'), name_rw: s(fd, 'name_rw') || null, sort_order: Number(s(fd, 'sort_order')) || 0, active: fd.get('active') === 'on' } });
    else await content('/categories', { method: 'POST', body: { kind: s(fd, 'kind'), name: s(fd, 'name'), name_rw: s(fd, 'name_rw') || null } });
  });
}
export async function deleteCategory(fd: FormData) {
  return run(fd, '/admin/content/categories', 'Category deleted.', async () => { await content(`/categories/${encodeURIComponent(s(fd, 'id'))}`, { method: 'DELETE' }); });
}
export async function setSubscriber(fd: FormData) {
  return run(fd, '/admin/content/subscribers', 'Updated.', async () => { await content(`/subscribers/${encodeURIComponent(s(fd, 'id'))}`, { method: 'PATCH', body: { status: s(fd, 'status') } }); });
}
export async function deleteSubscriber(fd: FormData) {
  return run(fd, '/admin/content/subscribers', 'Subscriber deleted.', async () => { await content(`/subscribers/${encodeURIComponent(s(fd, 'id'))}`, { method: 'DELETE' }); });
}
