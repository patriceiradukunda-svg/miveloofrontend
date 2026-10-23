import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getT } from '@/i18n/server';
import { Reveal } from '@/components/public/home/Reveal';
import { Bg, Icon, P, gold, h1s, h2s, light, shadow, solid, wide } from '@/components/public/kit';
import { StatusBadge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'About Miveloo',
  description: 'Miveloo is a school food marketplace and food-system intelligence platform that connects verified schools with the people who grow and supply food, starting in Rwanda.',
  alternates: { canonical: '/about' },
};

export default async function AboutPage() {
  const { t } = await getT();
  const pillars = [
    { d: ['M3 9l1-5h16l1 5', 'M4 9v11h16V9', 'M9 20v-6h6v6'], s: 'available' as const, h: t('about2.p1h', 'A private marketplace'), b: t('about2.p1b', 'Verified schools compare offers and order inside their own workspace. Suppliers publish only what they choose to share.'), href: '/how-it-works', cta: t('about2.p1c', 'See how it works') },
    { d: ['M3 7h11v9H3z', 'M14 10h4l3 3v3h-7z', 'M7 19.5h.01', 'M17 19.5h.01'], s: 'in-development' as const, h: t('about2.p2h', 'Tools for every step'), b: t('about2.p2b', 'Orders, deliveries, inventory and meal planning for schools, and stock and order tools for suppliers and cooperatives.'), href: '/roadmap', cta: t('about2.p2c', 'View the roadmap') },
    { d: ['M3 3v18h18', 'M7 14l4-4 3 3 5-6'], s: 'in-development' as const, h: t('about2.p3h', 'Honest data and AI'), b: t('about2.p3b', 'Forecasts and alerts are shown as estimates, with their data period and assumptions. When data is thin, we say so.'), href: '/ai-intelligence', cta: t('about2.p3c', 'How our AI works') },
  ];
  const serve = [
    { h: t('about2.a1', 'Schools'), b: t('about2.a1b', 'Find food, compare offers, order and track deliveries.'), href: '/schools' },
    { h: t('about2.a2', 'Individual suppliers'), b: t('about2.a2b', 'Farmers and traders reaching dependable school demand.'), href: '/sell' },
    { h: t('about2.a3', 'Cooperatives and groups'), b: t('about2.a3b', 'Combine members\' harvests to answer bigger orders.'), href: '/cooperatives' },
    { h: t('about2.a4', 'Institutions and partners'), b: t('about2.a4b', 'Aggregated insight for programmes and policy.'), href: '/institutions' },
  ];
  const board: { h: string; s: 'available' | 'in-development' | 'planned' | 'agreement' }[] = [
    { h: t('about2.b1', 'Core marketplace for verified schools'), s: 'available' },
    { h: t('about2.b2', 'School and supplier operations'), s: 'in-development' },
    { h: t('about2.b3', 'AI forecasts and alerts'), s: 'in-development' },
    { h: t('about2.b4', 'School-to-school exchange'), s: 'planned' },
    { h: t('about2.b5', 'Institutional intelligence'), s: 'agreement' },
  ];
  const principles = [
    { d: ['M5 11h14v9H5z', 'M8 11V8a4 4 0 018 0v3'], h: t('about2.r1h', 'Private by design'), b: t('about2.r1b', 'School data stays private. Institutions see aggregated or anonymised views under agreement.') },
    { d: ['M21 21l-4.3-4.3', 'M11 18a7 7 0 100-14 7 7 0 000 14'], h: t('about2.r2h', 'Honest about what is real'), b: t('about2.r2b', 'We label what is live, in development and planned, and we publish no figure we cannot prove.') },
    { d: ['M12 3v18', 'M5 8h14', 'M5 8l-3 7a3 3 0 006 0l-3-7z', 'M19 8l-3 7a3 3 0 006 0l-3-7z'], h: t('about2.r3h', 'Fair to both sides'), b: t('about2.r3b', 'Schools need dependable food and suppliers need dependable markets. We build for both.') },
    { d: ['M12 2a10 10 0 100 20 10 10 0 000-20z', 'M2 12h20', 'M12 2a15 15 0 010 20', 'M12 2a15 15 0 000 20'], h: t('about2.r4h', 'Easy for everyone'), b: t('about2.r4b', 'Built for low-cost phones and slow connections, in English and Kinyarwanda.') },
  ];
  return (
    <>
      <Bg n="05-farmer-harvesting-greens" pos="50% 45%" overlay="bg-gradient-to-r from-ink/90 via-ink/60 to-ink/10" className="flex min-h-[72svh] items-end">
        <div className={`${wide} rise space-y-6 pb-16 pt-32`}>
          <h1 style={h1s} className={`max-w-5xl text-balance font-semibold leading-[1.04] tracking-tight ${shadow}`}>{t('about2.title', 'Making school feeding more reliable, starting in Rwanda.')}</h1>
          <p className="max-w-2xl text-lg text-cream/90 md:text-xl">{t('about2.lead', 'Miveloo is a school food marketplace and food-system intelligence platform that connects verified schools with the people who grow and supply food.')}</p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link href="/register" className={gold}>{t('how.cta', 'Get Started')} <span aria-hidden className="ml-2">→</span></Link>
            <Link href="/about/team" className={light}>{t('about2.team', 'Meet the team')}</Link>
          </div>
        </div>
      </Bg>

      <section className="py-24">
        <div className={`${wide} grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16`}>
          <Reveal className="lg:sticky lg:top-32 lg:self-start">
            <h2 style={h2s} className="mt-3 text-balance font-semibold text-teal-dark">{t('about2.wTitle', 'A school meal only works when the food arrives.')}</h2>
          </Reveal>
          <Reveal delay={100} className="space-y-6 text-lg text-ink-soft">
            <p>{t('about2.w1', 'School feeding depends on food reaching kitchens reliably: on time, fresh and at a fair price. When schools cannot easily find dependable suppliers, and suppliers cannot easily reach dependable buyers, purchasing becomes harder and more wasteful than it needs to be.')}</p>
            <p>{t('about2.w2', 'Miveloo connects the two sides, and uses honest data to help everyone in the chain make better decisions: what to buy, what to grow, and where food is needed.')}</p>
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl shadow-card">
              <Image src={`${P}13-farmer-carrying-sack.jpg`} alt={t('about2.wAlt', 'A farmer carrying a sack of produce')} fill sizes="(min-width:1024px) 55vw, 100vw" className="object-cover" style={{ objectPosition: '50% 40%' }} />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-cream-deep py-24">
        <div className={wide}>
          <Reveal>
            <p className="mx-auto max-w-3xl text-balance text-center font-display text-2xl font-semibold italic text-teal-dark md:text-3xl">{t('brand.tagline', 'Nta Zindi Ngorane. Ibisubizo Byose Biri Imbere Yawe.')}</p>
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <Reveal className="h-full">
              <article id="mission" className="h-full scroll-mt-28 rounded-3xl bg-teal p-8 text-cream sm:p-12">
                <h2 className="flex items-center gap-3 text-sm font-bold uppercase tracking-[0.16em] text-cream/80"><span aria-hidden className="h-px w-8 bg-current" />{t('about2.mEyebrow', 'Our mission')}</h2>
                <p className="mt-5 text-balance text-xl leading-relaxed md:text-2xl">{t('brand.mission', 'To connect schools, food suppliers, cooperatives, and institutions through accessible solutions and intelligent technology that make food sourcing, supply management, and school meal planning easier, smarter, and more efficient.')}</p>
              </article>
            </Reveal>
            <Reveal delay={120} className="h-full">
              <article id="vision" className="h-full scroll-mt-28 rounded-3xl bg-gold p-8 text-ink sm:p-12">
                <h2 className="flex items-center gap-3 text-sm font-bold uppercase tracking-[0.16em] text-ink/70"><span aria-hidden className="h-px w-8 bg-current" />{t('about2.vEyebrow', 'Our vision')}</h2>
                <p className="mt-5 text-balance text-xl leading-relaxed md:text-2xl">{t('brand.vision', 'To create a future where every school can access the food it needs, suppliers can reach the markets they serve, and the entire school food system operates through reliable connections, informed decisions, and intelligent solutions.')}</p>
              </article>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className={wide}>
          <Reveal>
            <h2 style={h2s} className="mt-3 max-w-3xl text-balance font-semibold text-teal-dark">{t('about2.pTitle', 'One platform, three layers')}</h2>
          </Reveal>
          <ul className="mt-10 grid gap-6 lg:grid-cols-3">
            {pillars.map((x, k) => (
              <li key={x.h}>
                <Reveal delay={k * 120} className="h-full">
                  <article className="flex h-full flex-col rounded-2xl border border-ink/10 bg-white p-7 shadow-card sm:p-8">
                    <div className="flex items-center justify-between gap-3">
                      <span className="grid h-12 w-12 place-items-center rounded-full bg-teal text-cream"><Icon d={x.d} /></span>
                      <StatusBadge status={x.s} />
                    </div>
                    <h3 className="mt-5 text-2xl font-semibold text-teal-dark">{x.h}</h3>
                    <p className="mt-2 flex-1 text-lg text-ink-soft">{x.b}</p>
                    <Link href={x.href} className="mt-5 inline-flex min-h-11 items-center font-bold text-teal underline underline-offset-4">{x.cta} →</Link>
                  </article>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Bg n="06-school-kitchen-cooks" pos="50% 40%" overlay="bg-gradient-to-r from-ink/90 via-ink/75 to-ink/40" className="py-28">
        <div className={wide}>
          <Reveal className="max-w-3xl space-y-4">
            <h2 style={h2s} className={`text-balance font-semibold leading-[1.08] ${shadow}`}>{t('about2.sTitle', 'Everyone in the school food chain.')}</h2>
          </Reveal>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {serve.map((x, k) => (
              <li key={x.h}>
                <Reveal delay={k * 90} className="h-full">
                  <Link href={x.href} className="flex h-full flex-col rounded-2xl border border-cream/30 bg-cream/10 p-6 backdrop-blur-sm transition-colors hover:bg-cream/20">
                    <h3 className="text-xl font-semibold">{x.h}</h3>
                    <p className="mt-2 flex-1 text-cream/85">{x.b}</p>
                    <span aria-hidden className="mt-4 font-bold text-gold">→</span>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </Bg>

      <section className="py-24">
        <div className={`${wide} grid items-start gap-12 lg:grid-cols-2 lg:gap-16`}>
          <Reveal>
            <h2 style={h2s} className="mt-3 text-balance font-semibold text-teal-dark">{t('about2.tTitle', 'Early-stage, and honest about it.')}</h2>
            <p className="mt-4 text-lg text-ink-soft">{t('about2.tBody', 'We label what is live, what is in development and what is planned, and we publish no customer, coverage or impact numbers we cannot prove.')}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/roadmap" className={solid}>{t('about2.road', 'View the roadmap')}</Link>
              <Link href="/trust" className="inline-flex min-h-12 items-center justify-center rounded-full border-2 border-teal px-6 font-bold text-teal hover:bg-teal-tint">{t('about2.trust', 'Trust centre')}</Link>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <ul className="divide-y divide-ink/10 rounded-2xl border border-ink/10 bg-white shadow-card">
              {board.map((x) => (
                <li key={x.h} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 sm:px-6">
                  <span className="text-lg font-semibold text-teal-dark">{x.h}</span>
                  <StatusBadge status={x.s} />
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="bg-cream-deep py-24">
        <div className={wide}>
          <Reveal>
            <h2 style={h2s} className="mt-3 max-w-3xl text-balance font-semibold text-teal-dark">{t('about2.rTitle', 'What we hold ourselves to')}</h2>
          </Reveal>
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {principles.map((v, k) => (
              <li key={v.h}>
                <Reveal delay={k * 100} className="h-full">
                  <div className="h-full rounded-2xl border border-ink/10 bg-white p-6 shadow-card">
                    <span className="grid h-12 w-12 place-items-center rounded-full bg-teal text-cream"><Icon d={v.d} /></span>
                    <h3 className="mt-4 text-xl font-semibold text-teal-dark">{v.h}</h3>
                    <p className="mt-2 text-ink-soft">{v.b}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Bg n="10-grains-legumes-bowls" pos="50% 50%" overlay="bg-gradient-to-r from-ink/90 via-ink/70 to-ink/40" className="py-28 text-center">
        <Reveal className={wide}>
          <h2 style={h1s} className="mx-auto max-w-4xl text-balance font-semibold leading-[1.04]">{t('about2.endTitle', 'Be part of more reliable school feeding.')}</h2>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/register" className={gold}>{t('how.cta', 'Get Started')} <span aria-hidden className="ml-2">→</span></Link>
            <Link href="/about/team" className={light}>{t('about2.team', 'Meet the team')}</Link>
          </div>
        </Reveal>
      </Bg>
    </>
  );
}
