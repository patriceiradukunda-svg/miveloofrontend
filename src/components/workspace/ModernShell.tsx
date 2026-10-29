'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Logo } from '@/components/layout/Logo';
import { ErrorBoundary } from '@/components/feedback/ErrorBoundary';
import { activeOf, type WsGroup } from '@/config/workspace-groups';
import { cn } from '@/lib/utils';
import { Icon } from './Icon';

export interface ModernProps {
  groups: WsGroup[]; title: string; name: string; verification: 'unverified' | 'pending' | 'verified'; demo: boolean;
  initialCollapsed: boolean; language: ReactNode; userMenu: ReactNode; children: ReactNode;
}
const BADGE = {
  verified: ['Verified', 'bg-ws-green text-white'],
  pending: ['Pending', 'bg-ws-amber-tint text-ws-amber-ink'],
  unverified: ['Not verified', 'bg-ws-red-tint text-ws-red'],
} as const;
const iconBtn = 'inline-flex h-11 w-11 items-center justify-center rounded-full text-ws-ink hover:bg-ws-mint';

function Pills({ groups, current, compact, onNavigate }: { groups: WsGroup[]; current: WsGroup | undefined; compact?: boolean; onNavigate?: () => void }) {
  return (
    <ul className="space-y-2">
      {groups.map((g) => {
        const on = g === current;
        return (
          <li key={g.name}>
            <Link href={g.items[0]!.href} title={g.name} aria-current={on ? 'true' : undefined} onClick={onNavigate}
              className={cn('flex min-h-11 items-center gap-3 rounded-full border px-4 text-sm font-semibold transition-colors', compact && 'justify-center px-0',
                on ? 'border-ws-green bg-ws-green text-white shadow-sm' : 'border-ws-line bg-white text-ws-green hover:border-ws-green hover:bg-ws-mint')}>
              <Icon name={g.icon} className="h-5 w-5 shrink-0" />
              <span className={cn(compact && 'sr-only')}>{g.name}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
function Brand({ compact }: { compact?: boolean }) {
  return compact
    ? <span aria-hidden="true" className="mx-auto grid h-9 w-9 place-items-center rounded-[10px] bg-ws-green font-bold text-white">M</span>
    : <Logo className="h-10 w-auto" />;
}
function Identity({ name, verification }: { name: string; verification: ModernProps['verification'] }) {
  const [label, cls] = BADGE[verification];
  return (
    <div className="rounded-xl bg-ws-mint px-3 py-2.5 text-sm">
      <p className="truncate font-semibold text-ws-ink">{name}</p>
      <span className={cn('mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-bold', cls)}>{label}</span>
    </div>
  );
}

export function ModernShell({ groups, title, name, verification, demo, initialCollapsed, language, userMenu, children }: ModernProps) {
  const path = usePathname();
  const [collapsed, setCollapsed] = useState(initialCollapsed);
  const drawer = useRef<HTMLDialogElement>(null);
  const { group, item } = activeOf(groups, path);
  const current = group ?? groups[0];
  useEffect(() => { drawer.current?.close(); }, [path]);
  function toggle() {
    const next = !collapsed; setCollapsed(next);
    document.cookie = `ws_sidebar=${next ? 'collapsed' : 'open'}; path=/; max-age=31536000; samesite=lax`;
  }
  return (
    <div className="ws min-h-screen bg-ws-bg text-ws-ink">
      <aside aria-label="Workspace" className={cn('fixed inset-y-0 left-0 z-40 hidden flex-col gap-5 overflow-y-auto border-r border-ws-line bg-white py-5 transition-[width] duration-300 lg:flex', collapsed ? 'w-20 px-2' : 'w-64 px-4')}>
        <div className={cn('px-1', collapsed && 'flex justify-center')}><Brand compact={collapsed} /></div>
        {!collapsed && <Identity name={name} verification={verification} />}
        <nav aria-label="Workspace sections"><Pills groups={groups} current={current} compact={collapsed} /></nav>
      </aside>

      <dialog ref={drawer} aria-label="Workspace menu" onClick={(e) => { if (e.target === e.currentTarget) e.currentTarget.close(); }}
        className="m-0 h-full max-h-none w-72 max-w-[85vw] bg-white p-4 backdrop:bg-ink/50 open:flex open:flex-col open:gap-5 lg:hidden">
        <div className="flex items-center justify-between"><Brand /><button type="button" aria-label="Close menu" className={iconBtn} onClick={() => drawer.current?.close()}><Icon name="x" className="h-5 w-5" /></button></div>
        <Identity name={name} verification={verification} />
        <nav aria-label="Workspace sections"><Pills groups={groups} current={current} onNavigate={() => drawer.current?.close()} /></nav>
      </dialog>

      <div className={cn('min-w-0 transition-[margin] duration-300', collapsed ? 'lg:ml-20' : 'lg:ml-64')}>
        {demo && <p className="bg-gold px-4 py-1.5 text-center text-sm font-bold">Demo mode: sample data only. No real accounts, orders or payments.</p>}
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-ws-line bg-white/95 px-4 py-2 backdrop-blur sm:px-8">
          <div className="flex items-center gap-2">
            <button type="button" aria-label="Open menu" className={cn(iconBtn, 'lg:hidden')} onClick={() => drawer.current?.showModal()}><Icon name="menu" className="h-5 w-5" /></button>
            <button type="button" aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} aria-pressed={collapsed} className={cn(iconBtn, 'hidden lg:inline-flex')} onClick={toggle}><Icon name="menu" className="h-5 w-5" /></button>
            <p className="text-sm font-semibold text-ws-muted">{title}</p>
          </div>
          <div className="flex items-center gap-2">{language}
            <Link href="/app/notifications" aria-label="Notifications" className={iconBtn}><Icon name="bell" className="h-5 w-5" /></Link>{userMenu}</div>
        </header>
        {current && (
          <nav aria-label={`${current.name} pages`} className="overflow-x-auto border-b border-ws-line bg-white px-4 sm:px-8">
            <ul className="flex min-w-max">
              {current.items.map((l) => {
                const on = item?.href === l.href;
                return (
                  <li key={l.href}>
                    <Link href={l.href} aria-current={on ? 'page' : undefined}
                      className={cn('block whitespace-nowrap border-b-2 px-4 py-3 text-sm', on ? 'border-ws-green font-semibold text-ws-green' : 'border-transparent font-medium text-ws-muted hover:bg-ws-mint hover:text-ws-green')}>{l.label}</Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        )}
        <main id="main" tabIndex={-1} className="mx-auto w-full max-w-[1400px] p-4 sm:p-8"><ErrorBoundary>{children}</ErrorBoundary></main>
      </div>
    </div>
  );
}
