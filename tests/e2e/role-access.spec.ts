import { test, type Page } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { PROTECTED_PREFIXES } from '../../src/config/routes';

const PW = process.env.TEST_PASSWORD ?? '';
const THROTTLE = Number(process.env.THROTTLE_MS ?? 500);
const D = 'qa.miveloo.rw';
const ACCOUNTS = [
  { ui: 'supplier', email: `supplier-owner@${D}` },
  { ui: 'school', email: `school-owner@${D}` },
  { ui: 'group', email: `coop-owner@${D}` },
  { ui: 'institution', email: `inst-district-admin@${D}` },
  { ui: 'admin', email: `admin-super-administrator@${D}` },
] as const;
const INTERNAL = ['admin', 'ai-ops', 'app', 'cooperative', 'group', 'institution', 'intelligence', 'marketplace', 'school', 'supplier', 'suppliers', 'select-workspace'];

function routes(): string[] {
  const out: string[] = [];
  const walk = (dir: string) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name === 'page.tsx') {
        const url = '/' + path.relative('src/app', dir).split(path.sep).filter((s) => !/^\(.*\)$/.test(s)).join('/');
        if (!url.includes('[') && INTERNAL.includes(url.split('/')[1] ?? '')) out.push(url);
      }
    }
  };
  walk('src/app');
  return [...new Set(out)].sort();
}
function expected(url: string, ui: string): 'ok' | 'denied' {
  const r = PROTECTED_PREFIXES.find((p) => url === p.prefix || url.startsWith(p.prefix + '/'));
  return !r || r.role === 'any' || r.role === ui ? 'ok' : 'denied';
}
async function login(page: Page, email: string) {
  await page.goto('/login');
  await page.fill('input[name=email]', email);
  await page.fill('input[name=password]', email.startsWith('admin-') ? (process.env.ADMIN_TEST_PASSWORD ?? PW) : PW);
  await page.click('button[type=submit]');
  await page.waitForURL((u) => !u.pathname.startsWith('/login'), { timeout: 60_000 });
}
async function probe(page: Page, url: string) {
  const res = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60_000 });
  // Layout redirects stream after the 200 response; wait for them to land before reading the URL.
  await page.waitForLoadState('load').catch(() => {});
  await page.waitForTimeout(1500);
  const final = new URL(page.url()).pathname;
  const status = res?.status() ?? 0;
  const body = (await page.locator('body').innerText().catch(() => '')).slice(0, 400);
  let actual = 'ok';
  if (status >= 500 || /application error|something went wrong/i.test(body)) actual = 'error';
  else if (status === 404) actual = 'not-found';
  else if (final.startsWith('/login')) actual = 'login';
  else if (final.startsWith('/access-denied')) actual = 'denied';
  else if (final !== url) actual = 'redirect';
  return { actual, status, final };
}
const rows: string[] = ['role,url,expected,actual,status,final_url,verdict'];

test.describe.configure({ mode: 'serial' });
test.skip(!PW, 'set TEST_PASSWORD');

for (const acc of ACCOUNTS) {
  test(`access matrix: ${acc.ui}`, async ({ page }) => {
    test.setTimeout(1_800_000);
    await login(page, acc.email);
    for (const url of routes()) {
      const exp = expected(url, acc.ui);
      let r = await probe(page, url);
      if (r.actual === 'login' && exp === 'ok') { // likely rate limit or cold start on the API: wait and retry once
        await page.waitForTimeout(20_000);
        r = await probe(page, url);
      }
      rows.push([acc.ui, url, exp, r.actual, r.status, r.final, r.actual === exp ? 'PASS' : 'FAIL'].join(','));
      await page.waitForTimeout(THROTTLE);
    }
  });
}
test('anonymous is sent to login on every internal route', async ({ page }) => {
  test.setTimeout(900_000);
  for (const url of routes().filter((u) => PROTECTED_PREFIXES.some((p) => u === p.prefix || u.startsWith(p.prefix + '/')))) {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60_000 });
    const ok = new URL(page.url()).pathname.startsWith('/login');
    rows.push(['anonymous', url, 'login', ok ? 'login' : 'LEAK', '', page.url(), ok ? 'PASS' : 'FAIL'].join(','));
  }
});
test.afterAll(() => {
  fs.writeFileSync('role-access-report.csv', rows.join('\n'));
  const fails = rows.filter((r) => r.endsWith(',FAIL'));
  console.log(`\nrows=${rows.length - 1} FAIL=${fails.length}\n` + fails.slice(0, 80).join('\n'));
});
