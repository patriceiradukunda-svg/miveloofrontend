import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
const walk = (d: string): string[] => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
describe('removed notices stay removed', () => {
  it('no photo disclaimer anywhere in src', () => {
    for (const f of walk('src').filter((x) => /\.(tsx?|json)$/.test(x))) expect(readFileSync(f, 'utf8'), f).not.toMatch(/photograph(s)? (is|are) illustrative|photoNote/i);
  });
  it('floating tour button is hidden on the homepage', () => { expect(readFileSync('src/features/tour/TourLauncher.tsx', 'utf8')).toContain("path === '/'"); });
});
