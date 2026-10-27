import { Skeleton } from '@/components/ui/skeleton';
export default function Loading() {
  return <div className="container-page space-y-4 py-16" role="status" aria-label="Loading"><Skeleton className="h-10 w-2/3" /><Skeleton className="h-6 w-1/2" /><Skeleton className="h-48 w-full" /></div>;
}
