import Link from 'next/link';
import { h2s, solid } from '@/components/public/kit';
import { Cover } from './Cover';
import { DateTile, RegBadge, SampleTag } from './bits';
import { dateTile, eventCta, placeText, whenText, type LEvent } from './shared';

export function FeaturedEvent({ ev, href, label }: { ev: LEvent; href: string; label: string }) {
  return (
    <article className="grid overflow-hidden rounded-3xl border border-ink/10 bg-white shadow-card lg:grid-cols-[1.15fr_1fr]">
      <Link href={href} aria-label={ev.title} className="relative block aspect-[16/10] lg:aspect-auto lg:min-h-[26rem]"><Cover fill cover={ev.cover} alt={ev.cover_alt} label={ev.category?.name ?? 'Miveloo event'} seed={ev.slug} /><DateTile tile={dateTile(ev.starts_at)} /></Link>
      <div className="flex flex-col justify-center gap-4 p-8 sm:p-12">
        <p className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[0.14em]"><span className="rounded-full bg-gold/30 px-3 py-1 text-ink">{label}</span>{ev.category && <span className="text-teal">{ev.category.name}</span>}<RegBadge reg={ev.registration} />{ev.is_demo && <SampleTag />}</p>
        <h2 style={h2s} className="text-balance font-semibold leading-[1.1] text-teal-dark">{ev.title}</h2>
        {ev.summary && <p className="text-lg text-ink-soft">{ev.summary}</p>}
        <ul className="space-y-1 text-ink-soft"><li><span aria-hidden>◷ </span>{whenText(ev)}</li><li><span aria-hidden>⌖ </span>{placeText(ev)}</li></ul>
        <div><Link href={href} className={solid}>{eventCta(ev)} <span aria-hidden className="ml-2">→</span></Link></div>
      </div>
    </article>
  );
}
