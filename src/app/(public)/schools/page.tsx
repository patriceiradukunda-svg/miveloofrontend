import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getT } from '@/i18n/server';
import { Reveal } from '@/components/public/home/Reveal';
import { Bg, Eyebrow, Icon, P, gold, h1s, h2s, light, shadow, solid, wide } from '@/components/public/kit';

export const metadata: Metadata = {
  title: 'For schools',
  description: 'Miveloo helps verified schools find food, compare offers, order and track deliveries inside their own workspace.',
  alternates: { canonical: '/schools' },
};

export default async function SchoolsPage() {
  const { t } = await getT();
  const doing = [
    { d: ['M11 19a8 8 0 100-16 8 8 0 000 16z', 'M21 21l-4.3-4.3'], h: t('schools.a1', 'Find food'), b: t('schools.a1b', 'See what suppliers have listed for schools.') },
    { d: ['M4 7h16', 'M4 12h10', 'M4 17h6'], h: t('schools.a2', 'Compare offers'), b: t('schools.a2b', 'Look at indicative prices set by suppliers.') },
    { d: ['M3 4h2l2.4 10.4a1 1 0 00.98.8h8.2a1 1 0 00.98-.8L19 8H6', 'M9 20h.01', 'M17 20h.01'], h: t('schools.a3', 'Order'), b: t('schools.a3b', 'Place orders from your own workspace.') },
    { d: ['M3 7h11v9H3z', 'M14 10h4l3 3v3h-7z', 'M7 19.5h.01', 'M17 19.5h.01'], h: t('schools.a4', 'Track deliveries'), b: t('schools.a4b', 'Follow each order through to delivery.') },
  ];
  const checks = [
    t('schools.k1', 'Ordering sits inside your school’s own workspace.'),
    t('schools.k2', 'Verification applies where it is required.'),
    t('schools.k3', 'Prices are indicative and set by suppliers.'),
  ];
  const steps = [
    t('schools.s1', 'Register your school'),
    t('schools.s2', 'Complete verification where it applies'),
    t('schools.s3', 'Find, order and track inside your workspace'),
    t('schools.s4', 'Review your history and, optionally, advanced insights'),
  ];
  return (
    <>
      <Bg n="06-school-kitchen-cooks" pos="50% 45%" overlay="bg-gradient-to-r from-ink/90 via-ink/55 to-ink/10" className="flex min-h-[72svh] items-end">
        <div className={`${wide} rise space-y-6 pb-16 pt-32`}>
          <Eyebrow>{t('schools.eyebrow', 'For schools')}</Eyebrow>
          <h1 style={h1s} className={`max-w-5xl text-balance font-semibold leading-[1.04] tracking-tight ${shadow}`}>{t('schools.title', 'Food your school can count on.')}</h1>
          <p className="max-w-2xl text-lg text-cream/90 md:text-xl">{t('schools.lead', 'Find food, compare offers, order and track deliveries, all inside your school’s own workspace.')}</p>
          <div className="flex flex-wrap gap-3 pt-2"><Link href="/register/school" className={gold}>{t('schools.cta', 'Register your school')}</Link><Link href="/login" className={light}>{t('nav.login', 'Log in')}</Link></div>
        </div>
      </Bg>

      <section className={`${wide} py-24`}>
        <Reveal><Eyebrow dark={false}>{t('schools.wEyebrow', 'What you can do')}</Eyebrow><h2 style={h2s} className="mt-3 max-w-3xl text-balance font-semibold text-teal-dark">{t('schools.wTitle', 'Everything in one place')}</h2></Reveal>
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {doing.map((x, k) => (
            <li key={x.h}><Reveal delay={k * 90} className="h-full"><div className="h-full rounded-2xl border border-ink/10 bg-white p-7 shadow-card transition-transform duration-300 hover:-translate-y-1">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-teal text-cream"><Icon d={x.d} /></span>
              <h3 className="mt-5 text-xl font-semibold">{x.h}</h3><p className="mt-2 text-ink-soft">{x.b}</p>
            </div></Reveal></li>
          ))}
        </ul>
      </section>

      <section className="bg-cream-deep py-24">
        <div className={`${wide} grid items-center gap-12 lg:grid-cols-2`}>
          <Reveal><div className="relative aspect-[4/5] overflow-hidden rounded-blob shadow-card lg:max-w-xl"><Image src={`${P}03-school-canteen-serving.jpg`} alt="Children eating a meal in a school canteen" fill sizes="(min-width:1024px) 40vw, 100vw" className="object-cover" style={{ objectPosition: '45% 30%' }} /></div></Reveal>
          <Reveal delay={120}>
            <Eyebrow dark={false}>{t('schools.vEyebrow', 'Built for verified schools')}</Eyebrow>
            <h2 style={h2s} className="mt-3 text-balance font-semibold text-teal-dark">{t('schools.vTitle', 'Simple, careful and clearly yours')}</h2>
            <ul className="mt-6 space-y-3">{checks.map((c) => <li key={c} className="flex gap-3 text-lg text-ink-soft"><span aria-hidden className="mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-green text-sm font-bold text-white">✓</span>{c}</li>)}</ul>
            <p className="mt-6 text-ink-soft">{t('schools.vNote', 'Marketplace access opens after sign-in, for authorised schools and partners.')}</p>
          </Reveal>
        </div>
      </section>

      <section className={`${wide} py-24`}>
        <Reveal><Eyebrow dark={false}>{t('schools.gEyebrow', 'Getting started')}</Eyebrow><h2 style={h2s} className="mt-3 font-semibold text-teal-dark">{t('schools.gTitle', 'Four steps to your first order')}</h2></Reveal>
        <ol className="mt-10 grid gap-5 md:grid-cols-4">
          {steps.map((s, k) => (
            <li key={s}><Reveal delay={k * 90} className="h-full"><div className="relative h-full overflow-hidden rounded-2xl bg-white p-7 shadow-card">
              <span aria-hidden className="absolute -right-1 -top-5 font-display text-9xl font-bold text-gold/25">{k + 1}</span>
              <span className="relative grid h-10 w-10 place-items-center rounded-full bg-gold font-display text-lg font-bold">{k + 1}</span>
              <p className="relative mt-5 text-lg font-semibold">{s}</p>
            </div></Reveal></li>
          ))}
        </ol>
      </section>

      <section className="bg-cream-deep py-16">
        <div className={`${wide} flex flex-wrap items-center justify-between gap-6`}>
          <div className="max-w-2xl"><h2 style={h2s} className="font-semibold text-teal-dark">{t('schools.iTitle', 'Part of a programme or partner institution?')}</h2><p className="mt-2 text-lg text-ink-soft">{t('schools.iBody', 'Aggregated insight for programmes and policy.')}</p></div>
          <Link href="/institutions" className={solid}>{t('schools.iCta', 'For institutions')}</Link>
        </div>
      </section>

      <Bg n="01-market-baskets-produce" pos="50% 50%" overlay="bg-gradient-to-r from-ink/90 via-ink/70 to-ink/40" className="py-28 text-center">
        <Reveal className={wide}>
          <h2 style={h1s} className="mx-auto max-w-4xl text-balance font-semibold leading-[1.04]">{t('schools.endTitle', 'Ready to register your school?')}</h2>
          <div className="mt-8 flex flex-wrap justify-center gap-3"><Link href="/register/school" className={gold}>{t('schools.cta', 'Register your school')} <span aria-hidden className="ml-2">→</span></Link><Link href="/contact" className={light}>{t('schools.contact', 'Contact us')}</Link></div>
        </Reveal>
      </Bg>
    </>
  );
}
