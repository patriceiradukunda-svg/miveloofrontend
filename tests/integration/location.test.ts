import { describe, expect, it } from 'vitest';
import { registrationSchemas } from '@/features/auth/schemas/auth.schema';
const ok = { name: 'Aline U', email: 'a@b.rw', phone: '0788123456', district: 'Musanze', password: 'goodpass123', consent: 'on' };
describe('registered location rules', () => {
  it('location is optional', () => { expect(registrationSchemas.supplier.safeParse({ ...ok, latitude: '', longitude: '' }).success).toBe(true); });
  it('coordinates require explicit confirmation (device position is never assumed)', () => {
    expect(registrationSchemas.supplier.safeParse({ ...ok, latitude: '-1.94', longitude: '30.06' }).success).toBe(false);
    expect(registrationSchemas.supplier.safeParse({ ...ok, latitude: '-1.94', longitude: '30.06', locationConfirmed: 'on' }).success).toBe(true);
  });
  it('rejects impossible or half-filled coordinates', () => {
    expect(registrationSchemas.supplier.safeParse({ ...ok, latitude: '120', longitude: '30', locationConfirmed: 'on' }).success).toBe(false);
    expect(registrationSchemas.supplier.safeParse({ ...ok, latitude: '-1.9' }).success).toBe(false);
  });
});
