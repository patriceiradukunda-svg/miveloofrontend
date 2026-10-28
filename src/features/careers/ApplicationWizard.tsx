'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Wizard, useWiz, type Errors, type Step, type Values } from '@/components/forms/wizard/Wizard';
import { Area, Check, Select, Text } from '@/components/forms/wizard/fields';
import { ReviewRows } from '@/components/forms/wizard/ReviewRows';
import type { CarLabels } from './labels';
import { DocUpload } from './DocUpload';
import { MAX_TOTAL_BYTES, SubmitError, formatSize, postForm } from './files';

export interface ApplyJob {
  slug: string;
  title: string;
  questions: { id: string; label: string; hint?: string; required: boolean }[];
  docs: { id: string; label: string; hint?: string; required: boolean }[];
}

const str = (x: unknown) => (typeof x === 'string' ? x : '');
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^\+?[0-9][0-9 ()-]{6,19}$/;
const YEAR = /^(19|20)\d{2}$/;
const okUrl = (s: string) => { try { const u = new URL(s); return u.protocol === 'http:' || u.protocol === 'https:'; } catch { return false; } };
const label = (opts: { value: string; label: string }[], v: unknown) => opts.find((o) => o.value === str(v))?.label ?? '';

export function ApplicationWizard({ job, L }: { job: ApplyJob; L: CarLabels }) {
  const [files, setFiles] = useState<Record<string, File>>({});
  const min = (n: number) => L.e.min.replace('{n}', String(n));
  const total = Object.values(files).reduce((s, f) => s + f.size, 0);
  const firstDocStep = 4;

  const steps: Step[] = [
    {
      id: 'you', title: L.s.you.t, hint: L.s.you.h,
      validate: (v: Values) => {
        const e: Errors = {};
        if (!str(v.firstName).trim()) e.firstName = L.e.required;
        if (!str(v.lastName).trim()) e.lastName = L.e.required;
        if (!EMAIL.test(str(v.email).trim())) e.email = L.e.email;
        if (!PHONE.test(str(v.phone).trim())) e.phone = L.e.phone;
        if (!str(v.city).trim()) e.city = L.e.required;
        if (!str(v.country).trim()) e.country = L.e.required;
        if (str(v.link).trim() && !okUrl(str(v.link).trim())) e.link = L.e.url;
        return e;
      },
      content: (<>
        <div className="grid gap-5 sm:grid-cols-2">
          <Text name="firstName" label={L.f.firstName} required autoComplete="given-name" />
          <Text name="lastName" label={L.f.lastName} required autoComplete="family-name" />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Text name="email" label={L.f.email} required type="email" inputMode="email" autoComplete="email" />
          <Text name="phone" label={L.f.phone} required type="tel" inputMode="tel" autoComplete="tel" />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Text name="city" label={L.f.city} required autoComplete="address-level2" />
          <Text name="country" label={L.f.country} required autoComplete="country-name" />
        </div>
        <Text name="link" label={L.f.link} type="url" autoComplete="url" />
      </>),
    },
    {
      id: 'exp', title: L.s.exp.t, hint: L.s.exp.h,
      validate: (v: Values) => {
        const e: Errors = {};
        if (!str(v.status)) e.status = L.e.required;
        if (!str(v.years)) e.years = L.e.required;
        if (str(v.summary).trim().length < 50) e.summary = min(50);
        if (!str(v.skills).trim()) e.skills = L.e.required;
        return e;
      },
      content: (<>
        <Select name="status" label={L.f.status} required options={L.o.status} placeholder={L.f.choose} />
        <Select name="years" label={L.f.years} required options={L.o.years} placeholder={L.f.choose} />
        <Area name="summary" label={L.f.summary} hint={L.f.summaryHint} required rows={6} />
        <Area name="skills" label={L.f.skills} hint={L.f.skillsHint} required rows={3} />
      </>),
    },
    {
      id: 'edu', title: L.s.edu.t, hint: L.s.edu.h,
      validate: (v: Values) => {
        const e: Errors = {};
        if (!str(v.level)) e.level = L.e.required;
        if (!str(v.field).trim()) e.field = L.e.required;
        if (!str(v.school).trim()) e.school = L.e.required;
        if (!YEAR.test(str(v.year).trim())) e.year = L.e.year;
        return e;
      },
      content: (<>
        <Select name="level" label={L.f.level} required options={L.o.level} placeholder={L.f.choose} />
        <Text name="field" label={L.f.field} required />
        <div className="grid gap-5 sm:grid-cols-2">
          <Text name="school" label={L.f.school} required />
          <Text name="year" label={L.f.year} required inputMode="numeric" />
        </div>
      </>),
    },
    {
      id: 'role', title: L.s.role.t, hint: L.s.role.h,
      validate: (v: Values) => {
        const e: Errors = {};
        if (!str(v.start)) e.start = L.e.required;
        if (str(v.why).trim().length < 50) e.why = min(50);
        job.questions.forEach((q) => { if (q.required && !str(v[`q_${q.id}`]).trim()) e[`q_${q.id}`] = L.e.required; });
        return e;
      },
      content: (<>
        <Select name="start" label={L.f.start} required options={L.o.start} placeholder={L.f.choose} />
        <Area name="why" label={L.f.why} required rows={5} />
        {job.questions.map((q) => <Area key={q.id} name={`q_${q.id}`} label={q.label} hint={q.hint} required={q.required} rows={4} />)}
        <Text name="heard" label={L.f.heard} />
      </>),
    },
    ...job.docs.map((d): Step => ({
      id: `doc_${d.id}`, title: d.label, hint: '',
      validate: (v: Values): Errors => (d.required && !str(v[`doc_${d.id}`]) ? { [`doc_${d.id}`]: L.e.file } : {}),
      content: (
        <DocUpload name={`doc_${d.id}`} label={d.label} hint={d.hint} required={d.required} T={L.up} file={files[d.id] ?? null}
          onFile={(f) => setFiles((p) => { const q = { ...p }; if (f) q[d.id] = f; else delete q[d.id]; return q; })} />
      ),
    })),
    {
      id: 'review', title: L.s.review.t, hint: L.s.review.h,
      validate: (v: Values) => {
        const e: Errors = {};
        if (v.consent !== true) e.consent = L.e.consent;
        if (total > MAX_TOTAL_BYTES) e.files = L.e.tooBig;
        return e;
      },
      content: <Review job={job} L={L} files={files} total={total} />,
    },
  ];

  async function onSubmit(v: Values) {
    const data = {
      job: job.slug, jobTitle: job.title,
      firstName: str(v.firstName).trim(), lastName: str(v.lastName).trim(), email: str(v.email).trim(), phone: str(v.phone).trim(),
      city: str(v.city).trim(), country: str(v.country).trim(), link: str(v.link).trim(),
      status: str(v.status), yearsExperience: str(v.years), summary: str(v.summary).trim(), skills: str(v.skills).trim(),
      educationLevel: str(v.level), fieldOfStudy: str(v.field).trim(), institution: str(v.school).trim(), graduationYear: str(v.year).trim(),
      startAvailability: str(v.start), motivation: str(v.why).trim(), heardFrom: str(v.heard).trim(),
      answers: job.questions.map((q) => ({ id: q.id, question: q.label, answer: str(v[`q_${q.id}`]).trim() })),
      consent: true,
    };
    const fd = new FormData();
    fd.append('data', JSON.stringify(data));
    job.docs.forEach((d) => { const f = files[d.id]; if (f) fd.append(d.id, f, f.name); });
    await postForm(`/careers/jobs/${encodeURIComponent(job.slug)}/apply`, fd);
  }
  function formatError(e: unknown): string {
    if (e instanceof SubmitError) {
      if (e.status === 0) return L.errNoBackend;
      if (e.status === 413) return L.errTooBig;
      if (e.status === 429) return L.errWait;
    }
    return L.errSend;
  }

  return (
    <Wizard
      variant="split" steps={steps} initial={{ consent: false }} onSubmit={onSubmit} formatError={formatError}
      submitLabel={L.submit} labels={L.wiz}
      done={<div role="status" className="rounded-2xl bg-green-tint p-6"><h2 className="text-2xl font-semibold text-teal-dark">{L.done.t}</h2><p className="mt-2 text-lg">{L.done.b}</p><Link className="mt-4 inline-flex min-h-12 items-center font-bold underline" href="/careers">{L.done.back}</Link></div>}
    />
  );
}

