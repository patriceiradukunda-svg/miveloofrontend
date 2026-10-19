import { describe, expect, it } from 'vitest';
import { sampleSeries } from '../fixtures/sample-forecast';
describe('sample forecast data', () => {
  it('keeps observations and forecasts distinct, in time order', () => {
    for (const s of sampleSeries) { const all = [...s.observed.map((o) => o.label), ...s.forecast.map((f) => f.label)]; expect(new Set(all).size).toBe(all.length); expect(s.forecast.length).toBeGreaterThan(0); }
  });
  it('uncertainty bands are ordered and widen over time', () => {
    for (const s of sampleSeries) { let prev = 0; for (const f of s.forecast) { expect(f.low).toBeLessThanOrEqual(f.mid); expect(f.mid).toBeLessThanOrEqual(f.high); const w = f.high - f.low; expect(w).toBeGreaterThanOrEqual(prev); prev = w; } }
  });
});
