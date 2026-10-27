import { ExpertPage } from '@/components/kit/ExpertPage';
export const metadata = { title: "Candidates" };
export const dynamic = 'force-dynamic';
export default async function Page() { return ExpertPage({ id: "admin/careers/candidates" }); }
