import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const walk = (d: string): string[] =>
  readdirSync(d).flatMap((f) => {
    const p = join(d, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });

describe('tour has no founder persona', () => {
  it('founder config and page are gone', () => {
    expect(existsSync('src/config/founder.ts')).toBe(false);
    expect(existsSync('src/app/(public)/about/founder')).toBe(false);
  });

  it('tour source files do not reference a founder persona', () => {
    const files = [
      ...walk('src/features/tour'),
      'src/config/tour.ts',
    ].filter((file) => /\.(tsx?|json)$/.test(file));

    for (const file of files) {
      expect(readFileSync(file, 'utf8'), file).not.toMatch(/founder/i);
    }
  });
});
