"use client";
import { useEffect, useId, useMemo, useState } from 'react';
import { EmptyState } from '@/components/ui/empty-state';
import { formatRWF } from '@/lib/formatters';
import { forecast as fetchForecast, getFood, listings, liveApi, priceHistory } from '@/lib/miveloo-client';

type Fc = { label: string; low: number; mid: number; high: number; months: number };
type Series = { id: string; name: string; unit: string; observed: { label: string; value: number }[]; forecast: Fc[]; model: string };

const monthLabel = (iso: string) => new Date(`${iso.slice(0, 10)}T00:00:00Z`).toLocaleDateString('en-GB', { month: 'short', year: '2-digit', timeZone: 'UTC' });

async function loadSeries(max = 8): Promise<Series[]> {
  const rows = await listings({ limit: 200 });
  const ids = [...new Set(rows.map((l) => l.food_id))].slice(0, max);
  const out = await Promise.all(ids.map(async (id) => {
    const [food, hist, fc] = await Promise.all([getFood(id), priceHistory(id, { months: 12 }), fetchForecast(id)]);
    const seen = new Set<string>();
    const forecast: Fc[] = fc.forecasts
      .filter((f) => f.value != null)
      .sort((a, b) => a.target_end.localeCompare(b.target_end))
      .map((f) => ({ label: monthLabel(f.target_end), low: f.lower ?? (f.value as number), mid: f.value as number, high: f.upper ?? (f.value as number), months: Math.max(1, Math.round(f.horizon_days / 30)) }))
      .filter((f) => (seen.has(f.label) ? false : (seen.add(f.label), true)));
    return { id, name: food.name, unit: `RWF/${food.base_unit}`, observed: hist.points.slice(-7).map((p) => ({ label: monthLabel(p.month), value: Math.round(p.avg) })), forecast, model: fc.forecasts[0]?.model_version ?? 'baseline' } as Series;
  }));
  return out.filter((s) => s.observed.length >= 3 && s.forecast.length > 0).sort((a, b) => a.name.localeCompare(b.name));
}

const EMPTY = (
  <EmptyState
    title="Price history is not available yet"
    body="A price chart will appear when market-price history and a forecast source are reachable. Nothing is invented while they are unavailable."
  />
);

/** Observed history is a solid line; the forecast is dashed with an uncertainty band. They are never drawn alike.
 *  Data comes live from the Miveloo backend and is labelled as demonstration data (synthetic prices, baseline-model forecasts). */
