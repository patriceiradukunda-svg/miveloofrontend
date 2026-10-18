"use client";
import Link from 'next/link';
import { Wizard, useWiz, type Errors, type Step, type Values } from '@/components/forms/wizard/Wizard';
import { Choice, Select, Text } from '@/components/forms/wizard/fields';
import { LocationFields, locationSummary, validateLocation } from '@/components/forms/wizard/LocationFields';
import { ReviewRows } from '@/components/forms/wizard/ReviewRows';
import { plans, STATUS_LABEL } from '@/config/plans';
import { flags } from '@/config/feature-flags';
import { api, hasBackend } from '@/lib/api-client';
import { friendlyError } from '@/lib/errors';

const str = (x: unknown) => (typeof x === 'string' ? x : '');
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
/** Payments stay closed until the feature flag says they are live. */
const LIVE = (flags.payments as string) === 'available';
const METHODS = [{ value: 'mobile-money', title: 'Mobile money', desc: 'Pay from your phone wallet' }, { value: 'card', title: 'Bank card' }, { value: 'bank-transfer', title: 'Bank transfer' }];
const PURPOSES = ['Order payment', 'Invoice', 'Cooperative contribution', 'Other'].map((x) => ({ value: x, label: x }));

const Notice = () => <p className="rounded-xl bg-teal-tint p-3 text-sm">{LIVE ? 'You will pay on our payment provider’s secure page. Miveloo never asks for card or wallet details in this app.' : 'Payments are not open yet. Sending this registers your interest, and we will contact you. Miveloo never asks for card or wallet details in this app.'}</p>;

