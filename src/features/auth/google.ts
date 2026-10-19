'use server';
import { createPublicKey, createVerify, type JsonWebKeyInput } from 'node:crypto';

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const b64 = (s: string) => Buffer.from(s.replace(/-/g, '+').replace(/_/g, '/'), 'base64');
const bad = (): { ok: false; error: string } => ({ ok: false, error: 'We could not verify your Google sign-in. Please try again.' });

/** Verifies a Google ID token on the server (signature against Google's public keys, issuer, audience, expiry, verified email).
 *  The browser is never trusted with identity. The backend must verify the same token again when the account is created. */
export async function verifyGoogleCredential(credential: string): Promise<{ ok: true; email: string; name: string; sub: string } | { ok: false; error: string }> {
  try {
    if (!CLIENT_ID) return { ok: false, error: 'Google sign-in is not configured.' };
    const parts = credential.split('.');
    if (parts.length !== 3) return bad();
    const [h = '', p = '', s = ''] = parts;
    const header = JSON.parse(b64(h).toString('utf8')) as { alg?: string; kid?: string };
    if (header.alg !== 'RS256' || !header.kid) return bad();
    const res = await fetch('https://www.googleapis.com/oauth2/v3/certs', { next: { revalidate: 3600 } });
    if (!res.ok) return bad();
    const { keys } = (await res.json()) as { keys: (JsonWebKeyInput['key'] & { kid?: string })[] };
    const jwk = keys.find((k) => k.kid === header.kid);
    if (!jwk) return bad();
    if (!createVerify('RSA-SHA256').update(`${h}.${p}`).verify(createPublicKey({ key: jwk as unknown as import('node:crypto').JsonWebKey, format: 'jwk' }), b64(s))) return bad();
    const c = JSON.parse(b64(p).toString('utf8')) as { iss?: string; aud?: string; exp?: number; email?: string; email_verified?: boolean; name?: string; sub?: string };
    const now = Math.floor(Date.now() / 1000);
    if (!['https://accounts.google.com', 'accounts.google.com'].includes(c.iss ?? '') || c.aud !== CLIENT_ID || !c.exp || c.exp + 60 < now || c.email_verified !== true || !c.email) return bad();
    return { ok: true, email: c.email.toLowerCase(), name: (c.name ?? '').trim() || (c.email.split('@')[0] ?? ''), sub: c.sub ?? '' };
  } catch {
    return bad();
  }
}
