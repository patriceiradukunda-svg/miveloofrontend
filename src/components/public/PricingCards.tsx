import { plans, STATUS_LABEL } from '@/config/plans';
import { Card } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/badge';
export function PricingCards() {
  return (
    <ul className="grid gap-5 lg:grid-cols-3">{plans.map((p) => (
      <li key={p.id}><Card className={`h-full space-y-3 ${p.id === 'free' ? 'border-2 border-green' : ''}`}>
        <h3 className="text-2xl font-semibold">{p.name}</h3><p className="text-lg font-bold text-teal-dark">{p.price}</p><p className="text-sm text-ink-soft">For: {p.audience}</p>
        <ul className="space-y-2">{p.features.map((f) => <li key={f.id} className="flex flex-wrap items-center justify-between gap-2"><span>{f.label}</span><StatusBadge status={f.status} /></li>)}</ul>
        <ul className="list-disc space-y-1 pl-5 text-sm text-ink-soft">{p.limits.map((l) => <li key={l}>{l}</li>)}</ul>
        <span className="sr-only">{STATUS_LABEL.available}</span></Card></li>))}</ul>
  );
}