function PlanStep() {
  const { v } = useWiz(); const p = plans.find((x) => x.id === str(v.plan));
  return (<>
    <Notice />
    <Choice name="plan" label="Which service are you interested in?" required options={plans.filter((x) => x.id !== 'free').map((x) => ({ value: x.id, title: x.name, desc: `${x.price} · for ${x.audience}` }))} />
    {p && <div className="rounded-2xl border border-ink/10 bg-cream/60 p-4"><p className="font-bold">What it covers</p>
      <ul className="mt-2 space-y-2">{p.features.map((f) => <li key={f.id} className="flex flex-wrap items-center justify-between gap-2 text-sm"><span>{f.label}</span><span className="rounded-full bg-ink/10 px-2 py-0.5 text-xs font-bold">{STATUS_LABEL[f.status]}</span></li>)}</ul>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-ink-soft">{p.limits.map((l) => <li key={l}>{l}</li>)}</ul></div>}
  </>);
}
const Payer = ({ billing }: { billing: boolean }) => (<>
  <Text name="payerName" label={billing ? 'Billing contact' : 'Your name'} required autoComplete="name" />
  <Text name="organisation" label="Organisation" required={billing} autoComplete="organization" />
  <div className="grid gap-5 sm:grid-cols-2"><Text name="email" label="Email" type="email" required autoComplete="email" inputMode="email" /><Text name="phone" label="Phone" type="tel" required autoComplete="tel" inputMode="tel" /></div>
  {billing && <><Text name="tin" label="Tax identification number, TIN (optional)" inputMode="numeric" /><p className="text-sm font-bold">Billing address</p><LocationFields /></>}
</>);
const MethodStep = () => <><Notice /><Choice name="method" label="How would you like to pay?" required options={METHODS} /><p className="text-sm text-ink-soft">This is only your preference. The provider shows the options it supports.</p></>;
const payerErrors = (v: Values, billing: boolean): Errors => { const e: Errors = {}; if (str(v.payerName).trim().length < 2) e.payerName = 'Enter a name.'; if (billing && str(v.organisation).trim().length < 2) e.organisation = 'Enter the organisation.'; if (!EMAIL.test(str(v.email).trim())) e.email = 'Enter a valid email address.'; if (str(v.phone).replace(/\D/g, '').length < 9) e.phone = 'Enter a valid phone number.'; return billing ? { ...e, ...validateLocation(v) } : e; };

async function send(path: string, body: unknown) {
  if (!hasBackend) return;
  if (!LIVE) { await api('/billing/interest', { method: 'POST', body: JSON.stringify(body) }); return; }
  const r = await api<{ checkoutUrl?: string }>(path, { method: 'POST', body: JSON.stringify(body) });
  if (!r?.checkoutUrl) throw new Error('We could not start the payment. Please try again.');
  window.location.assign(r.checkoutUrl);
}
const done = (what: string) => (
  <div role="status" className="rounded-2xl bg-green-tint p-6"><h2 className="text-2xl font-semibold">{!hasBackend ? 'Demo only' : LIVE ? 'Taking you to the payment page…' : 'Thank you, we have your interest'}</h2>
    <p className="mt-2">{!hasBackend ? 'Nothing was sent because the backend is not connected.' : LIVE ? 'If nothing happens, check your connection and try again.' : `Paid services are not available yet. We will contact you about ${what} when they are.`}</p>
    <Link className="mt-3 inline-block font-bold underline" href="/app/billing">Back to billing</Link></div>
);

/** Choose an advanced service or institutional plan. Registers interest until payments are live. */
export function SubscriptionWizard() {
  const steps: Step[] = [
    { id: 'plan', title: 'Choose a service', content: <PlanStep />, validate: (v: Values): Errors => (str(v.plan) ? {} : { plan: 'Choose a service.' }) },
    { id: 'billing', title: 'Billing details', hint: 'Who should we contact, and where is your organisation?', content: <Payer billing />, validate: (v: Values) => payerErrors(v, true) },
    { id: 'method', title: 'Payment preference', content: <MethodStep />, validate: (v: Values): Errors => (str(v.method) ? {} : { method: 'Choose one.' }) },
    { id: 'review', title: 'Review and confirm', content: <SubReview /> },
  ];
  const body = (v: Values) => ({ kind: 'subscription', plan: str(v.plan), billing: { name: str(v.payerName), organisation: str(v.organisation), email: str(v.email), phone: str(v.phone), tin: str(v.tin), country: str(v.country) || 'RW', province: str(v.provinceName), district: str(v.districtName) || str(v.city), sector: str(v.sectorName), cell: str(v.cellName), village: str(v.villageName) }, preferredMethod: str(v.method) });
  return <Wizard steps={steps} initial={{ country: 'RW', countryName: 'Rwanda' }} onSubmit={(v) => send('/billing/checkout', body(v))} formatError={friendlyError} submitLabel={LIVE ? 'Continue to payment' : 'Register interest'} done={done('this service')} />;
}
function SubReview() {
  const { v } = useWiz();
  return <><Notice /><ReviewRows rows={[['Service', plans.find((p) => p.id === str(v.plan))?.name ?? '', 0], ['Billing contact', `${str(v.payerName)}, ${str(v.organisation)}`, 1], ['Email and phone', `${str(v.email)}, ${str(v.phone)}`, 1], ['Billing address', locationSummary(v), 1], ['Payment preference', METHODS.find((m) => m.value === str(v.method))?.title ?? '', 2]]} /></>;
}

/** One-off payment (order, invoice, contribution). Amount in RWF; the provider handles the actual payment. */
export function PaymentWizard({ reference = '' }: { reference?: string }) {
  const steps: Step[] = [
    { id: 'amount', title: 'What are you paying for?', content: <><Notice /><Select name="purpose" label="Purpose" required options={PURPOSES} placeholder="Choose a purpose" /><Text name="amount" label="Amount in RWF" required inputMode="numeric" /><Text name="reference" label="Order or invoice reference (optional)" /></>,
      validate: (v: Values) => { const e: Errors = {}; if (!str(v.purpose)) e.purpose = 'Choose a purpose.'; const n = Number(str(v.amount).replace(/,/g, '')); if (!Number.isFinite(n) || n < 1 || !Number.isInteger(n)) e.amount = 'Enter a whole amount in RWF.'; return e; } },
    { id: 'payer', title: 'Who is paying?', content: <Payer billing={false} />, validate: (v: Values) => payerErrors(v, false) },
    { id: 'method', title: 'Payment preference', content: <MethodStep />, validate: (v: Values): Errors => (str(v.method) ? {} : { method: 'Choose one.' }) },
    { id: 'review', title: 'Review and confirm', content: <PayReview /> },
  ];
  const body = (v: Values) => ({ kind: 'payment', purpose: str(v.purpose), amountRWF: Number(str(v.amount).replace(/,/g, '')), reference: str(v.reference), payer: { name: str(v.payerName), organisation: str(v.organisation), email: str(v.email), phone: str(v.phone) }, preferredMethod: str(v.method) });
  return <Wizard steps={steps} initial={{ reference }} onSubmit={(v) => send('/billing/checkout', body(v))} formatError={friendlyError} submitLabel={LIVE ? 'Continue to payment' : 'Register interest'} done={done('payments')} />;
}
function PayReview() {
  const { v } = useWiz();
  return <><Notice /><ReviewRows rows={[['Purpose', str(v.purpose), 0], ['Amount', `${Number(str(v.amount).replace(/,/g, '')).toLocaleString('en-RW')} RWF`, 0], ['Reference', str(v.reference), 0], ['Payer', `${str(v.payerName)}${str(v.organisation) ? `, ${str(v.organisation)}` : ''}`, 1], ['Email and phone', `${str(v.email)}, ${str(v.phone)}`, 1], ['Payment preference', METHODS.find((m) => m.value === str(v.method))?.title ?? '', 2]]} /></>;
}
