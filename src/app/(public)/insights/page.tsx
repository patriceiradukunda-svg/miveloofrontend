import type { Metadata } from 'next';
import { PostsPage } from '@/features/publishing/PostsPage';
export const metadata: Metadata = { title: 'Insights', description: 'Stories, knowledge and fresh perspectives on school feeding, food supply, planning and nutrition.', alternates: { canonical: '/insights' } };
export default function Page() { return <PostsPage kind="blog" />; }
