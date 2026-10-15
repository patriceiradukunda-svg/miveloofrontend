import type { Metadata } from 'next';
import { ContentPage } from '@/components/public/ContentPage';
import { InteractiveCycle } from '@/components/public/InteractiveCycle';
export const metadata: Metadata = { title: "How it works", alternates: { canonical: '/how-it-works' } };
export default function Page() { return <ContentPage slug="how-it-works" after={<InteractiveCycle />} />; }
