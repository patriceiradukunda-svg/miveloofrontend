// Only details that genuinely exist are rendered. Empty = hidden.
export const site = {
  name: 'Miveloo',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  contact: {
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? '',
    phone: process.env.NEXT_PUBLIC_CONTACT_PHONE ?? '',
  },
  social: [
    { label: 'LinkedIn', href: process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN ?? '' },
    { label: 'X', href: process.env.NEXT_PUBLIC_SOCIAL_X ?? '' },
    { label: 'Facebook', href: process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK ?? '' },
    { label: 'Instagram', href: process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM ?? '' },
  ].filter((s) => s.href),
  demoMode: process.env.DEMO_MODE === 'true',
} as const;
