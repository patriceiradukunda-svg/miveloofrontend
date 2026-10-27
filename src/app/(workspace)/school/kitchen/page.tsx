import { ExpertPage } from '@/components/kit/ExpertPage';
export const metadata = { title: "Kitchen production" };
export const dynamic = 'force-dynamic';
export default async function Page() { return ExpertPage({ id: "school/kitchen" }); }
