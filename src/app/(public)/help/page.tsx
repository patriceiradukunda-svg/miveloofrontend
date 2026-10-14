import type { Metadata } from 'next';
import { ContentPage } from '@/components/public/ContentPage';
export const metadata: Metadata = { title: "Help and support", alternates: { canonical: '/help' } };
export default function Page() { return <ContentPage slug="help" />; }
