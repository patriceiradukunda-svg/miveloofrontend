import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getT } from '@/i18n/server';
import { Reveal } from '@/components/public/home/Reveal';
import { Bg, Eyebrow, Icon, gold, h1s, h2s, light, shadow, wide } from '@/components/public/kit';
import { PHOTO_CREDITS, resolvePhoto } from '@/lib/photos';

export const metadata: Metadata = {
  title: 'Become a Supplier',
  description: 'Farmers, traders, distributors, food businesses, cooperatives and supplier groups can list food and receive orders from verified schools on Miveloo.',
  alternates: { canonical: '/sell' },
};

// Registration entry points (both routes exist under src/app/(auth)/register).
const SUPPLIER_HREF = '/register/supplier';
const GROUP_HREF = '/register/cooperative';

export default async function SellPage() {
  const { t } = await getT();
  const steps = [
    { d: ['M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2', 'M9 11a4 4 0 100-8 4 4 0 000 8z', 'M19 8v6', 'M22 11h-6'],
      h: t('sellp.s1h', 'Register'), b: t('sellp.s1b', 'Create a free supplier or group account and complete verification.') },
    { d: ['M21 8l-9-5-9 5v8l9 5 9-5z', 'M3 8l9 5 9-5', 'M12 13v8'],
      h: t('sellp.s2h', 'Publish listings'), b: t('sellp.s2b', 'Product, quantity, unit, price and general location.') },
    { d: ['M3 21h18', 'M5 21V10l7-5 7 5v11', 'M10 21v-5h4v5'],
      h: t('sellp.s3h', 'Reach school buyers'), b: t('sellp.s3b', 'Verified schools discover and order your products.') },
    { d: ['M9 4h6a1 1 0 011 1v1H8V5a1 1 0 011-1z', 'M16 5h2a2 2 0 012 2v13a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2h2', 'M9 14l2 2 4-4'],
      h: t('sellp.s4h', 'Manage orders'), b: t('sellp.s4b', 'Accept, prepare and dispatch. Message buyers.') },
    { d: ['M3 3v18h18', 'M7 14l4-4 3 3 5-6'],
      h: t('sellp.s5h', 'Grow'), b: t('sellp.s5b', 'Your history is free. Optional tools when you are ready.') },
  ];
  const who = [
    { d: ['M12 21v-8', 'M12 13c0-4 3-6 7-6 0 4-3 6-7 6z', 'M12 15c0-3-2-5-6-5 0 3 2 5 6 5z'], l: t('sellp.wFarmers', 'Farmers') },
    { d: ['M7 7h13', 'M16 3l4 4-4 4', 'M17 17H4', 'M8 13l-4 4 4 4'], l: t('sellp.wTraders', 'Traders') },
    { d: ['M3 7h11v9H3z', 'M14 10h4l3 3v3h-7z', 'M7 19.5h.01', 'M17 19.5h.01'], l: t('sellp.wDist', 'Distributors') },
    { d: ['M4 9l1-5h14l1 5', 'M4 9a2.5 2.5 0 005 0 2.5 2.5 0 005 0 2.5 2.5 0 005 0', 'M5 12v8h14v-8'], l: t('sellp.wBiz', 'Food businesses') },
    { d: ['M16 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2', 'M9.5 11a4 4 0 100-8 4 4 0 000 8z', 'M21 21v-2a4 4 0 00-3-3.9', 'M16 3.1a4 4 0 010 7.8'], l: t('sellp.wCoops', 'Cooperatives') },
    { d: ['M3 3h7v7H3z', 'M14 3h7v7h-7z', 'M3 14h7v7H3z', 'M14 14h7v7h-7z'], l: t('sellp.wGroups', 'Supplier groups') },
  ];
  const harvest = resolvePhoto('womenHarvest');
  const regSup = t('sellp.regSup', 'Register as a supplier');
  const regGroup = t('sellp.regGroup', 'Register your group');

  return (
    <>
      <Bg n="11-tomatoes-closeup" pos="50% 50%" overlay="bg-gradient-to-r from-ink/90 via-ink/65 to-ink/10" className="flex min-h-[72svh] items-end">
        <div className={`${wide} rise space-y-6 pb-16 pt-32`}>
          <Eyebrow>{t('sellp.eyebrow', 'Sell on Miveloo')}</Eyebrow>
          <h1 style={h1s} className={`max-w-5xl text-balance font-semibold leading-[1.04] tracking-tight ${shadow}`}>{t('sellp.title', 'Reach schools that need what you grow.')}</h1>
          <p className="max-w-2xl text-lg text-cream/90 md:text-xl">{t('sellp.lead', 'Farmers, traders, distributors, food businesses, cooperatives and supplier groups can list food and receive orders. Basic selling has no platform access fee.')}</p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link href={SUPPLIER_HREF} className={gold}>{regSup} <span aria-hidden className="ml-2">→</span></Link>
            <Link href={GROUP_HREF} className={light}>{regGroup}</Link>
          </div>
        </div>
      </Bg>

      <section className={`${wide} py-24`}>
        <Reveal>
          <Eyebrow dark={false}>{t('sellp.sEyebrow', 'How selling works')}</Eyebrow>
          <h2 style={h2s} className="mt-3 max-w-3xl text-balance font-semibold text-teal-dark">{t('sellp.sTitle', 'Five steps to selling to schools')}</h2>
        </Reveal>
        <ol className="relative mt-12 grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <span aria-hidden className="absolute left-7 right-7 top-7 hidden h-px bg-teal/25 xl:block" />
          {steps.map((x, k) => (
            <li key={x.h}>
              <Reveal delay={k * 90} className="h-full">
                <span className="relative z-10 grid h-14 w-14 place-items-center rounded-full bg-gold font-display text-xl font-bold text-ink ring-8 ring-cream">{k + 1}</span>
                <div className="-mt-7 h-full rounded-2xl border border-ink/10 bg-white p-6 pt-12 shadow-card">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-teal text-cream"><Icon d={x.d} /></span>
                  <h3 className="mt-4 text-xl font-semibold text-teal-dark">{x.h}</h3>
                  <p className="mt-2 text-ink-soft">{x.b}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      <Bg n="01-market-baskets-produce" pos="50% 60%" overlay="bg-gradient-to-r from-ink/90 via-ink/70 to-ink/20" className="py-28">
        <Reveal className={wide}>
          <div className="max-w-3xl space-y-6">
            <Eyebrow>{t('sellp.bEyebrow', 'You stay in control')}</Eyebrow>
            <h2 style={h2s} className={`text-balance font-semibold leading-[1.08] ${shadow}`}>{t('sellp.bTitle', 'You decide what schools see.')}</h2>
            <p className="text-lg text-cream/90 md:text-xl">{t('sellp.bBody', 'Basic selling has no platform access fee. You publish only the details you choose, and verified schools order from their own workspace.')}</p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link href={SUPPLIER_HREF} className={gold}>{regSup}</Link>
              <Link href="/how-it-works" className={light}>{t('nav.howItWorks', 'How it works')}</Link>
            </div>
          </div>
        </Reveal>
      </Bg>

      <section className="bg-cream-deep py-24">
        <div className={`${wide} grid items-center gap-12 lg:grid-cols-2 lg:gap-16`}>
          {harvest ? (
            <Reveal>
              <div className="relative aspect-[4/3] overflow-hidden rounded-blob shadow-card lg:max-w-2xl">
                <Image src={harvest.src} alt={t('sellp.altHarvest', 'Women harvesting vegetables in Rwanda')} fill sizes="(min-width:1024px) 45vw, 100vw" className="object-cover" style={{ objectPosition: '50% 40%' }} />
                <span className="absolute bottom-3 right-3 rounded bg-ink/75 px-2 py-1 text-[0.7rem] text-cream">{t('sellp.photo', 'Photo')}: {PHOTO_CREDITS[harvest.key]}</span>
              </div>
            </Reveal>
          ) : null}
          <Reveal delay={120}>
            <Eyebrow dark={false}>{t('sellp.wEyebrow', 'Who can sell')}</Eyebrow>
            <h2 style={h2s} className="mt-3 text-balance font-semibold text-teal-dark">{t('sellp.wTitle', 'Open to the people who grow and supply food')}</h2>
            <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {who.map((x) => (
                <li key={x.l} className="flex items-center gap-3 rounded-2xl border border-ink/10 bg-white p-4 shadow-card">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-teal-tint text-teal"><Icon d={x.d} /></span>
                  <span className="font-semibold text-ink">{x.l}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className={`${wide} py-16`}>
        <Reveal>
          <div className="flex gap-4 rounded-2xl border border-gold/40 bg-gold-tint p-6 sm:p-8">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-teal text-cream"><Icon d={['M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', 'M12 8v5', 'M12 16h.01']} /></span>
            <div>
              <h2 className="text-xl font-semibold text-teal-dark sm:text-2xl">{t('sellp.hHead', 'Honest expectations')}</h2>
              <p className="mt-2 max-w-4xl text-lg text-ink-soft">{t('sellp.hBody', 'Verification may be required before listings are visible. Groups show only confirmed stock as available, never estimated capacity.')}</p>
            </div>
          </div>
        </Reveal>
      </section>

      <Bg n="08-root-vegetables" pos="50% 35%" overlay="bg-gradient-to-r from-ink/90 via-ink/70 to-ink/40" className="py-28 text-center">
        <Reveal className={wide}>
          <h2 style={h1s} className="mx-auto max-w-4xl text-balance font-semibold leading-[1.04]">{t('sellp.endTitle', 'Ready to sell to schools?')}</h2>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href={SUPPLIER_HREF} className={gold}>{regSup} <span aria-hidden className="ml-2">→</span></Link>
            <Link href={GROUP_HREF} className={light}>{regGroup}</Link>
          </div>
          <p className="mx-auto mt-10 max-w-xl text-sm text-cream/80">{t('home2.photoNote', 'Photographs are illustrative and do not depict verified Miveloo users. Marketplace access is available to authorised schools and partners after sign-in.')}</p>
        </Reveal>
      </Bg>
    </>
  );
}
