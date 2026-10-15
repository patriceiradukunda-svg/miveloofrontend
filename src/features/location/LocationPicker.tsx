"use client";
import { useState } from 'react';

/** Never assumes the device position is the registered address: it only suggests, and the user must confirm. */
export function LocationPicker({ errors = {} }: { errors?: Record<string, string> }) {
  const [lat, setLat] = useState(''); const [lng, setLng] = useState(''); const [acc, setAcc] = useState(''); const [msg, setMsg] = useState<string>(); const [busy, setBusy] = useState(false);
  const valid = lat !== '' && lng !== '' && Math.abs(Number(lat)) <= 90 && Math.abs(Number(lng)) <= 180;
  function suggest() {
    if (!('geolocation' in navigator)) return setMsg('Your device cannot share a location. Please enter it manually.');
    setBusy(true); setMsg(undefined);
    navigator.geolocation.getCurrentPosition(
      (p) => { setLat(p.coords.latitude.toFixed(6)); setLng(p.coords.longitude.toFixed(6)); setAcc(String(Math.round(p.coords.accuracy))); setBusy(false); setMsg('Suggested from your device. Check it is your registered place, then confirm below.'); },
      (e) => { setBusy(false); setMsg(e.code === 1 ? 'No problem: location permission was not given. You can type the coordinates or skip this step and add it later.' : 'We could not get a position. You can enter it manually.'); },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 });
  }
  const f = 'field mt-1';
  return (
    <fieldset className="space-y-3 rounded-2xl border border-ink/15 p-4">
      <legend className="px-2 font-bold">Registered location (optional)</legend>
      <p className="text-sm text-ink-soft">Helps schools find nearby suppliers. Your public profile shows only a general area. Where you are right now may not be your school, farm or business.</p>
      <label className="block text-sm font-bold">What does this location represent?
        <select name="locationType" className={f} defaultValue=""><option value="">Not set</option><option value="school">School</option><option value="farm">Farm</option><option value="business">Business premises</option><option value="collection-point">Collection point</option></select></label>
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="text-sm font-bold">Latitude<input name="latitude" inputMode="decimal" className={f} value={lat} onChange={(e) => setLat(e.target.value)} placeholder="-1.944" /></label>
        <label className="text-sm font-bold">Longitude<input name="longitude" inputMode="decimal" className={f} value={lng} onChange={(e) => setLng(e.target.value)} placeholder="30.061" /></label>
        <label className="text-sm font-bold">Accuracy (metres)<input name="accuracy" inputMode="numeric" className={f} value={acc} onChange={(e) => setAcc(e.target.value)} /></label>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={suggest} disabled={busy} className="min-h-11 rounded-full border-2 border-teal px-5 font-bold text-teal hover:bg-teal-tint disabled:opacity-50">{busy ? 'Looking…' : '📍 Suggest from my device'}</button>
        {valid && <a className="font-bold underline" target="_blank" rel="noopener noreferrer" href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=16/${lat}/${lng}`}>Check on OpenStreetMap ↗</a>}
      </div>
      {msg && <p role="status" className="rounded-xl bg-gold-tint p-3 text-sm">{msg}</p>}
      {valid && <label className="flex items-start gap-3 text-sm"><input type="checkbox" name="locationConfirmed" className="mt-1 h-5 w-5 accent-teal" />I confirm this is the location I want to register.</label>}
      {errors.locationConfirmed && <p role="alert" className="text-sm font-semibold text-red-dark">⚠ {errors.locationConfirmed}</p>}
      {errors.latitude && <p role="alert" className="text-sm font-semibold text-red-dark">⚠ {errors.latitude}</p>}
    </fieldset>
  );
}
