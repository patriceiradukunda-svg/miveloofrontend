import { notFound } from 'next/navigation';
import { modules } from '@/config/modules';
import { ROLES, type Role } from '@/config/roles';
import { roleModules } from '@/config/role-modules';
import { PageHeader } from '@/components/layout/PageHeader';
import { QuickStart } from './QuickStart';
import { EmptyState } from '@/components/ui/empty-state';
import { LockedFeature } from '@/components/feedback/LockedFeature';
import { PriceForecastChart } from '@/features/analytics/PriceForecastChart';
import { EvidenceLegend } from '@/features/analytics/EvidenceLegend';

const FORECAST_PAGES = ['school/price-history', 'supplier/ai-insights', 'group/ai-insights', 'institution/price-intelligence', 'institution/forecasting'];
export function ModulePage({ id }: { id: string }) {
  const m = modules[id] ?? roleModules[id]; if (!m) notFound();
  const top = id.split('/')[0] as Role | 'app'; const isDash = id.endsWith('/dashboard'); const live = m.status === 'available';
  return (
    <div className="space-y-8">
      <PageHeader title={m.title} lead={m.desc} status={m.status} />
      {isDash && (ROLES as readonly string[]).includes(top) && <QuickStart role={top as Role} />}
      {isDash && <EmptyState title="Live dashboard data is not available yet" body="Summary figures and order charts will appear when real dashboard data is connected. No sample figures are shown." />}
      {FORECAST_PAGES.includes(id) && <><PriceForecastChart /><EvidenceLegend /></>}
      {m.notes.length > 0 && <ul className="space-y-1 rounded-2xl bg-teal-tint p-4 text-sm">{m.notes.map((n) => <li key={n}>ℹ {n}</li>)}</ul>}
      {id.startsWith('institution/') && <dl className="grid gap-3 rounded-2xl border border-ink/10 bg-white p-4 text-sm sm:grid-cols-4">{['Data sources', 'Coverage period', 'Last updated', 'Definitions and limitations'].map((k) => <div key={k}><dt className="font-bold">{k}</dt><dd className="text-ink-soft">Not available yet</dd></div>)}</dl>}
      {!isDash && <EmptyState title={live ? 'Nothing here yet' : 'Not available yet'} body={live ? 'When activity starts, it will appear here.' : (m.features.length > 0 ? 'This area is not live. Here is what it is planned to offer.' : 'This area is not live yet.')} />}
      {m.features.length > 0 && (live
        ? <ul className="grid gap-3 sm:grid-cols-2">{m.features.map((f) => <li key={f} className="rounded-xl bg-white p-4 shadow-card">✔ {f}</li>)}</ul>
        : <div className="grid gap-3 sm:grid-cols-2">{m.features.map((f) => <LockedFeature key={f} title={f} benefit="Planned capability. We will announce it here when it is ready." status={m.status} />)}</div>)}
    </div>
  );
}
