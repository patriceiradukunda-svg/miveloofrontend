import { notFound } from 'next/navigation';
import { publicContent } from '@/config/public-content';
import { PageHeader } from '@/components/layout/PageHeader';
import { ButtonLink } from '@/components/ui/button';

export function ContentPage({ slug }: { slug: string }) {
  const c = publicContent[slug]; if (!c) notFound();
  return (
    <div className="container-page max-w-3xl py-14">
      <PageHeader title={c.title} lead={c.lead} status={c.status ?? undefined} />
      <div className="mt-10 space-y-10">
        {c.sections.map(([h, items]) => (
          <section key={h}><h2 className="text-2xl font-semibold text-teal-dark">{h}</h2>
            {items.length === 1 ? <p className="mt-3 text-lg text-ink-soft">{items[0]}</p> : <ul className="mt-3 list-disc space-y-2 pl-5 text-lg text-ink-soft">{items.map((i) => <li key={i}>{i}</li>)}</ul>}</section>))}
      </div>
      <div className="mt-12 flex flex-wrap gap-3"><ButtonLink href="/marketplace">Browse marketplace</ButtonLink><ButtonLink href="/contact" variant="secondary">Contact us</ButtonLink></div>
    </div>
  );
}
