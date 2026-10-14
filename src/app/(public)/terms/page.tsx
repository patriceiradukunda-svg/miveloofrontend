import type { Metadata } from 'next';
import { ContentPage } from '@/components/public/ContentPage';
export const metadata: Metadata = { title: "Terms of service", alternates: { canonical: '/terms' } };
export default function Page() { return <ContentPage slug="terms" />; }
