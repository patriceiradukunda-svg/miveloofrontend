export interface Obs { label: string; value: number }
export interface Fc { label: string; mid: number; low: number; high: number }
export interface Series { id: string; name: string; unit: string; observed: Obs[]; forecast: Fc[] }

// ILLUSTRATIVE SAMPLE. Not real prices, not a real model output.
const mk = (name: string, id: string, base: number, amp: number): Series => {
  const mon = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
  const obs = mon.map((label, i) => ({ label, value: Math.round(base + Math.sin(i * 1.1) * amp + i * (amp / 3)) }));
  const last = obs[obs.length - 1]!.value;
  const fc = ['Nov', 'Dec', 'Jan'].map((label, i) => { const mid = Math.round(last + (i + 1) * (amp / 3)); const w = Math.round(amp * 0.5 * (i + 1)); return { label, mid, low: mid - w, high: mid + w }; });
  return { id, name, unit: 'RWF per kg', observed: obs, forecast: fc };
};
export const sampleSeries: Series[] = [mk('Maize flour', 'maize', 640, 40), mk('Dry beans', 'beans', 900, 70), mk('Irish potatoes', 'potato', 420, 45)];
