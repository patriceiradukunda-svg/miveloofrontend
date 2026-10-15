"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';
/** A personal reminder list stored in this browser only. It does not reflect verification or any backend state. */
export function Checklist({ role, steps }: { role: string; steps: [string, string][] }) {
  const k = `mv_check_${role}`; const [done, setDone] = useState<string[]>([]);
  useEffect(() => { try { setDone(JSON.parse(localStorage.getItem(k) ?? '[]') as string[]); } catch { /* ignore */ } }, [k]);
  const toggle = (l: string) => { const n = done.includes(l) ? done.filter((x) => x !== l) : [...done, l]; setDone(n); try { localStorage.setItem(k, JSON.stringify(n)); } catch { /* ignore */ } };
  return (
    <div className="rounded-2xl bg-white p-4 text-ink"><h3 className="font-sans text-sm font-bold">Your checklist <span className="font-normal text-ink-soft">({done.length}/{steps.length}, personal reminder)</span></h3>
      <ul className="mt-2 space-y-1">{steps.map(([l, h]) => <li key={l} className="flex items-center gap-2"><input id={`c-${l}`} type="checkbox" className="h-5 w-5 accent-teal" checked={done.includes(l)} onChange={() => toggle(l)} /><label htmlFor={`c-${l}`} className={done.includes(l) ? 'text-ink-soft line-through' : ''}>{l}</label><Link href={h} className="ml-auto font-bold text-teal underline" aria-label={`Open: ${l}`}>Open</Link></li>)}</ul></div>
  );
}
