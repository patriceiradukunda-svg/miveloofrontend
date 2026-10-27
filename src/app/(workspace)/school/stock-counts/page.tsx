import { ExpertPage } from '@/components/kit/ExpertPage';
export const metadata = { title: "Stock counts" };
export const dynamic = 'force-dynamic';
export default async function Page() { return ExpertPage({ id: "school/stock-counts" }); }
