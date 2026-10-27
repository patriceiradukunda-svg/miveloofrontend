import { ExpertPage } from '@/components/kit/ExpertPage';
export const metadata = { title: "Purchase requests" };
export const dynamic = 'force-dynamic';
export default async function Page() { return ExpertPage({ id: "school/procurement" }); }
