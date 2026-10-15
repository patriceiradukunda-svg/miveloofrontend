"use client";
import Link from 'next/link';
import { useState } from 'react';
import { SampleBadge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { useToast } from '@/components/ui/toast';

type N = { id: number; cat: string; text: string; href: string; when: string; read: boolean };
const SEED: N[] = [
  { id: 1, cat: 'Orders', text: 'Order ORD-SAMPLE-002 was submitted and is waiting for the supplier.', href: '/app/orders/ORD-SAMPLE-002', when: 'Today', read: false },
  { id: 2, cat: 'Deliveries', text: 'Order ORD-SAMPLE-001 has been dispatched.', href: '/app/orders/ORD-SAMPLE-001', when: 'Yesterday', read: false },
  { id: 3, cat: 'Verification', text: 'Your organisation documents are being reviewed.', href: '/school/profile', when: '2 days ago', read: true },
  { id: 4, cat: 'Stock', text: 'Low stock: Maize flour is below your alert level.', href: '/school/inventory', when: '3 days ago', read: true },
  { id: 5, cat: 'Subscription', text: 'You are on the free core plan. Advanced services are optional.', href: '/app/billing', when: 'Last week', read: true },
];
const CATS = ['Orders', 'Payments', 'Stock', 'Deliveries', 'Verification', 'Forecast alerts', 'Data sources', 'Subscription'];
const CHANNELS: [string, boolean][] = [['In-app', true], ['Email', false], ['SMS', false], ['WhatsApp', false], ['Push', false]];
export function NotificationCenter() {
  const [items, setItems] = useState(SEED); const [f, setF] = useState('All'); const toast = useToast();
  const shown = items.filter((n) => f === 'All' || (f === 'Unread' ? !n.read : n.cat === f)); const unread = items.filter((n) => !n.read).length;
  return (
    <div className="space-y-8">
      <section aria-label="Activity" className="space-y-4">
        <div className="flex flex-wrap items-center gap-3"><SampleBadge /><p className="font-bold" aria-live="polite">{unread} unread</p><button type="button" className="min-h-11 rounded-full border-2 border-teal px-4 font-bold text-teal" onClick={() => setItems(items.map((n) => ({ ...n, read: true })))}>Mark all read</button></div>
        <div role="group" aria-label="Filter" className="flex gap-2 overflow-x-auto pb-1">{['All', 'Unread', ...CATS.slice(0, 5)].map((c) => <button key={c} type="button" aria-pressed={f === c} onClick={() => setF(c)} className={`min-h-11 shrink-0 rounded-full border-2 px-4 font-bold ${f === c ? 'border-teal bg-teal text-cream' : 'border-ink/15 bg-white'}`}>{c}</button>)}</div>
        {shown.length ? <ul className="space-y-2">{shown.map((n) => (
          <li key={n.id} className={`flex flex-wrap items-center gap-3 rounded-2xl border p-4 ${n.read ? 'border-ink/10 bg-white' : 'border-gold bg-gold-tint'}`}>
            <span aria-hidden className="text-xl">{n.read ? '○' : '●'}</span>
            <div className="min-w-0 flex-1"><p className="text-xs font-bold uppercase text-ink-soft">{n.cat} · {n.when}{!n.read && ' · Unread'}</p><p>{n.text}</p></div>
            <Link href={n.href} className="font-bold text-teal underline">Open</Link>
            <button type="button" className="min-h-11 rounded-full px-3 font-bold text-ink-soft hover:bg-cream-deep" onClick={() => setItems(items.map((x) => (x.id === n.id ? { ...x, read: !x.read } : x)))}>{n.read ? 'Mark unread' : 'Mark read'}</button>
          </li>))}</ul> : <EmptyState title="You are all caught up" body="New activity will appear here." />}
      </section>
      <section aria-labelledby="pref-t"><h2 id="pref-t" className="text-2xl font-semibold">Notification preferences</h2>
        <p className="text-sm text-ink-soft">Only channels that really exist can be switched on. The others are shown as planned.</p>
        <div className="mt-3 overflow-x-auto rounded-2xl border border-ink/10 bg-white"><table className="w-full min-w-[34rem] text-left text-sm"><caption className="sr-only">Notification categories by channel</caption>
          <thead><tr><th scope="col" className="bg-cream-deep px-4 py-3">Category</th>{CHANNELS.map(([c, on]) => <th key={c} scope="col" className="bg-cream-deep px-3 py-3">{c}{!on && <span className="block text-xs font-normal text-ink-soft">planned</span>}</th>)}</tr></thead>
          <tbody>{CATS.map((c) => <tr key={c}><th scope="row" className="border-t border-ink/10 px-4 py-3 font-semibold">{c}</th>{CHANNELS.map(([ch, on]) => <td key={ch} className="border-t border-ink/10 px-3 py-3"><input type="checkbox" aria-label={`${c} via ${ch}`} disabled={!on} defaultChecked={on} className="h-5 w-5 accent-teal" /></td>)}</tr>)}</tbody></table></div>
        <button type="button" className="mt-3 min-h-12 rounded-full bg-teal px-6 font-bold text-cream" onClick={() => toast('Demo only: preferences are saved once the backend is connected.')}>Save preferences</button>
      </section>
    </div>
  );
}
