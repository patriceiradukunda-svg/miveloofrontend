import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getT } from '@/i18n/server';
import { h2s, solid, wide } from '@/components/public/kit';
import { DEFAULT_DOCUMENTS, isOpen, jobText } from '@/config/careers';
import { fetchJob } from '@/lib/careers-public';
import { ApplicationWizard, type ApplyJob } from '@/features/careers/ApplicationWizard';
import { carLabels } from '@/features/careers/labels';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const job = await fetchJob(slug);
  return { title: job ? `Apply: ${job.title}` : 'Careers', robots: { index: false, follow: true } };
}

export default async function ApplyPage({ params }: Props) {
  const { slug } = await params;
  const job = await fetchJob(slug);
  if (!job) notFound();
  const { t, locale } = await getT();
  const L = carLabels(t);
  const jt = jobText(job, locale);

  if (!isOpen(job)) {
    return (
      <section className={`${wide} py-24`}>
        <div role="status" className="mx-auto max-w-2xl rounded-2xl border border-ink/10 bg-white p-8 text-center shadow-card">
          <h1 className="text-2xl font-semibold text-teal-dark">{t('car.d.closed', 'Applications for this role are closed.')}</h1>
          <Link href="/careers#roles" className={`${solid} mt-6`}>{t('car.d.back', 'All roles')}</Link>
        </div>
      </section>
    );
  }

  const apply: ApplyJob = {
    slug: job.slug,
    title: jt.title,
    questions: (job.questions ?? []).map((q) => ({ id: q.id, label: q.label, ...(q.hint ? { hint: q.hint } : {}), required: q.required === true })),
    docs: (job.documents ?? DEFAULT_DOCUMENTS).map((d) => ({ id: d.id, label: d.label ?? L.docs[d.id], hint: d.hint ?? L.docHints[d.id], required: d.required })),
  };

  return (
    <>
      <section className="bg-cream-deep">
        <div className={`${wide} py-12 lg:py-16`}>
          <Link href={`/careers/${job.slug}`} className="inline-flex min-h-11 items-center text-sm font-bold text-teal underline"><span aria-hidden className="mr-2">←</span>{jt.title}</Link>
          <div className="rise mt-3 max-w-3xl space-y-3">
            <h1 style={h2s} className="text-balance font-semibold leading-[1.1] tracking-tight text-teal-dark">{jt.title}</h1>
            <p className="text-lg text-ink-soft">{t('car.a.lead', 'Take your time. You can go back and change anything before you send. Keep this page open until you have submitted.')}</p>
          </div>
        </div>
      </section>
      <section className={`${wide} py-12`}>
        <div className="mx-auto max-w-5xl rounded-2xl border border-ink/10 bg-white p-6 shadow-card sm:p-10">
          <ApplicationWizard job={apply} L={L} />
        </div>
      </section>
    </>
  );
}
