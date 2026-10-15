'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

/** Desktop nav link with a sliding gold underline; stays underlined on the current page. */
export function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const path = usePathname();
  const active = href === '/' ? path === '/' : path === href || path.startsWith(href + '/');
  return (
    <Link href={href} aria-current={active ? 'page' : undefined}
      className={`relative inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-2.5 text-[0.93rem] font-semibold text-ink after:absolute after:inset-x-3.5 after:bottom-1.5 after:h-0.5 after:origin-left after:rounded-full after:bg-gold after:transition-transform after:duration-300 hover:after:scale-x-100 focus-visible:after:scale-x-100 ${active ? 'after:scale-x-100' : 'after:scale-x-0'}`}>
      {children}
    </Link>
  );
}
