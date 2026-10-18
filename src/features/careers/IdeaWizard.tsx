'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Wizard, useWiz, type Errors, type Step, type Values } from '@/components/forms/wizard/Wizard';
import { Area, Check, Choice, Text } from '@/components/forms/wizard/fields';
import { ReviewRows } from '@/components/forms/wizard/ReviewRows';
import type { CarLabels } from './labels';
import { DocUpload } from './DocUpload';
import { SubmitError, formatSize, postForm } from './files';

const str = (x: unknown) => (typeof x === 'string' ? x : '');
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^\+?[0-9][0-9 ()-]{6,19}$/;
const title = (opts: { value: string; title: string }[], v: unknown) => opts.find((o) => o.value === str(v))?.title ?? '';

export function IdeaWizard({ L }: { L: CarLabels }) {
  const [file, setFile] = useState<File | null>(null);
  const I = L.idea;
  const min = (n: number) => L.e.min.replace('{n}', String(n));

  const steps: Step[] = [
    {
      id: 'you', title: I.s.you.t, hint: I.s.you.h,
      validate: (v: Values) => {
        const e: Errors = {};
        if (!str(v.name).trim()) e.name = L.e.required;
        if (!EMAIL.test(str(v.email).trim())) e.email = L.e.email;
        if (str(v.phone).trim() && !PHONE.test(str(v.phone).trim())) e.phone = L.e.phone;
        if (!str(v.city).trim()) e.city = L.e.required;
        if (!str(v.country).trim()) e.country = L.e.required;
        return e;
      },
      content: (<>
        <Text name="name" label={I.f.name} required autoComplete="name" />
        <div className="grid gap-5 sm:grid-cols-2">
          <Text name="email" label={L.f.email} required type="email" inputMode="email" autoComplete="email" />
          <Text name="phone" label={I.f.phone} type="tel" inputMode="tel" autoComplete="tel" />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Text name="city" label={L.f.city} required autoComplete="address-level2" />
          <Text name="country" label={L.f.country} required autoComplete="country-name" />
        </div>
        <Text name="org" label={I.f.org} autoComplete="organization" />
      </>),
    },
    {
      id: 'idea', title: I.s.idea.t, hint: I.s.idea.h,
      validate: (v: Values) => {
        const e: Errors = {};
        if (str(v.title).trim().length < 3) e.title = L.e.required;
        if (str(v.problem).trim().length < 40) e.problem = min(40);
        if (str(v.who).trim().length < 10) e.who = min(10);
        if (str(v.solution).trim().length < 60) e.solution = min(60);
        if (!str(v.stage)) e.stage = L.e.required;
        return e;
      },
      content: (<>
        <Text name="title" label={I.f.title} required />
        <Area name="problem" label={I.f.problem} hint={I.f.problemHint} required rows={5} />
        <Area name="who" label={I.f.who} hint={I.f.whoHint} required rows={3} />
        <Area name="solution" label={I.f.solution} hint={I.f.solutionHint} required rows={6} />
        <Choice name="stage" label={I.f.stage} required options={I.o.stage} />
      </>),
    },
    {
      id: 'join', title: I.s.join.t, hint: I.s.join.h,
      validate: (v: Values): Errors => (str(v.role) ? {} : { role: L.e.required }),
      content: (<>
        <Choice name="role" label={I.f.role} required options={I.o.role} />
        <Area name="extra" label={I.f.extra} rows={4} />
      </>),
    },
    {
      id: 'doc', title: I.s.doc.t, hint: I.s.doc.h,
      content: <DocUpload name="doc" label={I.s.doc.t} required={false} T={L.up} file={file} onFile={setFile} />,
    },
    {
      id: 'review', title: I.s.review.t, hint: I.s.review.h,
      validate: (v: Values): Errors => (v.consent === true ? {} : { consent: L.e.consent }),
      content: <Review L={L} file={file} />,
    },
  ];

  async function onSubmit(v: Values) {
    const data = {
      name: str(v.name).trim(), email: str(v.email).trim(), phone: str(v.phone).trim(), city: str(v.city).trim(), country: str(v.country).trim(), organisation: str(v.org).trim(),
      title: str(v.title).trim(), problem: str(v.problem).trim(), beneficiaries: str(v.who).trim(), solution: str(v.solution).trim(),
      stage: str(v.stage), joinAs: str(v.role), extra: str(v.extra).trim(), consent: true,
    };
    const fd = new FormData();
    fd.append('data', JSON.stringify(data));
    if (file) fd.append('document', file, file.name);
    await postForm('/careers/ideas', fd);
  }
  function formatError(e: unknown): string {
    if (e instanceof SubmitError) {
      if (e.status === 0) return L.errNoBackend;
      if (e.status === 413) return L.errTooBig;
      if (e.status === 429) return L.errWait;
    }
    return I.errSend;
  }

  return (
    <Wizard
      variant="compact" steps={steps} initial={{ consent: false }} onSubmit={onSubmit} formatError={formatError}
      submitLabel={I.submit} labels={L.wiz}
      done={<div role="status" className="rounded-2xl bg-green-tint p-6"><h2 className="text-2xl font-semibold text-teal-dark">{I.done.t}</h2><p className="mt-2 text-lg">{I.done.b}</p><Link className="mt-4 inline-flex min-h-12 items-center font-bold underline" href="/careers">{L.done.back}</Link></div>}
    />
  );
}

function Review({ L, file }: { L: CarLabels; file: File | null }) {
  const { v } = useWiz();
  const I = L.idea;
  const rows: [string, string, number][] = [
    [I.f.name, str(v.name), 0], [L.f.email, str(v.email), 0], [L.f.city, str(v.city), 0], [L.f.country, str(v.country), 0],
    [I.f.title, str(v.title), 1], [I.f.stage, title(I.o.stage, v.stage), 1],
    [I.f.role, title(I.o.role, v.role), 2],
    [I.s.doc.t, file ? `${file.name} (${formatSize(file.size)})` : L.notProvided, 3],
  ];
  return (
    <div className="space-y-5">
      <ReviewRows rows={rows} />
      <Check name="consent">{I.consent} <Link href="/privacy" target="_blank" rel="noopener" className="font-bold underline">{L.privacyLink}</Link></Check>
    </div>
  );
}
