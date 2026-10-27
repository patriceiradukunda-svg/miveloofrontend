import { PostsAdmin } from '@/features/contentadmin/PostsAdmin';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'News' };
export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) { return <PostsAdmin kind="news" sp={await searchParams} />; }
