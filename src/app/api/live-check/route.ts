import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

/** Open /api/live-check on the deployed site: shows whether this deployment has the backend address and can reach it. No secrets. */
export async function GET() {
  const raw = process.env.NEXT_PUBLIC_API_URL ?? '';
  const origin = raw.replace(/\/+$/, '').replace(/\/api\/v1$/, '');
  const out: Record<string, unknown> = { hasApiUrl: origin.length > 0, apiHost: origin ? new URL(origin).host : null };
  if (!origin) return NextResponse.json({ ...out, verdict: 'NEXT_PUBLIC_API_URL is not set for this deployment; redeploy after adding it in Vercel.' }, { status: 200 });
  for (const [key, path] of [['health', '/health/live'], ['listings', '/api/v1/listings?limit=1'], ['categories', '/api/v1/foods/categories']] as const) {
    const t0 = Date.now();
    try {
      const r = await fetch(`${origin}${path}`, { cache: 'no-store', signal: AbortSignal.timeout(55_000) });
      out[key] = { status: r.status, ms: Date.now() - t0 };
    } catch (e) {
      out[key] = { error: e instanceof Error ? e.name : 'error', ms: Date.now() - t0 };
    }
  }
  const ok = (out.listings as { status?: number } | undefined)?.status === 200;
  return NextResponse.json({ ...out, verdict: ok ? 'OK: this deployment can read the backend.' : 'The deployment has the address but could not read the backend (see statuses).' });
}
