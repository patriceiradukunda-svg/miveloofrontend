import Link from 'next/link';
import { PageHeader } from '@/components/layout/PageHeader';
import { content, safe, POST_STATUSES, EVENT_STATUSES } from '@/lib/server/content-admin';
import { Flash, Section, card, when } from './_ui';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Content' };
interface Dash {
  posts?: Record<string, Record<string, number>>; events?: Record<string, number>;
  recent_drafts?: { id?: string; kind: string; title: string; updated_at: string }[]; scheduled_next?: { id?: string; kind: string; title: string; scheduled_for: string }[];
}
const TILES = [['blog', 'Blog'], ['news', 'News'], ['events', 'Events'], ['media', 'Media library'], ['categories', 'Categories'], ['subscribers', 'Newsletter'], ['publish', 'Ready to publish'], ['scheduled', 'Scheduled'], ['calendar', 'Calendar'], ['translations', 'Translations'], ['activity', 'Activity']] as const;

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const { data: d, error } = await safe(content<Dash>('/dashboard'));
  return (
    <div className="space-y-8">
      <PageHeader title="Content" lead="Blog, news, events, media and newsletter in one place." />
      <Flash ok={sp.ok} error={error ?? sp.error} />
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{TILES.map(([h, l]) => <li key={h}><Link href={`/admin/content/${h}`} className={`${card} block font-semibold text-teal-dark hover:bg-cream-deep`}>{l}</Link></li>)}</ul>
      {d && (<>
        <div className="grid gap-6 lg:grid-cols-3">
          {(['blog', 'news'] as const).map((k) => d.posts?.[k] && (
            <Section key={k} title={k === 'blog' ? 'Blog posts' : 'News items'}><ul className="space-y-1 text-sm">{POST_STATUSES.map((s) => <li key={s} className="flex justify-between capitalize"><span>{s}</span><span className="font-semibold">{d.posts?.[k]?.[s] ?? 0}</span></li>)}</ul></Section>
          ))}
          {d.events && <Section title="Events"><ul className="space-y-1 text-sm">{EVENT_STATUSES.map((s) => <li key={s} className="flex justify-between capitalize"><span>{s}</span><span className="font-semibold">{d.events?.[s] ?? 0}</span></li>)}</ul></Section>}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {!!d.recent_drafts?.length && <Section title="Recent drafts"><ul className="space-y-1 text-sm">{d.recent_drafts.map((x, i) => <li key={x.id ?? i}><Link className="underline" href={`/admin/content/${x.kind}/${x.id ?? ''}`}>{x.title}</Link> <span className="text-ink-soft">· {when(x.updated_at)}</span></li>)}</ul></Section>}
          {!!d.scheduled_next?.length && <Section title="Going live next"><ul className="space-y-1 text-sm">{d.scheduled_next.map((x, i) => <li key={x.id ?? i}><Link className="underline" href={`/admin/content/${x.kind}/${x.id ?? ''}`}>{x.title}</Link> <span className="text-ink-soft">· {when(x.scheduled_for)}</span></li>)}</ul></Section>}
        </div>
      </>)}
    </div>
  );
}
