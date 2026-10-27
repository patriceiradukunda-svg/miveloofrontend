import { ExpertPage } from '@/components/kit/ExpertPage';
export const metadata = { title: "Support desk" };
export const dynamic = 'force-dynamic';
export default async function Page() { return ExpertPage({ id: "admin/support" }); }
