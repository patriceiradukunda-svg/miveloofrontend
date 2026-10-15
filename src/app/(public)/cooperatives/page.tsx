import type { Metadata } from 'next';
import { ContentPage } from '@/components/public/ContentPage';
export const metadata: Metadata = { title: "For cooperatives", alternates: { canonical: '/cooperatives' } };
export default function Page() { return <ContentPage slug="cooperatives" />; }
