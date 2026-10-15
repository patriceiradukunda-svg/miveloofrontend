import type { Metadata } from 'next';
import { ContentPage } from '@/components/public/ContentPage';
import { PriceForecastChart } from '@/features/analytics/PriceForecastChart';
import { EvidenceLegend } from '@/features/analytics/EvidenceLegend';
export const metadata: Metadata = { title: "AI and data intelligence", alternates: { canonical: '/ai-intelligence' } };
export default function Page() { return <ContentPage slug="ai-intelligence" after={<><PriceForecastChart /><EvidenceLegend /></>} />; }
