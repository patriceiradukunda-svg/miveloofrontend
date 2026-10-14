import type { Metadata } from 'next';
import { ContentPage } from '@/components/public/ContentPage';
export const metadata: Metadata = { title: "AI and data intelligence", alternates: { canonical: '/ai-intelligence' } };
export default function Page() { return <ContentPage slug="ai-intelligence" />; }
