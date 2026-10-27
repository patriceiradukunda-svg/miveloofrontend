import { EventsAdmin } from '@/features/contentadmin/EventsAdmin';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Events' };
export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) { return <EventsAdmin sp={await searchParams} />; }
