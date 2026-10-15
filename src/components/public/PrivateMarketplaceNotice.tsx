import { Scene } from '@/components/media/Scenes';
import { ButtonLink } from '@/components/ui/button';
import { SectionHeading } from '@/components/layout/SectionHeading';
import { Reveal } from '@/components/ui/reveal';

const STEPS = [['📝', 'Register', 'Create a school account. It is free.'], ['🛡️', 'Get verified', 'We confirm your school before access unlocks.'], ['🛒', 'Enter the marketplace', 'Compare suppliers and order inside your workspace.']];
/** The marketplace is private. This explains it without exposing any listing. */
export function PrivateMarketplaceNotice() {
  return (
    <section className="bg-cream-deep/60 py-16" aria-labelledby="pm-t"><div className="container-page grid items-center gap-10 md:grid-cols-2">
      <Reveal><div className="space-y-5">
        <SectionHeading eyebrow="The marketplace" title="Private by design, trusted by both sides" lead="Miveloo's marketplace lives inside the platform. Verified schools browse, compare and order there; suppliers publish listings from their own workspace for those schools to find. Visitors and unverified accounts do not see it." />
        <ol className="space-y-2">{STEPS.map(([e, t, d], i) => <li key={t} className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-card"><span aria-hidden className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gold-tint text-2xl">{e}</span><p><strong>{i + 1}. {t}</strong><span className="block text-sm text-ink-soft">{d}</span></p></li>)}</ol>
        <div className="flex flex-wrap gap-3"><ButtonLink href="/register/school" variant="primary">Register your school</ButtonLink><ButtonLink href="/sell" variant="gold">Sell on Miveloo</ButtonLink><ButtonLink href="/login" variant="secondary">School login</ButtonLink></div>
      </div></Reveal>
      <Reveal delay={100}><div aria-hidden className="overflow-hidden rounded-3xl shadow-card"><Scene name="trust" /></div></Reveal>
      <h2 id="pm-t" className="sr-only">Private marketplace</h2>
    </div></section>
  );
}
