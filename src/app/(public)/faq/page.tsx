import type { Metadata } from 'next';
import { PageHeader } from '@/components/layout/PageHeader';
export const metadata: Metadata = { title: 'FAQ', alternates: { canonical: '/faq' } };
const Q: [string, string][] = [
  ['Is Miveloo free?', 'Core marketplace access has no platform access fee. Optional advanced services may require payment and are labelled.'],
  ['Can anyone place an order?', 'No. Only verified school accounts can order, inside their workspace. Public visitors can browse listings.'],
  ['Does choosing "School" give me access straight away?', 'No. Identity, organisation and status are checked first.'],
  ['Are the listings real?', 'Listings marked "Sample data" are illustrations, not real transactions.'],
  ['Are forecasts guaranteed?', 'No. Forecasts are estimates, shown with their assumptions, and may be unavailable when data is insufficient.'],
];
export default function Faq() {
  return <div className="container-page max-w-3xl py-14"><PageHeader title="Frequently asked questions" />
    <div className="mt-8 space-y-3">{Q.map(([q, a]) => <details key={q} className="group rounded-2xl border border-ink/10 bg-white p-4"><summary className="cursor-pointer list-none font-bold marker:hidden">{q}</summary><p className="mt-2 text-ink-soft">{a}</p></details>)}</div></div>;
}
