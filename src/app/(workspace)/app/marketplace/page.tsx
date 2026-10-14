import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
export default async function M() { const s = await getSession(); redirect(s?.role === 'school' ? '/school/marketplace' : '/marketplace'); }
