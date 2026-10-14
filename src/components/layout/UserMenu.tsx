import { logout } from '@/features/auth/actions';
import { Button } from '@/components/ui/button';
import { ROLE_LABEL } from '@/config/roles';
import type { Session } from '@/lib/session';
export function UserMenu({ session }: { session: Session }) {
  return (
    <div className="flex items-center gap-3"><span className="hidden text-sm sm:block"><strong>{session.name}</strong><br /><span className="text-ink-soft">{ROLE_LABEL[session.role]}</span></span>
      <form action={logout}><Button type="submit" variant="ghost" className="min-h-11 px-4 text-sm">Sign out</Button></form></div>
  );
}
