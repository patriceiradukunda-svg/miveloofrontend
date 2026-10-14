import type { Metadata } from 'next';
import { ContentPage } from '@/components/public/ContentPage';
export const metadata: Metadata = { title: "Mission and impact", alternates: { canonical: '/impact' } };
export default function Page() { return <ContentPage slug="impact" />; }
