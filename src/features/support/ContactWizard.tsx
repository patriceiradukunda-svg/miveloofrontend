"use client";
import { useRef, useState, type ReactNode } from 'react';
import { Wizard, useWiz, type Errors, type Step, type Values } from '@/components/forms/wizard/Wizard';
import { Area, Check, Choice, Chips, Select, Text } from '@/components/forms/wizard/fields';
import { LocationFields, locationSummary, validateLocation } from '@/components/forms/wizard/LocationFields';
import { ReviewRows } from '@/components/forms/wizard/ReviewRows';
import { hasBackend } from '@/lib/api-client';

const str = (x: unknown) => (typeof x === 'string' ? x : '');
const arr = (x: unknown) => (Array.isArray(x) ? (x as string[]) : []);
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const API = process.env.NEXT_PUBLIC_API_URL ?? '';
const MAX_FILE = 1.5 * 1024 * 1024;
const FILE_TYPES = ['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'application/pdf'];

const BASIC = ['Registering an account', 'Selling on Miveloo', 'Buying for a school', 'Verification', 'Orders and deliveries', 'Partnership or programme', 'A technical problem', 'Something else'];
const EXTRA = ['Billing or Pro plan', 'AI forecasts or reports', 'Misleading information', 'Urgent: suspected account compromise', 'Urgent: unauthorised access', 'Urgent: fraudulent listing', 'Urgent: unsafe food concern', 'Urgent: privacy incident'];
const TOPICS = [...BASIC, ...EXTRA].map((x) => ({ value: x, label: x }));
// Topic -> the category names the support API accepts. Topics not listed here are already valid categories.
const CATEGORY_FOR: Record<string, string> = {
  'Registering an account': 'Account or verification', 'Verification': 'Account or verification',
  'Selling on Miveloo': 'Finding or listing food', 'Buying for a school': 'Finding or listing food',
  'Orders and deliveries': 'Orders and deliveries', 'A technical problem': 'Technical error',
  'Partnership or programme': 'Other', 'Something else': 'Other',
};
const USER_TYPE: Record<string, string> = { school: 'School', supplier: 'Supplier', cooperative: 'Cooperative or organisation', institution: 'Institutional partner', other: 'Other' };
const WHO = [{ value: 'school', title: 'School' }, { value: 'supplier', title: 'Supplier or farmer' }, { value: 'cooperative', title: 'Cooperative or group' }, { value: 'institution', title: 'Institution or partner' }, { value: 'other', title: 'Someone else' }];

function Attachment({ name, error, onPick, onClear }: { name: string; error: string; onPick: (f: File | null) => void; onClear: () => void }) {
  return (
    <div>
      <label htmlFor="mv-attach" className="block font-semibold">Screenshot or attachment (optional)</label>
      {name ? (
        <p className="mt-1 text-sm">Attached: <b>{name}</b> <button type="button" className="ml-2 underline" onClick={onClear}>Remove</button></p>
      ) : (
        <input id="mv-attach" type="file" accept="image/png,image/jpeg,image/gif,image/webp,application/pdf" className="mt-1 block w-full text-sm"
          onChange={(e) => { onPick(e.target.files?.[0] ?? null); e.target.value = ''; }} />
      )}
      <p className="mt-1 text-sm text-ink-soft">Images or PDF, up to 1.5 MB. Never include passwords or card details.</p>
      {error && <p role="alert" className="mt-1 text-sm font-semibold text-red">{error}</p>}
    </div>
  );
}

function Message({ attach }: { attach: ReactNode }) {
  const { v } = useWiz();
  return (<>
    <Select name="topic" label="What is it about?" required options={TOPICS} placeholder="Choose a topic" />
    <Choice name="urgency" label="How urgent is it?" options={[{ value: 'normal', title: 'Normal', desc: 'A reply within a few working days is fine' }, { value: 'urgent', title: 'Urgent', desc: 'It is blocking an order or a delivery' }]} />
    <Area name="message" label="How can we help?" required rows={5} hint="Include order numbers or product names if they help." />
    {attach}
    <Chips name="via" label="How should we reply?" options={[{ value: 'email', label: 'Email' }, { value: 'phone', label: 'Phone call' }]} />
    {arr(v.via).includes('phone') && <Text name="phone" label="Phone number" type="tel" required inputMode="tel" autoComplete="tel" hint="Example: 0788 123 456" />}
  </>);
}
function Where() {
  const { v } = useWiz();
  return (<>
    <Check name="addLocation">Add where I am (helps us route your message).</Check>
    {v.addLocation === true && <LocationFields />}
  </>);
}
function ReviewStep({ fileName }: { fileName: string }) {
  const { v } = useWiz();
  return <ReviewRows rows={[['Name', str(v.name), 0], ['Email', str(v.email), 0], ['I am', WHO.find((w) => w.value === str(v.who))?.title ?? '', 0], ['Organisation', str(v.organisation), 0], ['Topic', str(v.topic), 1], ['Urgency', str(v.urgency) === 'urgent' ? 'Urgent' : 'Normal', 1], ['Message', str(v.message), 1], ['Attachment', fileName || 'None', 1], ['Reply by', arr(v.via).join(' and ') || 'Email', 1], ['Location', v.addLocation === true ? locationSummary(v) : 'Not added', 2]]} />;
}

export function ContactWizard() {
  const fileRef = useRef<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [fileErr, setFileErr] = useState('');
  const [reference, setReference] = useState('');

  function pick(f: File | null) {
    if (!f) return;
    if (!FILE_TYPES.includes(f.type)) { fileRef.current = null; setFileName(''); setFileErr('Attach an image (PNG, JPEG, GIF or WebP) or a PDF.'); return; }
    if (f.size > MAX_FILE) { fileRef.current = null; setFileName(''); setFileErr('The file must be smaller than 1.5 MB.'); return; }
    fileRef.current = f; setFileName(f.name); setFileErr('');
  }
  function clear() { fileRef.current = null; setFileName(''); setFileErr(''); }

  const steps: Step[] = [
    { id: 'you', summary: (v: Values) => str(v.name), title: 'About you', content: <><Text name="name" label="Your name" required autoComplete="name" /><Text name="email" label="Email" type="email" required autoComplete="email" inputMode="email" /><Choice name="who" label="Who are you writing as?" required options={WHO} /><Text name="organisation" label="Organisation (optional)" autoComplete="organization" /></>,
      validate: (v: Values) => { const e: Errors = {}; if (str(v.name).trim().length < 2) e.name = 'Enter your name.'; if (!EMAIL.test(str(v.email).trim())) e.email = 'Enter a valid email address.'; if (!str(v.who)) e.who = 'Choose one.'; return e; } },
    { id: 'message', summary: (v: Values) => str(v.topic), title: 'Your message', content: <Message attach={<Attachment name={fileName} error={fileErr} onPick={pick} onClear={clear} />} />,
      validate: (v: Values) => { const e: Errors = {}; if (!str(v.topic)) e.topic = 'Choose a topic.'; if (str(v.message).trim().length < 20) e.message = 'Tell us a little more (at least 20 characters).'; if (arr(v.via).includes('phone') && str(v.phone).replace(/\D/g, '').length < 9) e.phone = 'Enter a valid phone number.'; return e; } },
    { id: 'where', summary: (v: Values) => v.addLocation === true ? locationSummary(v) : 'Skipped', title: 'Where you are (optional)', content: <Where />, validate: (v: Values): Errors => (v.addLocation === true ? validateLocation(v) : {}) },
    { id: 'review', title: 'Review and send', content: <ReviewStep fileName={fileName} /> },
  ];

  async function onSubmit(v: Values) {
    if (!hasBackend) return;
    const topic = str(v.topic);
    const wantsPhone = arr(v.via).includes('phone');
    const lines = [str(v.message).trim()];
    if (str(v.urgency) === 'urgent') lines.push('', 'Marked urgent by sender: it is blocking an order or a delivery.');
    if (v.addLocation === true) lines.push('', 'Location: ' + locationSummary(v));
    const fd = new FormData();
    fd.append('userType', USER_TYPE[str(v.who)] ?? 'Other');
    fd.append('name', str(v.name).trim());
    fd.append('email', str(v.email).trim());
    fd.append('category', CATEGORY_FOR[topic] ?? topic);
    fd.append('subject', topic);
    fd.append('description', lines.join('\n'));
    if (str(v.organisation).trim()) fd.append('organisation', str(v.organisation).trim());
    fd.append('channel', wantsPhone ? 'Phone' : 'Email');
    if (wantsPhone) fd.append('phone', str(v.phone).trim());
    if (fileRef.current) fd.append('attachment', fileRef.current);
    const r = await fetch(`${API}/api/v1/help/support`, { method: 'POST', body: fd });
    if (!r.ok) throw new Error(String(r.status));
    try { const j = (await r.json()) as { reference?: string }; setReference(j.reference ?? ''); } catch { /* no reference returned */ }
  }

  return (
    <Wizard steps={steps} initial={{ country: 'RW', countryName: 'Rwanda', urgency: 'normal', via: ['email'], addLocation: false }} onSubmit={onSubmit} formatError={() => 'We could not send your message. Please check your details and try again.'} submitLabel="Send message"
      done={<p role="status" className="rounded-2xl bg-green-tint p-5 font-semibold">Thank you. {hasBackend ? 'We will reply as you asked.' : 'No backend is connected in this build, so nothing was sent.'}{reference && <> Your reference number is <b>{reference}</b>. Please keep it.</>}</p>} />
  );
}
