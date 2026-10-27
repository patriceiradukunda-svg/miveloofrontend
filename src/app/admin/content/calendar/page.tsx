import { CalendarView } from '@/features/contentadmin/Queues';
export const dynamic = 'force-dynamic';
export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) { return <CalendarView sp={await searchParams} />; }
