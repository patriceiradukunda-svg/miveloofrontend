import type { Metadata } from 'next';
import { PageHeader } from '@/components/layout/PageHeader';
import { EmptyState } from '@/components/ui/empty-state';
export const metadata: Metadata = { title: 'Insights', alternates: { canonical: '/insights' } };
export default function Insights() {
  return <div className="container-page py-14 space-y-8"><PageHeader title="Insights" lead="Educational articles on school feeding, supply and data." /><EmptyState title="No articles published yet" body="Educational content will appear here once it has been written and reviewed." action={{ href: '/faq', label: 'Read the FAQ' }} /></div>;
}
