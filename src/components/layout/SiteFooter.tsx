import Link from 'next/link';
import { getT } from '@/i18n/server';
import { site } from '@/config/site';
import { Logo } from './Logo';
import { LanguageSwitcher } from './LanguageSwitcher';

const col = (title: string, links: [string, string][]) => (
  <nav aria-label={title}>
    <h2 className="font-sans text-sm font-bold uppercase tracking-wider text-teal">{title}</h2>
    <ul className="mt-3 space-y-2">{links.map(([h, l]) => <li key={h}><Link href={h} className="inline-block py-1 hover:underline">{l}</Link></li>)}</ul>
  </nav>
);
export async function SiteFooter() {
  const { t } = await getT();
  return (
    <footer className="mt-24 border-t-4 border-gold bg-cream-deep">
      <div className="container-page grid gap-10 py-12 md:grid-cols-[1.3fr_repeat(3,1fr)]">
        <div>
          <Logo className="h-20 w-auto" />
          <p className="mt-3 max-w-xs text-ink-soft">{t('footer.mission')}</p>
          <div className="mt-4"><LanguageSwitcher /></div>
          {(site.contact.email || site.contact.phone) && (
            <address className="mt-4 text-sm not-italic">
              {site.contact.email && <a className="block underline" href={`mailto:${site.contact.email}`}>{site.contact.email}</a>}
              {site.contact.phone && <a className="block underline" href={`tel:${site.contact.phone}`}>{site.contact.phone}</a>}
            </address>
          )}
          {site.social.length > 0 && <ul className="mt-3 flex flex-wrap gap-3 text-sm">{site.social.map((s) => <li key={s.label}><a className="underline" href={s.href} rel="noopener noreferrer" target="_blank">{s.label}</a></li>)}</ul>}
        </div>
        {col(t('footer.explore'), [['/sell', t('nav.sell')], ['/schools', 'Schools'], ['/cooperatives', 'Cooperatives'], ['/exchange', 'School exchange'], ['/institutions', 'Institutions'], ['/pricing', 'Pricing'], ['/tour', 'Take the tour'], ['/about', t('nav.about')], ['/about/team', t('nav.team', 'Team')], ['/roadmap', 'Roadmap'], ['/careers', t('nav.careers', 'Careers')], ['/contact', 'Contact']])}
        {col(t('footer.support'), [['/help', 'Help & support'], ['/faq', 'FAQs'], ['/register/supplier', 'Supplier onboarding'], ['/register/school', 'School registration'], ['/register/institution', 'Institutional partnerships'], ['/trust', 'Trust centre'], ['/ai-intelligence', 'AI & data']])}
        {col(t('footer.legal'), [['/privacy', 'Privacy policy'], ['/terms', 'Terms of service'], ['/cookies', 'Cookie policy'], ['/supplier-terms', 'Supplier terms'], ['/school-terms', 'School terms'], ['/data-ai-policy', 'Data & AI policy']])}
      </div>
      <p className="border-t border-ink/10 py-4 text-center text-sm text-ink-soft">© {new Date().getFullYear()} Miveloo. {t('footer.rights')}</p>
    </footer>
  );
}
