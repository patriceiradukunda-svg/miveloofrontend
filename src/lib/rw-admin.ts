/** Rwanda administrative hierarchy (5 provinces, 30 districts, 416 sectors, 2,148 cells, 14,837 villages).
 *  Static JSON in /public/data/rw-admin: a small index, plus one file per district loaded on demand. */
export interface Opt { c: string; n: string }
export interface Cell extends Opt { v: Opt[] }
export interface Sector extends Opt { cells: Cell[] }
export interface AdminIndex { provinces: Opt[]; districts: (Opt & { p: string })[] }

let idx: Promise<AdminIndex> | null = null;
const districts = new Map<string, Promise<Sector[]>>();

async function getJson<T>(url: string): Promise<T> {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`Failed to load ${url}`);
  return (await r.json()) as T;
}
export function loadIndex(): Promise<AdminIndex> {
  if (!idx) idx = getJson<AdminIndex>('/data/rw-admin/index.json').catch((e) => { idx = null; throw e; });
  return idx;
}
export function loadDistrict(code: string): Promise<Sector[]> {
  let p = districts.get(code);
  if (!p) { p = getJson<Sector[]>(`/data/rw-admin/d/${code}.json`).catch((e) => { districts.delete(code); throw e; }); districts.set(code, p); }
  return p;
}
