import { PageHeader } from '@/components/layout/PageHeader';
import { Flash } from '../../_ui';
import { JobForm } from '../../_job-form';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'New job' };

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  return (
    <div className="space-y-6">
      <PageHeader title="New job" lead="Saved as a draft. Nothing is public until you publish it." />
      <Flash ok={sp.ok} error={sp.error} />
      <JobForm />
    </div>
  );
}
