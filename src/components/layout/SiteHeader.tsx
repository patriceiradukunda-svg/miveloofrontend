import { getT } from '@/i18n/server';
import { getSession } from '@/lib/session';
import { ROLE_HOME } from '@/config/roles';
import { ButtonLink } from '@/components/ui/button';
import { Logo } from './Logo';
import { LanguageSwitcher } from './LanguageSwitcher';
import { MobileNavigation } from './MobileNavigation';
import { HeaderShell } from './HeaderShell';
import { NavLink } from './NavLink';

/** Five primary links only; everything else lives in SiteFooter. The logo is the Home link. Signed-in users get a Dashboard button. */
export async function SiteHeader() {
  const { t } = await getT();
  const session = await getSession();
  const items = [
    { href: '/how-it-works', label: t('nav.howItWorks', 'How it works') },
    { href: '/schools', label: t('nav.forSchools', 'Schools') },
    { href: '/sell', label: t('nav.becomeSupplier', 'Suppliers') },
    { href: '/pricing', label: t('nav.pricing', 'Pricing') },
    { href: '/about', label: t('nav.about', 'About') },
  ];
  const actions = session ? (
    <ButtonLink href={ROLE_HOME[session.role]} variant="gold" className="whitespace-nowrap shadow-card">{t('nav.dashboard', 'Dashboard')} <span aria-hidden>→</span></ButtonLink>
  ) : (
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
          {items.map((i) => <NavLink key={i.href} href={i.href}>{i.label}</NavLink>)}
        </nav>
        <div className="hidden items-center gap-2 xl:flex"><LanguageSwitcher />{actions}</div>
        <MobileNavigation items={items} menuLabel={t('nav.menu')} closeLabel={t('nav.close')} extra={<><LanguageSwitcher />{actions}</>} />
      </div>
    </HeaderShell>
  );
}
