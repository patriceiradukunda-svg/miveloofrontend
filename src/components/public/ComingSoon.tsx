import { ButtonLink } from '@/components/ui/button';

/** Honest placeholder for public sections that are planned but not yet published. */
export function ComingSoon({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return (
    <section className="container-page pb-32 pt-16">
      <p className="font-sans text-sm font-bold uppercase tracking-wider text-teal">{eyebrow}</p>
      <h1 className="mt-2 max-w-3xl text-3xl font-bold text-ink sm:text-4xl">{title}</h1>
      <p className="mt-4 max-w-2xl text-lg text-ink-soft">{text}</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <ButtonLink href="/insights" variant="gold" className="shadow-card">Read our insights <span aria-hidden>→</span></ButtonLink>
        <ButtonLink href="/contact" variant="ghost">Get in touch</ButtonLink>
      </div>
    </section>
  );
}
