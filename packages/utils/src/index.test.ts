import { describe, expect, it } from 'vitest';

import { formatUsd } from './index';

describe('formatUsd', () => {
  it('formats cents as USD with two decimals', () => {
    expect(formatUsd(12_500_000)).toBe('$125,000.00');
  });
  it('handles zero', () => {
    expect(formatUsd(0)).toBe('$0.00');
  });
});
