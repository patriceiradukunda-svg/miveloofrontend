import { Suspense } from 'react';
import { SupplierListings } from '@/features/marketplace/components/SupplierListings';
import { GallerySkeleton } from '@/features/marketplace/components/GallerySkeleton';
import { loadSupplierListings } from '@/features/marketplace/service';
export const metadata = { title: 'My listings' };
export const maxDuration = 60;
export default async function Page() {
  const d = await loadSupplierListings();
  return <Suspense fallback={<GallerySkeleton />}><SupplierListings initial={d.items} error={d.error} /></Suspense>;
}
