"use client";
import { useCallback, useEffect, useState } from 'react';
const KEY = 'mv_basket';
/** A personal convenience stored in this browser only; the server re-validates everything on submit. */
export function useBasket() {
  const [lines, setLines] = useState<Record<string, number>>({});
  useEffect(() => { try { setLines(JSON.parse(localStorage.getItem(KEY) ?? '{}') as Record<string, number>); } catch { /* ignore */ } }, []);
  const save = useCallback((n: Record<string, number>) => { setLines(n); try { localStorage.setItem(KEY, JSON.stringify(n)); } catch { /* ignore */ } }, []);
  return {
    lines, count: Object.keys(lines).length,
    set: (id: string, qty: number) => { const n = { ...lines }; if (qty > 0) n[id] = qty; else delete n[id]; save(n); },
    clear: () => save({}),
  };
}
