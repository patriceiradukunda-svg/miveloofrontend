import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import { ROLE_HOME } from '@/config/roles';
export default async function AppHome() { const s = await getSession(); redirect(s ? ROLE_HOME[s.role] : '/login'); }
