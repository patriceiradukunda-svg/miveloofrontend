import type { Metadata } from 'next';
import { ContentPage } from '@/components/public/ContentPage';
export const metadata: Metadata = { title: "School-to-school exchange", alternates: { canonical: '/exchange' } };
export default function Page() { return <ContentPage slug="exchange" />; }
