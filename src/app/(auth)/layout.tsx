import Image from 'next/image';
import Link from 'next/link';
import { Logo } from '@/components/layout/Logo';
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher';
import { Eyebrow, P } from '@/components/public/kit';
import { getT } from '@/i18n/server';

/** Split-screen auth shell: photo panel on large screens, slim photo banner on phones. */
export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const { t } = await getT();
  const tagline = t('auth.tagline', 'From local farms to school kitchens.');
  return (
    <div className="grid min-h-screen lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      <aside className="relative isolate hidden overflow-hidden text-cream lg:block">
        <Image src="/images/harvesting-hope-in-the-highlands.png" alt="" fill priority sizes="50vw" className="-z-20 object-cover" style={{ objectPosition: '50% 30%' }} />
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/90 via-ink/45 to-ink/20" />
        <div className="sticky top-0 flex h-screen flex-col justify-end gap-5 p-12 xl:p-16">
          <Eyebrow>Miveloo</Eyebrow>
          <h2 className="max-w-lg text-balance font-display text-4xl font-semibold leading-[1.08] xl:text-5xl">{tagline}</h2>
          <p className="max-w-md text-lg text-cream/90">{t('auth.sub', 'Connecting suppliers, cooperatives, schools and institutional partners for more reliable school feeding.')}</p>
        </div>
      </aside>

      <div className="flex min-h-screen flex-col bg-cream">
        <header className="flex items-center justify-between gap-3 px-4 py-3 sm:px-8">
          <Logo className="h-12 w-auto" priority />
          <div className="flex items-center gap-2">
            <Link href="/" className="inline-flex min-h-11 items-center rounded-full px-4 text-sm font-bold text-teal hover:bg-teal-tint"><span aria-hidden className="mr-1.5">←</span>{t('auth.home', 'Home')}</Link>
            <LanguageSwitcher />
          </div>
        </header>
        <div className="relative isolate h-28 overflow-hidden text-cream lg:hidden">
          <Image src="/images/harvesting-hope-in-the-highlands.png" alt="" fill sizes="100vw" className="-z-20 object-cover" style={{ objectPosition: '50% 30%' }} />
          <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-ink/85 to-ink/30" />
          <p className="flex h-full items-center px-4 font-display text-xl font-semibold sm:px-8">{tagline}</p>
        </div>
        <main id="main" tabIndex={-1} className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-4 pb-14 pt-8 sm:px-8">
          <div className="rise rounded-3xl border border-ink/10 bg-white p-6 shadow-card sm:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
