import Link from 'next/link';
import { Card } from '@/components/ui/card';
const A = [
  ['🏫', 'Schools', 'Find food, compare offers, order and track deliveries.', '/schools', '/register/school'],
  ['🧑🏾‍🌾', 'Individual suppliers', 'List your produce and reach school buyers.', '/sell', '/register/supplier'],
  ['🤝', 'Cooperatives & groups', 'Combine member stock and fulfil bigger orders.', '/sell', '/register/cooperative'],
  ['🏛️', 'Institutions & partners', 'Aggregated insight for programmes and policy.', '/institutions', '/register/institution'],
] as const;
export function AudienceCards() {
  return (
    <section className="container-page py-16"><h2 className="text-fluid-h2 font-semibold text-teal-dark">Built for everyone in the school food chain</h2>
      <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{A.map(([e, t, d, learn, reg]) => (
        <li key={t}><Card className="flex h-full flex-col gap-2"><span aria-hidden className="text-4xl">{e}</span><h3 className="text-xl font-semibold">{t}</h3><p className="text-ink-soft">{d}</p>
          <div className="mt-auto flex gap-4 pt-3 text-sm font-bold"><Link className="underline" href={learn}>Learn more</Link><Link className="text-teal underline" href={reg}>Register</Link></div></Card></li>))}</ul></section>
  );
}
