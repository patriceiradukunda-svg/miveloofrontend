import 'server-only';
import { api, API_BASE, ApiError } from '@/lib/miveloo-client';
import { withBackendToken } from '@/lib/server/backend-session';

export const POST_STATUSES = ['draft', 'scheduled', 'published', 'archived'] as const;
export const EVENT_STATUSES = ['draft', 'scheduled', 'published', 'cancelled', 'archived'] as const;
export const EVENT_FORMATS = [['tbc', 'To be confirmed'], ['in_person', 'In person'], ['online', 'Online'], ['hybrid', 'In person and online']] as const;
export const REG_MODES = [['none', 'No registration'], ['interest', 'Interest only'], ['required', 'Registration required']] as const;
export const REG_STATUSES = ['confirmed', 'waitlisted', 'interested', 'cancelled', 'attended', 'no_show'] as const;

type Rw = { title?: string; summary?: string; body?: string } | null;
type CatRef = { id: string; name: string } | null;
export interface AdminPost {
  id: string; kind: 'blog' | 'news'; slug: string; title: string; summary: string | null; body: string | null; category_id: string | null; category: CatRef;
  cover_url: string | null; cover_media_id: string | null; cover_alt: string | null; author_name: string | null; tags: string[] | null;
  seo_title: string | null; seo_description: string | null; rw: Rw; status: string; is_featured: boolean; published_at: string | null;
  scheduled_for: string | null; is_demo: boolean; updated_at: string; live: boolean; publish_problems: string[];
}
export interface AdminEvent {
  id: string; slug: string; title: string; summary: string | null; body: string | null; category_id: string | null; category: CatRef;
  cover_url: string | null; cover_media_id: string | null; cover_alt: string | null; starts_at: string | null; ends_at: string | null; date_note: string | null;
  format: string; venue: string | null; city: string | null; address: string | null; online_url: string | null; contact_email: string | null;
  registration_mode: string; registration_opens_at: string | null; registration_closes_at: string | null; capacity: number | null; waitlist_enabled: boolean;
  registration_note: string | null; seo_title: string | null; seo_description: string | null; rw: Rw; status: string; is_featured: boolean;
  published_at: string | null; scheduled_for: string | null; is_demo: boolean; updated_at: string; live: boolean; publish_problems: string[];
}
export interface AdminReg { id: string; reference: string; status: string; full_name: string; email: string; phone: string | null; organisation: string | null; attendees: number; message: string | null; staff_note: string | null; created_at: string; is_demo: boolean }
export interface MediaItem { id: string; url: string; filename: string; size_bytes: number; alt: string | null; credit: string | null; created_at: string }
export interface Category { id: string; kind: string; slug: string; name: string; name_rw: string | null; sort_order: number; active: boolean }
export interface Subscriber { id: string; email: string; name: string | null; language: string; source: string | null; status: string; created_at: string; is_demo: boolean }
export interface ActivityRow { actor_name: string | null; entity_type: string; action: string; created_at: string; is_demo: boolean }

export function asList<T>(x: unknown): T[] {
  if (Array.isArray(x)) return x as T[];
  const items = (x as { items?: unknown } | null)?.items;
  return Array.isArray(items) ? (items as T[]) : [];
}
export function qs(o: Record<string, unknown>): string {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(o)) if (v !== undefined && v !== null && v !== '') p.set(k, String(v));
  const t = p.toString(); return t ? `?${t}` : '';
}
export function content<T = unknown>(path: string, init: { method?: string; body?: unknown } = {}): Promise<T> {
  return withBackendToken((token) => api<T>(`/admin/content${path}`, { ...init, token, cache: 'no-store' }));
}
export function contentText(path: string): Promise<{ body: string; type: string }> {
  return withBackendToken(async (token) => {
    const res = await fetch(`${API_BASE}/admin/content${path}`, { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' });
    if (!res.ok) throw new ApiError(res.status, res.statusText);
    return { body: await res.text(), type: res.headers.get('content-type') ?? 'text/csv' };
  });
}
export function errorText(e: unknown): string {
  if (e instanceof ApiError) return e.status === 403 ? 'Your position does not allow this part of the content workspace.' : e.status === 401 ? 'Your session expired. Please sign in again.' : e.message;
  return 'Could not reach the backend.';
}
export async function safe<T>(p: Promise<T>): Promise<{ data: T | null; error: string | null }> {
  try { return { data: await p, error: null }; } catch (e) { return { data: null, error: errorText(e) }; }
}
