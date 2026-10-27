import { API_ORIGIN } from '@/lib/miveloo-client';

export type Locale = 'en' | 'rw';
export type Cat = { id: string; kind: string; slug: string; name: string; name_rw: string | null };
export type CoverInfo = { url: string; source: 'media' | 'site' | 'external' } | null;
export type Rw = { title?: string; summary?: string; body?: string } | null;

export interface Post {
  id: string; kind: 'blog' | 'news'; slug: string; title: string; summary: string | null; category: Cat | null; cover: CoverInfo;
  cover_alt: string | null; author_name: string | null; reading_minutes: number; published_at: string | null; is_featured: boolean;
  tags: string[]; is_demo: boolean; rw: Rw; body?: string; seo_title?: string | null; seo_description?: string | null; related?: Post[];
}
export type RegState = 'none' | 'open' | 'waitlist' | 'full' | 'not_open' | 'closed' | 'cancelled';
export interface Registration { mode: 'none' | 'interest' | 'required'; state: RegState; seats_left: number | null; opens_at: string | null; closes_at: string | null }
export interface EventItem {
  id: string; slug: string; title: string; summary: string | null; category: Cat | null; cover: CoverInfo; cover_alt: string | null;
  starts_at: string | null; ends_at: string | null; date_note: string | null; format: 'in_person' | 'online' | 'hybrid' | 'tbc';
  venue: string | null; city: string | null; status: string; is_featured: boolean; is_demo: boolean; is_past: boolean; rw: Rw;
  registration: Registration; body?: string; address?: string | null; contact_email?: string | null; registration_note?: string | null;
  seo_title?: string | null; seo_description?: string | null;
}
export type LPost = Post & { translated: boolean };
export type LEvent = EventItem & { translated: boolean };

const TZ = 'Africa/Kigali';
export const coverSrc = (c: CoverInfo): string | null => (c ? (c.source === 'media' ? `${API_ORIGIN}${c.url}` : c.url) : null);
export function hash(s: string): number { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; }
export const fmtDate = (iso?: string | null) => (iso ? new Date(iso).toLocaleDateString('en-GB', { dateStyle: 'medium', timeZone: TZ }) : '');
export const fmtTime = (iso?: string | null) => (iso ? new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: TZ }) : '');
export const fmtDateTime = (iso?: string | null) => (iso ? new Date(iso).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short', timeZone: TZ }) : '');
export function dateTile(iso?: string | null): { day: string; month: string } | null {
  if (!iso) return null;
  const d = new Date(iso);
  return { day: d.toLocaleDateString('en-GB', { day: '2-digit', timeZone: TZ }), month: d.toLocaleDateString('en-GB', { month: 'short', timeZone: TZ }).toUpperCase() };
}
export function whenText(e: Pick<EventItem, 'starts_at' | 'ends_at' | 'date_note'>): string {
  if (!e.starts_at) return e.date_note || 'Date to be announced';
  const start = fmtDateTime(e.starts_at);
  if (!e.ends_at) return start;
  return fmtDate(e.ends_at) === fmtDate(e.starts_at) ? `${start} – ${fmtTime(e.ends_at)}` : `${start} – ${fmtDateTime(e.ends_at)}`;
}
export const FORMAT_LABEL: Record<EventItem['format'], string> = { in_person: 'In person', online: 'Online', hybrid: 'In person and online', tbc: 'Format to be confirmed' };
export function placeText(e: Pick<EventItem, 'format' | 'venue' | 'city'>): string {
  if (e.format === 'online') return 'Online';
  const p = [e.venue, e.city].filter(Boolean).join(', ');
  const base = p || (e.format === 'tbc' ? 'Location to be confirmed' : 'Venue to be confirmed');
  return e.format === 'hybrid' ? `${base} (and online)` : base;
}
export const postMeta = (p: Pick<Post, 'published_at' | 'reading_minutes'>) => [fmtDate(p.published_at), `${p.reading_minutes} min read`].filter(Boolean).join(' · ');

/** Shows the Kinyarwanda title/summary/body when the visitor chose Kinyarwanda and the editor wrote one; otherwise English. */
export function localize<T extends { title: string; summary: string | null; body?: string; rw: Rw; category: Cat | null }>(x: T, locale: Locale): T & { translated: boolean } {
  const category = x.category && locale === 'rw' && x.category.name_rw ? { ...x.category, name: x.category.name_rw } : x.category;
  if (locale === 'rw' && x.rw?.title) return { ...x, category, title: x.rw.title, summary: x.rw.summary ?? x.summary, body: x.rw.body ?? x.body, translated: true } as unknown as T & { translated: boolean };
  return { ...x, category, translated: false } as unknown as T & { translated: boolean };
}

export function regBadge(r: Registration): { label: string; cls: string } | null {
  switch (r.state) {
    case 'open':
      if (r.mode === 'interest') return { label: 'Express interest', cls: 'bg-gold/30 text-ink' };
      return { label: r.seats_left !== null && r.seats_left <= 5 ? `${r.seats_left} ${r.seats_left === 1 ? 'seat' : 'seats'} left` : 'Registration open', cls: 'bg-green-tint text-teal-dark' };
    case 'waitlist': return { label: 'Waiting list', cls: 'bg-gold/30 text-ink' };
    case 'full': return { label: 'Full', cls: 'bg-ink/10 text-ink-soft' };
    case 'closed': return { label: 'Registration closed', cls: 'bg-ink/10 text-ink-soft' };
    case 'not_open': return { label: 'Opens soon', cls: 'bg-teal-tint text-teal-dark' };
    case 'cancelled': return { label: 'Cancelled', cls: 'bg-red-tint text-red-dark' };
    default: return null;
  }
}
export function eventCta(e: Pick<EventItem, 'registration' | 'status'>): string {
  if (e.status === 'cancelled') return 'View details';
  const r = e.registration;
  if (r.state === 'open') return r.mode === 'interest' ? 'Express interest' : 'Register';
  if (r.state === 'waitlist') return 'Join the waiting list';
  return 'View details';
}

const pad = (n: number) => String(n).padStart(2, '0');
const utc = (d: Date) => `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;
const esc = (s: string) => s.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
export function buildIcs(o: { uid: string; title: string; startsAt: string; endsAt?: string | null; location?: string; url?: string }): string {
  const s = new Date(o.startsAt); const e = o.endsAt ? new Date(o.endsAt) : new Date(s.getTime() + 2 * 3600 * 1000);
  return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Miveloo//Events//EN', 'BEGIN:VEVENT', `UID:${o.uid}@miveloo`, `DTSTAMP:${utc(new Date())}`,
    `DTSTART:${utc(s)}`, `DTEND:${utc(e)}`, `SUMMARY:${esc(o.title)}`, o.location ? `LOCATION:${esc(o.location)}` : '', o.url ? `URL:${o.url}` : '', 'END:VEVENT', 'END:VCALENDAR']
    .filter(Boolean).join('\r\n');
}
