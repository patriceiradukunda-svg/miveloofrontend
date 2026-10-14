"use client";
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { DEBOUNCE_MS } from '@/lib/constants';
import { CATEGORY_LABEL } from '@/lib/sample-data';
import { useT } from '@/providers/LocaleProvider';
import { Button } from '@/components/ui/button';

const DISTRICTS = ['Kigali', 'Musanze', 'Nyagatare'];
/** Filter state lives in the URL so results are shareable and survive refresh. */
export function ProductFilters({ basePath = '/marketplace' }: { basePath?: string }) {
  const { t } = useT(); const router = useRouter(); const sp = useSearchParams(); const path = usePathname() || basePath;
  const [q, setQ] = useState(sp.get('q') ?? ''); const first = useRef(true);
  const set = (k: string, v: string) => { const n = new URLSearchParams(sp.toString()); if (v) n.set(k, v); else n.delete(k); n.delete('page'); router.replace(`${path}?${n}`, { scroll: false }); };
  useEffect(() => { if (first.current) { first.current = false; return; } const id = setTimeout(() => set('q', q), DEBOUNCE_MS); return () => clearTimeout(id); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);
  const sel = (label: string, key: string, opts: [string, string][]) => (
    <label className="block text-sm font-bold">{label}
      <select className="field mt-1" value={sp.get(key) ?? ''} onChange={(e) => set(key, e.target.value)}><option value="">{t('market.all')}</option>{opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
    </label>
  );
  return (
    <form role="search" onSubmit={(e) => e.preventDefault()} className="space-y-4 rounded-2xl border border-ink/10 bg-white p-4">
      <label className="block text-sm font-bold">{t('market.search')}<input type="search" className="field mt-1" value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g. beans" /></label>
      {sel(t('market.category'), 'category', Object.entries(CATEGORY_LABEL))}
      {sel(t('market.district'), 'district', DISTRICTS.map((d) => [d, d]))}
      {sel(t('market.availability'), 'availability', [['in-stock', 'In stock'], ['limited', 'Limited'], ['seasonal', 'Seasonal']])}
      <label className="block text-sm font-bold">{t('market.maxPrice')}<input inputMode="numeric" className="field mt-1" defaultValue={sp.get('maxPrice') ?? ''} onBlur={(e) => set('maxPrice', e.target.value.replace(/\D/g, ''))} /></label>
      <Button type="button" variant="ghost" onClick={() => { setQ(''); router.replace(path); }}>{t('market.clear')}</Button>
    </form>
  );
}
