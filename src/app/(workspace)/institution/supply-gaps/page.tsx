import { ExpertPage } from '@/components/kit/ExpertPage';
export const metadata = { title: "Supply gaps" };
export const dynamic = 'force-dynamic';
export default async function Page() { return ExpertPage({ id: "institution/supply-gaps" }); }
