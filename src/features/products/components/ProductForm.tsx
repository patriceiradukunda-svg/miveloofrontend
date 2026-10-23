/* eslint-disable @next/next/no-img-element -- upload previews use temporary browser URLs */
"use client";
import { useEffect, useState } from 'react';

import { FormField } from '@/components/forms/FormField';

import { FormError } from '@/components/forms/FormError';

import { Button } from '@/components/ui/button';

import { useToast } from '@/components/ui/toast';

import { CATEGORY_LABEL } from '@/config/product-categories';

import { productSchema } from '../schemas/product.schema';

import { fieldErrors } from '@/features/auth/schemas/auth.schema';

import { friendlyError } from '@/lib/errors';

import { liveApi, searchFoods, type Food } from '@/lib/miveloo-client';

import { saveListingAction } from '../actions';


/** Live mode (NEXT_PUBLIC_API_URL set): saves to the Miveloo backend database, photos included. `defaults.listingId` switches to edit mode. */
export function ProductForm({ defaults = {} }: { defaults?: Record<string, string> }) {
  const [errors, setErrors] = useState<Record<string, string>>({}); const [busy, setBusy] = useState(false); const [formErr, setFormErr] = useState<string>(); const toast = useToast();
  const [foodQ, setFoodQ] = useState(''); const [foods, setFoods] = useState<Food[]>([]); const [foodId, setFoodId] = useState(defaults.foodId ?? ''); const [previews, setPreviews] = useState<string[]>([]);
  const editing = Boolean(defaults.listingId);

  useEffect(() => {
    if (!liveApi || editing || foodQ.trim().length < 2) { setFoods([]); return; }
    let off = false; const t = setTimeout(() => { searchFoods({ q: foodQ.trim(), limit: 12 }).then((r) => { if (!off) setFoods(r.items); }).catch(() => { if (!off) setFoods([]); }); }, 250);
    return () => { off = true; clearTimeout(t); };
  }, [foodQ, editing]);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); if (busy) return;
    const form = e.currentTarget; const fd = new FormData(form);
    const r = productSchema.safeParse(Object.fromEntries([...fd.entries()].filter(([, v]) => typeof v === 'string')));
    if (!r.success) { setErrors(fieldErrors(r.error)); setFormErr('Please fix the highlighted fields.'); return; }
    setErrors({}); setFormErr(undefined); setBusy(true);
    try {
      if (liveApi) {
        const out = new FormData();
        out.set('listingId', defaults.listingId ?? ''); out.set('foodId', foodId); out.set('title', String(fd.get('name') ?? ''));
        out.set('unit', String(fd.get('unit') ?? '')); out.set('price', String(fd.get('price') ?? '')); out.set('minOrder', String(fd.get('minOrder') ?? '')); out.set('quantity', String(fd.get('quantity') ?? ''));
        if (editing) out.set('keepImageIds', defaults.imageIds ?? '');
        fd.getAll('photos').forEach((f) => { if (typeof f !== 'string' && f.size > 0) out.append('photos', f); });
        const res = await saveListingAction(out);
        if (!res.ok) { setFormErr(res.error); return; }
        toast(res.status === 'pending_approval' ? `Saved${res.photos ? ` with ${res.photos} photo(s)` : ''}. It goes live after Miveloo approves it.` : `Saved${res.photos ? ` with ${res.photos} photo(s)` : ''}.`);
      } else {
        setFormErr('Listing submission is unavailable because the live listing service is not configured.');
      }
    } catch (err) { setFormErr(friendlyError(err)); } finally { setBusy(false); }
  }
  const d = (k: string) => defaults[k] ?? '';
  return (
    <form onSubmit={submit} noValidate className="max-w-xl space-y-4"><FormError message={formErr} />
      {liveApi && !editing && (
        <div className="space-y-2">
          <label className="block text-sm font-bold">Catalogue food (what you are selling)
            <input className="field mt-1" type="search" value={foodQ} onChange={(e) => setFoodQ(e.target.value)} placeholder="Type e.g. beans, maize flour, tomato…" />
          </label>
          {foods.length > 0 && <ul className="max-h-48 overflow-auto rounded-xl border border-ink/10 bg-white">{foods.map((f) => (
            <li key={f.id}><button type="button" className={`w-full px-3 py-2 text-left text-sm hover:bg-ink/5 ${foodId === f.id ? 'font-bold' : ''}`} onClick={() => { setFoodId(f.id); setFoodQ(f.name); setFoods([]); }}>{f.name}{f.name_rw ? ` (${f.name_rw})` : ''} <span className="text-ink-soft">· {f.category}</span></button></li>))}</ul>}
          <p className="text-xs text-ink-soft">{foodId ? 'Catalogue food selected.' : 'Pick a food from the list so buyers and forecasts can find it.'}</p>
        </div>
      )}
      <FormField label="Product name" error={errors.name} required>{(p) => <input {...p} name="name" defaultValue={d('name')} />}</FormField>
      <FormField label="Category" error={errors.category} required>{(p) => <select {...p} name="category" defaultValue={d('category')}><option value="">Choose…</option>{Object.entries(CATEGORY_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>}</FormField>
      <FormField label="Description" error={errors.description} hint="Verified schools see only what you write here." required>{(p) => <textarea {...p} name="description" rows={4} defaultValue={d('description')} />}</FormField>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Unit" error={errors.unit} hint="kg, litre, piece, bunch, tray…" required>{(p) => <input {...p} name="unit" defaultValue={d('unit')} />}</FormField>
        <FormField label="Available quantity" error={errors.quantity} hint="Only confirmed stock." required>{(p) => <input {...p} name="quantity" inputMode="numeric" defaultValue={d('quantity')} />}</FormField>
        <FormField label="Price per unit (RWF)" error={errors.price} hint="Optional. Shown as indicative.">{(p) => <input {...p} name="price" inputMode="numeric" defaultValue={d('price')} />}</FormField>
        <FormField label="Minimum order" error={errors.minOrder}>{(p) => <input {...p} name="minOrder" inputMode="numeric" defaultValue={d('minOrder')} />}</FormField>
      </div>
      <FormField label="General location (district)" error={errors.district} required>{(p) => <input {...p} name="district" defaultValue={d('district')} />}</FormField>
      {liveApi && (
        <div>
          <label className="block text-sm font-bold">Photos (JPEG, PNG or WebP, up to 1.5 MB each)
            <input className="field mt-1" type="file" name="photos" accept="image/jpeg,image/png,image/webp" multiple
              onChange={(e) => setPreviews(Array.from((e.target.files ?? []) as ArrayLike<File>).map((f) => URL.createObjectURL(f)))} />
          </label>
          {previews.length > 0 && <ul className="mt-2 flex flex-wrap gap-2">{previews.map((u) => (<li key={u}><img src={u} alt="Selected photo preview" className="h-20 w-20 rounded-xl object-cover" /></li>))}</ul>}
        </div>
      )}
      <Button type="submit" disabled={busy}>{busy ? 'Saving…' : editing ? 'Save changes' : 'Save draft'}</Button>
    </form>
  );
}
