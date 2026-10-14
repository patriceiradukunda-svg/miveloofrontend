import Link from 'next/link';
import { Logo } from './Logo';
import { LanguageSwitcher } from './LanguageSwitcher';
import { UserMenu } from './UserMenu';
import type { Session } from '@/lib/session';
export function WorkspaceHeader({ session }: { session: Session }) {
  return (
    <header className="sticky top-0 z-30 border-b border-ink/10 bg-cream/95 backdrop-blur">
      <div className="flex items-center justify-between gap-3 px-4 py-1.5"><Logo className="h-12 w-auto" />
        <div className="flex items-center gap-3"><Link href="/app/notifications" className="inline-flex min-h-11 items-center rounded-full px-3 font-semibold hover:bg-cream-deep" aria-label="Notifications">🔔</Link><LanguageSwitcher /><UserMenu session={session} /></div></div>
      {session.demo && <p className="bg-gold px-4 py-1.5 text-center text-sm font-bold">Demo mode: sample data only. No real accounts, orders or payments.</p>}
    </header>
  );
}
