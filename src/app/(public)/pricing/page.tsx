import type { Metadata } from 'next';
import Link from 'next/link';
import { getT } from '@/i18n/server';
import { Reveal } from '@/components/public/home/Reveal';
import { Bg, gold, h1s, h2s, light, wide } from '@/components/public/kit';
import { PricingExplorer, type TierView } from '@/components/public/pricing/PricingExplorer';
import { flags } from '@/config/feature-flags';
import type { FeatureStatus } from '@/config/plans';
import { CURRENCY, TIERS, YEARLY_MONTHS, freeMonths } from '@/config/pricing';

export const metadata: Metadata = {
  title: 'Pricing and plans',
  description: 'Start free. The core marketplace has no platform access fee. Optional plans for suppliers, schools, cooperatives and institutions.',
  alternates: { canonical: '/pricing' },
};

export default async function PricingPage() {
  const { t } = await getT();
  const live = (flags.payments as string) === 'available';
  const statusLabel: Record<FeatureStatus, string> = {
    available: t('svc.status.available', 'Available'),
    'in-development': t('svc.status.dev', 'In development'),
    planned: t('svc.status.planned', 'Planned'),
    agreement: t('svc.status.agreement', 'Needs agreement'),
  };
  const tiers: TierView[] = TIERS.map((tier) => ({
    id: tier.id,
    group: tier.group,
    name: t(tier.name.key, tier.name.en),
    forWho: t(tier.forWho.key, tier.forWho.en),
    monthly: tier.monthly,
    features: tier.features.map((f) => ({ id: f.id, label: t(f.text.key, f.text.en), status: f.status, statusLabel: statusLabel[f.status] })),
  }));
  const faq = [
    { q: t('price.faq.q1', 'Is the core marketplace free?'), a: t('price.faq.a1', 'Yes. The core marketplace has no platform access fee, and historical data in your own dashboard stays free.') },
    { q: t('price.faq.q2', 'Does the free plan include every AI service?'), a: t('price.faq.a2', 'No. The free plan does not include every AI service.') },
    { q: t('price.faq.q3', 'Will I see the terms before I subscribe?'), a: t('price.faq.a3', 'Yes. Optional advanced services will show eligibility, price, limits and terms before you subscribe.') },
    { q: t('price.faq.q4', 'Are there other fees?'), a: t('price.faq.a4', 'Payment-provider or mobile-money fees, where they apply, are set by those providers.') },
    { q: t('price.faq.q5', 'Why do institutional plans need an agreement?'), a: t('price.faq.a5', 'Institutional intelligence needs a data-sharing agreement. Coverage depends on data genuinely available.') },
  ];

  return (
    <>
      <section className="bg-cream-deep">
        <div className={`${wide} py-20 text-center lg:py-28`}>
          <div className="rise mx-auto max-w-4xl space-y-6">
            <h1 style={h1s} className="text-balance font-semibold leading-[1.04] tracking-tight text-teal-dark">{t('price.title', 'Simple pricing. Smarter food systems.')}</h1>
            <p className="text-lg text-ink-soft md:text-xl">{t('price.lead', 'Start free. Upgrade when you need more intelligence.')}</p>
            <p className="mx-auto max-w-2xl text-base text-ink-soft">{t('price.note', 'The core marketplace has no platform access fee, and historical data in your own dashboard stays free. The free plan does not include every AI service.')}</p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className={wide}>
          <PricingExplorer
            tiers={tiers}
            config={{ currency: CURRENCY, yearlyMonths: YEARLY_MONTHS, live }}
            labels={{
              filter: t('price.filter', 'Show plans for'),
              tabs: {
                all: t('price.tab.all', 'All plans'),
                suppliers: t('price.tab.suppliers', 'Farmers and suppliers'),
                schools: t('price.tab.schools', 'Schools'),
                groups: t('price.tab.groups', 'Cooperatives'),
                institutions: t('price.tab.institutions', 'Institutions'),
              },
              billing: t('price.billing', 'Billing period'),
              monthly: t('price.monthly', 'Monthly'),
              yearly: t('price.yearly', 'Yearly'),
              save: t('price.save', 'Save {n} months').replace('{n}', String(freeMonths)),
              perMonth: t('price.perMonth', '/ month'),
              perYear: t('price.perYear', '/ year'),
              forever: t('price.forever', 'forever'),
              saveLine: t('price.saveLine', 'Save {amount}/year · {n} months free'),
              ctaFree: t('price.cta.free', 'Get started free'),
              ctaChoose: t('price.cta.choose', 'Choose plan'),
              ctaInterest: t('price.cta.interest', 'Register interest'),
              showAll: t('price.showAll', 'Show all {n} features'),
              showLess: t('price.showLess', 'Show fewer'),
              included: t('price.included', 'What is included'),
              notOpen: t('price.notOpen', 'Paid plans are not open yet. Choose “Register interest” and we will contact you when they are.'),
              agreementNote: t('price.agreementNote', 'Institutional plans need a data-sharing agreement. Coverage depends on data genuinely available.'),
            }}
          />
        </div>
      </section>

      <section className="bg-cream-deep py-20">
        <div className={`${wide} max-w-4xl`}>
          <Reveal><h2 style={h2s} className="text-balance text-center font-semibold text-teal-dark">{t('price.faq.title', 'Questions, answered')}</h2></Reveal>
          <ul className="mt-10 space-y-3">
            {faq.map((x, k) => (
              <li key={x.q}>
                <Reveal delay={k * 60}>
                  <details className="group rounded-2xl border border-ink/10 bg-white px-6 py-4 shadow-card">
                    <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold text-teal-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold [&::-webkit-details-marker]:hidden">
                      {x.q}
                      <span aria-hidden className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-teal-tint text-xl text-teal transition-transform group-open:rotate-45">+</span>
                    </summary>
                    <p className="pb-2 pt-2 text-lg text-ink-soft">{x.a}</p>
                  </details>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Bg n="12-produce-flatlay" pos="50% 40%" overlay="bg-gradient-to-r from-ink/90 via-ink/70 to-ink/40" className="py-28 text-center">
        <Reveal className={wide}>
          <h2 style={h1s} className="mx-auto max-w-4xl text-balance font-semibold leading-[1.04]">{t('price.end.title', 'Start free today')}</h2>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/register" className={gold}>{t('price.cta.free', 'Get started free')} <span aria-hidden className="ml-2">→</span></Link>
            <Link href="/login" className={light}>{t('price.end.login', 'Log in')}</Link>
          </div>
        </Reveal>
      </Bg>
    </>
  );
}
