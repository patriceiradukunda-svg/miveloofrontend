"use client";
import { useState } from 'react';
import Link from 'next/link';
import { Scene, type SceneName } from '@/components/media/Scenes';
import { StatusBadge } from '@/components/ui/badge';
import type { FeatureStatus } from '@/config/plans';

const S: { id: string; tab: string; title: string; who: string; text: string; scene: SceneName; status: FeatureStatus; href?: string }[] = [
  { id: 'list', tab: '1 · List', title: 'Suppliers list what they have', who: 'Farmers, traders, cooperatives', text: 'Describe the product, quantity, unit, price and general location. You decide what schools see. Listing is free.', scene: 'farm', status: 'available', href: '/sell' },
  { id: 'verify', tab: '2 · Verify', title: 'We check before we trust', who: 'Miveloo team', text: 'Schools and suppliers are verified before protected actions unlock. Choosing a role never grants access by itself.', scene: 'trust', status: 'available' },
  { id: 'order', tab: '3 · Order', title: 'Schools compare and order', who: 'Verified schools', text: 'Compare offers, check delivery terms, and submit a purchase order. Suppliers accept or decline; every change is recorded.', scene: 'school', status: 'available', href: '/schools' },
  { id: 'deliver', tab: '4 · Deliver', title: 'Food moves, status follows', who: 'Suppliers and delivery operators', text: 'Preparing, dispatched, delivered: statuses follow one clear lifecycle. The school confirms what actually arrived and records any issue.', scene: 'delivery', status: 'in-development' },
  { id: 'learn', tab: '5 · Learn', title: 'History free, insight optional', who: 'Everyone', text: 'Your own historical records stay free. Advanced forecasts and alerts are optional and always labelled as estimates.', scene: 'data', status: 'in-development' },
];
export function InteractiveCycle() {
  const [i, setI] = useState(0); const s = S[i]!;
  const key = (e: React.KeyboardEvent) => { if (e.key === 'ArrowRight') setI((i + 1) % S.length); if (e.key === 'ArrowLeft') setI((i - 1 + S.length) % S.length); };
  return (
    <div className="rounded-3xl bg-white p-4 shadow-card sm:p-6">
      <div role="tablist" aria-label="Stages from farm to school" onKeyDown={key} className="flex gap-2 overflow-x-auto pb-2">
        {S.map((t, n) => <button key={t.id} role="tab" id={`cy-${t.id}`} aria-selected={n === i} aria-controls="cy-panel" tabIndex={n === i ? 0 : -1} onClick={() => setI(n)} className={`min-h-12 shrink-0 rounded-full px-5 font-bold ${n === i ? 'bg-teal text-cream' : 'bg-cream-deep hover:bg-gold-tint'}`}>{t.tab}</button>)}
      </div>
      <div id="cy-panel" role="tabpanel" aria-labelledby={`cy-${s.id}`} key={s.id} className="rise mt-4 grid items-center gap-6 md:grid-cols-2">
        <div className="space-y-3"><StatusBadge status={s.status} /><h3 className="text-2xl font-semibold text-teal-dark sm:text-3xl">{s.title}</h3><p className="text-sm font-bold uppercase tracking-wide text-gold-dark">{s.who}</p><p className="text-lg text-ink-soft">{s.text}</p>{s.href && <Link href={s.href} className="inline-flex min-h-11 items-center font-bold text-teal underline underline-offset-4">Learn more →</Link>}</div>
        <div className="overflow-hidden rounded-2xl"><Scene name={s.scene} label={s.title} /></div>
      </div>
    </div>
  );
}
