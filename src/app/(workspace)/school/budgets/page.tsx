import { ExpertPage } from '@/components/kit/ExpertPage';
export const metadata = { title: "Budgets" };
export const dynamic = 'force-dynamic';
export default async function Page() { return ExpertPage({ id: "school/budgets" }); }
