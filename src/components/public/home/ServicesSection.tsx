import Link from 'next/link';
import { getT } from '@/i18n/server';
import { Reveal } from '@/components/public/home/Reveal';
import { Eyebrow, h2s, solid, wide } from '@/components/public/kit';
import { plans, type FeatureStatus, type PlanId } from '@/config/plans';
import { ServicesSlider, type ServiceSlide } from './ServicesSlider';

const P = '/images/miveloo-photos/';
/** Decorative produce photos behind the icon panels (alt is empty on purpose: the icon and title carry the meaning). */
const BGS = ['08-root-vegetables', '09-bananas-plantains', '12-produce-flatlay', '11-tomatoes-closeup', '10-grains-legumes-bowls', '01-market-baskets-produce'];
const bgOf = (k: number) => BGS[k % BGS.length] ?? '08-root-vegetables';
const FALLBACK_ICON = ['M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z', 'M9 12l2 2 4-4'];
const ICONS: Record<string, string[]> = {
  listings: ['M21 8l-9-5-9 5v8l9 5 9-5z', 'M3 8l9 5 9-5', 'M12 13v8'],
  buying: ['M3 4h2l2.4 10.4a1 1 0 00.98.8h8.2a1 1 0 00.98-.8L19 8H6', 'M9 20h.01', 'M17 20h.01'],
  orders: ['M3 7h11v9H3z', 'M14 10h4l3 3v3h-7z', 'M7 19.5h.01', 'M17 19.5h.01'],
  history: ['M3 3v18h18', 'M7 14l4-4 3 3 5-6'],
  forecast: ['M3 17l5-5 4 4 8-9', 'M15 7h5v5'],
  alerts: ['M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9', 'M13.7 21a2 2 0 01-3.4 0'],
  bulk: ['M12 2l9 5-9 5-9-5z', 'M3 12l9 5 9-5', 'M3 17l9 5 9-5'],
  reports: ['M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z', 'M14 2v6h6', 'M9 13h6', 'M9 17h6'],
  regional: ['M12 22s7-6 7-12a7 7 0 10-14 0c0 6 7 12 7 12z', 'M12 12a2 2 0 100-4 2 2 0 000 4z'],
  programs: ['M9 4h6a1 1 0 011 1v1H8V5a1 1 0 011-1z', 'M16 5h2a2 2 0 012 2v13a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2h2', 'M9 14l2 2 4-4'],
  scenario: ['M4 4h16v16H4z', 'M4 10h16', 'M10 4v16'],
};

export async function ServicesSection() {
  const { t } = await getT();

  const feature: Record<string, string> = {
    listings: t('svc.f.listings', 'Publish and manage product listings'),
    buying: t('svc.f.buying', 'Basic buying: browse, request, order (verified schools)'),
    orders: t('svc.f.orders', 'Order tracking and messaging'),
    history: t('svc.f.history', 'Historical data available in your own dashboard'),
    forecast: t('svc.f.forecast', 'Advanced demand forecasts'),
    alerts: t('svc.f.alerts', 'Proactive shortage and price alerts'),
    bulk: t('svc.f.bulk', 'Bulk-supply planning'),
    reports: t('svc.f.reports', 'Specialised reports'),
    regional: t('svc.f.regional', 'Aggregated regional intelligence'),
    programs: t('svc.f.programs', 'Programme monitoring and exports'),
    scenario: t('svc.f.scenario', 'Scenario planning'),
  };
  const planName: Record<PlanId, string> = {
    free: t('svc.plan.free', 'Core marketplace'),
    plus: t('svc.plan.plus', 'Advanced services'),
    institutional: t('svc.plan.institutional', 'Institutional intelligence'),
  };
  const planPrice: Record<PlanId, string> = {
    free: t('svc.price.free', 'No platform access fee'),
    plus: t('svc.price.plus', 'Pricing to be announced'),
    institutional: t('svc.price.institutional', 'Negotiated agreement'),
  };
  const planAudience: Record<PlanId, string> = {
    free: t('svc.aud.free', 'Eligible schools, suppliers and groups'),
    plus: t('svc.aud.plus', 'Schools, suppliers and groups'),
    institutional: t('svc.aud.institutional', 'Government, NGOs, partners'),
  };
  const kind: Record<PlanId, ServiceSlide['kind']> = { free: 'free', plus: 'optional', institutional: 'agreement' };
  const kindLabel: Record<ServiceSlide['kind'], string> = {
    free: t('svc.free', 'Free core'),
    optional: t('svc.optional', 'Optional extra'),
    agreement: t('svc.agreement', 'By agreement'),
  };
  const statusLabel: Record<FeatureStatus, string> = {
    available: t('svc.status.available', 'Available'),
    'in-development': t('svc.status.dev', 'In development'),
    planned: t('svc.status.planned', 'Planned'),
    agreement: t('svc.status.agreement', 'Needs agreement'),
  };
  const photos: Record<string, { src: string; alt: string }> = {
    listings: { src: `${P}14-farmer-cabbage.jpg`, alt: t('svc.alt.listings', 'A farmer working among cabbages') },
    buying: { src: `${P}03-school-canteen-serving.jpg`, alt: t('svc.alt.buying', 'Children eating a meal in a school canteen') },
  };

  let n = 0;
  const slides: ServiceSlide[] = plans.flatMap((p) => p.features.map((f): ServiceSlide => {
    const photo = photos[f.id];
    return {
      id: `${p.id}-${f.id}`,
      plan: planName[p.id],
      kind: kind[p.id],
      kindLabel: kindLabel[kind[p.id]],
      title: feature[f.id] ?? f.label,
      status: f.status,
      statusLabel: statusLabel[f.status],
      price: planPrice[p.id],
      audience: planAudience[p.id],
      icon: ICONS[f.id] ?? FALLBACK_ICON,
      bg: bgOf(n++),
      ...(photo ? { photo } : {}),
    };
  }));

  return (
    <section className="bg-cream-deep py-20 md:py-24">
      <div className={wide}>
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <Eyebrow dark={false}>{t('svc.eyebrow', 'Services and pricing')}</Eyebrow>
            <h2 style={h2s} className="mt-3 text-balance font-semibold text-teal-dark">{t('home2.freeTitle', 'Free core. Optional extras.')}</h2>
          </div>
          <Link href="/pricing" className={solid}>{t('home2.pricing', 'See pricing')} <span aria-hidden className="ml-2">→</span></Link>
        </Reveal>
        <div className="mt-10">
          <ServicesSlider
            slides={slides}
            labels={{
              region: t('svc.region', 'Our services'),
              goTo: t('svc.goTo', 'Go to service'),
              slide: t('svc.slide', 'Service {n} of {total}'),
              forWho: t('svc.for', 'For'),
            }}
          />
        </div>
      </div>
    </section>
  );
}
