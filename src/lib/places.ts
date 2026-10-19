/** Rwanda place model and the "how far, and where?" rules used by the marketplace.
 *  Codes come from /public/data/rw-admin. Names are for display only. */
export interface Opt { c: string; n: string }
export interface Place { province: Opt; district: Opt; sector: Opt; cell: Opt; village: Opt; lat?: number; lng?: number }
export type Relation = 'village' | 'cell' | 'sector' | 'district' | 'province' | 'country';

/** Some official lists are ALL CAPS; show them as normal names. */
export function nice(n: string): string {
  return n === n.toUpperCase() ? n.toLowerCase().replace(/(^|[\s-])\p{L}/gu, (m) => m.toUpperCase()) : n;
}

/** How close two places are in the administrative hierarchy. Compared level by level, so equal names under different parents never match. */
export function relation(user: Place, other: Place): Relation {
  if (user.province.c !== other.province.c) return 'country';
  if (user.district.c !== other.district.c) return 'province';
  if (user.sector.c !== other.sector.c) return 'district';
  if (user.cell.c !== other.cell.c) return 'sector';
  if (user.village.c !== other.village.c) return 'cell';
  return 'village';
}

/** Which place names to show, by how far away the item is.
 *  village: none (distance only) · cell: village · sector: cell/village · district: sector/cell/village ·
 *  province: district/sector/cell/village · other province: district/sector/cell/village (as specified). */
export function placeParts(rel: Relation, other: Place): string[] {
  const v = nice(other.village.n), c = nice(other.cell.n), s = nice(other.sector.n), d = nice(other.district.n);
  switch (rel) {
    case 'village': return [];
    case 'cell': return [v];
    case 'sector': return [c, v];
    case 'district': return [s, c, v];
    default: return [d, s, c, v];
  }
}

const rad = (x: number) => (x * Math.PI) / 180;
/** Straight-line distance in km (haversine). null when either place has no confirmed coordinates. */
export function distanceKm(a: Place, b: Place): number | null {
  if (a.lat == null || a.lng == null || b.lat == null || b.lng == null) return null;
  const dLat = rad(b.lat - a.lat), dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
}
export function formatDistance(km: number | null): string {
  if (km == null) return '';
  if (km < 1) return `${Math.max(50, Math.round((km * 1000) / 50) * 50)} m`;
  if (km < 10) return `${km.toFixed(1)} km`;
  return `${Math.round(km)} km`;
}
export interface PlaceLabel { relation: Relation; parts: string[]; km: number | null; text: string; distance: string }
export function placeLabel(user: Place, other: Place): PlaceLabel {
  const rel = relation(user, other); const parts = placeParts(rel, other); const km = distanceKm(user, other);
  return { relation: rel, parts, km, text: parts.join(' / '), distance: formatDistance(km) };
}
