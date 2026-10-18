import type { Role } from './roles';

export const routes = {
  home: '/', sell: '/sell',
  howItWorks: '/how-it-works', schools: '/schools', institutions: '/institutions',
  ai: '/ai-intelligence', pricing: '/pricing', about: '/about', mission: '/about/mission',
  team: '/about/team', impact: '/impact', contact: '/contact', faq: '/faq', help: '/help',
  insights: '/insights', privacy: '/privacy', terms: '/terms', cookies: '/cookies',
  supplierTerms: '/supplier-terms', schoolTerms: '/school-terms', dataAi: '/data-ai-policy',
  tour: '/tour', careers: '/careers', roadmap: '/roadmap', cooperatives: '/cooperatives', exchange: '/exchange', trust: '/trust',
  login: '/login', register: '/register', forgot: '/forgot-password',
} as const;

/** Path prefix -> the only role allowed in. '/app' is any authenticated user. */
export const PROTECTED_PREFIXES: ReadonlyArray<{ prefix: string; role: Role | 'any' }> = [
  { prefix: '/admin', role: 'admin' },
  { prefix: '/school', role: 'school' },
  { prefix: '/supplier', role: 'supplier' },
  { prefix: '/group', role: 'group' },
  { prefix: '/institution', role: 'institution' },
  { prefix: '/marketplace', role: 'any' }, // private: old links are routed by the server gate
  { prefix: '/suppliers', role: 'any' },
  { prefix: '/app', role: 'any' },
];
