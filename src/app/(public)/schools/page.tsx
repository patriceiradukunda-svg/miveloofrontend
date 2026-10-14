import type { Metadata } from 'next';
import { ContentPage } from '@/components/public/ContentPage';
export const metadata: Metadata = { title: "For schools", alternates: { canonical: '/schools' } };
export default function Page() { return <ContentPage slug="schools" />; }
