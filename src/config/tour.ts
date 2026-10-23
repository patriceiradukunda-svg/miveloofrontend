import type { SceneName } from '@/components/media/Scenes';
import type { PhotoKey } from '@/lib/photos';

export interface TourStep {
  id: string; scene: SceneName; photo?: PhotoKey; href: string; cta: string;
  title: { en: string; rw: string }; say: string; points: string[];
}
/** Written in Miveloo's voice. No invented statistics, customers or partners. Kinyarwanda titles need native review. */
export const tourSteps: TourStep[] = [
  { id: 'why', scene: 'cycle', photo: 'schoolMeal', href: '/about#mission', cta: 'Our mission', title: { en: 'Why Miveloo exists', rw: 'Impamvu Miveloo ibaho' },
    say: 'A school meal only works when the food arrives: on time, fresh, at a fair price. The people who grow it and the kitchens that need it often cannot see each other. Miveloo is the bridge between them, with honest data on top.',
    points: ['Schools find the food they need', 'Suppliers reach reliable markets', 'Data helps everyone waste less'] },
  { id: 'schools', scene: 'school', photo: 'schoolKitchen', href: '/schools', cta: 'See the school journey', title: { en: 'If you run a school kitchen', rw: 'Niba uyobora igikoni cy\'ishuri' },
    say: 'You compare offers, order, and confirm what actually arrived. Every step is recorded, so a purchase is never a guess. Only verified schools can order; that protects you and our suppliers.',
    points: ['Compare prices, units and delivery terms', 'Track orders and confirm receipt', 'Your own history stays free'] },
  { id: 'suppliers', scene: 'farm', photo: 'womenHarvest', href: '/sell', cta: 'Sell on Miveloo', title: { en: 'If you grow or sell food', rw: 'Niba uhinga cyangwa ugurisha ibiribwa' },
    say: 'List what you have, say how much, and set your price. Schools discover you; you accept or decline each order. Selling on the core marketplace has no platform access fee.',
    points: ['Free to list and sell', 'You choose what schools see', 'Update stock as it changes'] },
  { id: 'coops', scene: 'coop', photo: 'coopMaize', href: '/cooperatives', cta: 'For cooperatives', title: { en: 'If you lead a cooperative', rw: 'Niba uyobora koperative' },
    say: 'Combine your members\' harvests and answer bigger orders. We keep confirmed stock apart from estimated capacity, so you never promise food you cannot deliver.',
    points: ['Member and harvest records', 'Confirmed vs estimated, always separate', 'Allocate orders to members fairly'] },
  { id: 'exchange', scene: 'exchange', photo: 'trainingKitchen', href: '/exchange', cta: 'How exchange works', title: { en: 'When one school has surplus', rw: 'Ishuri rimwe rifite ibisigaye' },
    say: 'Food that would be wasted at one school can feed another nearby. Verified schools can offer surplus, request transfers and record the outcome, with food-safety rules respected.',
    points: ['Publish surplus with quantity and expiry', 'Nearby verified schools can request it', 'Every transfer is tracked'] },
  { id: 'ai', scene: 'data', photo: 'agritech', href: '/ai-intelligence', cta: 'Meet the intelligence layer', title: { en: 'Our AI is honest by design', rw: 'AI yacu ni iy\'ukuri' },
    say: 'Miveloo is not a magic chatbot. It shows estimates with their data period, assumptions and uncertainty, and says plainly when there is not enough data. A prediction is never a promise.',
    points: ['Observed facts vs estimates, clearly labelled', 'Sources and last-updated shown', 'No invented prices or forecasts'] },
  { id: 'pricing', scene: 'cycle', photo: 'market', href: '/pricing', cta: 'See free vs paid', title: { en: 'Free first, paid only if you want more', rw: 'Ubuntu mbere, kwishyura ari amahitamo' },
    say: 'Browsing, basic buying and selling, orders and your own history stay free. Advanced forecasts, alerts and institutional reports are optional, and we show the limits and terms before you pay.',
    points: ['Core marketplace: no access fee', 'Premium features clearly marked', 'Paid plans never bypass privacy'] },
  { id: 'trust', scene: 'trust', photo: 'storage', href: '/trust', cta: 'Our trust centre', title: { en: 'Trust is built in', rw: 'Icyizere cyubakiye ku bikorwa' },
    say: 'Schools and suppliers are verified. The marketplace is private to verified schools, and suppliers choose what schools see. School data is private. And we will never claim customers, coverage or impact we cannot prove.',
    points: ['Verification before access', 'Marketplace and school data kept private', 'Honest about what is live today'] },
  { id: 'start', scene: 'farm', photo: 'hills', href: '/register', cta: 'Create your account', title: { en: 'Ready? Pick your path', rw: 'Witeguye? Hitamo inzira yawe' },
    say: 'Choose who you are to get started. Registering is free; access to protected features follows verification.',
    points: [] },
];
export const startPaths = [
  { href: '/register/school', label: '🏫 I run a school' }, { href: '/register/supplier', label: '🧑🏾‍🌾 I supply food' },
  { href: '/register/cooperative', label: '🤝 I lead a cooperative' }, { href: '/register/institution', label: '🏛️ I represent an institution' },
] as const;
