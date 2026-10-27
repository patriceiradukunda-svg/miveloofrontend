import type { Metadata } from 'next';
import { EventsPage } from '@/features/publishing/EventsPage';
export const metadata: Metadata = { title: 'Events', description: 'Workshops, meetups and partner gatherings for the school food community.', alternates: { canonical: '/events' } };
export default function Page() { return <EventsPage />; }
