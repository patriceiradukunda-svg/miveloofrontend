import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/layout/PageHeader';
import { ProductForm } from '@/features/products/components/ProductForm';
import { sampleProducts } from '@/lib/sample-data';
export default async function Page({ params }: { params: Promise<{ productId: string }> }) {
  const { productId } = await params; const p = sampleProducts.find((x) => x.id === productId); if (!p) notFound();
  return <div className="space-y-6"><PageHeader title={`Edit ${p.name}`} /><ProductForm defaults={{ name: p.name, category: p.category, description: p.description, unit: p.unit, quantity: String(p.availableQuantity ?? ''), price: String(p.indicativePriceRWF ?? ''), district: p.district }} /></div>;
}
