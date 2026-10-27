import { ExpertPage } from '@/components/kit/ExpertPage';
export const metadata = { title: "Audit log" };
export const dynamic = 'force-dynamic';
export default async function Page() { return ExpertPage({ id: "admin/audit" }); }
