import Image from 'next/image';
import Link from 'next/link';
import { HeroSection } from '@/components/public/HeroSection';
import { AudienceCards } from '@/components/public/AudienceCards';
import { PricingCards } from '@/components/public/PricingCards';
import { InteractiveCycle } from '@/components/public/InteractiveCycle';
import { PrivateMarketplaceNotice } from '@/components/public/PrivateMarketplaceNotice';
import { SectionHeading } from '@/components/layout/SectionHeading';
import { Scene } from '@/components/media/Scenes';
import { Photo } from '@/components/media/Photo';
import { Reveal } from '@/components/ui/reveal';
import { ButtonLink } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/badge';
import { startPaths } from '@/config/tour';
import { founder } from '@/config/founder';
import { getT } from '@/i18n/server';

export default async function Home() {
  await getT();
  return (
    <>
      <HeroSection />
      <section className="container-page pb-6 pt-20" aria-label="Founder welcome">
        <Reveal><div className="grid items-center gap-6 rounded-3xl bg-teal p-6 text-cream sm:p-10 md:grid-cols-[auto_1fr_auto]">
          <Image src={founder.photo} alt={`${founder.name}, ${founder.title}`} width={112} height={112} className="mx-auto h-24 w-24 rounded-full border-4 border-gold object-cover sm:h-28 sm:w-28" />
          <div><p className="text-xs font-bold uppercase tracking-[0.14em] text-gold">Welcome from {founder.name}, {founder.title}</p><p className="mt-2 font-display text-2xl leading-snug sm:text-3xl">&ldquo;Let me show you around. In two minutes you will know exactly where you fit.&rdquo;</p></div>
          <ButtonLink href="/tour" variant="gold">Start the tour</ButtonLink>
        </div></Reveal>
      </section>
      <section className="container-page py-16"><SectionHeading eyebrow="How it works" title="From the farm to the school kitchen, step by step" lead="Tap a stage to see who does what, and what is live today." /><div className="mt-8"><InteractiveCycle /></div></section>
      <AudienceCards />
      <PrivateMarketplaceNotice />
      <section className="container-page py-16"><div className="grid items-center gap-10 md:grid-cols-2">
        <Reveal><div className="overflow-hidden rounded-3xl shadow-card"><Photo k="agritech" alt="" className="aspect-[4/3]" fallback={<Scene name="data" />} /></div></Reveal>
        <Reveal delay={100}><div className="space-y-4"><SectionHeading eyebrow="Food-system intelligence" title="AI that shows its work" />
          <p className="text-lg text-ink-soft">Forecasts and alerts are estimates, shown with their data period, assumptions and uncertainty. When data is thin, Miveloo says so.</p>
          <ul className="space-y-2"><li className="flex items-center justify-between gap-3 rounded-xl bg-white p-3 shadow-card"><span>Your historical records</span><StatusBadge status="available" /></li><li className="flex items-center justify-between gap-3 rounded-xl bg-white p-3 shadow-card"><span>Demand forecasts and alerts</span><StatusBadge status="in-development" /></li><li className="flex items-center justify-between gap-3 rounded-xl bg-white p-3 shadow-card"><span>Institutional intelligence</span><StatusBadge status="agreement" /></li></ul>
          <Link className="inline-flex min-h-11 items-center font-bold text-teal underline underline-offset-4" href="/ai-intelligence">See the forecast chart →</Link></div></Reveal>
      </div></section>
      <section className="container-page py-8"><SectionHeading eyebrow="Pricing" title="Free core. Optional extras." lead="Browsing, basic buying and selling, orders and your own history have no platform access fee. Advanced services are optional and clearly labelled." /><div className="mt-8"><PricingCards /></div></section>
      <section className="container-page py-16"><Reveal><div className="rounded-3xl bg-gradient-to-br from-gold to-gold-dark/80 p-8 text-center sm:p-12">
        <h2 className="text-fluid-h2 font-semibold text-balance">Ready? Choose your path.</h2><p className="mx-auto mt-2 max-w-xl text-ink/80">Registering is free. Access to protected features follows verification.</p>
        <div className="mx-auto mt-6 grid max-w-3xl gap-3 sm:grid-cols-2">{startPaths.map((p) => <ButtonLink key={p.href} href={p.href} variant="primary">{p.label}</ButtonLink>)}</div></div></Reveal></section>
    </>
  );
}
