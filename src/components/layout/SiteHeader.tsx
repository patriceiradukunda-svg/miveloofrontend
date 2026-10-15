import { getT } from '@/i18n/server';
import { getSession } from '@/lib/session';
import { ROLE_HOME } from '@/config/roles';
import { ButtonLink } from '@/components/ui/button';
import { Logo } from './Logo';
import { LanguageSwitcher } from './LanguageSwitcher';
import { MobileNavigation } from './MobileNavigation';
import { NavLinks } from './NavLinks';

/** Visitors see: Home, How it works, Schools, Institutions, About + Sell on Miveloo and School login. Signed-in users see their workspace instead. */
export async function SiteHeader() {
  const { t } = await getT();
  const session = await getSession();
  const items = [
    { href: '/', label: t('nav.home', 'Home') }, { href: '/how-it-works', label: t('nav.howItWorks') },
    { href: '/schools', label: t('nav.schools', 'Schools') }, { href: '/institutions', label: t('nav.institutions') }, { href: '/about', label: t('nav.about') },
  ];
  const actions = session
    ? <ButtonLink href={ROLE_HOME[session.role]} size="sm">{t('nav.workspace', 'My workspace')}</ButtonLink>
    : <><ButtonLink href="/sell" variant="gold" size="sm">{t('nav.sell')}</ButtonLink><ButtonLink href="/login" variant="secondary" size="sm">{t('nav.schoolLogin')}</ButtonLink></>;
  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-cream/90 backdrop-blur-md">
      <div className="container-page flex h-16 items-center gap-6">
        <Logo className="h-12 w-auto" priority />
        <nav aria-label="Main" className="hidden flex-1 justify-center lg:flex"><NavLinks items={items} className="flex" /></nav>
        <div className="hidden items-center gap-2 lg:flex"><LanguageSwitcher />{actions}</div>
        <MobileNavigation items={items} menuLabel={t('nav.menu')} closeLabel={t('nav.close')} extra={<>{actions}<div className="pt-2"><LanguageSwitcher /></div></>} />
      </div>
    </header>
  );
}
