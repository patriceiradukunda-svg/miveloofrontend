import type { Metadata } from 'next';
import { ContentPage } from '@/components/public/ContentPage';
export const metadata: Metadata = { title: "Trust centre", alternates: { canonical: '/trust' } };
export default function Page() { return <ContentPage slug="trust" />; }
