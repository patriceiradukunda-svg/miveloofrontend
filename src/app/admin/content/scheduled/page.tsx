import { ScheduledQueue } from '@/features/contentadmin/Queues';
export const dynamic = 'force-dynamic';
export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) { return <ScheduledQueue sp={await searchParams} />; }
