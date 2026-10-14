import { describe, expect, it } from 'vitest';
import { canUseFeature, planFeatureStatus } from '@/config/plans';
describe('plans', () => {
  it('free plan includes history and listings', () => { expect(canUseFeature(['free'], 'history')).toBe(true); expect(canUseFeature(['free'], 'listings')).toBe(true); });
  it('free plan does not include advanced AI', () => { expect(canUseFeature(['free'], 'forecast')).toBe(false); });
  it('in-development features are never treated as usable', () => { expect(planFeatureStatus('plus', 'forecast')).toBe('in-development'); expect(canUseFeature(['plus'], 'forecast')).toBe(false); });
});
