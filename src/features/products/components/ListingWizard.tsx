"use client";
import { useState } from 'react';
import Link from 'next/link';
import { Wizard, useWiz, type Errors, type Step, type Values } from '@/components/forms/wizard/Wizard';
import { Area, Check, Choice, Chips, Select, Text } from '@/components/forms/wizard/fields';
import { LocationFields, locationSummary, validateLocation } from '@/components/forms/wizard/LocationFields';
import { PhotoPicker } from '@/components/forms/wizard/PhotoPicker';
import { ReviewRows } from '@/components/forms/wizard/ReviewRows';
import { FOOD_CATALOG, ORIGINS, UNITS, categoryOptions, itemSuggestions, subOptions } from '@/config/food-catalog';
import { api, hasBackend } from '@/lib/api-client';
import { friendlyError } from '@/lib/errors';

const str = (x: unknown) => (typeof x === 'string' ? x : '');
const arr = (x: unknown) => (Array.isArray(x) ? (x as string[]) : []);
const pos = (x: unknown) => { const n = Number(str(x).replace(/,/g, '')); return Number.isFinite(n) && n > 0; };
const nonNeg = (x: unknown) => str(x).trim() === '' || (Number.isFinite(Number(str(x).replace(/,/g, ''))) && Number(str(x).replace(/,/g, '')) >= 0);
const originLabel = (v: string) => ORIGINS.find((o) => o.value === v)?.label ?? v;

function What() {
  const { v, setMany } = useWiz(); const cat = str(v.category); const sub = str(v.sub);
  return (<>
    <Select name="category" label="Food category" required options={categoryOptions} placeholder="Choose a category" onPick={(c) => setMany({ category: c, sub: '', product: '' })} />
    <Select name="sub" label="Type" required options={subOptions(cat)} disabled={!cat} placeholder={cat ? 'Choose a type' : 'Choose a category first'} />
    <Text name="product" label="Product name" required suggestions={itemSuggestions(cat, sub)} hint="Pick a suggestion or type your own." />
    <Text name="localName" label="Local name (optional)" hint="For example, the Kinyarwanda name." />
    <Choice name="origin" label="Where does it come from?" required options={ORIGINS.map((o) => ({ value: o.value, title: o.label }))} />
    <Choice name="form" label="Form" options={[{ value: 'fresh', title: 'Fresh' }, { value: 'dried', title: 'Dried' }, { value: 'processed', title: 'Processed or packaged' }, { value: 'frozen', title: 'Frozen' }]} />
    <Area name="description" label="Description" required hint="Verified schools see only what you write here. Be honest and specific." />
  </>);
}
function Supply() {
  const { v } = useWiz(); const later = str(v.availability) && str(v.availability) !== 'now';
  return (<>
    <div className="grid gap-5 sm:grid-cols-2">
      <Select name="unit" label="Unit" required options={UNITS.map((u) => ({ value: u, label: u }))} placeholder="Choose a unit" />
      <Text name="quantity" label="Available quantity" required inputMode="numeric" hint="Only confirmed stock." />
      <Text name="minOrder" label="Minimum order (optional)" inputMode="numeric" />
      <Text name="price" label="Price per unit, RWF (optional)" inputMode="numeric" hint="Shown to schools as indicative." />
    </div>
    <Check name="negotiable">The price can be negotiated.</Check>
    <Choice name="availability" label="When is it available?" required options={[{ value: 'now', title: 'In stock now' }, { value: 'harvest', title: 'Harvest expected', desc: 'Not yet picked' }, { value: 'seasonal', title: 'Seasonal', desc: 'Available in certain months' }]} />
    {later && <Text name="availableFrom" label="Available from" type="date" required />}
    <Choice name="frequency" label="How often can you supply?" options={[{ value: 'once', title: 'One-off' }, { value: 'weekly', title: 'Weekly' }, { value: 'monthly', title: 'Monthly' }, { value: 'seasonal', title: 'Each season' }]} />
  </>);
}
const QUALITY = ['Freshly harvested', 'Sorted and graded', 'Washed', 'Packed for transport', 'Organic', 'Certified'].map((x) => ({ value: x, label: x }));
function Quality() {
  const { v } = useWiz();
  return (<>
    <p className="rounded-xl bg-gold-tint p-3 text-sm">These are your own statements. Miveloo does not verify them, and schools will see them as supplier-declared.</p>
    <Chips name="quality" label="What applies to this product?" options={QUALITY} />
    {arr(v.quality).includes('Certified') && <Text name="certificate" label="Certificate or mark number" required />}
    <Text name="packaging" label="Packaging" hint="For example: 50 kg sacks, crates, bunches." />
    <Text name="shelfLife" label="Shelf life in days (optional)" inputMode="numeric" />
    <Area name="handling" label="Storage and handling notes (optional)" rows={3} />
  </>);
}
function Delivery() {
  const { v } = useWiz(); const deliver = arr(v.fulfil).includes('deliver');
  return (<>
    <p className="text-sm text-ink-soft">Where is the product collected from? Schools see only a general area.</p>
    <LocationFields />
    <Chips name="fulfil" label="How can buyers get it?" options={[{ value: 'pickup', label: 'Buyer collects' }, { value: 'deliver', label: 'I can deliver' }]} />
    {deliver && <Text name="radius" label="Delivery distance you cover, in km" inputMode="numeric" />}
    <Text name="leadTime" label="Days needed to prepare an order" inputMode="numeric" />
  </>);
}

