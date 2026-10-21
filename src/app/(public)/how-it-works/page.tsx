import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getT } from '@/i18n/server';
import { Reveal } from '@/components/public/home/Reveal';
import { Bg, Icon, gold, h1s, h2s, light, shadow, solid, wide } from '@/components/public/kit';
import { PHOTO_CREDITS, resolvePhoto, type PhotoKey } from '@/lib/photos';

export const metadata: Metadata = {
  title: 'How it works',
  description: 'See how suppliers list what they have, schools are verified, orders are placed and deliveries are confirmed on Miveloo.',
  alternates: { canonical: '/how-it-works' },
};

export default async function HowItWorksPage() {
  const { t } = await getT();
  const forSuppliers = t('how.forSuppliers', 'For suppliers');
  const forSchools = t('how.forSchools', 'For schools');
  const both = t('how.both', 'Schools and suppliers');
  const steps = [
    { n: 1, d: ['M8 6h13', 'M8 12h13', 'M8 18h13', 'M3 6h.01', 'M3 12h.01', 'M3 18h.01'], w: forSuppliers,
      k: t('how.s1k', 'List'), h: t('how.s1h', 'Suppliers list what they have'),
      b: t('how.s1b', 'Farmers, traders, distributors and cooperatives register, then list what they have: quantity, unit, price and general location. Suppliers decide what schools see. Listing is free.') },
    { n: 2, d: ['M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', 'M9 12l2 2 4-4'], w: forSchools,
      k: t('how.s2k', 'Verify'), h: t('how.s2h', 'Schools get verified'),
      b: t('how.s2b', 'Schools register and are verified before they can order. Choosing “School” at sign-up does not grant buying access by itself.') },
    { n: 3, d: ['M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z', 'M14 2v6h6', 'M9 13h6', 'M9 17h6'], w: both,
      k: t('how.s3k', 'Order'), h: t('how.s3h', 'Schools order, suppliers respond'),
      b: t('how.s3b', 'Verified schools compare offers and submit purchase orders, and suppliers respond.') },
    { n: 4, d: ['M3 7h11v9H3z', 'M14 10h4l3 3v3h-7z', 'M7 19.5h.01', 'M17 19.5h.01'], w: both,
      k: t('how.s4k', 'Deliver'), h: t('how.s4h', 'Delivered and confirmed'),
      b: t('how.s4b', 'Suppliers prepare and dispatch. Schools confirm what arrived and record issues. Every change is recorded.') },
    { n: 5, d: ['M3 3v18h18', 'M7 14l4-4 3 3 5-6'], w: forSchools,
      k: t('how.s5k', 'Learn'), h: t('how.s5h', 'Learn from your own history'),
      b: t('how.s5b', 'Historical data in your own dashboard is free; advanced insights are optional.') },
  ];
  const pic = (k: PhotoKey) => { const r = resolvePhoto(k); return r ? { src: r.src, credit: PHOTO_CREDITS[r.key] } : null; };
  const who = [
    { photo: pic('womenCoop'), pos: '50% 30%', alt: t('how.altCoop', 'Women farmers from a cooperative in Rwanda'),
      h: forSuppliers, b: t('how.supB', 'Farmers, traders, distributors and cooperatives register, then list what they have. Listing is free.'),
      href: '/sell', cta: t('how.supCta', 'Become a Supplier') },
    { photo: pic('logistics'), pos: '50% 50%', alt: t('how.altLogistics', 'Fresh produce being loaded for delivery in Rwanda'),
      h: t('how.s4h', 'Delivered and confirmed'), b: t('how.s4b', 'Suppliers prepare and dispatch. Schools confirm what arrived and record issues. Every change is recorded.'),
      href: '/register', cta: t('how.cta', 'Get Started') },
    { photo: pic('schoolKitchen'), pos: '50% 50%', alt: t('how.altSchoolKitchen', 'A school kitchen in Rwanda preparing food'),
      h: forSchools, b: t('how.schB', 'Schools register and are verified before they can order. Verified schools compare offers and submit purchase orders.'),
      href: '/schools', cta: t('how.schCta', 'For Schools & Institutions') },
  ];

  return (
    <>
      <Bg n="08-root-vegetables" pos="50% 55%" overlay="bg-gradient-to-r from-ink/90 via-ink/60 to-ink/10" className="flex min-h-[72svh] items-end">
        <div className={`${wide} rise space-y-6 pb-16 pt-32`}>
          <h1 style={h1s} className={`max-w-5xl text-balance font-semibold leading-[1.04] tracking-tight ${shadow}`}>{t('how.title', 'From the farm to the school kitchen, step by step.')}</h1>
          <p className="max-w-2xl text-lg text-cream/90 md:text-xl">{t('how.lead', 'Five steps connect a school kitchen to the people who grow the food.')}</p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link href="/register" className={gold}>{t('how.cta', 'Get Started')} <span aria-hidden className="ml-2">→</span></Link>
            <Link href="/login" className={light}>{t('nav.login', 'Log in')}</Link>
          </div>
        </div>
      </Bg>

      <section className="py-24">
        <div className={`${wide} grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16`}>
          <Reveal className="lg:sticky lg:top-32 lg:self-start">
            <h2 style={h2s} className="mt-3 text-balance font-semibold text-teal-dark">{t('how.jTitle', 'Five steps, one clear path')}</h2>
            <p className="mt-4 max-w-md text-lg text-ink-soft">{t('how.jLead', 'Here is how a school kitchen and the people who grow the food come together on Miveloo.')}</p>
          </Reveal>
          <ol className="relative space-y-5 before:absolute before:bottom-8 before:left-7 before:top-8 before:w-px before:bg-teal/25">
            {steps.map((x, k) => (
              <li key={x.n}>
                <Reveal delay={k * 80}>
                  <div className="relative flex gap-4 sm:gap-6">
                    <span className="relative z-10 grid h-14 w-14 shrink-0 place-items-center rounded-full bg-gold font-display text-xl font-bold text-ink ring-8 ring-cream">{x.n}</span>
                    <div className="min-w-0 flex-1 rounded-2xl border border-ink/10 bg-white p-6 shadow-card sm:p-8">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="grid h-10 w-10 place-items-center rounded-full bg-teal text-cream"><Icon d={x.d} /></span>
                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal">{x.k}</p>
                        <span className="rounded-full bg-teal-tint px-3 py-1 text-xs font-bold text-teal-dark sm:ml-auto">{x.w}</span>
                      </div>
                      <h3 className="mt-4 text-balance text-xl font-semibold text-teal-dark sm:text-2xl">{x.h}</h3>
                      <p className="mt-2 text-base text-ink-soft sm:text-lg">{x.b}</p>
                    </div>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <Bg n="09-bananas-plantains" pos="50% 50%" overlay="bg-gradient-to-r from-ink/90 via-ink/70 to-ink/20" className="py-28">
        <Reveal className={wide}>
          <div className="max-w-3xl space-y-6">
            <h2 style={h2s} className={`text-balance font-semibold leading-[1.08] ${shadow}`}>{t('how.bTitle', 'Suppliers decide what schools see.')}</h2>
            <p className="text-lg text-cream/90 md:text-xl">{t('how.bBody', 'Farmers, traders, distributors and cooperatives list what they have and publish only the details they choose. Verified schools compare offers and order from their own workspace.')}</p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/sell" className={gold}>{t('how.supCta', 'Become a Supplier')}</Link>
              <Link href="/schools" className={light}>{t('how.schCta', 'For Schools & Institutions')}</Link>
            </div>
          </div>
        </Reveal>
      </Bg>

      <section className="bg-cream-deep py-24">
        <div className={wide}>
          <Reveal>
            <h2 style={h2s} className="mt-3 max-w-3xl text-balance font-semibold text-teal-dark">{t('how.aTitle', 'Find your place')}</h2>
          </Reveal>
          <ul className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {who.map((x, k) => (
              <li key={x.h}>
                <Reveal delay={k * 120} className="h-full">
                  <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-card">
                    {x.photo ? (
                      <div className="relative aspect-[16/10]">
                        <Image src={x.photo.src} alt={x.alt} fill sizes="(min-width:1024px) 30vw, (min-width:768px) 45vw, 100vw" className="object-cover" style={{ objectPosition: x.pos }} />
                        <span className="absolute bottom-2 right-2 rounded bg-ink/75 px-2 py-1 text-[0.7rem] text-cream">{t('how.photo', 'Photo')}: {x.photo.credit}</span>
                      </div>
                    ) : null}
                    <div className="flex flex-1 flex-col p-7 sm:p-8">
                      <h3 className="text-2xl font-semibold text-teal-dark">{x.h}</h3>
                      <p className="mt-2 flex-1 text-lg text-ink-soft">{x.b}</p>
                      <Link href={x.href} className={`${solid} mt-6 self-start`}>{x.cta}</Link>
                    </div>
                  </article>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Bg n="12-produce-flatlay" pos="50% 50%" overlay="bg-gradient-to-r from-ink/90 via-ink/70 to-ink/40" className="py-28 text-center">
        <Reveal className={wide}>
          <h2 style={h1s} className="mx-auto max-w-4xl text-balance font-semibold leading-[1.04]">{t('how.endTitle', 'Ready to get started?')}</h2>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/register" className={gold}>{t('how.cta', 'Get Started')} <span aria-hidden className="ml-2">→</span></Link>
            <Link href="/impact" className={light}>{t('how.impact', 'Our Impact')}</Link>
          </div>
        </Reveal>
      </Bg>
    </>
  );
}
