import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { distanceKm, formatDistance, nice, placeLabel, placeParts, relation, type Place } from '@/lib/places';
import { PLACES, DEMO_SCHOOL_PLACES } from '@/features/marketplace/sample-places';
import { MARKET_ITEMS } from '@/features/marketplace/sample-items';

const me: Place = PLACES.abatuje;
describe('place rules', () => {
  it('same village: distance only', () => { const l = placeLabel(me, PLACES.abatuje); expect(l.relation).toBe('village'); expect(l.parts).toEqual([]); });
  it('same cell, other village: village', () => { const l = placeLabel(me, PLACES.amariza); expect(l.relation).toBe('cell'); expect(l.parts).toEqual(['Amariza']); });
  it('same sector, other cell: cell / village', () => { const l = placeLabel(me, PLACES.kibagabaga); expect(l.relation).toBe('sector'); expect(l.text).toBe('Kibagabaga / Akintwari'); });
  it('same district, other sector: sector / cell / village', () => { const l = placeLabel(me, PLACES.remera); expect(l.relation).toBe('district'); expect(l.parts).toHaveLength(3); expect(l.parts[0]).toBe('Remera'); });
  it('same province, other district: district / sector / cell / village', () => { const l = placeLabel(me, PLACES.kicukiro); expect(l.relation).toBe('province'); expect(l.parts).toHaveLength(4); expect(l.parts[0]).toBe('Kicukiro'); });
  it('other province: district / sector / cell / village', () => { const l = placeLabel(me, PLACES.musanze); expect(l.relation).toBe('country'); expect(l.parts).toHaveLength(4); expect(l.parts[0]).toBe('Musanze'); });
  it('equal names under different parents do not match', () => {
    const fake: Place = { ...PLACES.amariza, sector: { c: 'X', n: PLACES.amariza.sector.n } }; expect(relation(me, fake)).toBe('district');
  });
  it('shows ALL-CAPS official names as normal names', () => { expect(nice('GATUNDA')).toBe('Gatunda'); expect(nice('Bibare')).toBe('Bibare'); expect(placeParts('cell', PLACES.nyagatare)).toEqual(['Barija A']); });
});
describe('distance', () => {
  it('is small within a cell and large across the country, and null without coordinates', () => {
    expect(distanceKm(me, PLACES.amariza)!).toBeLessThan(1); expect(distanceKm(me, PLACES.musanze)!).toBeGreaterThan(60);
    expect(distanceKm({ ...me, lat: undefined }, PLACES.musanze)).toBeNull();
  });
  it('formats metres and kilometres', () => { expect(formatDistance(0.43)).toBe('450 m'); expect(formatDistance(2.46)).toBe('2.5 km'); expect(formatDistance(96.4)).toBe('96 km'); expect(formatDistance(null)).toBe(''); });
});
describe('sample data is real and consistent', () => {
  const idx = JSON.parse(readFileSync('public/data/rw-admin/index.json', 'utf8')) as { provinces: { c: string }[]; districts: { c: string; p: string }[] };
  it('every sample place exists in the Rwanda dataset with the right parents', () => {
    for (const [k, p] of Object.entries(PLACES)) {
      const d = idx.districts.find((x) => x.c === p.district.c)!; expect(d, k).toBeTruthy(); expect(d.p, k).toBe(p.province.c);
      const secs = JSON.parse(readFileSync(`public/data/rw-admin/d/${p.district.c}.json`, 'utf8')) as { c: string; cells: { c: string; v: { c: string }[] }[] }[];
      const s = secs.find((x) => x.c === p.sector.c)!; expect(s, k).toBeTruthy(); const c = s.cells.find((x) => x.c === p.cell.c)!; expect(c, k).toBeTruthy(); expect(c.v.some((v) => v.c === p.village.c), k).toBe(true);
    }
  });
  it('every sample photo exists', async () => { const { existsSync } = await import('node:fs'); for (const i of MARKET_ITEMS) for (const f of i.photos) expect(existsSync('public' + f), f).toBe(true); });
  it('the demo previews together cover all six relations', () => {
    const seen = new Set<string>(); for (const k of DEMO_SCHOOL_PLACES) for (const i of MARKET_ITEMS) if (i.place) seen.add(relation(PLACES[k], i.place));
    expect([...seen].sort()).toEqual(['cell', 'country', 'district', 'province', 'sector', 'village']);
  });
});
