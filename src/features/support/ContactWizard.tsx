"use client";
import { Wizard, useWiz, type Errors, type Step, type Values } from '@/components/forms/wizard/Wizard';
import { Area, Check, Choice, Chips, Select, Text } from '@/components/forms/wizard/fields';
import { LocationFields, locationSummary, validateLocation } from '@/components/forms/wizard/LocationFields';
import { ReviewRows } from '@/components/forms/wizard/ReviewRows';
import { api, hasBackend } from '@/lib/api-client';

const str = (x: unknown) => (typeof x === 'string' ? x : '');
const arr = (x: unknown) => (Array.isArray(x) ? (x as string[]) : []);
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const TOPICS = ['Registering an account', 'Selling on Miveloo', 'Buying for a school', 'Verification', 'Orders and deliveries', 'Partnership or programme', 'A technical problem', 'Something else'].map((x) => ({ value: x, label: x }));
const WHO = [{ value: 'school', title: 'School' }, { value: 'supplier', title: 'Supplier or farmer' }, { value: 'cooperative', title: 'Cooperative or group' }, { value: 'institution', title: 'Institution or partner' }, { value: 'other', title: 'Someone else' }];

function Message() {
  const { v } = useWiz();
  return (<>
    <Select name="topic" label="What is it about?" required options={TOPICS} placeholder="Choose a topic" />
    <Choice name="urgency" label="How urgent is it?" options={[{ value: 'normal', title: 'Normal', desc: 'A reply within a few working days is fine' }, { value: 'urgent', title: 'Urgent', desc: 'It is blocking an order or a delivery' }]} />
    <Area name="message" label="How can we help?" required rows={5} hint="Include order numbers or product names if they help." />
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
function ReviewStep() {
  const { v } = useWiz();
  return <ReviewRows rows={[['Name', str(v.name), 0], ['Email', str(v.email), 0], ['I am', WHO.find((w) => w.value === str(v.who))?.title ?? '', 0], ['Organisation', str(v.organisation), 0], ['Topic', str(v.topic), 1], ['Urgency', str(v.urgency) === 'urgent' ? 'Urgent' : 'Normal', 1], ['Message', str(v.message), 1], ['Reply by', arr(v.via).join(' and ') || 'Email', 1], ['Location', v.addLocation === true ? locationSummary(v) : 'Not added', 2]]} />;
}

export function ContactWizard() {
  const steps: Step[] = [
    { id: 'you', title: 'About you', content: <><Text name="name" label="Your name" required autoComplete="name" /><Text name="email" label="Email" type="email" required autoComplete="email" inputMode="email" /><Choice name="who" label="Who are you writing as?" required options={WHO} /><Text name="organisation" label="Organisation (optional)" autoComplete="organization" /></>,
      validate: (v: Values) => { const e: Errors = {}; if (str(v.name).trim().length < 2) e.name = 'Enter your name.'; if (!EMAIL.test(str(v.email).trim())) e.email = 'Enter a valid email address.'; if (!str(v.who)) e.who = 'Choose one.'; return e; } },
    { id: 'message', title: 'Your message', content: <Message />,
      validate: (v: Values) => { const e: Errors = {}; if (!str(v.topic)) e.topic = 'Choose a topic.'; if (str(v.message).trim().length < 15) e.message = 'Tell us a little more (at least 15 characters).'; if (arr(v.via).includes('phone') && str(v.phone).replace(/\D/g, '').length < 9) e.phone = 'Enter a valid phone number.'; return e; } },
    { id: 'where', title: 'Where you are (optional)', content: <Where />, validate: (v: Values): Errors => (v.addLocation === true ? validateLocation(v) : {}) },
    { id: 'review', title: 'Review and send', content: <ReviewStep /> },
  ];
  async function onSubmit(v: Values) {
    const body = { name: str(v.name).trim(), email: str(v.email).trim(), message: str(v.message).trim(), phone: str(v.phone).trim(), role: str(v.who), organisation: str(v.organisation).trim(), topic: str(v.topic), urgency: str(v.urgency) || 'normal', replyVia: arr(v.via),
      location: v.addLocation === true ? { country: str(v.country) || 'RW', province: str(v.provinceName), district: str(v.districtName) || str(v.city), sector: str(v.sectorName), cell: str(v.cellName), village: str(v.villageName), latitude: str(v.lat) ? Number(v.lat) : undefined, longitude: str(v.lng) ? Number(v.lng) : undefined } : undefined };
    if (hasBackend) await api('/support/contact', { method: 'POST', body: JSON.stringify(body) });
  }
  return (
    <Wizard steps={steps} initial={{ country: 'RW', countryName: 'Rwanda', urgency: 'normal', via: ['email'], addLocation: false }} onSubmit={onSubmit} formatError={() => 'We could not send your message. Please try again.'} submitLabel="Send message"
      done={<p role="status" className="rounded-2xl bg-green-tint p-5 font-semibold">Thank you. {hasBackend ? 'We will reply as you asked.' : 'No backend is connected in this build, so nothing was sent.'}</p>} />
  );
}
