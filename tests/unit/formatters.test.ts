import { describe, expect, it } from 'vitest';
import { formatQuantity, formatRWF } from '@/lib/formatters';
describe('formatters', () => {
  it('formats RWF without decimals', () => { expect(formatRWF(1250)).toMatch(/1,?250/); expect(formatRWF(1250)).not.toMatch(/\.\d\d$/); });
  it('formats quantities', () => { expect(formatQuantity(500, 'kg')).toContain('500'); });
});
