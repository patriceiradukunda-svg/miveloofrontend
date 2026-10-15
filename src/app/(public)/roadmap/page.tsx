import type { Metadata } from 'next';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatusBadge } from '@/components/ui/badge';
import { Reveal } from '@/components/ui/reveal';
import type { FeatureStatus } from '@/config/plans';
export const metadata: Metadata = { title: 'Roadmap', description: 'What works today, what is in development, and what is planned.', alternates: { canonical: '/roadmap' } };
const P: { n: string; t: string; s: FeatureStatus; items: string[] }[] = [
  { n: '1', t: 'Foundation and core marketplace', s: 'available', items: ['Public website and public listings', 'Supplier registration and listing management', 'School registration and verification', 'Protected school purchasing and order lifecycle', 'Admin tools to run the marketplace safely'] },
  { n: '2', t: 'School and supplier operations', s: 'in-development', items: ['Meal and demand planning', 'Procurement approvals and budgets', 'Inventory, wastage and replenishment', 'Delivery tracking', 'Cooperative operations'] },
  { n: '3', t: 'Exchange and intelligence', s: 'planned', items: ['School-to-school exchange', 'Price intelligence and forecasting', 'Personalised recommendations and alerts', 'Paid advanced analytics'] },
  { n: '4', t: 'Institutional services', s: 'agreement', items: ['Institutional dashboards', 'Aggregated regional intelligence', 'Programme monitoring', 'Contracted data services, as data coverage grows'] },
];
export default function Roadmap() {
  return (
    <div className="container-page max-w-4xl space-y-8 py-14"><PageHeader title="Roadmap" lead="An honest map of what works today and what does not yet. Status labels are updated as features go live." />
      <ol className="relative space-y-6 border-l-4 border-gold pl-6 sm:pl-10">{P.map((p) => (
        <li key={p.n}><Reveal><span aria-hidden className="absolute -left-[1.3rem] grid h-9 w-9 place-items-center rounded-full bg-teal font-display text-lg font-bold text-cream sm:-left-[1.55rem]">{p.n}</span>
          <article className="rounded-3xl border border-ink/10 bg-white p-6 shadow-card"><div className="flex flex-wrap items-center justify-between gap-2"><h2 className="text-2xl font-semibold text-teal-dark">{p.t}</h2><StatusBadge status={p.s} /></div><ul className="mt-3 grid gap-2 sm:grid-cols-2">{p.items.map((i) => <li key={i} className="flex gap-2"><span aria-hidden className="text-green">›</span>{i}</li>)}</ul></article></Reveal></li>))}</ol></div>
  );
}
