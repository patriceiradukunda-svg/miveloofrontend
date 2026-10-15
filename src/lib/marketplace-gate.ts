import 'server-only';
import { redirect } from 'next/navigation';
import { getSession } from './session';

/** The marketplace is private. Old /marketplace and /suppliers links land here: schools go to their own marketplace, everyone else is refused. */
export async function routeToSchoolMarketplace(): Promise<never> {
  const s = await getSession();
  if (!s) redirect('/login?next=%2Fschool%2Fmarketplace');
  redirect(s.role === 'school' ? '/school/marketplace' : '/access-denied');
}
