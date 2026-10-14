import type { Metadata } from 'next';
import { ContentPage } from '@/components/public/ContentPage';
export const metadata: Metadata = { title: "About Miveloo", alternates: { canonical: '/about' } };
export default function Page() { return <ContentPage slug="about" />; }
