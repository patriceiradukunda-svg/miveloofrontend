import { PageHeader } from '@/components/layout/PageHeader';
import { EmptyState } from '@/components/ui/empty-state';

export default async function Page({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  await params;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit listing"
        lead="Update an existing supplier listing."
      />
      <EmptyState
        title="Listing editing is not connected yet"
        body="An existing listing must be loaded from the live service before it can be edited. No sample product is loaded."
      />
    </div>
  );
}
