import { describe, it } from 'node:test';

import { expect } from '@artiphishle/testosterone';

import { evaluateAuditRules } from '@/features/audit/domain/evaluateAuditRules';
import { resolveAuditConfiguration } from '@/features/audit/domain/resolveAuditConfiguration';
import type { PackageCycleDetail } from '@/types/audit';

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

describe('[evaluateAuditRules]', () => {
  it('passes cyclic-dependencies with the default blocking policy when no cycle exists', () => {
    const [result] = evaluateAuditRules({
      configuration: resolveAuditConfiguration(),
      cyclicPackages: [],
    });

    expect(result.id).toBe('cyclic-dependencies');
    expect(result.status).toBe('passed');
    expect(result.policy).toBe('blocking');
    expect(result.details.length).toBe(0);
  });

  it('reports failed cyclic-dependencies as advisory in audit mode', () => {
    const [result] = evaluateAuditRules({
      configuration: resolveAuditConfiguration({
        rules: [{ id: 'cyclic-dependencies', mode: 'audit' }],
      }),
      cyclicPackages: [cycle],
    });

    expect(result.status).toBe('failed');
    expect(result.policy).toBe('advisory');
    expect(result.details[0]).toBe('a → b → a');
    expect(JSON.stringify(result.evidence).includes('src/a.ts')).toBe(true);
  });

  it('omits disabled rules from evaluation results', () => {
    const results = evaluateAuditRules({
      configuration: resolveAuditConfiguration({
        rules: [{ id: 'cyclic-dependencies', mode: 'off' }],
      }),
      cyclicPackages: [cycle],
    });

    expect(results.length).toBe(0);
  });
});
