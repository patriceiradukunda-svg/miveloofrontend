"use client";
import { useMemo, useState } from 'react';
import { sampleProducts, sampleSuppliers, CATEGORY_LABEL } from '@/lib/sample-data';
import { filterProducts } from '@/features/products/services/products.service';
import { formatRWF } from '@/lib/formatters';
import { Button } from '@/components/ui/button';
import { SampleBadge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/toast';

/** Private buying UI. Server layout has already verified role + verification; the backend re-checks on submit. */
export function SchoolMarketplace() {
  const [q, setQ] = useState(''); const [cat, setCat] = useState(''); const [cart, setCart] = useState<Record<string, number>>({}); const toast = useToast(); const [busy, setBusy] = useState(false);
  const items = useMemo(() => filterProducts(sampleProducts, { q, category: cat || undefined }), [q, cat]);
  const lines = sampleProducts.filter((p) => cart[p.id]); const total = lines.reduce((s, p) => s + (p.indicativePriceRWF ?? 0) * (cart[p.id] ?? 0), 0);
  const supplier = (id: string) => sampleSuppliers.find((s) => s.id === id)?.name ?? 'Supplier';
  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_22rem]">
      <section aria-label="Products" className="space-y-4">
        <div className="flex flex-wrap gap-3"><label className="min-w-48 flex-1 text-sm font-bold">Search<input className="field mt-1" type="search" value={q} onChange={(e) => setQ(e.target.value)} /></label>
          <label className="text-sm font-bold">Category<select className="field mt-1" value={cat} onChange={(e) => setCat(e.target.value)}><option value="">All</option>{Object.entries(CATEGORY_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></label></div>
        <ul className="grid gap-4 sm:grid-cols-2">{items.map((p) => (
          <li key={p.id}><Card className="space-y-2"><div className="flex items-start justify-between gap-2"><h3 className="text-lg font-semibold"><span aria-hidden>{p.emoji} </span>{p.name}</h3><SampleBadge /></div>
            <p className="text-sm text-ink-soft">{supplier(p.supplierId)} · {p.district}</p>
            <p className="font-bold text-teal-dark">{p.indicativePriceRWF != null ? `${formatRWF(p.indicativePriceRWF)} / ${p.unit}` : 'Request a quotation'}</p>
            <p className="text-sm">Available: {p.availableQuantity ?? 'ask supplier'} {p.availableQuantity != null && p.unit} · Delivery terms: agreed per order</p>
            <div className="flex items-center gap-2"><label className="sr-only" htmlFor={`q-${p.id}`}>Quantity of {p.name}</label>
              <input id={`q-${p.id}`} className="field w-24" inputMode="numeric" placeholder="Qty" value={cart[p.id] ?? ''} onChange={(e) => setCart({ ...cart, [p.id]: Number(e.target.value.replace(/\D/g, '')) })} /><span className="text-sm">{p.unit}</span></div></Card></li>))}</ul>
      </section>
      <aside aria-label="Purchase request" className="h-fit rounded-2xl bg-white p-5 shadow-card xl:sticky xl:top-24">
        <h2 className="text-xl font-semibold">Purchase request</h2>
        {lines.length === 0 ? <p className="mt-2 text-ink-soft">Enter quantities to build a request.</p> : <ul className="mt-3 divide-y divide-ink/10">{lines.map((p) => <li key={p.id} className="flex justify-between py-2 text-sm"><span>{p.name} × {cart[p.id]}</span><span>{formatRWF((p.indicativePriceRWF ?? 0) * (cart[p.id] ?? 0))}</span></li>)}</ul>}
        <p className="mt-3 flex justify-between font-bold"><span>Estimated total</span><span>{formatRWF(total)}</span></p>
        <p className="mt-1 text-xs text-ink-soft">Indicative prices. The supplier confirms final price and quantity.</p>
        <Button className="mt-4 w-full" disabled={!lines.length || busy} onClick={() => { setBusy(true); setTimeout(() => { setBusy(false); setCart({}); toast('Demo only: in production this submits a draft order to the server.'); }, 600); }}>{busy ? 'Submitting…' : 'Submit request'}</Button>
      </aside>
    </div>
  );
}
