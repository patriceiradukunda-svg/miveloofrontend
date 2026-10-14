import type { Metadata } from 'next';
import { PageHeader } from '@/components/layout/PageHeader';
import { ButtonLink } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
export const metadata: Metadata = { title: 'Sell on Miveloo', description: 'Register as a supplier or cooperative, publish food listings and reach school buyers.', alternates: { canonical: '/sell' } };
const S = [['Register', 'Create a free supplier or group account and complete verification.'], ['Publish listings', 'Describe products, quantities, units, prices and general location.'], ['Reach school buyers', 'Verified schools can discover and order your products.'], ['Manage orders', 'After signing in, accept orders, update status and message buyers.'], ['Grow', 'Use free historical data; add optional advanced tools when you are ready.']];
export default function Sell() {
  return (
    <div className="container-page py-14 space-y-12">
      <PageHeader eyebrow="Sell on Miveloo" title="Reach schools that need what you grow." lead="Farmers, traders, distributors, food businesses, cooperatives and supplier groups can list food and receive orders. Basic selling has no platform access fee." />
      <div className="grid gap-5 md:grid-cols-2"><Card className="space-y-3"><h2 className="text-2xl font-semibold">Individual supplier</h2><p className="text-ink-soft">Farmer, trader, distributor or food business.</p><ButtonLink href="/register/supplier" variant="gold">Register as a supplier</ButtonLink></Card>
        <Card className="space-y-3"><h2 className="text-2xl font-semibold">Cooperative or supplier group</h2><p className="text-ink-soft">Combine member stock and coordinate bulk orders.</p><ButtonLink href="/register/cooperative">Register your group</ButtonLink></Card></div>
      <ol className="grid gap-4 md:grid-cols-5">{S.map(([t, d], i) => <li key={t} className="rounded-2xl bg-white p-4 shadow-card"><p className="font-display text-3xl font-bold text-gold-dark">{i + 1}</p><h3 className="font-semibold">{t}</h3><p className="text-sm text-ink-soft">{d}</p></li>)}</ol>
      <p className="rounded-2xl bg-gold-tint p-4 text-sm"><strong>Honest expectations:</strong> verification may be required before listings are visible. Groups only show confirmed stock as available, never estimated capacity.</p>
    </div>
  );
}
