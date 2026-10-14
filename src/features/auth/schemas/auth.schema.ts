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
const org = z.string().trim().min(2, 'Enter the organisation name.');
export const registrationSchemas = {
  school: z.object({ ...base, organisation: org }),
  supplier: z.object({ ...base, organisation: z.string().trim().optional() }),
  cooperative: z.object({ ...base, organisation: org }),
  institution: z.object({ ...base, organisation: org }),
};
export type RegistrationType = keyof typeof registrationSchemas;
export const resetSchema = z.object({ email: z.string().trim().email('Enter a valid email address.') });

export function fieldErrors(e: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const i of e.issues) { const k = String(i.path[0] ?? 'form'); if (!out[k]) out[k] = i.message; }
  return out;
}
