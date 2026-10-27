import 'server-only';
import { API_BASE, API_ORIGIN } from '@/lib/miveloo-client';
import { getJob as staticJob, getJobs as staticJobs, type Job } from '@/config/careers';

// The public API returns null for empty optional fields; the page code expects them to be absent.
type ApiJob = { [K in keyof Job]?: Job[K] | null } & { slug: string };

function toJob(a: ApiJob): Job {
  const { closes, niceToHave, benefits, documents, questions, rw, ...rest } = a;
  return {
    ...(rest as unknown as Job),
    ...(closes ? { closes } : {}), ...(niceToHave ? { niceToHave } : {}), ...(benefits ? { benefits } : {}),
    ...(documents ? { documents } : {}), ...(questions ? { questions } : {}), ...(rw ? { rw } : {}),
  };
}

async function load<T>(path: string): Promise<T | null> {
  if (!API_ORIGIN) return null;
  try {
    const res = await fetch(`${API_BASE}${path}`, { next: { revalidate: 60 }, signal: AbortSignal.timeout(10000) });
    return res.ok ? ((await res.json()) as T) : null;
  } catch { return null; }
}

/** Open roles from the live backend (cached 60 s); falls back to the static list if the API is unreachable. */
export async function fetchJobs(): Promise<Job[]> {
  const d = await load<{ items: ApiJob[] }>('/careers/jobs');
  if (!d || !Array.isArray(d.items)) return staticJobs();
  return d.items.map(toJob).sort((a, b) => b.posted.localeCompare(a.posted));
}
export async function fetchJob(slug: string): Promise<Job | undefined> {
  const d = await load<ApiJob & { item?: ApiJob; job?: ApiJob }>(`/careers/jobs/${encodeURIComponent(slug)}`);
  const a = d?.item ?? d?.job ?? d;
  return a && a.slug ? toJob(a) : staticJob(slug);
}
