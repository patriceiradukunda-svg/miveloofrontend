'use server';
import { cookies } from 'next/headers';
import { ROLE_HOME } from '@/config/roles';
import { createOrganization, liveApi, myOrganizations } from '@/lib/miveloo-client';
import { postGoogle, startSessionFromTokens, type Tokens } from '@/lib/server/google-session';
import { verifyGoogleCredential } from './google';

const PENDING = 'mv_google_pending';
// UI account type -> backend organization type. "institution" covers government and NGOs in the UI; government is assumed here.
const ORG_TYPE = {
  school: 'school', supplier: 'supplier', group: 'cooperative', cooperative: 'cooperative',
  institution: 'government', government: 'government', ngo: 'ngo',
} as const;
const WAKING = 'The service is waking up. Please try again in a minute.';

export async function registerWithGoogle(input: {
  credential: string; accountType: string; name: string; phone?: string; organisation: string;
}): Promise<{ error?: string; to?: string }> {
  if (!liveApi) return { error: 'Sign-up is not available yet because the service is not connected.' };
  const who = await verifyGoogleCredential(input.credential);
  if (!who.ok) return { error: who.error };
  const orgType = ORG_TYPE[input.accountType as keyof typeof ORG_TYPE];
  const orgName = input.organisation.trim();
  if (!orgType) return { error: 'Please choose a valid account type.' };
  if (!orgName) return { error: 'Please enter your organisation name.' };

  let res: Response;
  try {
    res = await postGoogle('/auth/google/register', {
      credential: input.credential,
      full_name: input.name.trim() || undefined,
      phone: input.phone?.trim() || undefined,
    });
    // Account already exists (e.g. an earlier attempt stopped before the organisation was created): continue as a Google sign-in.
    if (res.status === 409) res = await postGoogle('/auth/google', { credential: input.credential });
  } catch { return { error: WAKING }; }
  if (!res.ok) return { error: res.status === 429 ? 'Too many attempts. Please wait a few minutes.' : res.status === 503 ? WAKING : 'We could not create your account with Google. Please try again.' };

  const t = (await res.json()) as Tokens;
  try {
    const orgs = await myOrganizations(t.access_token);
    if (orgs.length === 0) await createOrganization(t.access_token, { type: orgType, name: orgName });
  } catch { return { error: 'Your account was created, but we could not register your organisation. Please try again.' }; }

  let r: Awaited<ReturnType<typeof startSessionFromTokens>>;
  try { r = await startSessionFromTokens(t); } catch { r = { error: 'Sign-in did not complete. Please try again.' }; }
  if (r.error || !r.role) return { error: r.error ?? 'Sign-in did not complete. Please try again.' };

  (await cookies()).delete(PENDING);
  return { to: ROLE_HOME[r.role] };
}
