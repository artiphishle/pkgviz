import { describe, it } from 'node:test';

import { expect } from '@artiphishle/testosterone';

import { evaluateAuditRules } from '@/features/audit/domain/evaluateAuditRules';
import type { PackageCycleDetail } from '@/types/audit';

describe('[evaluateAuditRules]', () => {
  it('passes cyclic-dependencies when no cycle exists', () => {
    const [result] = evaluateAuditRules({ cyclicPackages: [] });

    expect(result.id).toBe('cyclic-dependencies');
    expect(result.status).toBe('passed');
    expect(result.policy).toBe('blocking');
    expect(result.details.length).toBe(0);
  });

  it('fails cyclic-dependencies and retains structured cycle evidence', () => {
    const cycle: PackageCycleDetail = {
      packages: ['a', 'b', 'a'],
      edges: [
        {
          from: 'a',
          to: 'b',
          via: [
            {
              filePath: 'src/a.ts',
              fileClass: 'A',
              importName: 'b',
              isIntrinsic: true,
            },
          ],
        },
      ],
    };
    const [result] = evaluateAuditRules({ cyclicPackages: [cycle] });

    expect(result.status).toBe('failed');
    expect(result.details[0]).toBe('a → b → a');
    expect(JSON.stringify(result.evidence).includes('src/a.ts')).toBe(true);
  });
});
