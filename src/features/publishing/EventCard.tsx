import Link from 'next/link';
import { Cover } from './Cover';
import { DateTile, Pill, RegBadge, SampleTag } from './bits';
import { dateTile, eventCta, placeText, whenText, type LEvent } from './shared';

export function EventCard({ ev, href }: { ev: LEvent; href: string }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-card transition hover:-translate-y-0.5">
      <Link href={href} tabIndex={-1} aria-hidden="true" className="relative block aspect-[16/10] overflow-hidden">
        <Cover fill cover={ev.cover} alt={ev.cover_alt} label={ev.category?.name ?? 'Miveloo event'} seed={ev.slug} /><DateTile tile={dateTile(ev.starts_at)} />
      </Link>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center gap-2">{ev.category && <Pill>{ev.category.name}</Pill>}<RegBadge reg={ev.registration} />{ev.is_demo && <SampleTag />}</div>
        <h3 className="mt-3 text-xl font-semibold leading-snug text-teal-dark"><Link href={href} className="hover:underline">{ev.title}</Link></h3>
        {ev.summary && <p className="mt-2 text-ink-soft">{ev.summary}</p>}
        <ul className="mt-4 flex-1 space-y-1 text-sm text-ink-soft"><li><span aria-hidden>◷ </span>{whenText(ev)}</li><li><span aria-hidden>⌖ </span>{placeText(ev)}</li></ul>
        <Link href={href} className="mt-5 inline-flex min-h-11 items-center font-bold text-teal underline underline-offset-4">{eventCta(ev)} <span aria-hidden className="ml-1">→</span></Link>
      </div>
    </article>
  );
}
