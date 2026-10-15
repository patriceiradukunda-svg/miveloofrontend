"use client";
import Link from 'next/link';
import { useState } from 'react';
import { estimateNeeds, type Portion } from '@/lib/estimator';
import { formatNumber } from '@/lib/formatters';

const EXAMPLE: Portion[] = [{ food: 'Maize flour', gramsPerStudent: 120 }, { food: 'Dry beans', gramsPerStudent: 60 }, { food: 'Vegetables', gramsPerStudent: 80 }];
/** Plain arithmetic on the user's own inputs. The example portion sizes are placeholders, not recommendations. */
export function DemandEstimator() {
  const [students, setStudents] = useState(100); const [days, setDays] = useState(20); const [buffer, setBuffer] = useState(5); const [p, setP] = useState<Portion[]>(EXAMPLE);
  const needs = estimateNeeds(students, days, p, buffer); const total = needs.reduce((s, n) => s + n.kg, 0);
  const num = (v: string) => Math.max(0, Number(v.replace(/\D/g, '')) || 0);
  return (
    <section aria-labelledby="est-t" className="rounded-3xl border border-ink/10 bg-white p-5 shadow-card sm:p-8">
      <h2 id="est-t" className="text-2xl font-semibold text-teal-dark sm:text-3xl">Try it: how much food will we need?</h2>
      <p className="mt-1 text-ink-soft">Enter your own numbers. This is simple arithmetic, not a forecast. The example portions below are placeholders: replace them with your school&rsquo;s own menu standards.</p>
      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        {([['Students fed per day', students, setStudents], ['Feeding days', days, setDays], ['Safety buffer (%)', buffer, setBuffer]] as const).map(([l, v, set]) => <label key={l} className="text-sm font-bold">{l}<input className="field mt-1" inputMode="numeric" value={v} onChange={(e) => set(num(e.target.value))} /></label>)}
      </div>
      <ul className="mt-5 space-y-3">{p.map((r, i) => (
        <li key={i} className="grid items-end gap-3 sm:grid-cols-[1fr_9rem_auto]">
          <label className="text-sm font-bold">Food<input className="field mt-1" value={r.food} onChange={(e) => setP(p.map((x, n) => (n === i ? { ...x, food: e.target.value } : x)))} /></label>
          <label className="text-sm font-bold">Grams per student<input className="field mt-1" inputMode="numeric" value={r.gramsPerStudent} onChange={(e) => setP(p.map((x, n) => (n === i ? { ...x, gramsPerStudent: num(e.target.value) } : x)))} /></label>
          <button type="button" onClick={() => setP(p.filter((_, n) => n !== i))} className="min-h-12 rounded-full px-4 font-bold text-red-dark hover:bg-red-tint" aria-label={`Remove ${r.food || 'row'}`}>Remove</button>
        </li>))}</ul>
      <button type="button" onClick={() => setP([...p, { food: '', gramsPerStudent: 0 }])} className="mt-3 min-h-11 rounded-full border-2 border-teal px-5 font-bold text-teal hover:bg-teal-tint">+ Add food</button>
      <div className="mt-6 rounded-2xl bg-cream p-4" aria-live="polite">
        <h3 className="font-display text-xl font-semibold">You would need about</h3>
        {needs.length ? <ul className="mt-2 divide-y divide-ink/10">{needs.map((n) => <li key={n.food} className="flex flex-wrap items-center justify-between gap-2 py-2"><span><strong>{n.food}</strong>: {formatNumber(n.kg)} kg</span><Link className="font-bold text-teal underline" href={`/marketplace?q=${encodeURIComponent(n.food.split(' ')[0] ?? '')}`}>Find in marketplace →</Link></li>)}</ul> : <p className="text-ink-soft">Add a food and grams per student to see the quantity.</p>}
        {needs.length > 0 && <p className="mt-2 text-right font-bold">Total: {formatNumber(Math.round(total * 10) / 10)} kg</p>}
      </div>
    </section>
  );
}
