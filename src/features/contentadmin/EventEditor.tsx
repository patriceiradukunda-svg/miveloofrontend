import Link from 'next/link';
import { PageHeader } from '@/components/layout/PageHeader';
import { asList, content, safe, EVENT_FORMATS, REG_MODES, REG_STATUSES, type AdminEvent, type AdminReg, type Category, type MediaItem } from '@/lib/server/content-admin';
import { deleteEvent, deleteRegistration, eventAction, patchRegistration, saveEvent, scheduleEvent } from '@/app/admin/content/actions';
import { ACTION_LABEL, Demo, Flash, Fld, Hidden, Section, StatusPill, btnDanger, btnGhost, btnGold, field, toLocalInput, when } from '@/app/admin/content/_ui';

const ACTIONS: Record<string, string[]> = { draft: ['publish', 'archive'], scheduled: ['publish', 'unpublish', 'archive'], published: ['unpublish', 'cancel', 'archive'], cancelled: ['unpublish', 'reopen', 'archive'], archived: ['restore', 'publish'] };

export async function EventEditor({ id, sp }: { id: string; sp: Record<string, string | undefined> }) {
  const isNew = id === 'new';
  const path = `/admin/content/events/${id}`;
  const ev = isNew ? { data: null as AdminEvent | null, error: null as string | null } : await safe(content<AdminEvent>(`/events/${encodeURIComponent(id)}`));
  const [cats, media, regs] = await Promise.all([
    safe(content<unknown>('/categories?kind=event')), safe(content<{ items: MediaItem[] }>('/media?limit=100')),
    isNew ? Promise.resolve({ data: null as { summary: Record<string, unknown>; items: AdminReg[] } | null, error: null as string | null }) : safe(content<{ summary: Record<string, unknown>; items: AdminReg[] }>(`/events/${encodeURIComponent(id)}/registrations`)),
  ]);
  const e = ev.data;
  if (!isNew && !e) return <div className="space-y-4"><Flash error={ev.error ?? 'Not found.'} /><Link href="/admin/content/events" className={btnGhost}>Back to the list</Link></div>;
  const categories = asList<Category>(cats.data).filter((c) => c.active !== false);
  const images = media.data?.items ?? [];
  const hid = { id: isNew ? '' : id, back: path };
  const summary = Object.entries(regs.data?.summary ?? {}).filter(([, v]) => typeof v === 'number' || typeof v === 'string');
  return (
    <div className="space-y-6">
      <PageHeader title={isNew ? 'New event' : e?.title ?? ''} lead="Save as often as you like. The event stays private until you publish it."><Link href="/admin/content/events" className={btnGhost}>All events</Link></PageHeader>
      <Flash ok={sp.ok} error={ev.error ?? sp.error} />
      {e?.is_demo && <p className="rounded-xl bg-gold/30 px-4 py-3 text-sm">This is a sample event <Demo />. Visitors can still register for it while it is published. Replace or archive it before launch.</p>}
      <form action={saveEvent} className="space-y-5">
        <Hidden values={hid} />
        <Section title="Event">
          <div className="grid gap-4">
            <Fld label="Title"><input name="title" required maxLength={200} defaultValue={e?.title ?? ''} className={field} /></Fld>
            <Fld label="Summary" hint="At least 20 characters."><textarea name="summary" rows={2} maxLength={400} defaultValue={e?.summary ?? ''} className={field} /></Fld>
            <Fld label="Description" hint="Markdown is supported."><textarea name="body" rows={10} maxLength={20000} defaultValue={e?.body ?? ''} className={field} /></Fld>
          </div>
        </Section>
        <Section title="When and where">
          <div className="grid gap-4 sm:grid-cols-2">
            <Fld label="Starts (Kigali time)"><input type="datetime-local" name="starts_at" defaultValue={toLocalInput(e?.starts_at)} className={field} /></Fld>
            <Fld label="Ends (Kigali time)"><input type="datetime-local" name="ends_at" defaultValue={toLocalInput(e?.ends_at)} className={field} /></Fld>
            <Fld label="Date note" hint="Use when there is no exact date, for example Date to be announced."><input name="date_note" maxLength={120} defaultValue={e?.date_note ?? ''} className={field} /></Fld>
            <Fld label="Format"><select name="format" defaultValue={e?.format ?? 'tbc'} className={field}>{EVENT_FORMATS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></Fld>
            <Fld label="Venue"><input name="venue" maxLength={200} defaultValue={e?.venue ?? ''} className={field} /></Fld>
            <Fld label="City"><input name="city" maxLength={120} defaultValue={e?.city ?? ''} className={field} /></Fld>
            <Fld label="Address"><input name="address" maxLength={300} defaultValue={e?.address ?? ''} className={field} /></Fld>
            <Fld label="Online link" hint="Must start with https://"><input name="online_url" maxLength={500} defaultValue={e?.online_url ?? ''} className={field} /></Fld>
            <Fld label="Contact email"><input type="email" name="contact_email" defaultValue={e?.contact_email ?? ''} className={field} /></Fld>
            <Fld label="Category" hint="Required to publish."><select name="category_id" defaultValue={e?.category_id ?? ''} className={field}><option value="">Choose a category</option>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></Fld>
          </div>
        </Section>
        <Section title="Registration">
          <div className="grid gap-4 sm:grid-cols-2">
            <Fld label="Registration"><select name="registration_mode" defaultValue={e?.registration_mode ?? 'none'} className={field}>{REG_MODES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></Fld>
            <Fld label="Capacity" hint="Empty means no limit."><input name="capacity" inputMode="numeric" defaultValue={e?.capacity ?? ''} className={field} /></Fld>
            <Fld label="Opens (Kigali time)"><input type="datetime-local" name="registration_opens_at" defaultValue={toLocalInput(e?.registration_opens_at)} className={field} /></Fld>
            <Fld label="Closes (Kigali time)"><input type="datetime-local" name="registration_closes_at" defaultValue={toLocalInput(e?.registration_closes_at)} className={field} /></Fld>
            <label className="flex items-center gap-2 text-sm font-semibold text-teal-dark"><input type="checkbox" name="waitlist_enabled" defaultChecked={e?.waitlist_enabled ?? false} /> Offer a waiting list when full</label>
            <Fld label="Note shown to visitors"><input name="registration_note" maxLength={400} defaultValue={e?.registration_note ?? ''} className={field} /></Fld>
          </div>
        </Section>
        <Section title="Cover, search and Kinyarwanda (optional)">
          <div className="grid gap-4 sm:grid-cols-2">
            <Fld label="Cover image"><select name="cover_media_id" defaultValue={e?.cover_media_id ?? ''} className={field}><option value="">No change / none</option>{images.map((m) => <option key={m.id} value={m.id}>{m.filename}</option>)}</select></Fld>
            <Fld label="Cover description (alt text)"><input name="cover_alt" maxLength={300} defaultValue={e?.cover_alt ?? ''} className={field} /></Fld>
            <Fld label="Web address" hint="Leave empty to create it from the title."><input name="slug" maxLength={120} defaultValue={e?.slug ?? ''} className={field} /></Fld>
            <Fld label="Cover image address (optional)"><input name="cover_url" maxLength={500} defaultValue={e?.cover_url ?? ''} className={field} /></Fld>
            <Fld label="Search title"><input name="seo_title" maxLength={120} defaultValue={e?.seo_title ?? ''} className={field} /></Fld>
            <Fld label="Search description"><input name="seo_description" maxLength={200} defaultValue={e?.seo_description ?? ''} className={field} /></Fld>
            <Fld label="Title (Kinyarwanda)"><input name="rw_title" defaultValue={e?.rw?.title ?? ''} className={field} /></Fld>
            <Fld label="Summary (Kinyarwanda)"><input name="rw_summary" defaultValue={e?.rw?.summary ?? ''} className={field} /></Fld>
            <Fld label="Description (Kinyarwanda)" className="sm:col-span-2"><textarea name="rw_body" rows={6} defaultValue={e?.rw?.body ?? ''} className={field} /></Fld>
          </div>
        </Section>
        <button className={btnGold}>{isNew ? 'Create draft' : 'Save changes'}</button>
      </form>
      {e && (<>
        <Section title="Status and publishing">
          <p className="mb-3 flex flex-wrap items-center gap-2 text-sm"><StatusPill status={e.status} />{e.live ? 'Visible on the public site.' : 'Not visible on the public site.'} Updated {when(e.updated_at)}.{e.scheduled_for && e.status === 'scheduled' ? ` Goes live ${when(e.scheduled_for)}.` : ''}</p>
          {e.publish_problems.length > 0 && <ul className="mb-3 list-disc pl-5 text-sm text-ink-soft">{e.publish_problems.map((x) => <li key={x}>{x}</li>)}</ul>}
          <div className="flex flex-wrap gap-2">
            {[...(ACTIONS[e.status] ?? []), e.is_featured ? 'unfeature' : 'feature'].map((a) => (
              <form key={a} action={eventAction}><Hidden values={{ ...hid, action: a }} /><button className={a === 'publish' ? btnGold : btnGhost}>{ACTION_LABEL[a] ?? a}</button></form>
            ))}
          </div>
          {e.status !== 'archived' && (
            <form action={scheduleEvent} className="mt-4 flex flex-wrap items-end gap-2"><Hidden values={hid} />
              <Fld label="Publish automatically at (Kigali time)"><input type="datetime-local" name="scheduled_for" required className={field} /></Fld><button className={btnGhost}>Schedule</button></form>
          )}
          <form action={deleteEvent} className="mt-4 flex flex-wrap items-center gap-3"><Hidden values={hid} /><button className={btnDanger}>Delete permanently</button>
            <label className="flex items-center gap-1 text-xs"><input type="checkbox" name="force" /> Also delete its registrations</label></form>
        </Section>
        <Section title="Registrations">
          <Flash error={regs.error} />
          {summary.length > 0 && <p className="mb-3 text-sm text-ink-soft">{summary.map(([k, v]) => `${k.replace(/_/g, ' ')}: ${v}`).join(' · ')}</p>}
          <a className={btnGhost} href={`/admin/content/export?what=registrations&id=${encodeURIComponent(id)}`}>Download CSV</a>
          <ul className="mt-4 space-y-3">
            {(regs.data?.items ?? []).map((r) => (
              <li key={r.id} className="rounded-xl border border-ink/10 p-3">
                <p className="font-semibold">{r.full_name} <span className="font-normal text-ink-soft">· {r.email}{r.organisation ? ` · ${r.organisation}` : ''} · {r.attendees} {r.attendees === 1 ? 'person' : 'people'}</span>{r.is_demo && <Demo />}</p>
                {r.message && <p className="mt-1 text-sm text-ink-soft">{r.message}</p>}
                <form action={patchRegistration} className="mt-2 flex flex-wrap items-end gap-2">
                  <Hidden values={{ id: r.id, back: path }} />
                  <select name="status" defaultValue={r.status} aria-label="Status" className={`${field} max-w-44`}>{REG_STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
                  <input name="staff_note" defaultValue={r.staff_note ?? ''} placeholder="Staff note" aria-label="Staff note" className={`${field} max-w-64`} />
                  <label className="flex items-center gap-1 text-xs"><input type="checkbox" name="force" /> Allow over capacity</label>
                  <button className={btnGhost}>Save</button>
                </form>
                <form action={deleteRegistration} className="mt-1"><Hidden values={{ id: r.id, back: path }} /><button className="text-xs text-red-700 underline">Delete</button></form>
              </li>
            ))}
            {!(regs.data?.items ?? []).length && <li className="text-sm text-ink-soft">No registrations yet.</li>}
          </ul>
        </Section>
      </>)}
    </div>
  );
}