function Review({ job, L, files, total }: { job: ApplyJob; L: CarLabels; files: Record<string, File>; total: number }) {
  const { v } = useWiz();
  const rows: [string, string, number][] = [
    [L.f.firstName, str(v.firstName), 0], [L.f.lastName, str(v.lastName), 0], [L.f.email, str(v.email), 0], [L.f.phone, str(v.phone), 0],
    [L.f.city, str(v.city), 0], [L.f.country, str(v.country), 0],
    [L.f.status, label(L.o.status, v.status), 1], [L.f.years, label(L.o.years, v.years), 1],
    [L.f.level, label(L.o.level, v.level), 2], [L.f.field, str(v.field), 2], [L.f.school, str(v.school), 2], [L.f.year, str(v.year), 2],
    [L.f.start, label(L.o.start, v.start), 3],
    ...job.docs.map((d, k): [string, string, number] => { const f = files[d.id]; return [d.label, f ? `${f.name} (${formatSize(f.size)})` : L.notProvided, 4 + k]; }),
  ];
  return (
    <div className="space-y-5">
      <ReviewRows rows={rows} />
      {total > MAX_TOTAL_BYTES && <p role="alert" className="rounded-xl bg-red-tint px-4 py-3 text-sm font-semibold text-red-dark">⚠ {L.e.tooBig}</p>}
      <Check name="consent">{L.consent} <Link href="/privacy" target="_blank" rel="noopener" className="font-bold underline">{L.privacyLink}</Link></Check>
    </div>
  );
}
