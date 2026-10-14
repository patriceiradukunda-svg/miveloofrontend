export type Locale = 'en' | 'rw';
const tag = (l: Locale) => (l === 'rw' ? 'rw-RW' : 'en-RW');

export function formatRWF(amount: number, locale: Locale = 'en') {
  return new Intl.NumberFormat(tag(locale), { style: 'currency', currency: 'RWF', maximumFractionDigits: 0 }).format(amount);
}
export function formatNumber(n: number, locale: Locale = 'en') {
  return new Intl.NumberFormat(tag(locale)).format(n);
}
export function formatDate(iso: string, locale: Locale = 'en') {
  return new Intl.DateTimeFormat(tag(locale), { dateStyle: 'medium', timeZone: 'Africa/Kigali' }).format(new Date(iso));
}
export function formatQuantity(q: number, unit: string, locale: Locale = 'en') {
  return `${formatNumber(q, locale)} ${unit}`;
}
