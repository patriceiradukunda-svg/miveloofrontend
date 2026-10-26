import 'server-only';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { getSession, type Session } from './session';
import { checkRouteAccess } from './permissions';

/** Server-side guard used by workspace and admin layouts. The backend must still re-check every API call. */
export async function requireAccess(): Promise<{ session: Session; pathname: string }> {
  const pathname = (await headers()).get('x-pathname') ?? '/app';
  const session = await getSession();
  const result = checkRouteAccess(pathname, session?.role);
  if (!session || result === 'login') redirect(`/login?next=${encodeURIComponent(pathname)}`);
  if (result === 'denied') redirect('/access-denied');
  // Backend staff with the 'support' role may only use the support desk (their single permission is support:view_ticket).
  if (session.backendRole === 'support' && /^\/(admin|ai-ops)(\/|$)/.test(pathname) && !['/admin/dashboard', '/admin/support'].some((x) => pathname === x || pathname.startsWith(x + '/'))) redirect('/access-denied');
  return { session, pathname };
}
