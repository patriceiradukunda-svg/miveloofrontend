import Link from 'next/link';
import { getT } from '@/i18n/server';
import { ButtonLink } from '@/components/ui/button';
import { Photo } from '@/components/media/Photo';
import { Scene } from '@/components/media/Scenes';

export async function HeroSection() {
  const { t } = await getT();
  const chips = ['✔ Verified schools only buy', '🆓 Free core marketplace', '🔎 Honest AI estimates'];
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-cream-deep/70 via-cream to-cream">
      <div aria-hidden className="absolute -right-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-gold/25 blur-3xl" />
      <div className="container-page relative grid items-center gap-10 py-12 md:grid-cols-[1.1fr_1fr] md:py-20">
        <div className="rise space-y-6">
          <p className="eyebrow flex items-center gap-2"><span aria-hidden className="h-0.5 w-8 bg-gold" />{t('home.eyebrow')}</p>
          <h1 className="text-fluid-hero font-semibold text-balance text-teal-dark">{t('home.titleA')} <span className="mark">{t('home.titleB')}</span></h1>
          <p className="max-w-xl text-lg text-ink-soft">{t('home.lead')}</p>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/tour" variant="gold">🧭 {t('tour.cta', 'Tour with the founder')}</ButtonLink>
            <ButtonLink href="/sell" variant="primary">{t('home.ctaSell')}</ButtonLink>
            <ButtonLink href="/how-it-works" variant="secondary">{t('home.ctaBrowse')}</ButtonLink>
          </div>
          <p className="text-sm"><Link className="font-bold text-teal underline underline-offset-4" href="/register/school">{t('home.ctaSchool')} →</Link></p>
        </div>
        <div className="relative">
          <div className="blob floaty overflow-hidden shadow-card">
            <Photo k="schoolMeal" alt="Schoolchildren enjoying a school meal" className="aspect-[5/4]" priority fallback={<Scene name="cycle" label="Farms supply food, trucks deliver it, schools receive it" />} />
          </div>
          <ul className="mt-4 flex flex-wrap gap-2 md:absolute md:-bottom-6 md:left-0 md:right-0 md:mt-0 md:justify-center">{chips.map((c) => <li key={c} className="rounded-full bg-white px-4 py-2 text-sm font-bold shadow-card">{c}</li>)}</ul>
        </div>
      </div>
    </section>
  );
}
