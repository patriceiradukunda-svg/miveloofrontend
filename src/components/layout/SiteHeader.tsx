import { getT } from '@/i18n/server';
import { getSession } from '@/lib/session';
import { ROLE_HOME } from '@/config/roles';
import { ButtonLink } from '@/components/ui/button';
import { Logo } from './Logo';
import { LanguageSwitcher } from './LanguageSwitcher';
import { MobileNavigation } from './MobileNavigation';
import { HeaderShell } from './HeaderShell';
import { NavLink } from './NavLink';

const HomeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden><path d="M3 11l9-8 9 8" /><path d="M5 10v10h14V10" /></svg>
);

/** Visitors see: Home, How it works, Schools, Institutions, About + Sell on Miveloo and School login. Signed-in users see their workspace instead. */
export async function SiteHeader() {
  const { t } = await getT();
  const session = await getSession();
  const items = [
    { href: '/', label: t('nav.home', 'Home') },
    { href: '/how-it-works', label: t('nav.howItWorks', 'How it works') },
    { href: '/schools', label: t('nav.forSchools', 'Schools') },
    { href: '/sell', label: t('nav.becomeSupplier', 'Suppliers') },
    { href: '/impact', label: t('nav.impact', 'Impact') },
  ];
  const actions = (
    <>
      <ButtonLink href="/login" variant="ghost" className="whitespace-nowrap">{t('nav.login', 'Log in')}</ButtonLink>
      <ButtonLink href="/register" variant="gold" className="whitespace-nowrap shadow-card">{t('nav.getStarted', 'Get Started')} <span aria-hidden>→</span></ButtonLink>
    </>
  );
  return (
    <HeaderShell>
      <div className="mx-auto flex w-full max-w-[90rem] items-center justify-between gap-4 px-4 py-2.5 sm:px-6 lg:px-10">
        <Logo className="h-14 w-auto transition-all duration-300 group-data-[scrolled=true]:h-11" priority />
        <nav aria-label="Main" className="hidden items-center xl:flex">
          {items.map((i) => <NavLink key={i.href} href={i.href}>{i.href === '/' && <HomeIcon />}{i.label}</NavLink>)}
        </nav>
        <div className="hidden items-center gap-2 xl:flex"><LanguageSwitcher />{actions}</div>
        <MobileNavigation items={items} menuLabel={t('nav.menu')} closeLabel={t('nav.close')} extra={<><LanguageSwitcher />{actions}</>} />
      </div>
    </HeaderShell>
  );
}
