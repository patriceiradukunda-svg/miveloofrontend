import type { Metadata } from 'next';
import { EventDetail, eventMetadata } from '@/features/publishing/EventDetail';
type P = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: P): Promise<Metadata> { return eventMetadata((await params).slug); }
export default async function Page({ params }: P) { return <EventDetail slug={(await params).slug} />; }
