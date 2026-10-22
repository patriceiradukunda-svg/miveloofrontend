'use client';
import Link from 'next/link';
import { useId, useState } from 'react';
import type { FeatureStatus } from '@/config/plans';
import { gold, solid } from '@/components/public/kit';

export type Group = 'free' | 'suppliers' | 'schools' | 'groups' | 'institutions';
type Filter = 'all' | Exclude<Group, 'free'>;
export interface TierView {
  id: string;
  group: Group;
  name: string;
  forWho: string;
  monthly: number;
  features: { id: string; label: string; status: FeatureStatus; statusLabel: string }[];
}
export interface ExplorerLabels {
  filter: string; tabs: Record<Filter, string>; billing: string; monthly: string; yearly: string; save: string;
  perMonth: string; perYear: string; forever: string; saveLine: string;
  ctaFree: string; ctaChoose: string; ctaInterest: string; showAll: string; showLess: string; included: string;
  notOpen: string; agreementNote: string;
}
export interface ExplorerConfig { currency: string; yearlyMonths: number; live: boolean }

const FILTERS: Filter[] = ['all', 'suppliers', 'schools', 'groups', 'institutions'];
const LIMIT = 5;
const ring = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold';
const ACCENT: Record<Group, { bar: string; head: string; check: string }> = {
  free: { bar: 'bg-green', head: 'bg-green-tint', check: 'bg-green text-white' },
  suppliers: { bar: 'bg-gold', head: 'bg-gold-tint', check: 'bg-gold text-ink' },
  schools: { bar: 'bg-teal', head: 'bg-teal-tint', check: 'bg-teal text-cream' },
  groups: { bar: 'bg-green-dark', head: 'bg-green-tint', check: 'bg-green-dark text-white' },
  institutions: { bar: 'bg-teal-dark', head: 'bg-teal-tint', check: 'bg-teal-dark text-cream' },
};
const statusTone: Record<FeatureStatus, string> = {
  available: 'bg-green-tint text-green-dark',
  'in-development': 'bg-gold-tint text-gold-dark',
  planned: 'bg-teal-tint text-teal-dark',
  agreement: 'bg-red-tint text-red-dark',
};
const statusMark: Record<FeatureStatus, string> = { available: '●', 'in-development': '◐', planned: '○', agreement: '◆' };

export function PricingExplorer({ tiers, labels: L, config: C }: { tiers: TierView[]; labels: ExplorerLabels; config: ExplorerConfig }) {
  const [filter, setFilter] = useState<Filter>('all');
  const [yearly, setYearly] = useState(false);
  const shown = tiers.filter((t) => filter === 'all' || t.group === 'free' || t.group === filter);
  const anyPaid = shown.some((t) => t.monthly > 0);
  const anyInstitution = shown.some((t) => t.group === 'institutions');

  return (
    <div>
      <div className="flex flex-col items-center gap-6">
        <div role="group" aria-label={L.billing} className="inline-flex rounded-full border border-ink/15 bg-white p-1 shadow-card">
          <button type="button" aria-pressed={!yearly} onClick={() => setYearly(false)} className={`min-h-11 rounded-full px-6 text-sm font-bold transition-colors ${!yearly ? 'bg-teal text-cream' : 'text-teal-dark hover:bg-teal-tint'} ${ring}`}>{L.monthly}</button>
          <button type="button" aria-pressed={yearly} onClick={() => setYearly(true)} className={`flex min-h-11 items-center gap-2 rounded-full px-6 text-sm font-bold transition-colors ${yearly ? 'bg-teal text-cream' : 'text-teal-dark hover:bg-teal-tint'} ${ring}`}>
            {L.yearly}<span className="rounded-full bg-gold px-2 py-0.5 text-xs text-ink">{L.save}</span>
          </button>
        </div>
        <div role="group" aria-label={L.filter} className="-mx-4 flex w-[calc(100%+2rem)] gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:w-auto sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0">
          {FILTERS.map((k) => (
            <button key={k} type="button" aria-pressed={filter === k} onClick={() => setFilter(k)} className={`min-h-11 shrink-0 rounded-full border-2 px-5 text-sm font-bold transition-colors ${filter === k ? 'border-teal bg-teal text-cream' : 'border-ink/15 bg-white text-teal-dark hover:border-teal/50'} ${ring}`}>{L.tabs[k]}</button>
          ))}
        </div>
      </div>

      <ul key={filter} className="rise mt-10 flex flex-wrap justify-center gap-6">
        {shown.map((t) => (
          <li key={t.id} className="w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)] xl:w-[calc(25%-1.125rem)]">
            <TierCard tier={t} yearly={yearly} L={L} C={C} />
          </li>
        ))}
      </ul>

      <div className="mx-auto mt-8 max-w-3xl space-y-3 text-center text-sm">
        {!C.live && anyPaid && <p role="note" className="rounded-2xl bg-teal-tint px-5 py-4 text-teal-dark">{L.notOpen}</p>}
        {anyInstitution && <p role="note" className="rounded-2xl bg-gold-tint px-5 py-4 text-ink">{L.agreementNote}</p>}
      </div>
    </div>
  );
}

