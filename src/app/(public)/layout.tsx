import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (<><SiteHeader /><main id="main" tabIndex={-1} className="-mb-24">{children}</main><SiteFooter /></>);
}
