import { notFound } from 'next/navigation';
import { modules } from '@/config/modules';
import type { Role } from '@/config/roles';
import { PageHeader } from '@/components/layout/PageHeader';
import { MetricCard } from './MetricCard';
import { QuickStart } from './QuickStart';
import { EmptyState } from '@/components/ui/empty-state';
import { SampleBadge } from '@/components/ui/badge';
import { LockedFeature } from '@/components/feedback/LockedFeature';
import { ChartContainer } from '@/components/charts/ChartContainer';
import { BarChart } from '@/components/charts/BarChart';
import { PriceForecastChart } from '@/features/analytics/PriceForecastChart';
import { EvidenceLegend } from '@/features/analytics/EvidenceLegend';

const SALES = [{ label: 'May', value: 12 }, { label: 'Jun', value: 18 }, { label: 'Jul', value: 15 }, { label: 'Aug', value: 22 }, { label: 'Sep', value: 19 }, { label: 'Oct', value: 25 }];
const FORECAST_PAGES = ['school/price-history', 'supplier/ai-insights', 'group/ai-insights', 'institution/price-intelligence', 'institution/forecasting'];
export function ModulePage({ id }: { id: string }) {
  const m = modules[id]; if (!m) notFound();
  const top = id.split('/')[0] as Role | 'app'; const isDash = id.endsWith('/dashboard'); const live = m.status === 'available';
  return (
    <div className="space-y-8">
      <PageHeader title={m.title} lead={m.desc} status={m.status} />
      {isDash && top !== 'app' && <QuickStart role={top as Role} />}
      {m.metrics && <section aria-label="Key figures"><div className="mb-2"><SampleBadge /></div><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{m.metrics.map(([l, v]) => <MetricCard key={l} label={l!} value={v!} />)}</div></section>}
      {isDash && top !== 'admin' && top !== 'institution' && <ChartContainer title="Orders per month" sample caption="Sample data. Historical record, not a forecast."><BarChart data={SALES} unit=" orders" /></ChartContainer>}
      {FORECAST_PAGES.includes(id) && <><PriceForecastChart /><EvidenceLegend /></>}
      {m.notes.length > 0 && <ul className="space-y-1 rounded-2xl bg-teal-tint p-4 text-sm">{m.notes.map((n) => <li key={n}>ℹ {n}</li>)}</ul>}
      {id.startsWith('institution/') && <dl className="grid gap-3 rounded-2xl border border-ink/10 bg-white p-4 text-sm sm:grid-cols-4">{['Data sources', 'Coverage period', 'Last updated', 'Definitions and limitations'].map((k) => <div key={k}><dt className="font-bold">{k}</dt><dd className="text-ink-soft">Not available yet</dd></div>)}</dl>}
      {!isDash && <EmptyState title={live ? 'Nothing here yet' : 'Not available yet'} body={live ? 'When activity starts, it will appear here.' : 'This area is not live. Here is what it is planned to offer.'} />}
      {m.features.length > 0 && (live
        ? <ul className="grid gap-3 sm:grid-cols-2">{m.features.map((f) => <li key={f} className="rounded-xl bg-white p-4 shadow-card">✔ {f}</li>)}</ul>
        : <div className="grid gap-3 sm:grid-cols-2">{m.features.map((f) => <LockedFeature key={f} title={f} benefit="Planned capability. We will announce it here when it is ready." status={m.status} />)}</div>)}
    </div>
  );
}
