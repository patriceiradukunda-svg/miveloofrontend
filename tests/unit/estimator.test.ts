import { describe, expect, it } from 'vitest';
import { estimateNeeds } from '@/lib/estimator';
describe('demand estimator', () => {
  it('multiplies students x grams x days, plus buffer', () => {
    expect(estimateNeeds(100, 20, [{ food: 'Beans', gramsPerStudent: 60 }], 0)).toEqual([{ food: 'Beans', kg: 120 }]);
    expect(estimateNeeds(100, 20, [{ food: 'Beans', gramsPerStudent: 60 }], 10)[0]!.kg).toBe(132);
  });
  it('ignores incomplete rows and negative buffers', () => {
    expect(estimateNeeds(100, 20, [{ food: '', gramsPerStudent: 60 }, { food: 'X', gramsPerStudent: 0 }], 0)).toEqual([]);
    expect(estimateNeeds(10, 1, [{ food: 'A', gramsPerStudent: 100 }], -50)[0]!.kg).toBe(1);
  });
});
