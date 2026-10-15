import { describe, expect, it } from 'vitest';
import { existsSync, readdirSync } from 'node:fs';
import { tourSteps } from '@/config/tour';
import { publicContent } from '@/config/public-content';
import { PHOTO_FILES } from '@/lib/photos';

const staticRoutes = new Set(['/about/founder', '/schools', '/sell', '/cooperatives', '/exchange', '/ai-intelligence', '/pricing', '/trust', '/register']);
describe('founder tour', () => {
  it('every step links to a real page and has a title in both languages', () => {
    for (const s of tourSteps) { expect(staticRoutes.has(s.href)).toBe(true); expect(s.title.en.length).toBeGreaterThan(3); expect(s.title.rw.length).toBeGreaterThan(3); }
  });
  it('has unique ids and ends with the start step', () => { expect(new Set(tourSteps.map((s) => s.id)).size).toBe(tourSteps.length); expect(tourSteps.at(-1)!.id).toBe('start'); });
  it('contains no invented statistics', () => { for (const s of tourSteps) expect(`${s.say} ${s.points.join(' ')}`).not.toMatch(/\d{2,}\s?(%|schools|suppliers|farmers|students)/i); });
});
describe('content', () => {
  it('every content page has a matching route file', () => {
    const base = 'src/app/(public)/'; for (const slug of Object.keys(publicContent)) expect(existsSync(`${base}${slug}/page.tsx`), slug).toBe(true);
  });
  it('photo slots are unique filenames', () => { const f = Object.values(PHOTO_FILES); expect(new Set(f).size).toBe(f.length); expect(readdirSync('scripts')).toContain('fetch-images.sh'); });
});
