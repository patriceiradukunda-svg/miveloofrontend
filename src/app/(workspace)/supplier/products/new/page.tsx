import { PageHeader } from '@/components/layout/PageHeader';
import { ListingWizard } from '@/features/products/components/ListingWizard';
export const metadata = { title: 'New listing' };
export default function Page() { return <div className="space-y-6"><PageHeader title="New listing" lead="Describe what you can supply. Verified schools will see only these fields." /><ListingWizard /></div>; }
