import { saveJob } from './actions';
import { DOCS, JOB_TYPES, WORK_MODES, type Job } from '@/lib/server/careers-admin';
import { btn, card, field, lbl } from './_ui';

const list = (a?: string[] | null) => (a ?? []).join('\n');
function Text({ name, label, value, type = 'text', hint }: { name: string; label: string; value?: string | number | null; type?: string; hint?: string }) {
  return <div><label htmlFor={name} className={lbl}>{label}</label><input id={name} name={name} type={type} defaultValue={value ?? ''} className={field} />{hint && <p className="mt-1 text-xs text-ink-soft">{hint}</p>}</div>;
}
function Area({ name, label, value, rows = 4, hint }: { name: string; label: string; value?: string; rows?: number; hint?: string }) {
  return <div><label htmlFor={name} className={lbl}>{label}</label><textarea id={name} name={name} rows={rows} defaultValue={value} className={field} />{hint && <p className="mt-1 text-xs text-ink-soft">{hint}</p>}</div>;
}
function Pick({ name, label, value, options }: { name: string; label: string; value?: string; options: string[] }) {
  return <div><label htmlFor={name} className={lbl}>{label}</label><select id={name} name={name} defaultValue={value} className={field}>{options.map((o) => <option key={o}>{o}</option>)}</select></div>;
}

export function JobForm({ job }: { job?: Job }) {
  const rw = (job?.rw ?? {}) as Record<string, unknown>;
  const rwText = (k: string) => (typeof rw[k] === 'string' ? (rw[k] as string) : '');
  const rwList = (k: string) => (Array.isArray(rw[k]) ? (rw[k] as string[]).join('\n') : '');
  const docState = (id: string) => {
    const d = job?.documents?.find((x) => x.id === id);
    if (d) return d.required ? 'required' : 'optional';
    return job ? 'off' : id === 'cv' ? 'required' : id === 'coverLetter' ? 'optional' : 'off';
  };
  return (
    <form action={saveJob} className="space-y-6">
      <input type="hidden" name="id" value={job?.id ?? ''} />
      <input type="hidden" name="slug_current" value={job?.slug ?? ''} />
      <input type="hidden" name="back" value={job ? `/admin/careers/jobs/${job.id}` : '/admin/careers/jobs/new'} />
      <fieldset className={`${card} grid gap-4 sm:grid-cols-2`}><legend className="px-2 font-semibold text-teal-dark">Basics</legend>
        <div className="sm:col-span-2"><Text name="title" label="Job title" value={job?.title} /></div>
        <Text name="slug" label="Web address (slug)" value={job?.slug} hint={job ? 'Cannot be changed while the job is published.' : 'Leave empty to generate from the title.'} />
        <Text name="team" label="Team" value={job?.team} />
        <Pick name="type" label="Employment type" value={job?.type ?? 'full-time'} options={JOB_TYPES} />
        <Pick name="work_mode" label="Work mode" value={job?.work_mode ?? 'on-site'} options={WORK_MODES} />
        <Text name="location" label="Location" value={job?.location} />
        <Text name="openings" label="Number of openings" type="number" value={job?.openings ?? 1} />
        <Text name="closes_on" label="Closing date" type="date" value={job?.closes_on} hint="Empty means open until you close it." />
      </fieldset>
      <fieldset className={`${card} grid gap-4`}><legend className="px-2 font-semibold text-teal-dark">Description (English)</legend>
        <Area name="summary" label="Summary (max 600 characters)" rows={3} value={job?.summary ?? ''} />
        <Area name="about" label="About the role" value={list(job?.about)} hint="One paragraph per line." />
        <Area name="responsibilities" label="Responsibilities" value={list(job?.responsibilities)} hint="One per line." />
        <Area name="requirements" label="Requirements" value={list(job?.requirements)} hint="One per line." />
        <Area name="nice_to_have" label="Nice to have" rows={3} value={list(job?.nice_to_have)} />
        <Area name="benefits" label="Benefits (only what you really offer)" rows={3} value={list(job?.benefits)} />
      </fieldset>
      <fieldset className={`${card} grid gap-4`}><legend className="px-2 font-semibold text-teal-dark">Kinyarwanda (optional)</legend>
        <Text name="rw_title" label="Title" value={rwText('title')} />
        <Area name="rw_summary" label="Summary" rows={3} value={rwText('summary')} />
        <Area name="rw_about" label="About the role" value={rwList('about')} />
        <Area name="rw_responsibilities" label="Responsibilities" value={rwList('responsibilities')} />
        <Area name="rw_requirements" label="Requirements" value={rwList('requirements')} />
      </fieldset>
      <fieldset className={`${card} grid gap-4`}><legend className="px-2 font-semibold text-teal-dark">What applicants must provide</legend>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{DOCS.map(([id, l]) => (
          <div key={id}><label htmlFor={`doc_${id}`} className={lbl}>{l}</label>
            <select id={`doc_${id}`} name={`doc_${id}`} defaultValue={docState(id)} className={field}><option value="off">Not requested</option><option value="optional">Optional</option><option value="required">Required</option></select></div>))}</div>
        <Area name="questions" label="Screening questions" rows={4} value={(job?.questions ?? []).map((q) => q.label + (q.required ? ' *' : '')).join('\n')} hint="One question per line. End a line with * to make it required." />
      </fieldset>
      <fieldset className={`${card} grid gap-4 sm:grid-cols-4`}><legend className="px-2 font-semibold text-teal-dark">Salary</legend>
        <Text name="salary_min" label="Minimum" type="number" value={job?.salary_min} />
        <Text name="salary_max" label="Maximum" type="number" value={job?.salary_max} />
        <Text name="salary_currency" label="Currency" value={job?.salary_currency ?? 'RWF'} />
        <label className="flex items-center gap-2 pt-6 text-sm"><input type="checkbox" name="salary_visible" defaultChecked={job?.salary_visible} /> Show on the public page</label>
      </fieldset>
      <button className={btn}>{job ? 'Save changes' : 'Create draft'}</button>
    </form>
  );
}
