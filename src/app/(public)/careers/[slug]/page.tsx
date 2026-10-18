import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getT } from '@/i18n/server';
import { Reveal } from '@/components/public/home/Reveal';
import { Bg, Eyebrow, gold, h2s, h1s, light, wide } from '@/components/public/kit';
import { DEFAULT_DOCUMENTS, formatDate, getJob, isOpen, jobText } from '@/config/careers';
import { carLabels, jobMeta } from '@/features/careers/labels';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const job = getJob(slug);
  if (!job) return { title: 'Careers' };
  return { title: job.title, description: job.summary, alternates: { canonical: `/careers/${job.slug}` } };
}

function Block({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="rounded-2xl border border-ink/10 bg-white p-7 shadow-card sm:p-8">
      <h2 className="text-2xl font-semibold text-teal-dark">{title}</h2>
      <ul className="mt-4 space-y-3">
        {items.map((x) => <li key={x} className="flex gap-3 text-lg text-ink-soft"><span aria-hidden className="mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-green text-sm font-bold text-white">✓</span>{x}</li>)}
      </ul>
    </section>
  );
}

export default async function JobPage({ params }: Props) {
  const { slug } = await params;
  const job = getJob(slug);
  if (!job) notFound();
  const { t, locale } = await getT();
  const L = carLabels(t);
  const meta = jobMeta(t);
  const jt = jobText(job, locale);
  const open = isOpen(job);
  const docs = (job.documents ?? DEFAULT_DOCUMENTS).map((d) => ({ id: d.id, label: d.label ?? L.docs[d.id], required: d.required }));
  const facts: [string, string][] = [
    [t('car.d.team', 'Team'), job.team],
    [t('car.d.type', 'Type'), meta.type[job.type]],
    [t('car.d.mode', 'Work mode'), meta.mode[job.workMode]],
    [t('car.d.loc', 'Location'), job.location],
    [t('car.d.posted', 'Posted'), formatDate(job.posted, locale)],
    ...(job.closes ? [[t('car.d.closes', 'Closes'), formatDate(job.closes, locale)] as [string, string]] : []),
  ];

  return (
    <>
      <section className="bg-cream-deep">
        <div className={`${wide} py-14 lg:py-20`}>
          <Link href="/careers#roles" className="inline-flex min-h-11 items-center text-sm font-bold text-teal underline"><span aria-hidden className="mr-2">←</span>{t('car.d.back', 'All roles')}</Link>
          <div className="rise mt-4 max-w-4xl space-y-5">
            <Eyebrow dark={false}>{job.team}</Eyebrow>
            <h1 style={h2s} className="text-balance font-semibold leading-[1.1] tracking-tight text-teal-dark">{jt.title}</h1>
            <p className="text-lg text-ink-soft md:text-xl">{jt.summary}</p>
            <ul className="flex flex-wrap gap-2">
              {[meta.type[job.type], meta.mode[job.workMode], job.location].map((c) => <li key={c} className="rounded-full border border-ink/10 bg-white px-4 py-1.5 text-sm font-semibold text-teal-dark">{c}</li>)}
            </ul>
            <div className="pt-2">
              {open
                ? <Link href={`/careers/${job.slug}/apply`} className={gold}>{t('car.d.apply', 'Apply for this role')} <span aria-hidden className="ml-2">→</span></Link>
                : <p role="status" className="inline-block rounded-2xl bg-gold-tint px-5 py-3 font-semibold">{t('car.d.closed', 'Applications for this role are closed.')}</p>}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className={`${wide} grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-12`}>
          <div className="space-y-6">
            <Reveal>
              <section className="rounded-2xl border border-ink/10 bg-white p-7 shadow-card sm:p-8">
                <h2 className="text-2xl font-semibold text-teal-dark">{t('car.d.about', 'About the role')}</h2>
                <div className="mt-4 space-y-4 text-lg text-ink-soft">{jt.about.map((p) => <p key={p}>{p}</p>)}</div>
              </section>
            </Reveal>
            <Reveal><Block title={t('car.d.resp', 'What you will do')} items={jt.responsibilities} /></Reveal>
            <Reveal><Block title={t('car.d.req', 'What we are looking for')} items={jt.requirements} /></Reveal>
            {jt.niceToHave && jt.niceToHave.length > 0 && <Reveal><Block title={t('car.d.nice', 'Nice to have')} items={jt.niceToHave} /></Reveal>}
            {jt.benefits && jt.benefits.length > 0 && <Reveal><Block title={t('car.d.ben', 'What we offer')} items={jt.benefits} /></Reveal>}
          </div>

          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-2xl border border-ink/10 bg-white p-7 shadow-card">
              <h2 className="text-xl font-semibold text-teal-dark">{t('car.d.glance', 'Role at a glance')}</h2>
              <dl className="mt-4 divide-y divide-ink/10">
                {facts.map(([k, v]) => <div key={k} className="flex justify-between gap-4 py-3"><dt className="text-sm font-bold uppercase tracking-wider text-ink-soft">{k}</dt><dd className="text-right font-semibold">{v}</dd></div>)}
              </dl>
            </div>
            <div className="rounded-2xl border border-ink/10 bg-white p-7 shadow-card">
              <h2 className="text-xl font-semibold text-teal-dark">{t('car.d.docs', 'Documents you will need')}</h2>
              <p className="mt-1 text-sm text-ink-soft">{t('car.d.docsNote', 'You will add these one at a time while you apply.')}</p>
              <ul className="mt-4 space-y-3">
                {docs.map((d) => (
                  <li key={d.id} className="flex items-start justify-between gap-3">
                    <span className="font-semibold">{d.label}</span>
                    <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${d.required ? 'bg-gold-tint text-ink' : 'bg-teal-tint text-teal-dark'}`}>{d.required ? L.up.required : L.up.optional}</span>
                  </li>
                ))}
              </ul>
              {open && <Link href={`/careers/${job.slug}/apply`} className={`${gold} mt-6 w-full`}>{t('car.d.apply', 'Apply for this role')}</Link>}
            </div>
          </aside>
        </div>
      </section>

      <Bg n="09-bananas-plantains" pos="30% 50%" overlay="bg-gradient-to-r from-ink/90 via-ink/70 to-ink/40" className="py-24 text-center">
        <Reveal className={wide}>
          <h2 style={h1s} className="mx-auto max-w-4xl text-balance font-semibold leading-[1.04]">{t('car.d.endTitle', 'Not the right role? Come with your own idea.')}</h2>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/careers/idea" className={gold}>{t('car.p2cta', 'Share your idea')} <span aria-hidden className="ml-2">→</span></Link>
            <Link href="/careers#roles" className={light}>{t('car.d.back', 'All roles')}</Link>
          </div>
          <p className="mx-auto mt-10 max-w-xl text-sm text-cream/80">{t('home2.photoNote', 'Photographs are illustrative and do not depict verified Miveloo users. Marketplace access is available to authorised schools and partners after sign-in.')}</p>
        </Reveal>
      </Bg>
    </>
  );
}
