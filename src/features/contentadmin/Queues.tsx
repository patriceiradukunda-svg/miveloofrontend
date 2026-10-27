import Link from 'next/link';
import { PageHeader } from '@/components/layout/PageHeader';
import { content, safe, type AdminEvent, type AdminPost } from '@/lib/server/content-admin';
import { eventAction, postAction } from '@/app/admin/content/actions';
import { Demo, Flash, Hidden, StatusPill, btnGhost, btnGold, card, when } from '@/app/admin/content/_ui';

type Sp = Record<string, string | undefined>;
const posts = (q: string) => safe(content<{ items: AdminPost[] }>(`/posts?${q}&limit=200`));
const events = (q: string) => safe(content<{ items: AdminEvent[] }>(`/events?${q}&limit=200`));
interface Row { id: string; title: string; kind: string; href: string; at: string | null; demo: boolean; status: string; problems: string[]; translated: boolean }
const pRow = (x: AdminPost): Row => ({ id: x.id, title: x.title, kind: x.kind, href: `/admin/content/${x.kind}/${x.id}`, at: x.scheduled_for ?? x.published_at, demo: x.is_demo, status: x.status, problems: x.publish_problems, translated: !!x.rw?.title });
const eRow = (x: AdminEvent): Row => ({ id: x.id, title: x.title, kind: 'event', href: `/admin/content/events/${x.id}`, at: x.starts_at ?? x.scheduled_for, demo: x.is_demo, status: x.status, problems: x.publish_problems, translated: !!x.rw?.title });
const act = (r: Row) => (r.kind === 'event' ? eventAction : postAction);

function Shell({ title, lead, sp, error, children }: { title: string; lead: string; sp: Sp; error: string | null; children: React.ReactNode }) {
  return <div className="space-y-6"><PageHeader title={title} lead={lead} /><Flash ok={sp.ok} error={error ?? sp.error} />{children}</div>;
}
function List({ rows, back, action, empty }: { rows: Row[]; back: string; action?: string; empty: string }) {
  if (!rows.length) return <p className={`${card} text-sm text-ink-soft`}>{empty}</p>;
  return (
    <ul className="space-y-2">{rows.map((r) => (
      <li key={`${r.kind}${r.id}`} className={`${card} flex flex-wrap items-center justify-between gap-3`}>
        <div><Link href={r.href} className="font-semibold text-teal-dark underline">{r.title}</Link>{r.demo && <Demo />}
          <p className="text-xs text-ink-soft capitalize">{r.kind} · {r.at ? when(r.at) : 'no date'}</p>
          {!action && r.problems.length > 0 && <p className="mt-1 text-xs text-ink-soft">{r.problems.join(' ')}</p>}</div>
        <div className="flex items-center gap-2"><StatusPill status={r.status} />
          {action && <form action={act(r)}><Hidden values={{ id: r.id, kind: r.kind, action, back }} /><button className={action === 'publish' ? btnGold : btnGhost}>{action === 'publish' ? 'Publish' : 'Unschedule'}</button></form>}</div>
      </li>))}</ul>
  );
}

export async function ScheduledQueue({ sp }: { sp: Sp }) {
  const [p, e] = await Promise.all([posts('status=scheduled'), events('status=scheduled')]);
  const rows = [...(p.data?.items ?? []).map(pRow), ...(e.data?.items ?? []).map(eRow)].sort((a, b) => String(a.at).localeCompare(String(b.at)));
  return <Shell title="Scheduled" lead="Items that will go live automatically." sp={sp} error={p.error ?? e.error}><List rows={rows} back="/admin/content/scheduled" action="unpublish" empty="Nothing is scheduled." /></Shell>;
}
export async function CalendarView({ sp }: { sp: Sp }) {
  const [p, e] = await Promise.all([posts('status=scheduled'), events('when=upcoming')]);
  const rows = [...(p.data?.items ?? []).map(pRow), ...(e.data?.items ?? []).filter((x) => x.status !== 'archived').map(eRow)].sort((a, b) => String(a.at ?? '9').localeCompare(String(b.at ?? '9')));
  return <Shell title="Content calendar" lead="Upcoming events and posts scheduled to publish, in date order." sp={sp} error={p.error ?? e.error}><List rows={rows} back="/admin/content/calendar" empty="Nothing upcoming." /></Shell>;
}
export async function PublishQueue({ sp }: { sp: Sp }) {
  const [p, e] = await Promise.all([posts('status=draft'), events('status=draft')]);
  const all = [...(p.data?.items ?? []).map(pRow), ...(e.data?.items ?? []).map(eRow)];
  return (
    <Shell title="Ready to publish" lead="Drafts that meet the publishing rules, and what the others still need." sp={sp} error={p.error ?? e.error}>
      <h2 className="text-lg font-semibold text-teal-dark">Ready</h2>
      <List rows={all.filter((r) => !r.problems.length)} back="/admin/content/publish" action="publish" empty="No draft is ready yet." />
      <h2 className="text-lg font-semibold text-teal-dark">Needs work first</h2>
      <List rows={all.filter((r) => r.problems.length)} back="/admin/content/publish" empty="Every draft is ready." />
    </Shell>
  );
}
export async function TranslationsView({ sp }: { sp: Sp }) {
  const [p, e] = await Promise.all([posts('limit=200'), events('when=all')]);
  const rows = [...(p.data?.items ?? []).map(pRow), ...(e.data?.items ?? []).map(eRow)].filter((r) => !r.translated && r.status !== 'archived');
  return <Shell title="Translations" lead="Items with no Kinyarwanda title. Visitors who choose Kinyarwanda see the English text for these." sp={sp} error={p.error ?? e.error}><List rows={rows} back="/admin/content/translations" empty="Everything has a Kinyarwanda title." /></Shell>;
}
