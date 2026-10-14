import { describe, expect, it } from 'vitest';
import { registrationSchemas, loginSchema } from '@/features/auth/schemas/auth.schema';
const ok = { name: 'Aline U', email: 'a@b.rw', phone: '0788123456', district: 'Musanze', password: 'goodpass123', consent: 'on' };
describe('auth schemas', () => {
  it('accepts valid school registration', () => { expect(registrationSchemas.school.safeParse({ ...ok, organisation: 'GS Example' }).success).toBe(true); });
  it('rejects weak passwords, bad phones and missing consent', () => {
    expect(registrationSchemas.supplier.safeParse({ ...ok, password: 'short' }).success).toBe(false);
    expect(registrationSchemas.supplier.safeParse({ ...ok, phone: '12345' }).success).toBe(false);
    expect(registrationSchemas.supplier.safeParse({ ...ok, consent: undefined }).success).toBe(false);
  });
  it('requires an organisation for schools but not individual suppliers', () => { expect(registrationSchemas.school.safeParse(ok).success).toBe(false); expect(registrationSchemas.supplier.safeParse(ok).success).toBe(true); });
  it('does not accept a role field from the client', () => { const r = registrationSchemas.supplier.parse({ ...ok, role: 'admin' }); expect('role' in r).toBe(false); });
  it('validates login', () => { expect(loginSchema.safeParse({ email: 'x', password: '' }).success).toBe(false); });
});
