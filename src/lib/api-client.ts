import { ApiError } from './errors';

const BASE = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? '';
export const hasBackend = BASE.length > 0;

export async function api<T>(path: string, init: RequestInit & { cookie?: string } = {}): Promise<T> {
  if (!hasBackend) throw new ApiError(503, 'No backend configured');
  const { cookie, ...rest } = init;
  // File uploads (FormData) must NOT get a JSON content type: the browser adds the multipart boundary itself.
  const isForm = typeof FormData !== 'undefined' && rest.body instanceof FormData;
  const res = await fetch(`${BASE}${path}`, {
    ...rest,
    credentials: 'include',
    headers: { ...(isForm ? {} : { 'Content-Type': 'application/json' }), ...(cookie ? { cookie } : {}), ...rest.headers },
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { message?: string; fieldErrors?: Record<string, string> };
    throw new ApiError(res.status, body.message ?? res.statusText, body.fieldErrors);
  }
  return (await res.json()) as T;
}
