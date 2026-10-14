import { requireAccess } from '@/lib/guard';
import { WorkspaceShell } from '@/components/layout/WorkspaceShell';
import { VerificationRequired } from '@/components/feedback/VerificationRequired';

const OPEN_UNVERIFIED = ['/school/dashboard', '/school/profile'];
export const dynamic = 'force-dynamic';
export default async function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const { session, pathname } = await requireAccess();
  const gated = session.role === 'school' && session.verification !== 'verified' && pathname.startsWith('/school') && !OPEN_UNVERIFIED.includes(pathname);
  return <WorkspaceShell session={session}>{gated ? <VerificationRequired /> : children}</WorkspaceShell>;
}