export function ListingWizard() {
  const [photos, setPhotos] = useState<File[]>([]); const [photoErr, setPhotoErr] = useState<string>();
  const steps: Step[] = [
    { id: 'what', summary: (v: Values) => `${str(v.product)} · ${str(v.sub)}`, title: 'What you sell', hint: 'Start with the product.', content: <What />,
      validate: (v: Values) => { const e: Errors = {}; if (!str(v.category)) e.category = 'Choose a category.'; if (!str(v.sub)) e.sub = 'Choose a type.'; if (str(v.product).trim().length < 2) e.product = 'Enter the product name.'; if (!str(v.origin)) e.origin = 'Choose where it comes from.'; if (str(v.description).trim().length < 20) e.description = 'Describe the product in at least 20 characters.'; return e; } },
    { id: 'supply', summary: (v: Values) => `${str(v.quantity)} ${str(v.unit)}`, title: 'Quantity and price', content: <Supply />,
      validate: (v: Values) => { const e: Errors = {}; if (!str(v.unit)) e.unit = 'Choose a unit.'; if (!pos(v.quantity)) e.quantity = 'Enter the quantity you have.'; if (!nonNeg(v.minOrder)) e.minOrder = 'Enter a number.'; if (!nonNeg(v.price)) e.price = 'Enter a price in RWF.'; if (!str(v.availability)) e.availability = 'Tell us when it is available.'; if (str(v.availability) && str(v.availability) !== 'now' && !str(v.availableFrom)) e.availableFrom = 'Choose a date.'; return e; } },
    { id: 'quality', summary: (v: Values) => arr(v.quality).join(', ') || 'Nothing declared', title: 'Quality and handling', content: <Quality />,
      validate: (v: Values): Errors => (arr(v.quality).includes('Certified') && !str(v.certificate).trim() ? { certificate: 'Enter the certificate or mark number.' } : {}) },
    { id: 'photos', summary: () => `${photos.length} photo${photos.length === 1 ? '' : 's'}`, title: 'Photos', hint: 'Clear photos of the real product help schools decide. Up to 6.', content: <PhotoPicker files={photos} onChange={(f) => { setPhotos(f); setPhotoErr(undefined); }} error={photoErr} />,
      validate: (): Errors => { if (photos.length === 0) { setPhotoErr('Add at least one photo.'); return { photos: 'Add at least one photo.' }; } return {}; } },
    { id: 'delivery', summary: (v: Values) => locationSummary(v), title: 'Pickup and delivery', content: <Delivery />,
      validate: (v: Values) => { const e = validateLocation(v); if (arr(v.fulfil).length === 0) e.fulfil = 'Choose at least one option.'; return e; } },
    { id: 'review', title: 'Review and save', hint: 'You can still change anything. The listing is saved as a draft first.', content: <ReviewStep photos={photos.length} /> },
  ];
  async function onSubmit(v: Values) {
    const data = { category: str(v.category), subcategory: str(v.sub), name: str(v.product).trim(), localName: str(v.localName).trim(), origin: str(v.origin), form: str(v.form), description: str(v.description).trim(),
      unit: str(v.unit), quantity: Number(str(v.quantity).replace(/,/g, '')), minOrder: str(v.minOrder) ? Number(str(v.minOrder)) : undefined, price: str(v.price) ? Number(str(v.price).replace(/,/g, '')) : undefined, negotiable: v.negotiable === true,
      availability: str(v.availability), availableFrom: str(v.availableFrom), frequency: str(v.frequency), quality: arr(v.quality), certificate: str(v.certificate), packaging: str(v.packaging), shelfLifeDays: str(v.shelfLife) ? Number(v.shelfLife) : undefined, handling: str(v.handling),
      location: { country: str(v.country) || 'RW', province: str(v.provinceName), district: str(v.districtName) || str(v.city), sector: str(v.sectorName), cell: str(v.cellName), village: str(v.villageName), latitude: str(v.lat) ? Number(v.lat) : undefined, longitude: str(v.lng) ? Number(v.lng) : undefined },
      fulfil: arr(v.fulfil), deliveryRadiusKm: str(v.radius) ? Number(v.radius) : undefined, leadTimeDays: str(v.leadTime) ? Number(v.leadTime) : undefined, status: 'draft' };
    if (!hasBackend) return;
    const fd = new FormData(); fd.append('data', JSON.stringify(data)); photos.forEach((f) => fd.append('photos', f));
    await api('/supplier/products', { method: 'POST', body: fd });
  }
  return (
    <Wizard variant="split" steps={steps} initial={{ country: 'RW', countryName: 'Rwanda', negotiable: false, quality: [], fulfil: [] }} onSubmit={onSubmit} formatError={friendlyError} submitLabel="Save draft"
      done={<div role="status" className="rounded-2xl bg-green-tint p-6"><h2 className="text-2xl font-semibold">{hasBackend ? 'Saved as a draft' : 'Demo only'}</h2><p className="mt-2">{hasBackend ? 'Publish it from your products list when you are ready.' : 'Nothing was saved because the backend is not connected.'}</p><Link className="mt-3 inline-block font-bold underline" href="/supplier/products">Back to my products</Link></div>} />
  );
}
function ReviewStep({ photos }: { photos: number }) {
  const { v } = useWiz(); const cat = FOOD_CATALOG.find((c) => c.id === str(v.category))?.label ?? '';
  return <ReviewRows rows={[['Product', `${str(v.product)}${str(v.localName) ? ` (${str(v.localName)})` : ''}`, 0], ['Category', `${cat} › ${str(v.sub)}`, 0], ['Origin', originLabel(str(v.origin)), 0],
    ['Quantity', `${str(v.quantity)} ${str(v.unit)}${str(v.minOrder) ? `, minimum ${str(v.minOrder)}` : ''}`, 1], ['Price', str(v.price) ? `${str(v.price)} RWF per ${str(v.unit)}${v.negotiable === true ? ' (negotiable)' : ''}` : 'Not shown', 1], ['Availability', str(v.availability) === 'now' ? 'In stock now' : `${str(v.availability)} from ${str(v.availableFrom)}`, 1],
    ['Quality', arr(v.quality).join(', '), 2], ['Photos', `${photos} added`, 3], ['Collected from', locationSummary(v), 4], ['Buyers get it by', arr(v.fulfil).map((x) => (x === 'deliver' ? 'Delivery' : 'Collection')).join(' and '), 4]]} />;
}
