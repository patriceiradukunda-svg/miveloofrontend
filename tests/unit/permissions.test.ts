import { describe, expect, it } from 'vitest';
import { can, checkRouteAccess } from '@/lib/permissions';

describe('permissions', () => {
  it('only schools may buy', () => {
    expect(can('school', 'marketplace.buy')).toBe(true);
    for (const r of ['supplier', 'group', 'institution', 'admin'] as const) expect(can(r, 'marketplace.buy')).toBe(false);
    expect(can(undefined, 'marketplace.buy')).toBe(false);
  });
  it('public pages are open', () => { expect(checkRouteAccess('/', undefined)).toBe('allow'); expect(checkRouteAccess('/sell', undefined)).toBe('allow'); expect(checkRouteAccess('/how-it-works', undefined)).toBe('allow'); });
  it('the marketplace is private: visitors are sent to login', () => { expect(checkRouteAccess('/marketplace', undefined)).toBe('login'); expect(checkRouteAccess('/marketplace/prd-1', undefined)).toBe('login'); expect(checkRouteAccess('/suppliers', undefined)).toBe('login'); });
  it('private routes need a session', () => { expect(checkRouteAccess('/school/marketplace', undefined)).toBe('login'); });
  it('role mismatch is denied', () => {
    expect(checkRouteAccess('/school/marketplace', 'supplier')).toBe('denied');
    expect(checkRouteAccess('/admin/users', 'school')).toBe('denied');
    expect(checkRouteAccess('/institution/intelligence', 'school')).toBe('denied');
    expect(checkRouteAccess('/school/marketplace', 'school')).toBe('allow');
  });
  it('does not confuse similar prefixes', () => { expect(checkRouteAccess('/schools', undefined)).toBe('allow'); expect(checkRouteAccess('/supplier-terms', undefined)).toBe('allow'); });
  it('any authenticated user may open /app', () => { expect(checkRouteAccess('/app/orders', 'supplier')).toBe('allow'); expect(checkRouteAccess('/app/orders', undefined)).toBe('login'); });
});
