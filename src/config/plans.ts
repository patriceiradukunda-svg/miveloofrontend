export type FeatureStatus = 'available' | 'in-development' | 'planned' | 'agreement';
export type PlanId = 'free' | 'plus' | 'institutional';

export interface PlanFeature { id: string; label: string; status: FeatureStatus }
export interface Plan {
  id: PlanId; name: string; price: string; audience: string; features: PlanFeature[]; limits: string[];
}

/** Paid prices are intentionally not invented. Set them once commercial terms are final. */
export const plans: Plan[] = [
  {
    id: 'free', name: 'Core marketplace', price: 'No platform access fee', audience: 'Eligible schools, suppliers and groups',
    features: [
      { id: 'listings', label: 'Publish and manage product listings', status: 'available' },
      { id: 'buying', label: 'Basic buying: browse, request, order (verified schools)', status: 'available' },
      { id: 'orders', label: 'Order tracking and messaging', status: 'available' },
      { id: 'history', label: 'Historical data available in your own dashboard', status: 'available' },
    ],
    limits: ['Does not include every advanced AI service.', 'Payment-provider or mobile-money fees, where they apply, are set by those providers.'],
  },
  {
    id: 'plus', name: 'Advanced services', price: 'Pricing to be announced', audience: 'Schools, suppliers and groups',
    features: [
      { id: 'forecast', label: 'Advanced demand forecasts', status: 'in-development' },
      { id: 'alerts', label: 'Proactive shortage and price alerts', status: 'in-development' },
      { id: 'bulk', label: 'Bulk-supply planning', status: 'planned' },
      { id: 'reports', label: 'Specialised reports', status: 'planned' },
    ],
    limits: ['Optional. Eligibility, price, limits and terms will be shown here before you can subscribe.'],
  },
  {
    id: 'institutional', name: 'Institutional intelligence', price: 'Negotiated agreement', audience: 'Government, NGOs, partners',
    features: [
      { id: 'regional', label: 'Aggregated regional intelligence', status: 'agreement' },
      { id: 'programs', label: 'Programme monitoring and exports', status: 'agreement' },
      { id: 'scenario', label: 'Scenario planning', status: 'planned' },
    ],
    limits: ['Needs a data-sharing agreement. Coverage depends on data genuinely available.'],
  },
];

export const STATUS_LABEL: Record<FeatureStatus, string> = {
  available: 'Available', 'in-development': 'In development', planned: 'Planned', agreement: 'Needs agreement',
};

export function planFeatureStatus(plan: PlanId, featureId: string): FeatureStatus | undefined {
  return plans.find((p) => p.id === plan)?.features.find((f) => f.id === featureId)?.status;
}
export function canUseFeature(subscribed: PlanId[], featureId: string): boolean {
  return subscribed.some((p) => planFeatureStatus(p, featureId) === 'available');
}
