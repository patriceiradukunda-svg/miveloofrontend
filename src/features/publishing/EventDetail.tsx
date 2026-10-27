import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { EmptyState } from '@/components/ui/empty-state';
import { wide } from '@/components/public/kit';
import { getT } from '@/i18n/server';
import { Cover } from './Cover';
import { Markdown } from './Markdown';
import { NewsletterBand } from './NewsletterBand';
import { RegisterForm } from './RegisterForm';
import { Pill, RegBadge, SampleTag } from './bits';
import { getEvent, getLocale } from './server';
import { FORMAT_LABEL, fmtDateTime, localize, placeText, whenText, type LEvent } from './shared';

export async function eventMetadata(slug: string): Promise<Metadata> {
  const r = await getEvent(slug);
  if (r.status !== 'ok') return { title: 'Event', robots: { index: false } };
  const e = r.data; const title = e.seo_title || e.title; const description = e.seo_description || e.summary || undefined;
  return { title, description, alternates: { canonical: `/events/${e.slug}` }, robots: e.is_demo ? { index: false, follow: true } : undefined, openGraph: { title, description, type: 'website' } };
}

function Panel({ ev }: { ev: LEvent }) {
  const r = ev.registration; const contact = ev.contact_email;
  const box = 'rounded-2xl border border-ink/10 bg-white p-6 shadow-card';
  const help = contact ? <a className="font-bold underline" href={`mailto:${contact}`}>{contact}</a> : <Link className="font-bold underline" href="/contact">Contact us</Link>;
  if (r.state === 'none') return <div className={box}><h2 className="text-xl font-semibold text-teal-dark">Registration</h2><p className="mt-2 text-ink-soft">No registration is needed for this event. Questions? {help}</p></div>;
  if (r.state === 'cancelled') return <div className={`${box} bg-red-tint`}><h2 className="text-xl font-semibold text-red-dark">This event has been cancelled</h2><p className="mt-2">Questions? {help}</p></div>;
  if (r.state === 'closed') return <div className={box}><h2 className="text-xl font-semibold text-teal-dark">{ev.is_past ? 'This event has ended' : 'Registration has closed'}</h2><p className="mt-2 text-ink-soft">Questions? {help}</p></div>;
  if (r.state === 'not_open') return <div className={box}><h2 className="text-xl font-semibold text-teal-dark">Registration opens soon</h2><p className="mt-2 text-ink-soft">{r.opens_at ? `Registration opens on ${fmtDateTime(r.opens_at)}.` : 'Check back soon.'}</p></div>;
  if (r.state === 'full') return <div className={box}><h2 className="text-xl font-semibold text-teal-dark">This event is full</h2><p className="mt-2 text-ink-soft">Questions or want to be considered if a seat opens? {help}</p></div>;
  return (
    <div className={box}>
      <h2 className="text-xl font-semibold text-teal-dark">{r.mode === 'interest' ? 'Express your interest' : r.state === 'waitlist' ? 'Join the waiting list' : 'Register to attend'}</h2>
      {r.seats_left !== null && r.state === 'open' && <p className="mt-1 text-sm font-semibold text-teal">{r.seats_left} {r.seats_left === 1 ? 'seat' : 'seats'} left</p>}
      {r.closes_at && <p className="mt-1 text-sm text-ink-soft">Registration closes {fmtDateTime(r.closes_at)}.</p>}
      <div className="mt-4"><RegisterForm slug={ev.slug} title={ev.title} mode={r.mode === 'interest' ? 'interest' : 'required'} state={r.state === 'waitlist' ? 'waitlist' : 'open'} seatsLeft={r.seats_left}
        note={ev.registration_note ?? null} startsAt={ev.starts_at} endsAt={ev.ends_at} place={placeText(ev)} /></div>
    </div>
  );
}

export async function EventDetail({ slug }: { slug: string }) {
  const { t } = await getT(); const locale = await getLocale(); const r = await getEvent(slug);
  if (r.status === 'missing') notFound();
  if (r.status !== 'ok') return <div className={`${wide} py-24`}><EmptyState title="This page is temporarily unavailable" body="We could not load this event. Please try again in a few minutes." /></div>;
  const ev = localize(r.data, locale);
  return (
    <>
      <header className="bg-cream-deep pb-10 pt-16">
        <div className={`${wide} space-y-4`}>
          <nav aria-label="Breadcrumb" className="text-sm text-ink-soft"><Link href="/" className="underline">Home</Link> / <Link href="/events" className="underline">Events</Link></nav>
          <div className="flex flex-wrap items-center gap-2">{ev.category && <Pill>{ev.category.name}</Pill>}<RegBadge reg={ev.registration} />{ev.is_demo && <SampleTag />}</div>
          <h1 className="max-w-4xl text-balance font-display text-4xl font-semibold leading-tight text-teal-dark md:text-5xl">{ev.title}</h1>
          {ev.summary && <p className="max-w-3xl text-xl text-ink-soft">{ev.summary}</p>}
        </div>
      </header>
      <div className={`${wide} grid gap-10 py-12 lg:grid-cols-[minmax(0,1fr)_24rem]`}>
        <div className="space-y-8">
          {ev.is_demo && <p className="rounded-xl bg-gold/20 p-4 text-sm font-semibold">This is a sample event created to show how the page and registration work.</p>}
          {locale === 'rw' && !ev.translated && <p className="rounded-xl bg-teal-tint p-4 text-sm font-semibold">{t('pub.englishOnly', 'This article is available in English only.')}</p>}
          {ev.cover && <div className="relative aspect-[16/9] overflow-hidden rounded-2xl"><Cover fill cover={ev.cover} alt={ev.cover_alt} label={ev.category?.name ?? 'Miveloo event'} seed={ev.slug} /></div>}
          <Markdown text={ev.body ?? ''} />
        </div>
        <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
          <dl className="space-y-3 rounded-2xl border border-ink/10 bg-white p-6 shadow-card">
            <div><dt className="text-sm text-ink-soft">When</dt><dd className="font-semibold text-teal-dark">{whenText(ev)}{ev.starts_at && <span className="font-normal text-ink-soft"> (Kigali time)</span>}</dd></div>
            <div><dt className="text-sm text-ink-soft">Where</dt><dd className="font-semibold text-teal-dark">{placeText(ev)}{ev.address && <span className="block font-normal text-ink-soft">{ev.address}</span>}</dd></div>
            <div><dt className="text-sm text-ink-soft">Format</dt><dd>{FORMAT_LABEL[ev.format]}{(ev.format === 'online' || ev.format === 'hybrid') && <span className="block text-sm text-ink-soft">The joining link is shown after you register.</span>}</dd></div>
            {ev.contact_email && <div><dt className="text-sm text-ink-soft">Contact</dt><dd><a className="underline" href={`mailto:${ev.contact_email}`}>{ev.contact_email}</a></dd></div>}
          </dl>
          <Panel ev={ev} />
        </aside>
      </div>
      <NewsletterBand source="event-page" language={locale} />
    </>
  );
}