export function PriceForecastChart() {
  const id = useId();
  const [all, setAll] = useState<Series[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [sid, setSid] = useState('');
  const [h, setH] = useState(3);

  useEffect(() => {
    if (!liveApi) { setFailed(true); return; }
    let off = false;
    loadSeries().then((s) => { if (!off) { setAll(s); if (!s.length) setFailed(true); } }).catch(() => { if (!off) setFailed(true); });
    return () => { off = true; };
  }, []);

  const s = all && all.length ? (all.find((x) => x.id === sid) ?? all[0]!) : null;
  const fc = useMemo(() => (s ? s.forecast.filter((f) => f.months <= h) : []), [s, h]);
  const g = useMemo(() => {
    if (!s) return null;
    const vals = [...s.observed.map((o) => o.value), ...fc.flatMap((f) => [f.low, f.high])];
    const min = Math.min(...vals) - 10, max = Math.max(...vals) + 10;
    const n = Math.max(2, s.observed.length + fc.length);
    const x = (i: number) => 8 + (i / (n - 1)) * 84;
    const y = (v: number) => 44 - ((v - min) / (max - min)) * 36;
    const lastI = s.observed.length - 1;
    return { x, y, lastI, lastV: s.observed[lastI]!.value, min, max };
  }, [s, fc]);

  if (failed) return EMPTY;
  if (!all || !s || !g) return <p className="rounded-2xl bg-white/60 p-6 text-center text-ink-soft" role="status">Loading price history… (the service can take up to a minute to wake)</p>;

  const obsPath = s.observed.map((o, i) => `${i ? 'L' : 'M'}${g.x(i)},${g.y(o.value)}`).join(' ');
  const fcPath = [`M${g.x(g.lastI)},${g.y(g.lastV)}`, ...fc.map((f, i) => `L${g.x(g.lastI + 1 + i)},${g.y(f.mid)}`)].join(' ');
  const band = [`M${g.x(g.lastI)},${g.y(g.lastV)}`, ...fc.map((f, i) => `L${g.x(g.lastI + 1 + i)},${g.y(f.high)}`), ...[...fc].reverse().map((f, i) => `L${g.x(g.lastI + fc.length - i)},${g.y(f.low)}`), 'Z'].join(' ');
  const labels = [...s.observed.map((o) => o.label), ...fc.map((f) => f.label)];
  return (
    <figure className="rounded-3xl border border-ink/10 bg-white p-5 shadow-card" aria-labelledby={`${id}-t`}>
      <figcaption className="flex flex-wrap items-center justify-between gap-3">
        <span id={`${id}-t`} className="font-display text-xl font-semibold">Price history and forecast: {s.name} ({s.unit})</span>
        <span className="rounded-full bg-gold/20 px-2 py-0.5 text-xs font-bold">Demo data · {s.model}</span>
      </figcaption>
      <div className="mt-3 flex flex-wrap gap-3">
        <label className="text-sm font-bold">Product <select className="field mt-1" value={s.id} onChange={(e) => setSid(e.target.value)}>{all.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}</select></label>
        <label className="text-sm font-bold">Forecast horizon <select className="field mt-1" value={h} onChange={(e) => setH(Number(e.target.value))}>{[1, 3, 6].map((n) => <option key={n} value={n}>{n} month{n > 1 ? 's' : ''}</option>)}</select></label>
      </div>
      <svg viewBox="0 0 100 56" className="mt-3 h-64 w-full" role="img" aria-label={`Observed monthly prices, then a ${h}-month forecast with an uncertainty range. Demonstration data.`}>
        {[0, 1, 2, 3].map((t) => <line key={t} x1="8" x2="92" y1={8 + t * 12} y2={8 + t * 12} stroke="#12261F" strokeOpacity=".08" />)}
        <path d={band} fill="#F5A900" fillOpacity=".25" /><line x1={g.x(g.lastI)} x2={g.x(g.lastI)} y1="4" y2="46" stroke="#12261F" strokeDasharray="1.2 1.2" strokeOpacity=".5" />
        <text x={g.x(g.lastI) + 1} y="6.5" fontSize="2.6" fill="#44574F">Forecast starts</text>
        <path d={obsPath} fill="none" stroke="#00645F" strokeWidth="1.2" strokeLinejoin="round" /><path d={fcPath} fill="none" stroke="#B97E00" strokeWidth="1.2" strokeDasharray="2.2 1.6" />
        {s.observed.map((o, i) => <circle key={o.label} cx={g.x(i)} cy={g.y(o.value)} r="1.1" fill="#00645F" />)}
        {fc.map((f, i) => <rect key={f.label} x={g.x(g.lastI + 1 + i) - 1} y={g.y(f.mid) - 1} width="2" height="2" fill="#fff" stroke="#B97E00" strokeWidth=".5" transform={`rotate(45 ${g.x(g.lastI + 1 + i)} ${g.y(f.mid)})`} />)}
        {labels.map((l, i) => <text key={l + i} x={g.x(i)} y="51" textAnchor="middle" fontSize="2.8" fill="#44574F">{l}</text>)}
        <text x="1" y="8" fontSize="2.6" fill="#44574F">{Math.round(g.max)}</text><text x="1" y="46" fontSize="2.6" fill="#44574F">{Math.round(g.min)}</text>
      </svg>
      <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm"><li><span aria-hidden className="mr-1 inline-block h-0.5 w-6 bg-teal align-middle" />Observed (historical)</li><li><span aria-hidden className="mr-1 inline-block h-0.5 w-6 border-t-2 border-dashed border-gold-dark align-middle" />Model forecast (estimate)</li><li><span aria-hidden className="mr-1 inline-block h-3 w-6 bg-gold/30 align-middle" />Uncertainty range</li></ul>
      <p className="mt-2 text-xs text-ink-soft">Demonstration data: prices are synthetic, and forecasts come from Miveloo&rsquo;s built-in statistical baseline, not a trained model. Real forecasts will show their data period, assumptions, last-updated time and confidence, or say &ldquo;not enough data&rdquo;.</p>
      <details className="mt-3"><summary className="cursor-pointer font-bold">View as a table</summary>
        <div className="overflow-x-auto"><table className="mt-2 w-full min-w-[28rem] text-left text-sm"><caption className="sr-only">Prices and forecast for {s.name}</caption><thead><tr><th scope="col" className="py-1">Month</th><th scope="col">Type</th><th scope="col">Value</th><th scope="col">Range</th></tr></thead>
          <tbody>{s.observed.map((o) => <tr key={o.label}><td>{o.label}</td><td>Observed</td><td>{formatRWF(o.value)}</td><td>n/a</td></tr>)}{fc.map((f) => <tr key={f.label}><td>{f.label}</td><td>Forecast (estimate)</td><td>{formatRWF(f.mid)}</td><td>{formatRWF(f.low)} to {formatRWF(f.high)}</td></tr>)}</tbody></table></div></details>
    </figure>
  );
}
