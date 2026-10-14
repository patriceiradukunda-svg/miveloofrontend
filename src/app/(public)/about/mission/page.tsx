import type { Metadata } from 'next';
import { ContentPage } from '@/components/public/ContentPage';
export const metadata: Metadata = { title: "Mission", alternates: { canonical: '/about/mission' } };
export default function Page() { return <ContentPage slug="about/mission" />; }
