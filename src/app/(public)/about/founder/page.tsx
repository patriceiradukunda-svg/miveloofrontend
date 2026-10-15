import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { founder } from '@/config/founder';
import { Photo } from '@/components/media/Photo';
import { Scene } from '@/components/media/Scenes';
import { Reveal } from '@/components/ui/reveal';
import { ButtonLink } from '@/components/ui/button';
export const metadata: Metadata = { title: 'A note from the founder', alternates: { canonical: '/about/founder' } };

const VALUES = [['🌱', 'Start with the person', 'A school cook, a farmer, a cooperative leader. If it is not clear to them, it is not finished.'], ['🔍', 'Say what is real', 'We label live, in development and planned. We never present sample data as real.'], ['🤝', 'Fair to both sides', 'Schools need dependable food; suppliers need dependable markets. We build for both.'], ['🛡️', 'Private by default', 'School data is private. Suppliers choose what the public sees.']];
export default function Founder() {
  return (
    <>
      <section className="bg-gradient-to-b from-cream-deep/70 to-cream">
        <div className="container-page grid items-center gap-10 py-14 md:grid-cols-[1fr_1.2fr]">
          <div className="relative mx-auto w-full max-w-sm"><div aria-hidden className="blob absolute -inset-3 bg-gold/40" /><Image src={founder.photo} alt={`${founder.name}, ${founder.title}`} width={480} height={480} priority className="blob relative aspect-square w-full object-cover shadow-card" /></div>
          <div className="space-y-4"><p className="eyebrow flex items-center gap-2"><span aria-hidden className="h-0.5 w-8 bg-gold" />A note from the founder</p>
            <h1 className="text-fluid-h2 font-semibold text-balance text-teal-dark">Every school day depends on food arriving. <span className="mark">We make that dependable.</span></h1>
            <p className="text-lg text-ink-soft">I am {founder.name}. Miveloo began from a simple belief: the people who grow food and the schools that need it should be able to find each other, trade fairly, and learn from the data they already create.</p>
            <div className="flex flex-wrap gap-3"><ButtonLink href="/tour" variant="gold">🧭 Take the guided tour</ButtonLink><ButtonLink href="/about/team" variant="secondary">Meet the team</ButtonLink></div></div>
        </div>
      </section>
      <div className="container-page max-w-5xl space-y-14 py-12">
        <Reveal><div className="grid gap-6 md:grid-cols-2">
          <article className="rounded-3xl bg-teal p-8 text-cream"><p className="text-xs font-bold uppercase tracking-[0.14em] text-gold">Mission</p><h2 className="mt-2 text-3xl font-semibold">Make school feeding more reliable.</h2><p className="mt-3 text-cream/90">Help schools access the food they need, help suppliers reach reliable markets, and reduce avoidable inefficiency in how school food is bought and delivered.</p></article>
          <article className="rounded-3xl bg-gold p-8"><p className="text-xs font-bold uppercase tracking-[0.14em] text-ink/70">Vision</p><h2 className="mt-2 text-3xl font-semibold">Informed school feeding, Rwanda first, Africa next.</h2><p className="mt-3 text-ink/80">A trusted food-system platform where institutions decide with reliable data, and every supplier, large or small, can reach meaningful demand.</p></article>
        </div></Reveal>
        <Reveal><section><h2 className="text-3xl font-semibold text-teal-dark">What guides us</h2><ul className="mt-5 grid gap-4 sm:grid-cols-2">{VALUES.map(([e, t, d]) => <li key={t} className="rounded-2xl border border-ink/10 bg-white p-5 shadow-card"><span aria-hidden className="text-3xl">{e}</span><h3 className="mt-1 text-xl font-semibold">{t}</h3><p className="text-ink-soft">{d}</p></li>)}</ul></section></Reveal>
        <Reveal><section className="grid items-center gap-8 md:grid-cols-2"><div className="overflow-hidden rounded-3xl"><Photo k="hills" alt="Agricultural hills in Rwanda" className="aspect-[4/3]" fallback={<Scene name="farm" />} /></div>
          <div className="space-y-3"><h2 className="text-3xl font-semibold text-teal-dark">What I will not do</h2><ul className="space-y-2 text-lg text-ink-soft"><li>✕ Claim customers, partners, coverage or impact we cannot prove.</li><li>✕ Present a prediction as a promise.</li><li>✕ Let a paid plan bypass anyone&rsquo;s privacy.</li><li>✕ Hide where a number came from.</li></ul><Link className="font-bold text-teal underline underline-offset-4" href="/trust">Read the trust centre →</Link></div></section></Reveal>
      </div>
    </>
  );
}
