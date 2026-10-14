import type { MetadataRoute } from 'next';
import { site } from '@/config/site';
import { routes } from '@/config/routes';
export default function sitemap(): MetadataRoute.Sitemap {
  const skip = new Set<string>([routes.login, routes.register, routes.forgot]);
  return Object.values(routes).filter((r) => !skip.has(r)).map((p) => ({ url: `${site.url}${p === '/' ? '' : p}`, changeFrequency: 'weekly' as const }));
}
