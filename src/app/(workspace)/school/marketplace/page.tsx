import { PageHeader } from '@/components/layout/PageHeader';
import { SchoolMarketplace } from '@/features/orders/components/SchoolMarketplace';
export const metadata = { title: 'School marketplace' };
export default function Page() { return <div className="space-y-6"><PageHeader title="School marketplace" lead="Compare offers, check quantities and delivery terms, then submit a purchase request." status="available" /><SchoolMarketplace /></div>; }
