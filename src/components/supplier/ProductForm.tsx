"use client";

import { useState } from "react";
import type { ChangeEvent, FormEvent, ReactNode } from "react";

const UNITS = [
  "kg", "tonne", "bag (50 kg)", "bag (100 kg)", "sack", "crate",
  "carton", "bunch", "piece", "dozen", "tray (30 eggs)", "litre",
];

type Values = {
  name: string;
  category: string;
  unit: string;
  price: string;
  quantity: string;
  minOrder: string;
  description: string;
};
type Errors = Partial<Record<keyof Values, string>>;

const EMPTY: Values = {
  name: "", category: "", unit: "kg", price: "", quantity: "", minOrder: "", description: "",
};

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-bold">{label}</label>
      {children}
      {error && <p role="alert" className="text-sm font-semibold text-red-dark">⚠ {error}</p>}
    </div>
  );
}

function validate(v: Values): Errors {
  const e: Errors = {};
  if (v.name.trim().length < 2) e.name = "Enter the product name.";
  if (!v.category.trim()) e.category = "Enter a category.";
  const price = Number(v.price);
  if (!v.price || !Number.isFinite(price) || price <= 0) e.price = "Enter a price above 0 (RWF).";
  const qty = Number(v.quantity);
  if (v.quantity !== "" && (!Number.isFinite(qty) || qty < 0)) e.quantity = "Stock cannot be negative.";
  const min = Number(v.minOrder);
  if (v.minOrder !== "" && (!Number.isFinite(min) || min <= 0)) e.minOrder = "Minimum order must be above 0.";
  return e;
}

export function ProductForm() {
  const [v, setV] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState("");

  const bind =
    (k: keyof Values) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setV((p) => ({ ...p, [k]: e.target.value }));

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const found = validate(v);
    setErrors(found);
    setStatus(
      Object.keys(found).length
        ? ""
        : "Details look valid. Saving to the backend is not connected yet, so nothing was stored."
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="max-w-2xl space-y-5 rounded-2xl border border-ink/10 bg-white p-6 shadow-card">
      <Field id="pf-name" label="Product name" error={errors.name}>
        <input id="pf-name" className="field" value={v.name} onChange={bind("name")} />
      </Field>
      <Field id="pf-category" label="Category" error={errors.category}>
        <input id="pf-category" className="field" value={v.category} onChange={bind("category")} />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="pf-price" label="Price (RWF)" error={errors.price}>
          <input id="pf-price" className="field" inputMode="numeric" value={v.price} onChange={bind("price")} />
        </Field>
        <Field id="pf-unit" label="Unit">
          <select id="pf-unit" className="field" value={v.unit} onChange={bind("unit")}>
            {UNITS.map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
        </Field>
        <Field id="pf-qty" label="Stock available" error={errors.quantity}>
          <input id="pf-qty" className="field" inputMode="numeric" value={v.quantity} onChange={bind("quantity")} />
        </Field>
        <Field id="pf-min" label="Minimum order" error={errors.minOrder}>
          <input id="pf-min" className="field" inputMode="numeric" value={v.minOrder} onChange={bind("minOrder")} />
        </Field>
      </div>
      <Field id="pf-desc" label="Description">
        <textarea id="pf-desc" className="field min-h-28" value={v.description} onChange={bind("description")} />
      </Field>
      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" className="inline-flex min-h-12 items-center rounded-full bg-teal px-6 font-bold text-cream hover:bg-teal-dark">
          Save product
        </button>
        <button type="button" onClick={() => { setV(EMPTY); setErrors({}); setStatus(""); }} className="min-h-12 rounded-full px-5 font-bold text-teal hover:bg-teal-tint">
          Reset
        </button>
      </div>
      {status && <p role="status" className="rounded-xl bg-gold-tint px-4 py-3 text-sm font-semibold">{status}</p>}
    </form>
  );
}
