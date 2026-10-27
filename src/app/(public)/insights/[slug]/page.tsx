import type { Metadata } from 'next';
import { PostDetail, postMetadata } from '@/features/publishing/PostDetail';
type P = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: P): Promise<Metadata> { return postMetadata('blog', (await params).slug); }
export default async function Page({ params }: P) { return <PostDetail kind="blog" slug={(await params).slug} />; }
