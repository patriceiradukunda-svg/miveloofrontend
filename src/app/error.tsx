"use client";
import { Button } from '@/components/ui/button';
export default function Error({ reset }: { error: Error; reset: () => void }) {
  return <div className="container-page py-24 text-center"><h1 className="text-3xl font-semibold">Something went wrong</h1><p className="mt-2 text-ink-soft">Please try again. If it keeps happening, tell our support team.</p><div className="mt-6"><Button onClick={reset}>Try again</Button></div></div>;
}
