import type { Metadata } from 'next';
import { PostDetail, postMetadata } from '@/features/publishing/PostDetail';
type P = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: P): Promise<Metadata> { return postMetadata('news', (await params).slug); }
export default async function Page({ params }: P) { return <PostDetail kind="news" slug={(await params).slug} />; }
