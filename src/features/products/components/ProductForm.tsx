"use client";
import { useState } from 'react';
import { FormField } from '@/components/forms/FormField';
import { FormError } from '@/components/forms/FormError';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import { CATEGORY_LABEL } from '@/lib/sample-data';
import { productSchema } from '../schemas/product.schema';
import { fieldErrors } from '@/features/auth/schemas/auth.schema';
import { api, hasBackend } from '@/lib/api-client';
import { friendlyError } from '@/lib/errors';

export function ProductForm({ defaults = {} }: { defaults?: Record<string, string> }) {
  const [errors, setErrors] = useState<Record<string, string>>({}); const [busy, setBusy] = useState(false); const [formErr, setFormErr] = useState<string>(); const toast = useToast();
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); if (busy) return;
    const r = productSchema.safeParse(Object.fromEntries(new FormData(e.currentTarget)));
    if (!r.success) { setErrors(fieldErrors(r.error)); setFormErr('Please fix the highlighted fields.'); return; }
    setErrors({}); setFormErr(undefined); setBusy(true);
    try { if (hasBackend) await api('/supplier/products', { method: 'POST', body: JSON.stringify(r.data) }); toast(hasBackend ? 'Saved as draft. Publish when ready.' : 'Demo only: nothing was saved.'); }
    catch (err) { setFormErr(friendlyError(err)); } finally { setBusy(false); }
  }
  const d = (k: string) => defaults[k] ?? '';
  return (
    <form onSubmit={submit} noValidate className="max-w-xl space-y-4"><FormError message={formErr} />
      <FormField label="Product name" error={errors.name} required>{(p) => <input {...p} name="name" defaultValue={d('name')} />}</FormField>
      <FormField label="Category" error={errors.category} required>{(p) => <select {...p} name="category" defaultValue={d('category')}><option value="">Choose…</option>{Object.entries(CATEGORY_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>}</FormField>
      <FormField label="Description" error={errors.description} hint="Verified schools see only what you write here." required>{(p) => <textarea {...p} name="description" rows={4} defaultValue={d('description')} />}</FormField>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Unit" error={errors.unit} hint="kg, litre, bunch…" required>{(p) => <input {...p} name="unit" defaultValue={d('unit')} />}</FormField>
        <FormField label="Available quantity" error={errors.quantity} hint="Only confirmed stock." required>{(p) => <input {...p} name="quantity" inputMode="numeric" defaultValue={d('quantity')} />}</FormField>
        <FormField label="Price per unit (RWF)" error={errors.price} hint="Optional. Shown as indicative.">{(p) => <input {...p} name="price" inputMode="numeric" defaultValue={d('price')} />}</FormField>
        <FormField label="Minimum order" error={errors.minOrder}>{(p) => <input {...p} name="minOrder" inputMode="numeric" defaultValue={d('minOrder')} />}</FormField>
      </div>
      <FormField label="General location (district)" error={errors.district} required>{(p) => <input {...p} name="district" defaultValue={d('district')} />}</FormField>
      <Button type="submit" disabled={busy}>{busy ? 'Saving…' : 'Save draft'}</Button>
    </form>
  );
}
