import { PageHeader } from '@/components/layout/PageHeader';
import { PricingCards } from '@/components/public/PricingCards';
import { EmptyState } from '@/components/ui/empty-state';
import { ButtonLink } from '@/components/ui/button';
export const metadata = { title: 'Billing and subscription' };
export default function Page() {
  return <div className="space-y-8"><PageHeader title="Billing and subscription" lead="Current plan: Core marketplace (no platform access fee). Historical data in your dashboard stays free." status="available" />
    <div><ButtonLink href="/app/billing/subscribe">Choose a plan</ButtonLink></div><PricingCards />
    <EmptyState title="No invoices" body="Paid services are not yet available. Payments, when introduced, will be processed by a trusted provider on the server; Miveloo will never ask for card details in this app." /></div>;
}
