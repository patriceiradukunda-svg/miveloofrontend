import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { team } from '@/config/team';
describe('team page', () => {
  it('every team member has a photo file and a name', () => { for (const m of team) { expect(m.name.length).toBeGreaterThan(1); expect(existsSync('public' + m.photo), m.photo).toBe(true); } });
  it('the site footer links to the Team page', () => { expect(readFileSync('src/components/layout/SiteFooter.tsx', 'utf8')).toContain("'/about/team'"); });
  it('the Team page exists', () => { expect(existsSync('src/app/(public)/about/team/page.tsx')).toBe(true); });
});
