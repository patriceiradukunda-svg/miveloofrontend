/** Browser-side file rules. These are a convenience only: the backend must check type and size again. */
export const MAX_MB = 5;
export const MAX_BYTES = MAX_MB * 1024 * 1024;
export const MAX_TOTAL_BYTES = 20 * 1024 * 1024;
export const ACCEPT = '.pdf,.doc,.docx,.jpg,.jpeg,.png';
const EXTENSIONS = ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png'];

export function checkFile(f: File): 'type' | 'size' | null {
  const ext = f.name.split('.').pop()?.toLowerCase() ?? '';
  if (!EXTENSIONS.includes(ext) || f.size === 0) return 'type';
  if (f.size > MAX_BYTES) return 'size';
  return null;
}
export function formatSize(bytes: number): string {
  return bytes >= 1024 * 1024 ? `${(bytes / (1024 * 1024)).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

/**
 * Applications and ideas are sent from the browser straight to the Miveloo API as multipart form data.
 * (Browser code can only read NEXT_PUBLIC_ variables, so this needs NEXT_PUBLIC_API_URL.)
 * We do not reuse api() here because it forces a JSON content type, which breaks file uploads.
 */
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? '';
export const careersReady = API_BASE.length > 0;

export class SubmitError extends Error {
  constructor(public status: number) {
    super('submit');
  }
}
export async function postForm(path: string, body: FormData): Promise<void> {
  if (!careersReady) throw new SubmitError(0);
  const res = await fetch(`${API_BASE}${path}`, { method: 'POST', body, credentials: 'omit' });
  if (!res.ok) throw new SubmitError(res.status);
}
