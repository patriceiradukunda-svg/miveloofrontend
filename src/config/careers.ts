/**
 * Posted roles. Add one object per REAL job to `jobs`; nothing is shown on the site until you do.
 * - Text is English. Add `rw` to give Kinyarwanda versions of any text field.
 * - Dates are ISO strings (YYYY-MM-DD). A role without `closes` stays open until you remove it.
 * - Do not use "idea" as a slug: that address belongs to the idea form.
 * - `documents` lists what an applicant must upload, one step per document. Leave it out for the default
 *   (CV required, cover letter optional). Only ask for documents you genuinely need at application stage.
 * - Questions are English only.
 *
 * Example (copy, fill in with a real role, remove the comment markers):
 *
 * {
 *   slug: 'programme-coordinator',
 *   title: 'Programme Coordinator',
 *   team: 'Programmes',
 *   type: 'full-time',
 *   workMode: 'hybrid',
 *   location: 'Kigali, Rwanda',
 *   posted: '2026-10-20',
 *   closes: '2026-11-30',
 *   summary: 'One or two sentences about the role.',
 *   about: ['A paragraph about the role.'],
 *   responsibilities: ['First responsibility.', 'Second responsibility.'],
 *   requirements: ['First requirement.', 'Second requirement.'],
 *   niceToHave: ['Optional extra.'],
 *   benefits: ['Only what you really offer.'],
 *   documents: [{ id: 'cv', required: true }, { id: 'certificates', required: true }, { id: 'coverLetter', required: false }],
 *   questions: [{ id: 'why', label: 'What would you change first?', required: true }],
 * }
 */

export type DocId = 'cv' | 'coverLetter' | 'idDocument' | 'certificates' | 'portfolio' | 'references' | 'other';
export type JobType = 'full-time' | 'part-time' | 'contract' | 'internship' | 'volunteer';
export type WorkMode = 'on-site' | 'hybrid' | 'remote';

export interface JobDoc { id: DocId; required: boolean; label?: string; hint?: string }
export interface JobQuestion { id: string; label: string; hint?: string; required?: boolean }
export interface JobText {
  title: string;
  summary: string;
  about: string[];
  responsibilities: string[];
  requirements: string[];
  niceToHave?: string[];
  benefits?: string[];
}
export interface Job extends JobText {
  slug: string;
  team: string;
  type: JobType;
  workMode: WorkMode;
  location: string;
  posted: string;
  closes?: string;
  documents?: JobDoc[];
  questions?: JobQuestion[];
  rw?: Partial<JobText>;
}

export const DEFAULT_DOCUMENTS: JobDoc[] = [
  { id: 'cv', required: true },
  { id: 'coverLetter', required: false },
];

export const jobs: Job[] = [];

export function getJobs(): Job[] {
  return [...jobs].sort((a, b) => b.posted.localeCompare(a.posted));
}
export function getJob(slug: string): Job | undefined {
  return jobs.find((j) => j.slug === slug);
}
export function isOpen(job: Job, now: Date = new Date()): boolean {
  if (!job.closes) return true;
  return new Date(`${job.closes}T23:59:59`).getTime() >= now.getTime();
}
export function jobText(job: Job, locale: string): JobText {
  const { title, summary, about, responsibilities, requirements, niceToHave, benefits } = job;
  const base: JobText = { title, summary, about, responsibilities, requirements, ...(niceToHave ? { niceToHave } : {}), ...(benefits ? { benefits } : {}) };
  return locale === 'rw' ? { ...base, ...job.rw } : base;
}
export function formatDate(iso: string, locale: string): string {
  return new Intl.DateTimeFormat(locale === 'rw' ? 'rw' : 'en-GB', { dateStyle: 'long' }).format(new Date(`${iso}T00:00:00`));
}
