import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { TourLauncher } from '@/features/tour/TourLauncher';
import { getPhotoMap } from '@/lib/photos';
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (<><SiteHeader /><main id="main" tabIndex={-1}>{children}</main><SiteFooter /><TourLauncher photos={getPhotoMap()} /></>);
}
