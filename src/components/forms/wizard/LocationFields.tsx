'use client';
import { useEffect, useMemo, useState } from 'react';
import { useT } from '@/providers/LocaleProvider';
import { countryOptions } from '@/lib/countries';
import { loadDistrict, loadIndex, type AdminIndex, type Sector } from '@/lib/rw-admin';
import { Select, Text } from './fields';
import { useWiz, type Errors, type Values } from './Wizard';

const LEVELS = ['province', 'district', 'sector', 'cell', 'village'] as const;
type Level = (typeof LEVELS)[number];
const str = (x: unknown) => (typeof x === 'string' ? x : '');

/** Validation for the location step. Rwanda: all five admin levels. Elsewhere: city/town only (no province). */
export function validateLocation(v: Values, o: { coordsRequired?: boolean } = {}): Errors {
  const e: Errors = {}; const rw = (str(v.country) || 'RW') === 'RW';
  if (rw) { for (const k of LEVELS) if (!str(v[k])) e[k] = `Select your ${k}.`; }
  else if (!str(v.city).trim()) e.city = 'Enter your city or town.';
  const lat = str(v.lat).trim(), lng = str(v.lng).trim();
  if (lat || lng || o.coordsRequired) {
    const a = Number(lat), b = Number(lng);
    if (!lat || !lng || Number.isNaN(a) || Number.isNaN(b) || a < -90 || a > 90 || b < -180 || b > 180) e.lat = 'Enter valid coordinates, for example -1.9441 and 30.0619.';
    else if (rw && (a < -2.9 || a > -1 || b < 28.8 || b > 31)) e.lat = 'These coordinates are outside Rwanda. Check them, or use your current location.';
  }
  return e;
}
/** One-line readable location, for review screens. */
export function locationSummary(v: Values): string {
  if ((str(v.country) || 'RW') === 'RW') return [v.villageName, v.cellName, v.sectorName, v.districtName, v.provinceName, 'Rwanda'].map(str).filter(Boolean).join(', ');
  return [v.address, v.city, v.countryName].map(str).filter(Boolean).join(', ');
}

