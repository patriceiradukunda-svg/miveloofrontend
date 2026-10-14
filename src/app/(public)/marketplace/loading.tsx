import { Skeleton } from '@/components/ui/skeleton';
export default function Loading() {
  return <div className="container-page grid gap-8 py-12 lg:grid-cols-[18rem_1fr]" role="status" aria-label="Loading listings"><Skeleton className="h-96" /><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }, (_, i) => <Skeleton key={i} className="h-64" />)}</div></div>;
}
