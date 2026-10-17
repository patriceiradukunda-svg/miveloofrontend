"use client";
import Link from 'next/link';
import { Wizard, useWiz, type Errors, type Step, type Values } from '@/components/forms/wizard/Wizard';
import { Area, Check, Choice, Chips, Select, Text } from '@/components/forms/wizard/fields';
import { LocationFields, locationSummary, validateLocation } from '@/components/forms/wizard/LocationFields';
import { ReviewRows } from '@/components/forms/wizard/ReviewRows';
import { FOOD_CATALOG, ORIGINS, UNITS, categoryOptions, itemSuggestions, subOptions } from '@/config/food-catalog';
import { api, hasBackend } from '@/lib/api-client';
import { friendlyError } from '@/lib/errors';

const str = (x: unknown) => (typeof x === 'string' ? x : '');
const arr = (x: unknown) => (Array.isArray(x) ? (x as string[]) : []);
const num = (x: unknown) => Number(str(x).replace(/,/g, ''));
const FREQ = [{ value: 'once', title: 'One-off' }, { value: 'weekly', title: 'Every week' }, { value: 'biweekly', title: 'Every 2 weeks' }, { value: 'monthly', title: 'Every month' }, { value: 'term', title: 'Every school term' }];
const QUALITY = ['Fresh', 'Sorted and graded', 'Washed', 'Packed', 'Organic'].map((x) => ({ value: x, label: x }));
const EXPIRY = [{ value: '7', label: '7 days' }, { value: '14', label: '14 days' }, { value: '30', label: '30 days' }, { value: '90', label: '90 days' }];

function Need() {
  const { v, setMany } = useWiz(); const cat = str(v.category);
  return (<>
    <Select name="category" label="Food category" required options={categoryOptions} placeholder="Choose a category" onPick={(c) => setMany({ category: c, sub: '', product: '' })} />
    <Select name="sub" label="Type" required options={subOptions(cat)} disabled={!cat} placeholder={cat ? 'Choose a type' : 'Choose a category first'} />
    <Text name="product" label="What exactly do you need?" required suggestions={itemSuggestions(cat, str(v.sub))} hint="Pick a suggestion or type your own." />
    <Area name="specs" label="Anything specific? (optional)" rows={3} hint="Size, ripeness, variety, packaging." />
  </>);
}
function Amount() {
  const { v } = useWiz(); const once = str(v.frequency) === 'once';
  return (<>
    <div className="grid gap-5 sm:grid-cols-2"><Text name="quantity" label="Quantity needed" required inputMode="numeric" /><Select name="unit" label="Unit" required options={UNITS.map((u) => ({ value: u, label: u }))} placeholder="Choose a unit" /></div>
    <Choice name="frequency" label="How often?" required options={FREQ} />
    <Text name="needBy" label={once ? 'Needed by' : 'First delivery needed by'} type="date" required />
    {str(v.frequency) && !once && <Text name="weeks" label="For how many weeks? (optional)" inputMode="numeric" />}
  </>);
}
function Prefs() {
  return (<>
    <Chips name="origin" label="Where can it come from?" hint="Leave all unselected if any origin is fine." options={ORIGINS.map((o) => ({ value: o.value, label: o.label }))} />
    <Chips name="quality" label="Quality wishes" options={QUALITY} />
    <Text name="maxPrice" label="Highest price per unit you would pay, RWF (optional)" inputMode="numeric" />
    <Check name="substitutes">Similar products are acceptable if this one is not available.</Check>
  </>);
}
function Alerts() {
  const { v } = useWiz();
  return (<>
    <Select name="expiry" label="Keep this request open for" required options={EXPIRY} placeholder="Choose a period" />
    <Chips name="notifyOn" label="Tell me when" options={[{ value: 'listing', label: 'A matching product is listed' }, { value: 'price', label: 'A match is at or below my price' }, { value: 'restock', label: 'A matching product is back in stock' }]} />
    <fieldset className="rounded-2xl border border-ink/10 bg-cream/60 p-4"><legend className="px-1 text-sm font-bold">How we tell you</legend>
      <ul className="mt-1 space-y-2 text-sm"><li className="flex items-center gap-3"><input type="checkbox" checked readOnly aria-label="In-app notifications" className="h-5 w-5 accent-teal" />In-app notification (always on)</li>
        {['Email', 'SMS', 'WhatsApp'].map((c) => <li key={c} className="flex items-center gap-3 text-ink-soft"><input type="checkbox" disabled aria-label={`${c} (planned)`} className="h-5 w-5" />{c} <span className="rounded-full bg-ink/10 px-2 py-0.5 text-xs font-bold">planned</span></li>)}</ul></fieldset>
    {arr(v.notifyOn).length === 0 && <p className="text-sm text-ink-soft">With nothing selected, your request is saved but you will not be told about matches.</p>}
  </>);
}

