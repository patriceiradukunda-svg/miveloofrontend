"use client";
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import type { NavItem } from './NavLinks';

export function MobileNavigation({ items, menuLabel, closeLabel, extra }: { items: NavItem[]; menuLabel: string; closeLabel: string; extra: React.ReactNode }) {
  const [open, setOpen] = useState(false); const path = usePathname(); const btn = useRef<HTMLButtonElement>(null);
  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(false); btn.current?.focus(); } };
    document.addEventListener('keydown', onKey); return () => document.removeEventListener('keydown', onKey);
  }, []);
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : ''; return () => { document.body.style.overflow = ''; }; }, [open]);
  return (
    <div className="ml-auto lg:hidden">
      <button ref={btn} type="button" aria-expanded={open} aria-controls="mobile-nav" aria-label={open ? closeLabel : menuLabel} onClick={() => setOpen(!open)}
        className="grid h-11 w-11 place-items-center rounded-full border-2 border-teal text-teal">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden>{open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}</svg>
      </button>
      {open && (
        <nav id="mobile-nav" aria-label="Main" className="rise fixed inset-x-0 bottom-0 top-16 overflow-y-auto bg-cream px-4 pb-8 pt-2">
          <ul>{items.map((i) => { const on = i.href === '/' ? path === '/' : path.startsWith(i.href); return (
            <li key={i.href}><Link href={i.href} aria-current={on ? 'page' : undefined} className={`flex min-h-14 items-center justify-between border-b border-ink/10 px-2 font-display text-2xl ${on ? 'text-teal-dark' : 'text-ink'}`}>{i.label}<span aria-hidden className="text-gold">→</span></Link></li>); })}</ul>
          <div className="mt-6 flex flex-col gap-3">{extra}</div>
        </nav>
      )}
    </div>
  );
}
