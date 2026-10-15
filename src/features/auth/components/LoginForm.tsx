"use client";
import Link from 'next/link';
import { useActionState } from 'react';
import { loginAction } from '../actions';
import { FormField } from '@/components/forms/FormField';
import { FormError } from '@/components/forms/FormError';
import { Button } from '@/components/ui/button';
import { useT } from '@/providers/LocaleProvider';
import { PasswordInput } from './PasswordInput';

export function LoginForm({ next }: { next?: string }) {
  const { t } = useT(); const [state, action, pending] = useActionState(loginAction, undefined);
  return (
    <form action={action} className="space-y-4">
      <FormError message={state?.error} />
      <input type="hidden" name="next" value={next ?? ''} />
      <FormField label={t('auth.email')} required>{(p) => <input {...p} name="email" type="email" required autoComplete="email" inputMode="email" />}</FormField>
      <FormField label={t('auth.password')} required>{(p) => <PasswordInput {...p} name="password" required autoComplete="current-password" />}</FormField>
      <div className="flex justify-end"><Link className="text-sm font-bold text-teal underline" href="/forgot-password">{t('auth.forgot')}</Link></div>
      <Button type="submit" className="w-full" disabled={pending}>{pending ? '…' : t('auth.signIn')}</Button>
    </form>
  );
}
