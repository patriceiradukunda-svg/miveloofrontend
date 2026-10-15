import type { Metadata } from 'next';
import { PageHeader } from '@/components/layout/PageHeader';
import { ButtonLink } from '@/components/ui/button';
import { Photo } from '@/components/media/Photo';
import { Scene } from '@/components/media/Scenes';
import { Reveal } from '@/components/ui/reveal';
export const metadata: Metadata = { title: 'Sell on Miveloo', description: 'Register as a supplier or cooperative, publish food listings and reach school buyers.', alternates: { canonical: '/sell' } };
const S = [['📝', 'Register', 'Create a free supplier or group account and complete verification.'], ['📦', 'Publish listings', 'Product, quantity, unit, price and general location.'], ['🏫', 'Reach school buyers', 'Verified schools discover and order your products.'], ['✅', 'Manage orders', 'Accept, prepare and dispatch. Message buyers.'], ['📈', 'Grow', 'Your history is free. Optional tools when you are ready.']];
export default function Sell() {
  return (
    <>
      <section className="bg-gradient-to-b from-gold-tint to-cream"><div className="container-page grid items-center gap-8 py-12 md:grid-cols-[1.1fr_1fr] md:py-16">
        <PageHeader eyebrow="Sell on Miveloo" title="Reach schools that need what you grow." lead="Farmers, traders, distributors, food businesses, cooperatives and supplier groups can list food and receive orders. Basic selling has no platform access fee.">
          <div className="grid gap-3 pt-2 sm:grid-cols-2"><ButtonLink href="/register/supplier" variant="gold">Register as a supplier</ButtonLink><ButtonLink href="/register/cooperative">Register your group</ButtonLink></div></PageHeader>
        <div className="floaty overflow-hidden rounded-3xl shadow-card"><Photo k="womenHarvest" alt="" className="aspect-[4/3]" priority fallback={<Scene name="farm" />} /></div>
      </div></section>
      <div className="container-page space-y-10 py-12">
        <ol className="grid gap-4 md:grid-cols-5">{S.map(([e, t, d], i) => <li key={t}><Reveal delay={i * 70}><div className="h-full rounded-2xl bg-white p-5 shadow-card"><span aria-hidden className="text-3xl">{e}</span><p className="mt-2 font-display text-2xl font-bold text-gold-dark">{i + 1}</p><h2 className="font-sans text-lg font-bold">{t}</h2><p className="text-sm text-ink-soft">{d}</p></div></Reveal></li>)}</ol>
        <p className="rounded-2xl bg-gold-tint p-4 text-sm"><strong>Honest expectations:</strong> verification may be required before listings are visible. Groups show only confirmed stock as available, never estimated capacity.</p>
      </div>
    </>
  );
}
