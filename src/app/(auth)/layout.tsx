import Image from 'next/image';
import Link from 'next/link';
import { Logo } from '@/components/layout/Logo';
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher';
import { Eyebrow, P } from '@/components/public/kit';
import { getT } from '@/i18n/server';

const SCENES = [['02-farmer-grass-portrait', '50% 30%'], ['03-school-canteen-serving', '50% 30%'], ['13-farmer-carrying-sack', '50% 30%'], ['06-school-kitchen-cooks', '50% 45%']] as const;

/** Auth shell: a slowly cross-fading photo panel (large screens), and a calm cream panel with the form card. */
export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const { t } = await getT();
  const tagline = t('auth.tagline', 'From local farms to school kitchens.');
  const chips = [t('auth.c1', 'Schools find and order'), t('auth.c2', 'Suppliers list and sell'), t('auth.c3', 'Cooperatives sell together')];
  return (
    <div className="grid min-h-screen lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      <aside className="relative isolate hidden overflow-hidden bg-ink text-cream lg:block">
        <style>{'@keyframes authfade{0%{opacity:0}5%{opacity:1}25%{opacity:1}30%{opacity:0}100%{opacity:0}}'}</style>
        {SCENES.map(([n, pos], k) => <Image key={n} src={`${P}${n}.jpg`} alt="" fill priority={k === 0} sizes="50vw" className="-z-20 object-cover" style={{ objectPosition: pos, animation: `authfade 28s linear ${k * 7}s infinite backwards` }} />)}
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/90 via-ink/40 to-ink/25" />
        <div className="sticky top-0 flex h-screen flex-col justify-end gap-5 p-12 xl:p-16">
          <Eyebrow>Miveloo</Eyebrow>
          <h2 className="max-w-lg text-balance font-display text-4xl font-semibold leading-[1.08] xl:text-5xl">{tagline}</h2>
          <ul className="flex flex-wrap gap-2">{chips.map((c) => <li key={c} className="rounded-full border border-cream/30 bg-ink/40 px-4 py-2 text-sm font-semibold backdrop-blur-md">{c}</li>)}</ul>
          <p className="text-xs text-cream/70">{t('auth.photoNote', 'Photographs are illustrative and do not depict verified Miveloo users.')}</p>
        </div>
      </aside>

      <div className="relative isolate flex min-h-screen flex-col overflow-hidden bg-cream">
        <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 -z-10 h-80 w-80 rounded-full bg-gold/25 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-32 -left-24 -z-10 h-96 w-96 rounded-full bg-green/20 blur-3xl" />
        <header className="flex items-center justify-between gap-3 px-4 py-3 sm:px-8">
          <Logo className="h-12 w-auto" priority />
          <div className="flex items-center gap-2">
            <Link href="/" className="inline-flex min-h-11 items-center rounded-full px-4 text-sm font-bold text-teal hover:bg-teal-tint"><span aria-hidden className="mr-1.5">←</span>{t('auth.home', 'Home')}</Link>
            <LanguageSwitcher />
          </div>
        </header>
        <main id="main" tabIndex={-1} className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-4 pb-10 pt-4 sm:px-8">
          <div className="rise relative rounded-3xl border border-ink/10 bg-white/90 p-6 shadow-card backdrop-blur sm:p-9">
            <span aria-hidden className="absolute inset-x-10 top-0 h-1 rounded-b-full bg-gradient-to-r from-green via-gold to-teal" />
            {children}
          </div>
        </main>
        <footer className="flex flex-wrap justify-center gap-x-5 gap-y-1 px-4 pb-6 text-sm text-ink-soft"><Link className="underline" href="/privacy">{t('auth.privacy', 'Privacy')}</Link><Link className="underline" href="/terms">{t('auth.terms', 'Terms')}</Link><Link className="underline" href="/contact">{t('auth.help', 'Need help?')}</Link></footer>
      </div>
    </div>
  );
}