export function LocationFields({ coordsRequired = false }: { coordsRequired?: boolean }) {
  const { v, setMany } = useWiz(); const { locale } = useT();
  const country = str(v.country) || 'RW'; const rw = country === 'RW';
  const [idx, setIdx] = useState<AdminIndex | null>(null); const [secs, setSecs] = useState<Sector[] | null>(null);
  const [failed, setFailed] = useState(false); const [tries, setTries] = useState(0);
  const [geo, setGeo] = useState<string>(); const [locating, setLocating] = useState(false);
  const countries = useMemo(() => countryOptions(locale), [locale]);
  const dCode = str(v.district);

  useEffect(() => { if (!rw) return; let live = true; setFailed(false); loadIndex().then((i) => live && setIdx(i)).catch(() => live && setFailed(true)); return () => { live = false; }; }, [rw, tries]);
  useEffect(() => { if (!dCode) { setSecs(null); return; } let live = true; setSecs(null); loadDistrict(dCode).then((s) => live && setSecs(s)).catch(() => live && setFailed(true)); return () => { live = false; }; }, [dCode, tries]);

  const provinces = idx?.provinces ?? [];
  const districts = (idx?.districts ?? []).filter((d) => d.p === str(v.province));
  const cells = secs?.find((s) => s.c === str(v.sector))?.cells ?? [];
  const villages = cells.find((c) => c.c === str(v.cell))?.v ?? [];
  const opts = (a: { c: string; n: string }[]) => a.map((x) => ({ value: x.c, label: x.n }));

  function pick(level: Level, code: string, name: string) {
    const clear: Values = {}; LEVELS.slice(LEVELS.indexOf(level) + 1).forEach((k) => { clear[k] = ''; clear[`${k}Name`] = ''; });
    setMany({ [level]: code, [`${level}Name`]: name, ...clear });
  }
  function locate() {
    if (!navigator.geolocation) { setGeo('Your browser cannot share its location. Type the coordinates instead.'); return; }
    setLocating(true); setGeo(undefined);
    navigator.geolocation.getCurrentPosition(
      (p) => { setMany({ lat: p.coords.latitude.toFixed(6), lng: p.coords.longitude.toFixed(6) }); setGeo(`Location captured, accurate to about ${Math.round(p.coords.accuracy)} m.`); setLocating(false); },
      () => { setGeo('We could not get your location. Check your browser permission, or type the coordinates.'); setLocating(false); },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 });
  }
  const lat = str(v.lat).trim(), lng = str(v.lng).trim(); const mapOk = lat && lng && !Number.isNaN(Number(lat)) && !Number.isNaN(Number(lng));

  return (
    <div className="space-y-5">
      <Select name="country" label="Country" required options={countries.map((c) => ({ value: c.code, label: c.name }))} placeholder="Select your country"
        onPick={(code, name) => setMany({ country: code, countryName: name, province: '', provinceName: '', district: '', districtName: '', sector: '', sectorName: '', cell: '', cellName: '', village: '', villageName: '', city: '', address: '' })} />
      {rw ? (
        <>
          {failed && <p role="alert" className="rounded-xl bg-red-tint px-4 py-3 text-sm font-semibold text-red-dark">We could not load the location list. <button type="button" className="underline" onClick={() => setTries((t) => t + 1)}>Try again</button></p>}
          <div className="grid gap-5 sm:grid-cols-2">
            <Select name="province" label="Province" required options={opts(provinces)} placeholder={idx ? 'Select province' : 'Loading…'} disabled={!idx} onPick={(c, n) => pick('province', c, n)} />
            <Select name="district" label="District" required options={opts(districts)} placeholder="Select district" disabled={!str(v.province)} onPick={(c, n) => pick('district', c, n)} />
            <Select name="sector" label="Sector" required options={opts(secs ?? [])} placeholder={dCode && !secs ? 'Loading…' : 'Select sector'} disabled={!secs} onPick={(c, n) => pick('sector', c, n)} />
            <Select name="cell" label="Cell" required options={opts(cells)} placeholder="Select cell" disabled={!str(v.sector)} onPick={(c, n) => pick('cell', c, n)} />
            <Select name="village" label="Village (Umudugudu)" required options={opts(villages)} placeholder="Select village" disabled={!str(v.cell)} onPick={(c, n) => setMany({ village: c, villageName: n })} />
          </div>
        </>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2"><Text name="city" label="City or town" required autoComplete="address-level2" /><Text name="address" label="Address (optional)" autoComplete="street-address" /></div>
      )}
      <fieldset className="space-y-3 rounded-2xl border border-ink/10 bg-cream/60 p-4">
        <legend className="px-1 text-sm font-bold">GPS coordinates{coordsRequired ? <span aria-hidden className="text-red"> *</span> : <span className="font-normal text-ink-soft"> (optional)</span>}</legend>
        <div className="grid gap-4 sm:grid-cols-2"><Text name="lat" label="Latitude" inputMode="decimal" placeholder="-1.9441" /><Text name="lng" label="Longitude" inputMode="decimal" placeholder="30.0619" /></div>
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" onClick={locate} disabled={locating} className="inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-teal px-4 text-sm font-bold text-teal hover:bg-teal-tint disabled:opacity-50"><span aria-hidden>◎</span>{locating ? 'Locating…' : 'Use my current location'}</button>
          {mapOk && <a href={`https://www.google.com/maps?q=${lat},${lng}`} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-teal underline">Check on map ↗</a>}
        </div>
        <p role="status" className="text-sm text-ink-soft">{geo ?? 'We only ask your browser for your location when you press the button.'}</p>
      </fieldset>
    </div>
  );
}
