import { PublishQueue } from '@/features/contentadmin/Queues';
export const dynamic = 'force-dynamic';
export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) { return <PublishQueue sp={await searchParams} />; }
