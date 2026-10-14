import { HeroSection } from '@/components/public/HeroSection';
import { AudienceCards } from '@/components/public/AudienceCards';
import { PricingCards } from '@/components/public/PricingCards';
import { ProductGrid } from '@/components/marketplace/ProductGrid';
import { listPublicProducts } from '@/features/products/services/products.service';
import { ButtonLink } from '@/components/ui/button';
import { getT } from '@/i18n/server';

const STEPS = ['Register as a school, supplier, group or institution', 'Complete verification where it applies', 'Publish, browse or order inside your workspace', 'Review your history and, optionally, advanced insights'];
export default async function Home() {
  const { t } = await getT(); const { items } = await listPublicProducts({ page: 1 });
  return (
    <>
      <HeroSection />
      <AudienceCards />
      <section className="bg-teal py-16 text-cream"><div className="container-page grid gap-8 md:grid-cols-2">
        <div><p className="text-xs font-bold uppercase tracking-[0.14em] text-gold">Mission</p><h2 className="mt-2 text-fluid-h2 font-semibold">Make school feeding more reliable.</h2></div>
        <p className="text-lg text-cream/90">Schools need dependable food. Suppliers need dependable markets. Miveloo connects them, and uses data to cut avoidable inefficiency in how school food is bought and delivered.</p></div></section>
      <section className="container-page py-16"><div className="flex flex-wrap items-end justify-between gap-3"><h2 className="text-fluid-h2 font-semibold text-teal-dark">From the marketplace</h2><ButtonLink href="/marketplace" variant="secondary">See all listings</ButtonLink></div>
        <p className="mt-2 text-sm text-ink-soft">{t('home.sampleNote')}</p><div className="mt-6"><ProductGrid items={items.slice(0, 3)} /></div></section>
      <section className="container-page py-8"><h2 className="text-fluid-h2 font-semibold text-teal-dark">AI that is honest about what it knows</h2>
        <p className="mt-3 max-w-2xl text-lg text-ink-soft">Forecasts, alerts and recommendations are being developed. They will be shown as estimates, with their data and assumptions, never as guarantees. <a className="font-bold underline" href="/ai-intelligence">See what exists today</a>.</p></section>
      <section className="container-page py-16"><h2 className="text-fluid-h2 font-semibold text-teal-dark">Get started in four steps</h2>
        <ol className="mt-8 grid gap-5 md:grid-cols-4">{STEPS.map((s, i) => <li key={s} className="rounded-2xl bg-white p-5 shadow-card"><span className="grid h-10 w-10 place-items-center rounded-full bg-gold font-display text-xl font-bold">{i + 1}</span><p className="mt-3 font-semibold">{s}</p></li>)}</ol></section>
      <section className="container-page py-8"><h2 className="text-fluid-h2 font-semibold text-teal-dark">Free core. Optional extras.</h2><p className="mb-6 mt-2 text-ink-soft">The core marketplace has no platform access fee. Advanced services are optional and clearly labelled.</p><PricingCards /></section>
    </>
  );
}
