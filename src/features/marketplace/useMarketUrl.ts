"use client";
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import { parseFilters, toQuery, type MarketFilters, type SortKey } from './filters';

/** Filter state lives in the URL: refresh-safe, shareable, and the target of "matching food" notification links. */
export function useMarketUrl(defSort: SortKey) {
  const sp = useSearchParams(); const router = useRouter(); const path = usePathname();
  const f = useMemo(() => parseFilters((k) => sp.get(k), defSort), [sp, defSort]);
  const set = useCallback((p: Partial<MarketFilters>) => { const q = toQuery({ ...f, ...p }, defSort); router.replace(q ? `${path}?${q}` : path, { scroll: false }); }, [f, defSort, path, router]);
  const clear = useCallback(() => router.replace(path, { scroll: false }), [router, path]);
  return { f, set, clear };
}
