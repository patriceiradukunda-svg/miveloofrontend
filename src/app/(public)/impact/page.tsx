import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getT } from '@/i18n/server';
import { Reveal } from '@/components/public/home/Reveal';
import { Bg, Eyebrow, Icon, gold, h1s, h2s, light, wide } from '@/components/public/kit';
import { PHOTO_CREDITS, resolvePhoto } from '@/lib/photos';

export const metadata: Metadata = {
  title: 'Mission and impact',
  description: 'Miveloo’s mission and vision, and how we will report impact: measured figures only, each with its source, period and method.',
  alternates: { canonical: '/impact' },
};

export default async function ImpactPage() {
  const { t } = await getT();
  const hills = resolvePhoto('hills');
  const commitments = [
    { d: ['M3 21h18', 'M5 21V10l7-5 7 5v11', 'M10 21v-5h4v5'], b: t('imp.c1', 'Help schools access the food they need.') },
    { d: ['M12 21v-8', 'M12 13c0-4 3-6 7-6 0 4-3 6-7 6z', 'M12 15c0-3-2-5-6-5 0 3 2 5 6 5z'], b: t('imp.c2', 'Help suppliers reach reliable markets.') },
    { d: ['M22 17l-8.5-8.5-5 5L2 7', 'M16 17h6v-6'], b: t('imp.c3', 'Reduce avoidable inefficiency in purchasing and distribution.') },
    { d: ['M3 3v18h18', 'M7 14l4-4 3 3 5-6'], b: t('imp.c4', 'Support better-informed school-feeding decisions with honest data.') },
  ];
  const future = [
    { h: t('imp.f1', 'Stronger connections'), b: t('imp.f1b', 'Schools and suppliers find each other without the guesswork.') },
    { h: t('imp.f2', 'Smarter decisions'), b: t('imp.f2b', 'Clearer information helps schools, suppliers and programmes plan ahead.') },
    { h: t('imp.f3', 'Less avoidable waste'), b: t('imp.f3b', 'Better information helps cut inefficiency in how school food is bought and delivered.') },
  ];
  const evidence = [
    { d: ['M4 4h16v16H4z', 'M9 9h6', 'M9 13h6'], h: t('imp.t1', 'Source'), b: t('imp.t1b', 'Where the number comes from.') },
    { d: ['M3 5h18v16H3z', 'M3 10h18', 'M8 3v4', 'M16 3v4'], h: t('imp.t2', 'Period'), b: t('imp.t2b', 'The time it covers.') },
    { d: ['M3 17L17 3l4 4L7 21z', 'M7 11l2 2', 'M10 8l2 2', 'M13 5l2 2'], h: t('imp.t3', 'Method'), b: t('imp.t3b', 'How it was measured.') },
  ];

  return (
    <>
      <section className="bg-cream-deep">
        <div className={`${wide} grid items-center gap-12 py-20 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16 lg:py-28`}>
          <div className="rise space-y-6">
            <Eyebrow dark={false}>{t('imp.eyebrow', 'Mission and impact')}</Eyebrow>
            <h1 style={h2s} className="max-w-3xl text-balance font-semibold leading-[1.1] tracking-tight text-teal-dark">{t('imp.title', 'We publish measured impact only when we have evidence.')}</h1>
            <p className="max-w-2xl text-lg text-ink-soft md:text-xl">{t('imp.lead', 'Miveloo is early-stage. We label what is live, what is in development and what is planned.')}</p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link href="/how-it-works" className={gold}>{t('nav.howItWorks', 'How it works')} <span aria-hidden className="ml-2">→</span></Link>
              <Link href="/contact" className="inline-flex min-h-12 items-center px-2 font-bold text-teal-dark underline">{t('imp.contact', 'Contact us')}</Link>
            </div>
          </div>
          {hills ? (
            <div className="rise relative aspect-[4/3] overflow-hidden rounded-blob shadow-card lg:max-w-xl lg:justify-self-end">
              <Image src={hills.src} alt={t('imp.altHills', 'Farmland on the hills of Rwanda')} fill priority sizes="(min-width:1024px) 40vw, 100vw" className="object-cover" />
              <span className="absolute bottom-3 right-3 rounded bg-ink/75 px-2 py-1 text-[0.7rem] text-cream">{t('imp.photo', 'Photo')}: {PHOTO_CREDITS[hills.key]}</span>
            </div>
          ) : null}
        </div>
      </section>

      <section className="py-24">
        <div className={`${wide} grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16`}>
          <Reveal className="space-y-5 lg:sticky lg:top-32 lg:self-start">
            <Eyebrow dark={false}>{t('imp.mEyebrow', 'Our mission')}</Eyebrow>
            <h2 style={h2s} className="text-balance font-semibold text-teal-dark">{t('imp.mTitle', 'Make school feeding more reliable.')}</h2>
            <h3 className="pt-2 text-xs font-bold uppercase tracking-[0.16em] text-teal">{t('imp.why', 'Why we exist')}</h3>
            <p className="max-w-xl text-lg text-ink-soft">{t('imp.whyB', 'School feeding depends on food reaching kitchens reliably. Miveloo helps schools find food, helps suppliers reach dependable markets, and uses honest data to reduce avoidable waste and inefficiency.')}</p>
          </Reveal>
          <ul className="grid gap-5 sm:grid-cols-2">
            {commitments.map((x, k) => (
              <li key={x.b}>
                <Reveal delay={k * 90} className="h-full">
                  <div className="h-full rounded-2xl border border-ink/10 bg-white p-7 shadow-card">
                    <span className="grid h-12 w-12 place-items-center rounded-full bg-teal text-cream"><Icon d={x.d} /></span>
                    <p className="mt-5 text-lg font-semibold text-ink">{x.b}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-teal-dark py-24 text-cream">
        <div className={wide}>
          <Reveal>
            <Eyebrow>{t('imp.vEyebrow', 'Our vision')}</Eyebrow>
            <h2 style={h1s} className="mt-4 max-w-4xl text-balance font-semibold leading-[1.04]">{t('imp.vTitle', 'A better food future')}</h2>
          </Reveal>
          <ul className="mt-12 grid gap-5 md:grid-cols-3">
            {future.map((f, k) => (
              <li key={f.h}>
                <Reveal delay={k * 90} className="h-full">
                  <div className="h-full rounded-2xl border border-cream/20 bg-cream/10 p-7">
                    <h3 className="font-display text-xl font-semibold">{f.h}</h3>
                    <p className="mt-2 text-cream/90">{f.b}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-cream-deep py-24">
        <div className={wide}>
          <Reveal>
            <Eyebrow dark={false}>{t('imp.eEyebrow', 'Evidence')}</Eyebrow>
            <h2 style={h2s} className="mt-3 max-w-3xl text-balance font-semibold text-teal-dark">{t('imp.eTitle', 'How we report impact')}</h2>
          </Reveal>
          <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
            <Reveal className="h-full">
              <div className="h-full rounded-2xl border border-ink/10 bg-white p-7 shadow-card sm:p-8">
                <h3 className="text-2xl font-semibold text-teal-dark">{t('imp.status', 'Current status')}</h3>
                <ul className="mt-4 space-y-3">
                  {[t('imp.s1', 'Miveloo has no published impact figures yet. When we do, each number will show its source, period and method.'), t('imp.s2', 'Anything shown elsewhere labelled “Sample data” is illustrative and not a real transaction.')].map((c) => (
                    <li key={c} className="flex gap-3 text-lg text-ink-soft"><span aria-hidden className="mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-green text-sm font-bold text-white">✓</span>{c}</li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <ul className="grid gap-4">
              {evidence.map((x, k) => (
                <li key={x.h}>
                  <Reveal delay={k * 90}>
                    <div className="flex items-center gap-4 rounded-2xl border border-ink/10 bg-white p-5 shadow-card">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-teal-tint text-teal"><Icon d={x.d} /></span>
                      <div><p className="font-semibold text-ink">{x.h}</p><p className="text-ink-soft">{x.b}</p></div>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
          <Reveal className="mt-6">
            <div className="rounded-2xl border border-gold/40 bg-gold-tint p-6 sm:p-8">
              <h3 className="text-xl font-semibold text-teal-dark sm:text-2xl">{t('imp.todayH', 'Where we are today')}</h3>
              <p className="mt-2 max-w-4xl text-lg text-ink-soft">{t('imp.todayB', 'Miveloo is early-stage. We label what is live, what is in development and what is planned, and we publish no customer, coverage or impact numbers we cannot prove.')}</p>
            </div>
          </Reveal>
        </div>
      </section>

      <Bg n="09-bananas-plantains" pos="30% 50%" overlay="bg-gradient-to-r from-ink/90 via-ink/70 to-ink/40" className="py-28 text-center">
        <Reveal className={wide}>
          <h2 style={h1s} className="mx-auto max-w-4xl text-balance font-semibold leading-[1.04]">{t('imp.endTitle', 'Ready to get started?')}</h2>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/register" className={gold}>{t('imp.cta', 'Get Started')} <span aria-hidden className="ml-2">→</span></Link>
            <Link href="/sell" className={light}>{t('how.supCta', 'Become a Supplier')}</Link>
          </div>
          <p className="mx-auto mt-10 max-w-xl text-sm text-cream/80">{t('home2.photoNote', 'Photographs are illustrative and do not depict verified Miveloo users. Marketplace access is available to authorised schools and partners after sign-in.')}</p>
        </Reveal>
      </Bg>
    </>
  );
}
