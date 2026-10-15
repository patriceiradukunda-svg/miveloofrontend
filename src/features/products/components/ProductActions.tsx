"use client";
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { useToast } from '@/components/ui/toast';
export function ProductActions({ name }: { name: string }) {
  const toast = useToast();
  return <ConfirmDialog trigger="Archive" title={`Archive ${name}?`} body="It will disappear from the marketplace. You can restore it later." confirmLabel="Archive listing" onConfirm={() => toast('Demo only: nothing was changed.')} />;
}
