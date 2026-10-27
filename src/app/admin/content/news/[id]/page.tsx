import { PostEditor } from '@/features/contentadmin/PostEditor';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Edit' };
export default async function Page({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<Record<string, string | undefined>> }) { const { id } = await params; return <PostEditor kind="news" id={id} sp={await searchParams} />; }
