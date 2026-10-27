import { ExpertPage } from '@/components/kit/ExpertPage';
export const metadata = { title: "Goods received" };
export const dynamic = 'force-dynamic';
export default async function Page() { return ExpertPage({ id: "school/goods-received" }); }
