import type { RegistrationType } from './schemas/auth.schema';
export const INFO: Record<RegistrationType, { title: string; org: string | null; note: string }> = {
  school: { title: 'Register your school', org: 'School name', note: 'Schools are verified before they can order. We use your details to confirm your school and contact you about orders.' },
  supplier: { title: 'Register as a supplier', org: 'Business or farm name (optional)', note: 'Suppliers may be asked for identity, business or product verification. Only what you publish is shown publicly.' },
  cooperative: { title: 'Register your cooperative or group', org: 'Cooperative or group name', note: 'We verify groups and their managers. Member personal and financial data stays private.' },
  institution: { title: 'Register your institution', org: 'Organisation name', note: 'Institutional access needs organisation verification and a data-sharing agreement.' },
};
export const registrationTitle = (t: RegistrationType) => INFO[t].title;
