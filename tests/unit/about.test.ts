import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
const src = readFileSync('src/app/(public)/about/page.tsx', 'utf8');
describe('about page', () => {
  it('links to the team, roadmap and trust pages', () => { for (const h of ['/about/team', '/roadmap', '/trust']) expect(src).toContain(h); });
  it('does not expose the private marketplace', () => { expect(src).not.toMatch(/['"`]\/(marketplace|suppliers)(['"`/?])/); });
  it('makes no numeric claims about customers or impact', () => { expect(src).not.toMatch(/\d{2,}\s?(schools|suppliers|farmers|students|customers|users)/i); });
});
