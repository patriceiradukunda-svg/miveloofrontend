import { PageHeader } from '@/components/layout/PageHeader';
import { EmptyState } from '@/components/ui/empty-state';

export const metadata = { title: 'Orders' };

export default function Orders() {
  return (
    <div className="space-y-6">
      <PageHeader title="Orders" lead="Track orders and their delivery lifecycle." status="available" />
      <EmptyState
        title="Order history is not connected to this page yet"
        body="No example orders are displayed. Your authenticated order history needs to be connected before real orders can appear here."
      />
    </div>
  );
}
