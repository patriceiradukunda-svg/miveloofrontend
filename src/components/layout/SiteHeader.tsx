import Link from 'next/link';
import { getT } from '@/i18n/server';
import { ButtonLink } from '@/components/ui/button';
import { Logo } from './Logo';
import { LanguageSwitcher } from './LanguageSwitcher';
import { MobileNavigation } from './MobileNavigation';

export async function SiteHeader() {
  const { t } = await getT();
  const items = [
    { href: '/how-it-works', label: t('nav.howItWorks') }, { href: '/marketplace', label: t('nav.marketplace') },
    { href: '/institutions', label: t('nav.institutions') }, { href: '/about', label: t('nav.about') },
  ];
  const actions = (
    <>
      <ButtonLink href="/sell" variant="gold">{t('nav.sell')}</ButtonLink>
      <ButtonLink href="/login" variant="secondary">{t('nav.schoolLogin')}</ButtonLink>
    </>
  );
  return (
    <header className="relative sticky top-0 z-40 border-b border-ink/10 bg-cream/95 backdrop-blur">
      <div className="container-page flex items-center justify-between gap-4 py-2">
        <Logo className="h-14 w-auto" priority />
        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {items.map((i) => <Link key={i.href} href={i.href} className="rounded-full px-4 py-2.5 font-semibold hover:bg-cream-deep">{i.label}</Link>)}
        </nav>
        <div className="hidden items-center gap-3 lg:flex"><LanguageSwitcher />{actions}</div>
        <MobileNavigation items={items} menuLabel={t('nav.menu')} closeLabel={t('nav.close')} extra={<><LanguageSwitcher />{actions}</>} />
      </div>
    </header>
  );
}
