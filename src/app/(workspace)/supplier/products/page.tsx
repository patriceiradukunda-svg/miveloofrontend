import { PageHeader } from '@/components/layout/PageHeader';
import { ButtonLink } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';

export const metadata = { title: 'My products' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="My products" lead="Manage your own listings, stock and availability." status="available">
        <ButtonLink href="/supplier/products/new" variant="gold">New listing</ButtonLink>
      </PageHeader>
      <EmptyState
        title="Your listings are not connected here yet"
        body="This page does not currently load listings belonging to your signed-in supplier account. No sample products are shown."
        action={{ href: '/supplier/products/new', label: 'Create a listing' }}
      />
    </div>
  );
}
