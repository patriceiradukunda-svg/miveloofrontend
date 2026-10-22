import { ApiError } from './errors';

const RAW = (process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? '').trim();
/** Origin only: a trailing slash or /api/v1 is stripped so the prefix is added exactly once below. */
const ORIGIN = RAW.replace(/\/+$/, '').replace(/\/api\/v1$/, '');
export const hasBackend = ORIGIN.length > 0;

export async function api<T>(path: string, init: RequestInit & { cookie?: string } = {}): Promise<T> {
  if (!hasBackend) throw new ApiError(503, 'No backend configured');
  const { cookie, ...rest } = init;
  // File uploads (FormData) must NOT get a JSON content type: the browser adds the multipart boundary itself.
  const isForm = typeof FormData !== 'undefined' && rest.body instanceof FormData;
  const url = `${ORIGIN}${path.startsWith('/api/') ? path : `/api/v1${path}`}`;
  const res = await fetch(url, {
    ...rest,
    credentials: 'include',
    headers: { ...(isForm ? {} : { 'Content-Type': 'application/json' }), ...(cookie ? { cookie } : {}), ...rest.headers },
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { message?: string; error?: { message?: string }; fieldErrors?: Record<string, string> };
    throw new ApiError(res.status, body.error?.message ?? body.message ?? res.statusText, body.fieldErrors);
  }
  return (res.status === 204 ? (null as T) : ((await res.json()) as T));
}
