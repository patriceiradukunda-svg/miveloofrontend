import type { Metadata } from 'next';
import { ContentPage } from '@/components/public/ContentPage';
export const metadata: Metadata = { title: "For institutions", alternates: { canonical: '/institutions' } };
export default function Page() { return <ContentPage slug="institutions" />; }
