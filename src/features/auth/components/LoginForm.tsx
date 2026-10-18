"use client";
import Link from 'next/link';
import { useActionState } from 'react';
import { loginAction } from '../actions';
import { FormField } from '@/components/forms/FormField';
import { FormError } from '@/components/forms/FormError';
import { Button } from '@/components/ui/button';
import { useT } from '@/providers/LocaleProvider';
import { PasswordInput } from './PasswordInput';

const Svg = ({ d }: { d: string[] }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden>{d.map((x) => <path key={x} d={x} />)}</svg>;
const MAIL = ['M4 6h16v12H4z', 'M4 7l8 6 8-6'];
const LOCK = ['M5 11h14v9H5z', 'M8 11V8a4 4 0 018 0v3'];

export function LoginForm({ next }: { next?: string }) {
  const { t } = useT(); const [state, action, pending] = useActionState(loginAction, undefined);
  return (
    <form action={action} className="space-y-5">
      <FormError message={state?.error} />
      <input type="hidden" name="next" value={next ?? ''} />
      <FormField label={t('auth.email')} required>{(p) => (
        <div className="relative"><span aria-hidden className="pointer-events-none absolute inset-y-0 left-4 grid place-items-center text-ink-soft"><Svg d={MAIL} /></span>
          <input {...p} className={`${p.className} pl-12`} name="email" type="email" required autoComplete="email" inputMode="email" /></div>)}</FormField>
      <FormField label={t('auth.password')} required>{(p) => <PasswordInput {...p} leading={<Svg d={LOCK} />} name="password" required autoComplete="current-password" />}</FormField>
      <div className="flex justify-end"><Link className="text-sm font-bold text-teal underline" href="/forgot-password">{t('auth.forgot')}</Link></div>
      <Button type="submit" className="w-full text-base" disabled={pending}>{pending ? '…' : <>{t('auth.signIn')} <span aria-hidden className="ml-2">→</span></>}</Button>
    </form>
  );
}
