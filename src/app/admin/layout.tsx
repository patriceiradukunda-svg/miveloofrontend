import { requireAccess } from '@/lib/guard';
import { WorkspaceShell } from '@/components/layout/WorkspaceShell';
export const dynamic = 'force-dynamic';
export const metadata = { robots: { index: false, follow: false } };
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { session } = await requireAccess();
  return <WorkspaceShell session={session}>{children}</WorkspaceShell>;
}
