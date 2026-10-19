import type { Metadata } from 'next';
import Link from 'next/link';
import { getT } from '@/i18n/server';
import { Reveal } from '@/components/public/home/Reveal';
import { Bg, Eyebrow, Icon, gold, h1s, h2s, light, solid, wide } from '@/components/public/kit';
import { formatDate, getJobs, isOpen, jobText } from '@/config/careers';
import { jobMeta } from '@/features/careers/labels';

export const metadata: Metadata = {
  title: 'Careers',
  description: 'Join Miveloo. Apply for a posted role, or come to us with an idea of your own.',
  alternates: { canonical: '/careers' },
};

export default async function CareersPage() {
  const { t, locale } = await getT();
  const meta = jobMeta(t);
  const open = getJobs().filter((j) => isOpen(j));
  const paths = [
    { d: ['M3 7h18v13H3z', 'M8 7V4h8v3', 'M3 13h18'], h: t('car.p1h', 'Apply for a posted role'), b: t('car.p1b', 'See what we are hiring for, read the full details and apply step by step.'), href: '#roles', cta: t('car.p1cta', 'See open roles'), cls: gold },
    { d: ['M9 18h6', 'M10 21h4', 'M12 3a6 6 0 00-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0012 3z'], h: t('car.p2h', 'Bring your own idea'), b: t('car.p2b', 'Have an idea for this ecosystem and want to build it with us? Tell us about it.'), href: '/careers/idea', cta: t('car.p2cta', 'Share your idea'), cls: solid },
  ];
  const how = [
    { d: ['M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z', 'M14 2v6h6', 'M9 13h6', 'M9 17h6'], h: t('car.h1', 'Read the role'), b: t('car.h1b', 'See the full details first: what the work is and what we ask for.') },
    { d: ['M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2', 'M12 11a4 4 0 100-8 4 4 0 000 8z'], h: t('car.h2', 'Tell us about you'), b: t('car.h2b', 'Fill in a step-by-step form about you, your experience and your education.') },
    { d: ['M12 16V4', 'M7 9l5-5 5 5', 'M5 20h14'], h: t('car.h3', 'Upload your documents'), b: t('car.h3b', 'Add each document the role asks for, one step at a time.') },
    { d: ['M4 12l5 5L20 6'], h: t('car.h4', 'Review and send'), b: t('car.h4b', 'Check everything, then submit. You can go back and edit any step.') },
  ];

  return (
    <>
      <section className="bg-cream-deep">
        <div className={`${wide} py-20 lg:py-28`}>
          <div className="rise max-w-5xl space-y-6">
            <Eyebrow dark={false}>{t('car.eyebrow', 'Careers')}</Eyebrow>
            <h1 style={h1s} className="text-balance font-semibold leading-[1.04] tracking-tight text-teal-dark">{t('car.title', 'Our team is not enough for this ecosystem. Come and join us.')}</h1>
            <p className="max-w-3xl text-lg text-ink-soft md:text-xl">{t('car.lead', 'There are two ways to join us. Some wait for a posted role. Others come with an idea of their own. Which one would you like today?')}</p>
          </div>
          <ul className="mt-12 grid gap-5 md:grid-cols-2">
            {paths.map((p, k) => (
              <li key={p.h}>
                <Reveal delay={k * 100} className="h-full">
                  <div className="flex h-full flex-col rounded-2xl border border-ink/10 bg-white p-8 shadow-card">
                    <span className="grid h-14 w-14 place-items-center rounded-full bg-teal text-cream"><Icon d={p.d} /></span>
                    <h2 className="mt-6 text-2xl font-semibold text-teal-dark">{p.h}</h2>
                    <p className="mt-2 flex-1 text-lg text-ink-soft">{p.b}</p>
                    <Link href={p.href} className={`${p.cls} mt-6 self-start`}>{p.cta} <span aria-hidden className="ml-2">→</span></Link>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="roles" className="scroll-mt-24 py-24">
        <div className={wide}>
          <Reveal>
            <Eyebrow dark={false}>{t('car.rEyebrow', 'Open roles')}</Eyebrow>
            <h2 style={h2s} className="mt-3 max-w-3xl text-balance font-semibold text-teal-dark">{t('car.rTitle', 'Roles we have posted')}</h2>
          </Reveal>
          {open.length === 0 ? (
            <Reveal className="mt-10">
              <div className="rounded-2xl border-2 border-dashed border-ink/20 bg-white/60 p-10 text-center">
                <h3 className="text-2xl font-semibold text-teal-dark">{t('car.emptyT', 'No open roles right now')}</h3>
                <p className="mx-auto mt-2 max-w-xl text-lg text-ink-soft">{t('car.emptyB', 'We have not posted any roles at the moment. You can still come to us with an idea.')}</p>
                <Link href="/careers/idea" className={`${solid} mt-6`}>{t('car.p2cta', 'Share your idea')}</Link>
              </div>
            </Reveal>
          ) : (
            <ul className="mt-10 grid gap-5 lg:grid-cols-2">
              {open.map((j, k) => {
                const jt = jobText(j, locale);
                return (
                  <li key={j.slug}>
                    <Reveal delay={(k % 2) * 90} className="h-full">
                      <article className="flex h-full flex-col rounded-2xl border border-ink/10 bg-white p-7 shadow-card sm:p-8">
                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal">{j.team}</p>
                        <h3 className="mt-2 text-2xl font-semibold text-teal-dark"><Link href={`/careers/${j.slug}`} className="hover:underline">{jt.title}</Link></h3>
                        <ul className="mt-4 flex flex-wrap gap-2">
                          {[meta.type[j.type], meta.mode[j.workMode], j.location].map((c) => <li key={c} className="rounded-full bg-teal-tint px-3 py-1 text-sm font-semibold text-teal-dark">{c}</li>)}
                        </ul>
                        <p className="mt-4 flex-1 text-lg text-ink-soft">{jt.summary}</p>
                        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                          <p className="text-sm text-ink-soft">{j.closes ? `${t('car.closes', 'Closes')}: ${formatDate(j.closes, locale)}` : `${t('car.posted', 'Posted')}: ${formatDate(j.posted, locale)}`}</p>
                          <Link href={`/careers/${j.slug}`} className={solid}>{t('car.view', 'View role')} <span aria-hidden className="ml-2">→</span></Link>
                        </div>
                      </article>
                    </Reveal>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>

      <section className="bg-cream-deep py-24">
        <div className={wide}>
          <Reveal>
            <Eyebrow dark={false}>{t('car.hEyebrow', 'How applying works')}</Eyebrow>
            <h2 style={h2s} className="mt-3 max-w-3xl text-balance font-semibold text-teal-dark">{t('car.hTitle', 'Four simple steps')}</h2>
          </Reveal>
          <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {how.map((s, k) => (
              <li key={s.h}>
                <Reveal delay={k * 90} className="h-full">
                  <div className="relative h-full overflow-hidden rounded-2xl bg-white p-7 shadow-card">
                    <span aria-hidden className="absolute -right-1 -top-5 font-display text-9xl font-bold text-gold/25">{k + 1}</span>
                    <span className="relative grid h-12 w-12 place-items-center rounded-full bg-teal text-cream"><Icon d={s.d} /></span>
                    <h3 className="relative mt-5 text-xl font-semibold">{s.h}</h3>
                    <p className="relative mt-2 text-ink-soft">{s.b}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <Bg n="12-produce-flatlay" pos="50% 40%" overlay="bg-gradient-to-r from-ink/90 via-ink/70 to-ink/40" className="py-28 text-center">
        <Reveal className={wide}>
          <h2 style={h1s} className="mx-auto max-w-4xl text-balance font-semibold leading-[1.04]">{t('car.endTitle', 'Have an idea? Come and build it with us.')}</h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-cream/90 md:text-xl">{t('car.endBody', 'Not every way to join is a posted role. If you see something this ecosystem needs, tell us about it.')}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/careers/idea" className={gold}>{t('car.p2cta', 'Share your idea')} <span aria-hidden className="ml-2">→</span></Link>
            <Link href="#roles" className={light}>{t('car.p1cta', 'See open roles')}</Link>
          </div>
        </Reveal>
      </Bg>
    </>
  );
}
