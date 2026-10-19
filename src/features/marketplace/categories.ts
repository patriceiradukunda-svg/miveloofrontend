import { FOOD_CATALOG } from '@/config/food-catalog';

const EMOJI: Record<string, string> = {
  cereals: '🌾', roots: '🥔', pulses: '🫘', bananas: '🍌', vegetables: '🥬', fruits: '🥑', 'nuts-seeds': '🥜', 'oils-fats': '🫒', meat: '🍗', eggs: '🥚',
  dairy: '🥛', fish: '🐟', honey: '🍯', 'spices-herbs': '🌿', 'flour-milling': '🌾', bakery: '🍞', 'pasta-noodles': '🍝', canned: '🥫', sauces: '🍅',
  snacks: '🍪', confectionery: '🍬', beverages: '🧃', traditional: '🍲', 'ready-to-eat': '🍱', frozen: '🧊', 'imported-specialty': '📦', ingredients: '🧂', other: '🍽️',
};
export const catEmoji = (id: string) => EMOJI[id] ?? '🍽️';
export const catLabel = (id: string) => FOOD_CATALOG.find((c) => c.id === id)?.label ?? id;
