import type { Metadata } from 'next';
import { ContentPage } from '@/components/public/ContentPage';
export const metadata: Metadata = { title: "Supplier terms", alternates: { canonical: '/supplier-terms' } };
export default function Page() { return <ContentPage slug="supplier-terms" />; }
