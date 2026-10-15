import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getT } from '@/i18n/server';
import { Reveal } from '@/components/public/home/Reveal';
import { Bg, Eyebrow, Icon, gold, h1s, h2s, light, shadow, wide } from '@/components/public/kit';
import { team } from '@/config/team';

export const metadata: Metadata = {
  title: 'Team',
  description: 'Meet the people building Miveloo, the school food marketplace and food-system intelligence platform for Rwanda.',
  alternates: { canonical: '/about/team' },
};

export default async function TeamPage() {
  const { t } = await getT();
  const values = [
    { d: ['M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2', 'M12 11a4 4 0 100-8 4 4 0 000 8'], h: t('team.v1h', 'Start with the person'), b: t('team.v1b', 'A school cook, a farmer, a cooperative leader. If it is not clear to them, it is not finished.') },
    { d: ['M21 21l-4.3-4.3', 'M11 18a7 7 0 100-14 7 7 0 000 14'], h: t('team.v2h', 'Say what is real'), b: t('team.v2b', 'We label what is live, in development and planned, and we never present sample data as real.') },
    { d: ['M12 3v18', 'M5 8h14', 'M5 8l-3 7a3 3 0 006 0l-3-7z', 'M19 8l-3 7a3 3 0 006 0l-3-7z'], h: t('team.v3h', 'Fair to both sides'), b: t('team.v3b', 'Schools need dependable food and suppliers need dependable markets. We build for both.') },
    { d: ['M5 11h14v9H5z', 'M8 11V8a4 4 0 018 0v3'], h: t('team.v4h', 'Private by default'), b: t('team.v4b', 'School data is private, and the marketplace is for verified schools only.') },
  ];
  return (
    <>
      <Bg n="03-school-canteen-serving" pos="50% 40%" overlay="bg-gradient-to-r from-ink/90 via-ink/60 to-ink/10" className="flex min-h-[64svh] items-end">
        <div className={`${wide} rise space-y-6 pb-16 pt-32`}>
          <Eyebrow>{t('team.eyebrow', 'Our team')}</Eyebrow>
          <h1 style={h1s} className={`max-w-5xl text-balance font-semibold leading-[1.04] tracking-tight ${shadow}`}>{t('team.title', 'The people building Miveloo.')}</h1>
          <p className="max-w-2xl text-lg text-cream/90 md:text-xl">{t('team.lead', 'A small team working to make school feeding more reliable, starting in Rwanda.')}</p>
        </div>
      </Bg>

      <section className="py-24">
        <div className={wide}>
          <Reveal>
            <Eyebrow dark={false}>{t('team.mEyebrow', 'Meet the team')}</Eyebrow>
            <h2 style={h2s} className="mt-3 max-w-3xl text-balance font-semibold text-teal-dark">{t('team.mTitle', 'Real people behind the platform')}</h2>
          </Reveal>
          <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((m, k) => (
              <li key={m.name}>
                <Reveal delay={k * 120} className="h-full">
                  <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-card transition-transform duration-300 hover:-translate-y-1">
                    <div className="relative aspect-square overflow-hidden bg-cream-deep">
                      <Image src={m.photo} alt={t('team.photoAlt', 'Portrait of') + ' ' + m.name} fill sizes="(min-width:1024px) 30vw, (min-width:640px) 45vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" style={{ objectPosition: '50% 22%' }} />
                    </div>
                    <div className="p-6 sm:p-7">
                      <h3 className="text-2xl font-semibold text-teal-dark">{m.name}</h3>
                      {m.role ? <p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-gold-dark">{m.role}</p> : null}
                      {m.bio ? <p className="mt-3 text-base text-ink-soft">{m.bio}</p> : null}
                    </div>
                  </article>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-cream-deep py-24">
        <div className={wide}>
          <Reveal>
            <Eyebrow dark={false}>{t('team.gEyebrow', 'What guides us')}</Eyebrow>
            <h2 style={h2s} className="mt-3 max-w-3xl text-balance font-semibold text-teal-dark">{t('team.gTitle', 'How we work')}</h2>
          </Reveal>
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, k) => (
              <li key={v.h}>
                <Reveal delay={k * 100} className="h-full">
                  <div className="h-full rounded-2xl border border-ink/10 bg-white p-6 shadow-card">
                    <span className="grid h-12 w-12 place-items-center rounded-full bg-teal text-cream"><Icon d={v.d} /></span>
                    <h3 className="mt-4 text-xl font-semibold text-teal-dark">{v.h}</h3>
                    <p className="mt-2 text-ink-soft">{v.b}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Bg n="12-produce-flatlay" pos="50% 50%" overlay="bg-gradient-to-r from-ink/90 via-ink/70 to-ink/40" className="py-28 text-center">
        <Reveal className={wide}>
          <h2 style={h1s} className="mx-auto max-w-4xl text-balance font-semibold leading-[1.04]">{t('team.endTitle', 'Want to work with us?')}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-cream/90">{t('team.endLead', 'Schools, suppliers, cooperatives and partners are welcome to get in touch.')}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/contact" className={gold}>{t('team.contact', 'Contact us')} <span aria-hidden className="ml-2">→</span></Link>
            <Link href="/how-it-works" className={light}>{t('nav.howItWorks', 'How it works')}</Link>
          </div>
        </Reveal>
      </Bg>
    </>
  );
}
