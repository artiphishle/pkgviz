import { describe, expect, it } from '@artiphishle/testosterone';

import { ciCycleProofA } from '@/features/audit/domain/ciCycleProofA';
import { ciCycleProofB } from '@/features/dependency-analysis/adapters/outbound/dependency-graph/ciCycleProofB';

describe('[CI cyclic dependency proof]', () => {
  it('loads both temporary cycle endpoints without invoking the recursive functions', () => {
    expect(typeof ciCycleProofA).toBe('function');
    expect(typeof ciCycleProofB).toBe('function');
  });
});
