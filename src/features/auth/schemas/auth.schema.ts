import { z } from 'zod';
import { RW_PHONE, strongPassword } from '@/lib/validators';

export const loginSchema = z.object({
  email: z.string().trim().email('Enter a valid email address, like name@example.com.'),
  password: z.string().min(1, 'Enter your password.'),
});
const base = {
  name: z.string().trim().min(2, 'Enter your full name.'),
  email: z.string().trim().email('Enter a valid email address.'),
  phone: z.string().trim().refine((v) => RW_PHONE.test(v.replace(/\s/g, '')), 'Enter a Rwandan mobile number, like 0788 123 456.'),
  district: z.string().trim().min(2, 'Enter your district.'),
  password: z.string().refine(strongPassword, 'Use at least 10 characters, with letters and numbers.'),
  consent: z.literal('on', { errorMap: () => ({ message: 'Please confirm you agree to the privacy policy.' }) }),
};
const optNum = (min: number, max: number, msg: string) => z.preprocess((v) => (v === '' || v == null ? undefined : v), z.coerce.number({ invalid_type_error: msg }).min(min, msg).max(max, msg).optional());
const location = {
  latitude: optNum(-90, 90, 'Latitude must be between -90 and 90.'), longitude: optNum(-180, 180, 'Longitude must be between -180 and 180.'),
  accuracy: optNum(0, 100000, 'Accuracy must be a positive number.'),
  locationType: z.preprocess((v) => (v === '' ? undefined : v), z.enum(['school', 'farm', 'business', 'collection-point']).optional()),
  locationConfirmed: z.literal('on').optional(),
};
const needsConfirm = (d: { latitude?: number; longitude?: number; locationConfirmed?: string }, ctx: z.RefinementCtx) => {
  if ((d.latitude != null || d.longitude != null) && (d.latitude == null || d.longitude == null)) ctx.addIssue({ code: 'custom', path: ['latitude'], message: 'Enter both latitude and longitude, or leave both empty.' });
  if (d.latitude != null && d.longitude != null && d.locationConfirmed !== 'on') ctx.addIssue({ code: 'custom', path: ['locationConfirmed'], message: 'Please confirm this is the location you want to register.' });
};
const org = z.string().trim().min(2, 'Enter the organisation name.');
export const registrationSchemas = {
  school: z.object({ ...base, ...location, organisation: org }).superRefine(needsConfirm),
  supplier: z.object({ ...base, ...location, organisation: z.string().trim().optional() }).superRefine(needsConfirm),
  cooperative: z.object({ ...base, ...location, organisation: org }).superRefine(needsConfirm),
  institution: z.object({ ...base, organisation: org }),
};
export type RegistrationType = keyof typeof registrationSchemas;
export const resetSchema = z.object({ email: z.string().trim().email('Enter a valid email address.') });

export function fieldErrors(e: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const i of e.issues) { const k = String(i.path[0] ?? 'form'); if (!out[k]) out[k] = i.message; }
  return out;
}
