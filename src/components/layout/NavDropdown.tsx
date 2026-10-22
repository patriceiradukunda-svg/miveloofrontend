'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useId, useRef, useState } from 'react';

/** Desktop dropdown for a nav group. Opens on hover, click or keyboard; closes on Escape, outside click and navigation. */
export function NavDropdown({ label, items }: { label: string; items: { href: string; label: string }[] }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const id = useId();
  const active = items.some((i) => path === i.href || path.startsWith(i.href + '/'));
  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    const onDown = (e: MouseEvent) => { if (!root.current?.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(false); btn.current?.focus(); } };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey); };
  }, []);
  return (
    <div ref={root} className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}
      onBlur={(e) => { if (!root.current?.contains(e.relatedTarget as Node)) setOpen(false); }}>
      <button ref={btn} type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen((o) => !o)}
        className={`relative inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-2.5 text-[0.93rem] font-semibold text-ink after:absolute after:inset-x-3.5 after:bottom-1.5 after:h-0.5 after:origin-left after:rounded-full after:bg-gold after:transition-transform after:duration-300 hover:after:scale-x-100 focus-visible:after:scale-x-100 ${active || open ? 'after:scale-x-100' : 'after:scale-x-0'}`}>
        {label}
        <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden className={`h-4 w-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}><path d="M5.5 7.5l4.5 4.5 4.5-4.5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      {open && (
        <div className="absolute left-0 top-full z-50 pt-2">
          <ul id={id} className="min-w-48 rounded-2xl border border-ink/10 bg-cream p-2 shadow-card">
            {items.map((i) => {
              const on = path === i.href || path.startsWith(i.href + '/');
              return (
                <li key={i.href}>
                  <Link href={i.href} aria-current={on ? 'page' : undefined}
                    className={`block rounded-xl px-3.5 py-2.5 text-[0.93rem] font-semibold hover:bg-cream-deep ${on ? 'text-teal-dark' : 'text-ink'}`}>{i.label}</Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
