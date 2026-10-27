import { wide } from '@/components/public/kit';
import { RegistrationManage } from '@/features/publishing/RegistrationManage';
export const metadata = { title: 'Your event registration', robots: { index: false, follow: false } };
export default async function Page({ params, searchParams }: { params: Promise<{ reference: string }>; searchParams: Promise<{ token?: string }> }) {
  const { reference } = await params; const { token } = await searchParams;
  return <div className={`${wide} max-w-3xl py-16`}><RegistrationManage reference={reference} token={token ?? ''} /></div>;
}
