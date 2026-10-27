import 'server-only';
import { cookies } from 'next/headers';
import { api, ApiError } from '@/lib/miveloo-client';
import { LOCALE_COOKIE } from '@/lib/constants';
import type { EventItem, Locale, Post } from './shared';

export async function getLocale(): Promise<Locale> { return (await cookies()).get(LOCALE_COOKIE)?.value === 'rw' ? 'rw' : 'en'; }

export type Res<T> = { status: 'ok'; data: T } | { status: 'missing' } | { status: 'error' };
async function call<T>(path: string, fresh = false): Promise<Res<T>> {
  try { return { status: 'ok', data: await api<T>(path, fresh ? { cache: 'no-store' } : { revalidate: 60 }) }; }
  catch (e) { return e instanceof ApiError && e.status === 404 ? { status: 'missing' } : { status: 'error' }; }
}
export const getPosts = (kind: 'blog' | 'news') => call<{ items: Post[]; total: number }>(`/content/posts?kind=${kind}&limit=100`);
export const getPost = (kind: 'blog' | 'news', slug: string) => call<Post>(`/content/posts/${kind}/${encodeURIComponent(slug)}`);
export const getEvents = () => call<{ items: EventItem[]; total: number }>('/content/events?when=all&limit=100', true);
export const getEvent = (slug: string) => call<EventItem>(`/content/events/${encodeURIComponent(slug)}`, true);
