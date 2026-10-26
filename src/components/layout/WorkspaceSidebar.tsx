"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import type { NavLink } from '@/config/navigation';
import { cn } from '@/lib/utils';

export function WorkspaceSidebar({ links, title }: { links: NavLink[]; title: string }) {
  const path = usePathname(); const [open, setOpen] = useState(false);
  const hit = links.filter((x) => path === x.href || path.startsWith(x.href + '/')).sort((a, b) => b.href.length - a.href.length)[0]?.href;
  return (
    <aside className="border-b border-ink/10 bg-white lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r">
      <button type="button" className="flex min-h-12 w-full items-center justify-between px-4 font-bold lg:hidden" aria-expanded={open} aria-controls="ws-nav" onClick={() => setOpen(!open)}>{title}<span aria-hidden>{open ? '✕' : '☰'}</span></button>
      <nav id="ws-nav" aria-label={title} className={cn('p-2 lg:sticky lg:top-16 lg:block lg:max-h-[calc(100vh-4rem)] lg:overflow-y-auto', open ? 'block' : 'hidden')}>
        <ul className="space-y-0.5">{links.map((l, i) => { const on = hit === l.href; const head = l.group && l.group !== links[i - 1]?.group; return (
          <li key={l.href}>{head ? <p className="px-3 pb-1 pt-4 text-xs font-bold uppercase tracking-wide text-ink-soft">{l.group}</p> : null}<Link href={l.href} aria-current={on ? 'page' : undefined} className={cn('block rounded-xl px-3 py-2.5 font-semibold', on ? 'bg-teal text-cream' : 'hover:bg-cream-deep')}>{l.label}</Link></li>); })}</ul>
      </nav>
    </aside>
  );
}
