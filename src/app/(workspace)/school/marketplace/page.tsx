import { Suspense } from 'react';
import { SchoolGallery } from '@/features/marketplace/components/SchoolGallery';
import { GallerySkeleton } from '@/features/marketplace/components/GallerySkeleton';
import { loadSchoolMarket } from '@/features/marketplace/service';
export const metadata = { title: 'Marketplace' };
// The free-tier API can take up to a minute to wake after idle; allow the page that long instead of timing out.
export const maxDuration = 60;
export default async function Page() {
  const d = await loadSchoolMarket();
  return <Suspense fallback={<GallerySkeleton />}><SchoolGallery items={d.items} place={d.place} error={d.error} /></Suspense>;
}
