"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
export interface NavItem { href: string; label: string }

export function NavLinks({ items, className }: { items: NavItem[]; className?: string }) {
  const path = usePathname();
  return (
    <ul className={cn('items-center gap-1', className)}>
      {items.map((i) => { const on = i.href === '/' ? path === '/' : path === i.href || path.startsWith(i.href + '/'); return (
        <li key={i.href}><Link href={i.href} aria-current={on ? 'page' : undefined}
          className={cn('relative inline-flex min-h-11 items-center px-3 font-semibold transition-colors hover:text-teal-dark', on ? 'text-teal-dark after:absolute after:inset-x-3 after:bottom-1 after:h-0.5 after:rounded-full after:bg-gold' : 'text-ink-soft')}>{i.label}</Link></li>); })}
    </ul>
  );
}
