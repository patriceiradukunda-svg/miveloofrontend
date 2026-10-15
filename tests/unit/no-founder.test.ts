import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
const walk = (d: string): string[] => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
describe('tour has no founder persona', () => {
  it('founder config and page are gone', () => { expect(existsSync('src/config/founder.ts')).toBe(false); expect(existsSync('src/app/(public)/about/founder')).toBe(false); });
  it('no source file mentions a founder', () => { for (const f of walk('src').filter((x) => /\.(tsx?|json)$/.test(x))) expect(readFileSync(f, 'utf8'), f).not.toMatch(/founder/i); });
});
