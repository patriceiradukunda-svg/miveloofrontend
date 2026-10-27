import type { Metadata } from 'next';
import { PostsPage } from '@/features/publishing/PostsPage';
export const metadata: Metadata = { title: 'News', description: 'Announcements, product updates and stories from Miveloo.', alternates: { canonical: '/news' } };
export default function Page() { return <PostsPage kind="news" />; }
