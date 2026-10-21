import 'server-only';
import { api, API_BASE, ApiError } from '@/lib/miveloo-client';
import { withBackendToken } from '@/lib/server/backend-session';

export const JOB_STATUSES = ['draft', 'published', 'unpublished', 'closed', 'archived'] as const;
export const APP_STATUSES = ['new', 'screening', 'shortlisted', 'interview', 'assessment', 'offer', 'hired', 'rejected', 'withdrawn'] as const;
export const JOB_TYPES = ['full-time', 'part-time', 'contract', 'internship', 'volunteer'];
export const WORK_MODES = ['on-site', 'hybrid', 'remote'];
export const DOCS = [['cv', 'CV / résumé'], ['coverLetter', 'Cover letter'], ['idDocument', 'ID document'], ['certificates', 'Certificates'],
  ['portfolio', 'Portfolio'], ['references', 'References'], ['other', 'Other']] as const;

export interface Question { id: string; label: string; required: boolean }
export interface Job {
  id: string; slug: string; title: string; team: string | null; type: string; work_mode: string; location: string | null; summary: string | null;
  about: string[] | null; responsibilities: string[] | null; requirements: string[] | null; nice_to_have: string[] | null; benefits: string[] | null;
  documents: { id: string; required: boolean }[] | null; questions: Question[] | null; rw: Record<string, unknown> | null; openings: number;
  salary_min: number | null; salary_max: number | null; salary_currency: string; salary_visible: boolean; status: string; closes_on: string | null;
  published_at: string | null; version: number; updated_at: string; is_demo: boolean;
  applications: { total: number; new: number; by_status: Record<string, number> }; publish_problems: string[];
}
export interface AppRow {
  id: string; job_id: string; job_title: string; reference: string; full_name: string; email: string; phone: string | null; location: string | null;
  linkedin_url: string | null; status: string; rating: number | null; tags: string[]; starred: boolean; rejection_reason: string | null;
  created_at: string; last_activity_at: string; is_demo: boolean;
}
export interface AppDetail extends AppRow {
  cover_note: string | null; answers: Record<string, string> | null; job_questions: Question[] | null; assigned_to_name: string | null;
  history: { id: string; from_status: string | null; to_status: string; note: string | null; created_at: string; changed_by: string | null }[];
  notes: { id: string; body: string; created_at: string; author: string | null }[];
  replies: { id: string; direction: string; template_key: string | null; to_email: string; subject: string; body: string; status: string; error: string | null; created_at: string; sent_by: string | null }[];
  interviews: { id: string; scheduled_at: string; duration_min: number; mode: string; location: string | null; interviewers: string[] | null; status: string; score: number | null; feedback: string | null }[];
}
export interface Template { id: string; key: string; name: string; subject: string; body: string; active: boolean; updated_at: string }
export interface Activity { id: string; entity_type: string; entity_id: string | null; action: string; detail: Record<string, unknown> | null; created_at: string; is_demo: boolean; actor: string | null; job_id: string | null; application_id: string | null }
export interface Dashboard {
  jobs_by_status: Record<string, number>; applications_by_status: Record<string, number>; applications_total: number; new_last_7_days: number;
  new_waiting_over_3_days: number; avg_days_to_hire: number | null;
  closing_within_7_days: { id: string; title: string; closes_on: string }[]; published_but_expired: { id: string; title: string; closes_on: string }[];
  published_without_applicants: { id: string; title: string }[]; top_jobs: { id: string; title: string; status: string; applications: number }[];
  weekly_applications: { week: string; count: number }[]; recent_activity: Omit<Activity, 'id' | 'actor'>[];
}

export function qs(o: Record<string, unknown>): string {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(o)) if (v !== undefined && v !== null && v !== '') p.set(k, String(v));
  const t = p.toString(); return t ? `?${t}` : '';
}
export function careers<T>(path: string, init: { method?: string; body?: unknown } = {}): Promise<T> {
  return withBackendToken((token) => api<T>(`/admin/careers${path}`, { ...init, token, cache: 'no-store' }));
}
export function careersText(path: string): Promise<{ body: string; type: string }> {
  return withBackendToken(async (token) => {
    const res = await fetch(`${API_BASE}/admin/careers${path}`, { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' });
    if (!res.ok) throw new ApiError(res.status, res.statusText);
    return { body: await res.text(), type: res.headers.get('content-type') ?? 'text/csv' };
  });
}
export async function safe<T>(p: Promise<T>): Promise<{ data: T | null; error: string | null }> {
  try { return { data: await p, error: null }; }
  catch (e) {
    if (e instanceof ApiError) return { data: null, error: e.status === 403 ? 'Your account needs the platform_admin role on the backend to use this area.' : e.status === 401 ? 'Your session expired. Please sign in again.' : e.message };
    return { data: null, error: 'Could not reach the backend.' };
  }
}