function TierCard({ tier, yearly, L, C }: { tier: TierView; yearly: boolean; L: ExplorerLabels; C: ExplorerConfig }) {
  const [open, setOpen] = useState(false);
  const listId = useId();
  const free = tier.monthly === 0;
  const a = ACCENT[tier.group];
  const fmt = (n: number) => `${C.currency}${n.toLocaleString('en-US')}`;
  const price = yearly ? tier.monthly * C.yearlyMonths : tier.monthly;
  const saving = tier.monthly * 12 - tier.monthly * C.yearlyMonths;
  const collapsible = tier.features.length > LIMIT + 1;
  const visible = collapsible && !open ? tier.features.slice(0, LIMIT) : tier.features;
  const cta = free ? L.ctaFree : C.live ? L.ctaChoose : L.ctaInterest;

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-card transition-shadow duration-300 hover:shadow-lg">
      <div aria-hidden className={`h-1.5 ${a.bar}`} />
      <div className={`px-6 pb-5 pt-6 ${a.head}`}>
        <h3 className="font-display text-xl font-semibold text-teal-dark">{tier.name}</h3>
        <p className="mt-1 min-h-10 text-sm text-ink-soft">{tier.forWho}</p>
        <p className="mt-4 flex items-end gap-2">
          <span className="font-display text-5xl font-semibold leading-none text-teal-dark">{fmt(price)}</span>
          <span className="pb-1 text-sm text-ink-soft">{free ? L.forever : yearly ? L.perYear : L.perMonth}</span>
        </p>
        <p className="mt-2 min-h-5 text-sm font-semibold text-green-dark">{!free && yearly ? L.saveLine.replace('{amount}', fmt(saving)).replace('{n}', String(12 - C.yearlyMonths)) : ''}</p>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <Link href={free ? '/register' : '/app/billing/subscribe'} className={`${free ? gold : solid} w-full ${ring}`}>{cta}</Link>
        <ul id={listId} aria-label={L.included} className="mt-6 space-y-3 border-t border-ink/10 pt-5">
          {visible.map((f) => (
            <li key={f.id} className="flex gap-3">
              <span aria-hidden className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full text-[0.65rem] font-bold ${f.status === 'available' ? a.check : 'border-2 border-ink/25 text-transparent'}`}>✓</span>
              <span className="min-w-0">
                <span className="block text-[0.95rem] text-ink">{f.label}</span>
                <span className={`mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.7rem] font-bold ${statusTone[f.status]}`}><span aria-hidden>{statusMark[f.status]}</span>{f.statusLabel}</span>
              </span>
            </li>
          ))}
        </ul>
        {collapsible && (
          <button type="button" aria-expanded={open} aria-controls={listId} onClick={() => setOpen((v) => !v)} className={`mt-4 min-h-11 self-start rounded-full px-3 text-sm font-bold text-teal underline hover:bg-teal-tint ${ring}`}>
            {open ? L.showLess : L.showAll.replace('{n}', String(tier.features.length))}
          </button>
        )}
      </div>
    </article>
  );
}