export function RequestWizard({ matchAlerts = false }: { matchAlerts?: boolean }) {
  const steps: Step[] = [
    { id: 'need', title: 'What you need', content: <Need />, validate: (v: Values) => { const e: Errors = {}; if (!str(v.category)) e.category = 'Choose a category.'; if (!str(v.sub)) e.sub = 'Choose a type.'; if (str(v.product).trim().length < 2) e.product = 'Tell us what you need.'; return e; } },
    { id: 'amount', title: 'How much and when', content: <Amount />, validate: (v: Values) => { const e: Errors = {}; if (!(num(v.quantity) > 0)) e.quantity = 'Enter the quantity.'; if (!str(v.unit)) e.unit = 'Choose a unit.'; if (!str(v.frequency)) e.frequency = 'Choose how often.'; if (!str(v.needBy)) e.needBy = 'Choose a date.'; else if (str(v.needBy) < new Date().toISOString().slice(0, 10)) e.needBy = 'Choose a date that is not in the past.'; return e; } },
    { id: 'prefs', title: 'Your preferences', content: <Prefs />, validate: (v: Values): Errors => (str(v.maxPrice).trim() && !(num(v.maxPrice) > 0) ? { maxPrice: 'Enter a price in RWF.' } : {}) },
    { id: 'where', title: 'Deliver to', hint: 'Where should the food arrive?', content: <><LocationFields /><Text name="contact" label="Contact person at delivery" autoComplete="name" /><Text name="contactPhone" label="Their phone number" type="tel" inputMode="tel" /></>, validate: (v: Values) => validateLocation(v) },
    { id: 'alerts', title: 'Alerts', hint: 'We keep your request on file and can tell you when a match appears.', content: <Alerts />, validate: (v: Values): Errors => (str(v.expiry) ? {} : { expiry: 'Choose how long to keep it open.' }) },
    { id: 'review', title: 'Review and send', content: <ReviewStep /> },
  ];
  async function onSubmit(v: Values) {
    const body = { category: str(v.category), subcategory: str(v.sub), product: str(v.product).trim(), specs: str(v.specs).trim(), quantity: num(v.quantity), unit: str(v.unit), frequency: str(v.frequency), needBy: str(v.needBy), weeks: str(v.weeks) ? num(v.weeks) : undefined,
      origins: arr(v.origin), quality: arr(v.quality), maxPriceRWF: str(v.maxPrice) ? num(v.maxPrice) : undefined, acceptSubstitutes: v.substitutes === true,
      deliverTo: { country: str(v.country) || 'RW', province: str(v.provinceName), district: str(v.districtName) || str(v.city), sector: str(v.sectorName), cell: str(v.cellName), village: str(v.villageName), latitude: str(v.lat) ? Number(v.lat) : undefined, longitude: str(v.lng) ? Number(v.lng) : undefined },
      contact: str(v.contact), contactPhone: str(v.contactPhone), expiresInDays: num(v.expiry), notifyOn: arr(v.notifyOn), channels: ['in-app'] };
    if (hasBackend) await api('/school/requests', { method: 'POST', body: JSON.stringify(body) });
  }
  return (
    <Wizard variant="split" steps={steps} initial={{ country: 'RW', countryName: 'Rwanda', origin: [], quality: [], notifyOn: ['listing'], substitutes: false }} onSubmit={onSubmit} formatError={friendlyError} submitLabel="Send request"
      done={<div role="status" className="rounded-2xl bg-green-tint p-6"><h2 className="text-2xl font-semibold">{hasBackend ? 'Request saved' : 'Demo only'}</h2>
        <p className="mt-2">{!hasBackend ? 'Nothing was saved because the backend is not connected.' : matchAlerts ? 'We will notify you in your notifications when a matching product is listed.' : 'Your request is on file. Automatic match alerts are not switched on yet; we will tell you here when they are.'}</p>
        <Link className="mt-3 inline-block font-bold underline" href="/app/notifications">Go to notifications</Link></div>} />
  );
}
function ReviewStep() {
  const { v } = useWiz(); const cat = FOOD_CATALOG.find((c) => c.id === str(v.category))?.label ?? '';
  return <ReviewRows rows={[['Need', `${str(v.product)} (${cat} › ${str(v.sub)})`, 0], ['Amount', `${str(v.quantity)} ${str(v.unit)}, ${FREQ.find((f) => f.value === str(v.frequency))?.title.toLowerCase() ?? ''}`, 1], ['Needed by', str(v.needBy), 1],
    ['Origin', arr(v.origin).length ? arr(v.origin).map((o) => ORIGINS.find((x) => x.value === o)?.label ?? o).join(', ') : 'Any', 2], ['Highest price', str(v.maxPrice) ? `${str(v.maxPrice)} RWF per ${str(v.unit)}` : 'Not set', 2],
    ['Deliver to', locationSummary(v), 3], ['Open for', `${str(v.expiry)} days`, 4], ['Alerts', arr(v.notifyOn).length ? 'In-app' : 'None', 4]]} />;
}
