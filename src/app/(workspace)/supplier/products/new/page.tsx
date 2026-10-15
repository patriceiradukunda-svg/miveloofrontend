import { PageHeader } from '@/components/layout/PageHeader';
import { ProductForm } from '@/features/products/components/ProductForm';
export const metadata = { title: 'New listing' };
export default function Page() { return <div className="space-y-6"><PageHeader title="New listing" lead="Describe what you can supply. Verified schools will see only these fields." /><ProductForm /></div>; }
