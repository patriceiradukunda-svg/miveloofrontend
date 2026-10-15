import Link from 'next/link';
import { notFound } from 'next/navigation';
import { publicContent } from '@/config/public-content';
import { PageHeader } from '@/components/layout/PageHeader';
import { ButtonLink } from '@/components/ui/button';
import { Scene } from '@/components/media/Scenes';
import { Photo } from '@/components/media/Photo';
import { Reveal } from '@/components/ui/reveal';

const ICONS = ['🌱', '🧭', '🤝', '📈', '🛡️', '💬'];
export function ContentPage({ slug, after }: { slug: string; after?: React.ReactNode }) {
  const c = publicContent[slug]; if (!c) notFound();
  const scene = c.scene ?? 'farm';
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-b from-cream-deep/70 to-cream">
        <div className="container-page grid items-center gap-8 py-12 md:grid-cols-[1.1fr_1fr] md:py-16">
          <PageHeader title={c.title} lead={c.lead} status={c.status ?? undefined} />
          <div className="floaty overflow-hidden rounded-3xl shadow-card">
            {c.photo ? <Photo k={c.photo} alt="" className="aspect-[4/3]" priority fallback={<Scene name={scene} />} /> : <Scene name={scene} />}
          </div>
        </div>
      </section>
      <div className="container-page max-w-5xl space-y-6 py-12">
        {c.sections.map(([h, items], i) => (
          <Reveal key={h}>
            <section className="grid gap-4 rounded-3xl border border-ink/10 bg-white p-6 shadow-card sm:grid-cols-[4rem_1fr] sm:p-8">
              <span aria-hidden className="grid h-14 w-14 place-items-center rounded-2xl bg-gold-tint text-3xl">{ICONS[i % ICONS.length]}</span>
              <div><h2 className="text-2xl font-semibold text-teal-dark sm:text-3xl">{h}</h2>
                {items.length === 1 ? <p className="mt-2 text-lg text-ink-soft">{items[0]}</p> : <ul className="mt-3 space-y-2 text-lg text-ink-soft">{items.map((x) => <li key={x} className="flex gap-2"><span aria-hidden className="text-green">✔</span>{x}</li>)}</ul>}</div>
            </section>
          </Reveal>
        ))}
        {after}
        <div className="flex flex-wrap gap-3 pt-4"><ButtonLink href="/tour" variant="gold">🧭 Take the tour</ButtonLink><ButtonLink href="/how-it-works" variant="secondary">How it works</ButtonLink><Link className="inline-flex min-h-12 items-center px-4 font-bold underline" href="/contact">Contact us</Link></div>
      </div>
      {/* The marketplace is internal (sign-in required), so public pages point to registration instead. */}
      <div className="mt-12 flex flex-wrap gap-3"><ButtonLink href="/register">Get started</ButtonLink><ButtonLink href="/contact" variant="secondary">Contact us</ButtonLink></div>
    </div>
  );
}
