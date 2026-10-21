import Image from 'next/image';
import Link from 'next/link';
import { getT } from '@/i18n/server';
import { HeroSlider } from '@/components/public/home/HeroSlider';
import { Reveal } from '@/components/public/home/Reveal';
import { ServicesSection } from '@/components/public/home/ServicesSection';

const P = '/images/miveloo-photos/';
const wide = 'mx-auto w-full max-w-[90rem] px-4 sm:px-6 lg:px-10';
const btn = 'inline-flex min-h-12 items-center justify-center rounded-full px-6 text-[0.95rem] font-bold transition-all duration-300';
const gold = `${btn} bg-gold text-ink hover:-translate-y-0.5 hover:bg-cream hover:shadow-card`;
const light = `${btn} border-2 border-cream/70 text-cream hover:bg-cream/10`;
const solid = `${btn} bg-teal text-cream hover:-translate-y-0.5 hover:bg-teal-dark`;
// Wide, horizontal headings that run across the page in 1-2 lines.
const h1s = { fontSize: 'clamp(2.1rem, 0.9rem + 4.4vw, 5rem)' } as const;
const h2s = { fontSize: 'clamp(1.7rem, 1rem + 2.6vw, 3rem)' } as const;
const shadow = '[text-shadow:0_2px_24px_rgba(0,0,0,0.35)]';
const lrOverlay = 'bg-gradient-to-r from-ink/90 via-ink/65 to-ink/15';

