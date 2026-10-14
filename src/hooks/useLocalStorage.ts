import { useState } from 'react';
/** For harmless UI preferences only. Never store tokens or personal data here. */
export function useLocalStorage<T>(key: string, initial: T) {
  const [v, setV] = useState<T>(() => { try { const s = typeof window !== 'undefined' ? localStorage.getItem(key) : null; return s ? (JSON.parse(s) as T) : initial; } catch { return initial; } });
  const set = (n: T) => { setV(n); try { localStorage.setItem(key, JSON.stringify(n)); } catch { /* storage unavailable */ } };
  return [v, set] as const;
}
