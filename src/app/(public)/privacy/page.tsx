import type { Metadata } from 'next';
import { ContentPage } from '@/components/public/ContentPage';
export const metadata: Metadata = { title: "Privacy policy", alternates: { canonical: '/privacy' } };
export default function Page() { return <ContentPage slug="privacy" />; }
