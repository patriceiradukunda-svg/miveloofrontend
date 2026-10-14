import Link from 'next/link';
import { Card } from '@/components/ui/card';
const T = [['school', '🏫', 'School', 'Buy food for your school. Needs verification.'], ['supplier', '🧑🏾‍🌾', 'Individual supplier', 'Farmer, trader, distributor or food business.'], ['cooperative', '🤝', 'Cooperative or supplier group', 'Combine member stock and fulfil bulk orders.'], ['institution', '🏛️', 'Institution, NGO or government partner', 'Programme monitoring and aggregated insight.']] as const;
export function AccountTypeSelector() {
  return <ul className="grid gap-4 sm:grid-cols-2">{T.map(([k, e, t, d]) => <li key={k}><Link href={`/register/${k}`} className="block h-full"><Card className="h-full transition-colors hover:border-teal"><span aria-hidden className="text-3xl">{e}</span><h2 className="mt-1 text-xl font-semibold">{t}</h2><p className="text-ink-soft">{d}</p></Card></Link></li>)}</ul>;
}
