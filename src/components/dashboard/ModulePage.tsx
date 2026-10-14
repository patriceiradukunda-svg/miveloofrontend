import { modules } from '@/config/modules';
import { PageHeader } from '@/components/layout/PageHeader';
import { MetricCard } from './MetricCard';
import { EmptyState } from '@/components/ui/empty-state';
import { SampleBadge } from '@/components/ui/badge';
import { ChartContainer } from '@/components/charts/ChartContainer';
import { LineChart } from '@/components/charts/LineChart';
import { notFound } from 'next/navigation';

const PRICE = [{ label: 'May', value: 610 }, { label: 'Jun', value: 640 }, { label: 'Jul', value: 690 }, { label: 'Aug', value: 650 }, { label: 'Sep', value: 660 }];
export function ModulePage({ id }: { id: string }) {
  const m = modules[id]; if (!m) notFound();
  const unavailable = m.status !== 'available';
  return (
    <div className="space-y-8">
      <PageHeader title={m.title} lead={m.desc} status={m.status} />
      {m.metrics && <section aria-label="Key figures"><div className="mb-2"><SampleBadge /></div><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{m.metrics.map(([l, v]) => <MetricCard key={l} label={l!} value={v!} />)}</div></section>}
      {id === 'school/price-history' && <ChartContainer title="Maize flour, RWF per kg" sample caption="Sample data. Historical record, not a forecast."><LineChart data={PRICE} unit=" RWF" /></ChartContainer>}
      {m.notes.length > 0 && <ul className="space-y-1 rounded-2xl bg-teal-tint p-4 text-sm">{m.notes.map((n) => <li key={n}>ℹ {n}</li>)}</ul>}
      {id.startsWith('institution/') && <dl className="grid gap-3 rounded-2xl border border-ink/10 bg-white p-4 text-sm sm:grid-cols-4">{['Data sources', 'Coverage period', 'Last updated', 'Definitions and limitations'].map((k) => <div key={k}><dt className="font-bold">{k}</dt><dd className="text-ink-soft">Not available yet</dd></div>)}</dl>}
      <EmptyState title={unavailable ? 'Not available yet' : 'Nothing here yet'} body={unavailable ? 'This area is not live. Here is what it is planned to offer.' : 'When activity starts, it will appear here.'} />
      {m.features.length > 0 && <ul className="grid gap-3 sm:grid-cols-2">{m.features.map((f) => <li key={f} className="rounded-xl bg-white p-4 shadow-card">{f}</li>)}</ul>}
    </div>
  );
}
