import type { Metadata } from 'next';
import { ContentPage } from '@/components/public/ContentPage';
export const metadata: Metadata = { title: "Data and AI policy", alternates: { canonical: '/data-ai-policy' } };
export default function Page() { return <ContentPage slug="data-ai-policy" />; }
