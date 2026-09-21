import { describe, expect, it, render } from '@artiphishle/testosterone';
import React from 'react';

import { AuditRulePanel } from '@/features/audit/adapters/inbound/react/AuditRulePanel';
import type { Audit } from '@/types/audit';

describe('[AuditRulePanel]', () => {
  it('renders violated rule content supplied by the composition root', () => {
    const { getByText } = render(
      <AuditRulePanel
        evaluation={evaluation}
        cycleSelection={{ highlights: [], selectedIds: [], setSelected: () => undefined }}
        mode="light"
        onCycleInspectionChange={() => undefined}
      />
    );

    expect(getByText('Cyclic Dependencies')).toBeDefined();
  });
});

const evaluation: Audit['evaluation'] = {
  cyclicPackages: [
    {
      packages: ['app.a', 'app.b', 'app.a'],
      edges: [],
    },
  ],
  rules: [
    {
      id: 'cyclic-dependencies',
      status: 'failed',
      policy: 'blocking',
      message: 'Detected a cyclic dependency.',
      details: [],
      evidence: {},
    },
  ],
};
