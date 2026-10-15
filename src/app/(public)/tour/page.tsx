import type { Metadata } from 'next';
import { TourPlayer } from '@/features/tour/TourPlayer';
import { getPhotoMap } from '@/lib/photos';
import { SectionHeading } from '@/components/layout/SectionHeading';
export const metadata: Metadata = { title: 'Guided tour with the founder', description: 'A short walk through Miveloo, in the founder\'s words.', alternates: { canonical: '/tour' } };
export default function TourPage() {
  return (
    <div className="container-page max-w-5xl space-y-8 py-12">
      <SectionHeading as="h1" eyebrow="Guided tour" title="Walk through Miveloo with the founder" lead="Nine short stops. Use the arrow keys or the buttons. Skip to the end any time." />
      <TourPlayer photos={getPhotoMap()} />
    </div>
  );
}
