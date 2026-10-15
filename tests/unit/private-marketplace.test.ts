import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const walk = (d: string): string[] => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
describe('the marketplace is private', () => {
  it('has no public marketplace or supplier-listing pages', () => {
    for (const p of ['src/app/(public)/marketplace', 'src/app/(public)/suppliers', 'src/components/marketplace']) expect(existsSync(p), p).toBe(false);
  });
  it('no public page, header or footer links to /marketplace or /suppliers', () => {
    const files = [...walk('src/app/(public)'), ...walk('src/components/public'), ...walk('src/components/layout'), 'src/config/public-content.ts', 'src/config/tour.ts'].filter((f) => /\.(tsx?|json)$/.test(f));
    for (const f of files) expect(readFileSync(f, 'utf8'), f).not.toMatch(/['"`]\/(marketplace|suppliers)(['"`/?])/);
  });
  it('old URLs are routed by the server gate, never rendered', () => {
    for (const f of ['src/app/marketplace/page.tsx', 'src/app/marketplace/[...rest]/page.tsx', 'src/app/suppliers/page.tsx', 'src/app/suppliers/[...rest]/page.tsx']) expect(readFileSync(f, 'utf8')).toContain('routeToSchoolMarketplace');
  });
});
