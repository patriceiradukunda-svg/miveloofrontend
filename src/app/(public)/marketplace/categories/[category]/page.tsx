import { redirect } from 'next/navigation';
export default async function Category({ params }: { params: Promise<{ category: string }> }) {
  redirect(`/marketplace?category=${encodeURIComponent((await params).category)}`);
}
