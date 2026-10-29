import { cookies } from 'next/headers';
import { WorkspaceHeader } from '@/components/layout/WorkspaceHeader';
import { WorkspaceSidebar } from '@/components/layout/WorkspaceSidebar';
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher';
import { UserMenu } from '@/components/layout/UserMenu';
import { navFor } from '@/config/navigation';
import { navForPosition } from '@/config/positions';
import { tidyLinks } from '@/config/app-access';
import { ROLE_LABEL } from '@/config/roles';
import { workspaceGroups } from '@/config/workspace-groups';
import type { Session } from '@/lib/session';
import { ShellSwitch } from './ShellSwitch';

export async function WorkspaceFrame({ session, children }: { session: Session; children: React.ReactNode }) {
  const links = tidyLinks(session.position, navForPosition(session.position, navFor(session.role)));
  const collapsed = (await cookies()).get('ws_sidebar')?.value === 'collapsed';
  const title = ROLE_LABEL[session.role];
  return (
    <ShellSwitch classicHeader={<WorkspaceHeader session={session} />} classicSidebar={<WorkspaceSidebar links={links} title={title} />}
      schoolGroups={workspaceGroups('school', links)} supplierGroups={workspaceGroups('supplier', links)}
      title={title} name={session.name} verification={session.verification} demo={session.demo} initialCollapsed={collapsed}
      language={<LanguageSwitcher />} userMenu={<UserMenu session={session} />}>{children}</ShellSwitch>
  );
}
