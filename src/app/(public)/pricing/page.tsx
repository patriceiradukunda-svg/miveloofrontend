import type { Metadata } from 'next';
import { PageHeader } from '@/components/layout/PageHeader';
import { PricingCards } from '@/components/public/PricingCards';
export const metadata: Metadata = { title: 'Pricing and plans', alternates: { canonical: '/pricing' } };
export default function Pricing() {
  return <div className="container-page py-14 space-y-8"><PageHeader title="Pricing and plans" lead="The core marketplace has no platform access fee. Historical data in your own dashboard stays free. Optional advanced services may cost money and will show eligibility, price, limits and terms before you subscribe. The free plan does not include every AI service." /><PricingCards /></div>;
}
