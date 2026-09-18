import { describe, expect, it } from '@artiphishle/testosterone';

import { resolveAuditConfiguration } from '@/features/audit/domain/resolveAuditConfiguration';

describe('[resolveAuditConfiguration]', () => {
  it('defaults cyclic-dependencies to blocking enforcement', () => {
    const configuration = resolveAuditConfiguration();

    expect(configuration.failOnRuleViolation).toBe(true);
    expect(configuration.rules).toEqual([{ id: 'cyclic-dependencies', mode: 'block' }]);
  });

  it('applies rule and execution overrides deterministically', () => {
    const configuration = resolveAuditConfiguration({
      failOnRuleViolation: false,
      rules: [
        { id: 'cyclic-dependencies', mode: 'audit' },
        { id: 'cyclic-dependencies', mode: 'off' },
      ],
    });

    expect(configuration.failOnRuleViolation).toBe(false);
    expect(configuration.rules).toEqual([{ id: 'cyclic-dependencies', mode: 'off' }]);
  });
});
