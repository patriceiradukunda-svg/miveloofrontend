import { EventEditor } from '@/features/contentadmin/EventEditor';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Edit event' };
export default async function Page({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<Record<string, string | undefined>> }) { const { id } = await params; return <EventEditor id={id} sp={await searchParams} />; }
