export interface Portion { food: string; gramsPerStudent: number }
export interface Need { food: string; kg: number }
/** Pure arithmetic: students x grams x days x (1 + buffer). Inputs are the user's own; nothing is assumed. */
export function estimateNeeds(students: number, days: number, portions: Portion[], bufferPct = 0): Need[] {
  const f = 1 + Math.max(0, bufferPct) / 100;
  return portions.filter((p) => p.food && p.gramsPerStudent > 0).map((p) => ({ food: p.food, kg: Math.round(((students * p.gramsPerStudent * days * f) / 1000) * 10) / 10 }));
}
