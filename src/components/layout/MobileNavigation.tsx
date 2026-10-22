"use client";
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import type { NavItem } from './NavLinks';

export type MobileItem = { label: string; href?: string; children?: NavItem[] };

export function MobileNavigation({ items, menuLabel, closeLabel, extra }: { items: MobileItem[]; menuLabel: string; closeLabel: string; extra: React.ReactNode }) {
  const [open, setOpen] = useState(false); const path = usePathname(); const btn = useRef<HTMLButtonElement>(null);
  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(false); btn.current?.focus(); } };
    document.addEventListener('keydown', onKey); return () => document.removeEventListener('keydown', onKey);
  }, []);
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : ''; return () => { document.body.style.overflow = ''; }; }, [open]);
  const link = 'block rounded-xl px-3 py-3 text-lg font-semibold hover:bg-cream-deep';
  return (
    <div className="xl:hidden">
      <button ref={btn} type="button" aria-expanded={open} aria-controls="mobile-nav" onClick={() => setOpen(!open)}
        className="inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-teal px-4 font-bold text-teal">
        <span aria-hidden>{open ? '✕' : '☰'}</span>{open ? closeLabel : menuLabel}
      </button>
      {open && (
        <nav id="mobile-nav" aria-label="Main" className="rise absolute inset-x-0 top-full max-h-[calc(100svh-5rem)] overflow-y-auto border-b border-ink/10 bg-cream p-4 shadow-card">
          <ul className="space-y-1">
            {items.map((i) => i.children ? (
              <li key={i.label}>
                <p className="px-3 pt-3 text-sm font-bold uppercase tracking-wider text-teal">{i.label}</p>
                <ul className="ml-3 mt-1 space-y-1 border-l-2 border-gold pl-1">
                  {i.children.map((c) => <li key={c.href}><Link href={c.href} className={link}>{c.label}</Link></li>)}
                </ul>
              </li>
            ) : (
              <li key={i.href}><Link href={i.href!} className={link}>{i.label}</Link></li>
            ))}
          </ul>
          <div className="mt-4 flex flex-col gap-3">{extra}</div>
        </nav>
      )}
    </div>
  );
}
