import { ExpertPage } from '@/components/kit/ExpertPage';
export const metadata = { title: "Member payments" };
export const dynamic = 'force-dynamic';
export default async function Page() { return ExpertPage({ id: "group/payments" }); }
