import type { Metadata } from 'next';
import Link from 'next/link';
import { getT } from '@/i18n/server';
import { h2s, wide } from '@/components/public/kit';
import { IdeaWizard } from '@/features/careers/IdeaWizard';
import { carLabels } from '@/features/careers/labels';

export const metadata: Metadata = {
  title: 'Share your idea',
  description: 'Have an idea for the school food ecosystem? Tell the Miveloo team and say how you would like to join.',
  alternates: { canonical: '/careers/idea' },
};

export default async function IdeaPage() {
  const { t } = await getT();
  const L = carLabels(t);
  return (
    <>
      <section className="bg-cream-deep">
        <div className={`${wide} py-12 lg:py-16`}>
          <Link href="/careers" className="inline-flex min-h-11 items-center text-sm font-bold text-teal underline"><span aria-hidden className="mr-2">←</span>{t('car.eyebrow', 'Careers')}</Link>
          <div className="rise mt-3 max-w-3xl space-y-3">
            <h1 style={h2s} className="text-balance font-semibold leading-[1.1] tracking-tight text-teal-dark">{t('car.i.title', 'Come up with your own way to join us.')}</h1>
            <p className="text-lg text-ink-soft">{t('car.i.lead', 'Tell us the problem you see, how you would solve it, and the part you would like to play. Keep this page open until you have submitted.')}</p>
          </div>
        </div>
      </section>
      <section className={`${wide} py-12`}>
        <div className="mx-auto max-w-3xl rounded-2xl border border-ink/10 bg-white p-6 shadow-card sm:p-10">
          <IdeaWizard L={L} />
        </div>
      </section>
    </>
  );
}