/** Full-bleed photo section: the image is the background; the overlay keeps text readable. */
function Bg({ n, pos = 'center', overlay = lrOverlay, className = '', children }: { n: string; pos?: string; overlay?: string; className?: string; children: React.ReactNode }) {
  return (
    <section className={`relative isolate overflow-hidden text-cream ${className}`}>
      <Image src={`${P}${n}.jpg`} alt="" fill sizes="100vw" className="-z-20 object-cover" style={{ objectPosition: pos }} />
      <div aria-hidden className={`absolute inset-0 -z-10 ${overlay}`} />
      {children}
    </section>
  );
}
/** Scrolling produce ribbon (decorative). Pauses on hover; reduced-motion CSS stops it. */
function Ribbon({ items }: { items: string[] }) {
  const row = (hidden?: boolean) => (
    <ul aria-hidden={hidden} className="flex shrink-0 items-center gap-8 pr-8">
      {items.map((w) => <li key={w} className="flex items-center gap-8 whitespace-nowrap font-display text-xl italic">{w}<span aria-hidden className="not-italic text-teal">✺</span></li>)}
    </ul>
  );
  return (
    <div className="overflow-hidden bg-gold py-3.5 text-ink">
      <style>{'@keyframes ribbon{to{transform:translateX(-50%)}}'}</style>
      <div className="flex w-max animate-[ribbon_50s_linear_infinite] hover:[animation-play-state:paused]">{row()}{row(true)}</div>
    </div>
  );
}
const Icon = ({ d }: { d: string[] }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden>{d.map((p) => <path key={p} d={p} />)}</svg>;

export default async function Home() {
  const { t } = await getT();
  const slides = [
    { src: `${P}13-farmer-carrying-sack.jpg`, alt: 'A farmer carries a sack across a field', pos: '50% 30%' },
    { src: `${P}05-farmer-harvesting-greens.jpg`, alt: 'A farmer harvesting leafy greens', pos: '60% 40%' },
    { src: `${P}02-farmer-grass-portrait.jpg`, alt: 'A smiling farmer holding freshly cut grass', pos: '50% 25%' },
    { src: `${P}04-vendor-tomatoes-stall.jpg`, alt: 'A vendor behind a stall of tomatoes', pos: '50% 35%' },
    { src: `${P}06-school-kitchen-cooks.jpg`, alt: 'Cooks serving rice in a school kitchen', pos: '50% 45%', posSm: '62% 45%' },
    { src: `${P}03-school-canteen-serving.jpg`, alt: 'Children eating a meal in a school canteen', pos: '50% 30%' },
  ];
  const produce = ['Tomatoes', 'Beans', 'Bananas', 'Potatoes', 'Onions', 'Cabbage', 'Leafy greens', 'Sweet potatoes', 'Grains', 'Peppers'];
  const stages = [
    { n: '14-farmer-cabbage', k: t('home2.j1', 'Grown'), b: t('home2.j1b', 'It starts on the land, with farmers and growers.') },
    { n: '08-root-vegetables', k: t('home2.j2', 'Gathered'), b: t('home2.j2b', 'Suppliers and cooperatives bring stock together and send it to schools.') },
    { n: '06-school-kitchen-cooks', k: t('home2.j3', 'Prepared'), b: t('home2.j3b', 'School kitchens turn fresh produce into meals.') },
    { n: '03-school-canteen-serving', k: t('home2.j4', 'Served'), b: t('home2.j4b', 'Children get a dependable meal.') },
  ];
  const steps = [
    { d: ['M16 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2', 'M9.5 11a4 4 0 100-8 4 4 0 000 8z', 'M19 8v6', 'M16 11h6'], title: t('home2.st1', 'Register'), body: t('home2.st1b', 'As a school, supplier, cooperative or institution.') },
    { d: ['M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z', 'M9 12l2 2 4-4'], title: t('home2.st2', 'Get verified'), body: t('home2.st2b', 'Verification applies where it is required.') },
    { d: ['M4 4h7v7H4z', 'M13 4h7v4h-7z', 'M13 11h7v9h-7z', 'M4 14h7v6H4z'], title: t('home2.st3', 'Work in your space'), body: t('home2.st3b', 'Publish, browse or order inside your workspace.') },
    { d: ['M5 20v-6', 'M12 20V6', 'M19 20v-10'], title: t('home2.st4', 'Review and learn'), body: t('home2.st4b', 'See your history and, optionally, advanced insights.') },
  ];
  const cards = [
    { n: '03-school-canteen-serving', pos: '40% 30%', title: t('home2.c1', 'Schools'), body: t('home2.c1b', 'Find dependable food, compare offers and track deliveries.'), href: '/schools', cta: t('home2.c1c', 'For Schools & Institutions') },
    { n: '14-farmer-cabbage', pos: '50% 35%', title: t('home2.c2', 'Suppliers'), body: t('home2.c2b', 'Reach school buyers with the produce you grow.'), href: '/sell', cta: t('home2.c2c', 'Become a Supplier') },
    { n: '07-market-women-vendors', pos: '55% 50%', title: t('home2.c3', 'Cooperatives'), body: t('home2.c3b', 'Combine member stock and fulfil bigger orders.'), href: '/sell', cta: t('home2.c3c', 'Join as a group') },
  ];
  const trust = [
    { d: ['M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z', 'M9 12l2 2 4-4'], h: t('home2.t1', 'Verified where it matters'), b: t('home2.t1b', 'Registration comes with verification where it applies.') },
    { d: ['M5 11h14v9H5z', 'M8 11V8a4 4 0 018 0v3'], h: t('home2.t2', 'Access-controlled workspaces'), b: t('home2.t2b', 'Ordering and listings sit behind sign-in, for authorised schools and partners.') },
    { d: ['M3 17l5-5 4 4 8-9', 'M15 7h5v5'], h: t('home2.t3', 'Honest about data'), b: t('home2.t3b', 'Forecasts and insights are shown as estimates, with their data and assumptions.') },
  ];
  const future = [
    { h: t('home2.f1', 'Stronger connections'), b: t('home2.f1b', 'Schools and suppliers find each other without the guesswork.') },
    { h: t('home2.f2', 'Smarter decisions'), b: t('home2.f2b', 'Clearer information helps schools, suppliers and programmes plan ahead.') },
    { h: t('home2.f3', 'Less avoidable waste'), b: t('home2.f3b', 'Better information helps cut inefficiency in how school food is bought and delivered.') },
  ];
  return (
    <>
      <HeroSlider slides={slides} labels={{ region: t('home2.slider', 'Photo gallery'), prev: t('home2.prev', 'Previous photo'), next: t('home2.next', 'Next photo'), goTo: t('home2.goTo', 'Go to photo'), pause: t('home2.pause', 'Pause photo rotation'), play: t('home2.play', 'Play photo rotation') }}>
        <div className={`${wide} rise space-y-5 py-10 sm:space-y-6 sm:py-12 lg:pb-20 lg:pt-32`}>
          <h1 style={h1s} className={`max-w-6xl text-balance font-semibold leading-[1.04] tracking-tight ${shadow}`}>{t('home2.title', 'From local farms to school kitchens.')}</h1>
          <p className="max-w-2xl text-lg text-cream/90 md:text-xl">{t('home2.lead', 'Miveloo connects suppliers, cooperatives, schools and institutional partners for more reliable school feeding.')}</p>
          <div className="grid gap-3 pt-2 sm:flex sm:flex-wrap">
            <Link href="/schools" className={`${gold} w-full sm:w-auto`}>{t('home2.ctaSchools', 'For Schools & Institutions')}</Link>
            <Link href="/sell" className={`${light} w-full sm:w-auto`}>{t('home2.ctaSupplier', 'Become a Supplier')}</Link>
          </div>
        </div>
      </HeroSlider>

      <Ribbon items={produce} />

      <Bg n="01-market-baskets-produce" pos="50% 50%" className="py-24 md:py-36">
        <Reveal className={wide}>
          <h2 style={h1s} className="mt-4 max-w-5xl text-balance font-semibold leading-[1.04]">{t('home2.about', 'Dependable food. Dependable markets.')}</h2>
          <p className="mt-6 max-w-2xl text-lg text-cream/90 md:text-xl">{t('home2.aboutBody', 'Schools need food they can count on. Suppliers need markets they can trust. Miveloo brings them together and uses data to reduce avoidable inefficiency.')}</p>
        </Reveal>
      </Bg>

      <section className="bg-cream py-24">
        <div className={wide}>
          <Reveal><h2 style={h2s} className="mt-3 max-w-3xl text-balance font-semibold text-teal-dark">{t('home2.jTitle', 'From farm to classroom, one connected path')}</h2></Reveal>
          <ul className="mt-10 flex flex-col gap-3 lg:h-[34rem] lg:flex-row">
            {stages.map((s, k) => (
              <li key={s.n} tabIndex={0} className="group relative isolate min-h-64 flex-1 overflow-hidden rounded-2xl text-cream shadow-card transition-[flex] duration-700 ease-out focus-visible:outline-none lg:min-h-0 lg:hover:flex-[2.6] lg:focus-within:flex-[2.6] lg:focus-visible:flex-[2.6]">
                <Image src={`${P}${s.n}.jpg`} alt="" fill sizes="(min-width:1024px) 40vw, 100vw" className="-z-20 object-cover transition-transform duration-700 group-hover:scale-105" />
                <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/90 via-ink/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <span className="font-display text-sm font-bold text-gold">0{k + 1}</span>
                  <h3 className="font-display text-3xl font-semibold">{s.k}</h3>
                  <p className="mt-2 max-w-xs text-cream/90 transition-all duration-500 lg:translate-y-2 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100 lg:group-focus-visible:translate-y-0 lg:group-focus-visible:opacity-100 lg:group-focus-within:opacity-100">{s.b}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-cream-deep py-24">
        <div className={wide}>
          <Reveal><h2 style={h2s} className="mt-3 font-semibold text-teal-dark">{t('home2.howTitle', 'How Miveloo works')}</h2></Reveal>
          <ol className="-mx-4 mt-10 flex snap-x snap-mandatory scroll-pl-4 gap-5 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:px-6 sm:scroll-pl-6 lg:mx-0 lg:grid lg:grid-cols-4 lg:overflow-visible lg:px-0">
            {steps.map((s, k) => (
              <li key={s.title} className="w-[78%] shrink-0 snap-start sm:w-80 lg:w-auto">
                <Reveal delay={k * 90} className="h-full">
                  <article className="relative h-full overflow-hidden rounded-2xl bg-white p-7 shadow-card transition-transform duration-300 hover:-translate-y-1">
                    <span aria-hidden className="absolute -right-1 -top-5 font-display text-9xl font-bold text-gold/25">{k + 1}</span>
                    <span className="relative grid h-12 w-12 place-items-center rounded-full bg-teal text-cream"><Icon d={s.d} /></span>
                    <h3 className="relative mt-6 text-xl font-semibold">{s.title}</h3><p className="relative mt-2 text-ink-soft">{s.body}</p>
                  </article>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={`${wide} py-24`}>
        <Reveal><h2 style={h2s} className="mt-3 font-semibold text-teal-dark">{t('home2.forTitle', 'Built for the whole food chain')}</h2></Reveal>
        <ul className="mt-10 grid gap-5 md:grid-cols-3">
          {cards.map((c, k) => (
            <li key={c.title}><Reveal delay={k * 100} className="h-full">
              <article className="group relative isolate flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-2xl text-cream shadow-card">
                <Image src={`${P}${c.n}.jpg`} alt="" fill sizes="(min-width:768px) 33vw, 100vw" className="-z-20 object-cover transition-transform duration-700 group-hover:scale-105" style={{ objectPosition: c.pos }} />
                <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/95 via-ink/60 via-45% to-transparent" />
                <div className="space-y-2 p-6"><h3 className="text-3xl font-semibold">{c.title}</h3><p className="text-cream/90">{c.body}</p><Link href={c.href} className={`${gold} mt-2`}>{c.cta} <span aria-hidden className="ml-2">→</span></Link></div>
              </article>
            </Reveal></li>
          ))}
        </ul>
      </section>

      <Bg n="05-farmer-harvesting-greens" pos="60% 40%" overlay="bg-gradient-to-r from-ink/90 via-ink/60 to-ink/20" className="py-28 md:py-40">
        <Reveal className={wide}>
          <p style={h1s} className="max-w-5xl text-balance font-display font-semibold italic leading-[1.1]">{t('home2.quote', 'Every meal starts with someone who grew it.')}</p>
          <Link href="/impact" className={`${gold} mt-8`}>{t('home2.impact', 'Our Impact')} <span aria-hidden className="ml-2">→</span></Link>
        </Reveal>
      </Bg>

      <section className="bg-cream py-24">
        <div className={wide}>
          <Reveal><h2 style={h2s} className="mt-3 font-semibold text-teal-dark">{t('home2.tTitle', 'Built on trust')}</h2></Reveal>
          <ul className="mt-10 grid gap-5 md:grid-cols-3">
            {trust.map((x, k) => (
              <li key={x.h}><Reveal delay={k * 100} className="h-full"><div className="h-full rounded-2xl border border-ink/10 bg-white p-7 shadow-card">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-teal-tint text-teal"><Icon d={x.d} /></span>
                <h3 className="mt-5 text-xl font-semibold">{x.h}</h3><p className="mt-2 text-ink-soft">{x.b}</p>
              </div></Reveal></li>
            ))}
          </ul>
        </div>
      </section>

      <Bg n="11-tomatoes-closeup" pos="50% 50%" overlay="bg-gradient-to-r from-ink/90 via-teal-dark/75 to-teal-dark/20" className="py-24 md:py-36">
        <Reveal className={wide}>
          <h2 style={h1s} className="mt-4 text-balance font-semibold leading-[1.04]">{t('home2.futTitle', 'A better food future')}</h2>
          <ul className="mt-10 grid max-w-5xl gap-4 md:grid-cols-3">
            {future.map((f) => <li key={f.h} className="rounded-2xl border border-cream/25 bg-ink/40 p-6 backdrop-blur-md"><h3 className="font-display text-xl font-semibold">{f.h}</h3><p className="mt-2 text-cream/90">{f.b}</p></li>)}
          </ul>
        </Reveal>
      </Bg>

      <ServicesSection />

      <Bg n="02-farmer-grass-portrait" pos="50% 30%" overlay="bg-gradient-to-r from-ink/90 via-ink/70 to-ink/40" className="py-28 text-center">
        <Reveal className={wide}>
          <h2 style={h1s} className="mx-auto max-w-4xl text-balance font-semibold leading-[1.04]">{t('home2.ctaTitle', 'Ready to get started?')}</h2>
          <div className="mt-8 flex flex-wrap justify-center gap-3"><Link href="/register" className={gold}>{t('nav.getStarted', 'Get Started')} <span aria-hidden className="ml-2">→</span></Link><Link href="/login" className={light}>{t('home2.login', 'Log in')}</Link></div>
        </Reveal>
      </Bg>
    </>
  );
}
