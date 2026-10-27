import { PostsAdmin } from '@/features/contentadmin/PostsAdmin';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Blog' };
export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) { return <PostsAdmin kind="blog" sp={await searchParams} />; }
