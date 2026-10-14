import type { Metadata } from 'next';
import { ContentPage } from '@/components/public/ContentPage';
export const metadata: Metadata = { title: "Cookie policy", alternates: { canonical: '/cookies' } };
export default function Page() { return <ContentPage slug="cookies" />; }
