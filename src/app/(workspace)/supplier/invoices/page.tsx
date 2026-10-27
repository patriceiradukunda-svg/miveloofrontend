import { ExpertPage } from '@/components/kit/ExpertPage';
export const metadata = { title: "Invoices" };
export const dynamic = 'force-dynamic';
export default async function Page() { return ExpertPage({ id: "supplier/invoices" }); }
