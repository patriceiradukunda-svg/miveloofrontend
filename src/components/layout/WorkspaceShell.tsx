import { WorkspaceHeader } from './WorkspaceHeader';
import { WorkspaceSidebar } from './WorkspaceSidebar';
import { navFor } from '@/config/navigation';
import { ROLE_LABEL } from '@/config/roles';
import type { Session } from '@/lib/session';
export function WorkspaceShell({ session, children }: { session: Session; children: React.ReactNode }) {
  return (
    <div className="min-h-screen"><WorkspaceHeader session={session} />
      <div className="lg:flex"><WorkspaceSidebar links={navFor(session.role)} title={ROLE_LABEL[session.role]} />
        <main id="main" tabIndex={-1} className="min-w-0 flex-1 p-4 sm:p-8">{children}</main></div></div>
  );
}
