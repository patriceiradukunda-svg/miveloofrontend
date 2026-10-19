import { Suspense } from 'react';
import { SchoolGallery } from '@/features/marketplace/components/SchoolGallery';
import { GallerySkeleton } from '@/features/marketplace/components/GallerySkeleton';
import { loadSchoolMarket } from '@/features/marketplace/service';
export const metadata = { title: 'Marketplace' };
export default async function Page() {
  const d = await loadSchoolMarket();
  return <Suspense fallback={<GallerySkeleton />}><SchoolGallery items={d.items} place={d.place} error={d.error} /></Suspense>;
}
