import { describe, expect, it, render } from '@artiphishle/testosterone';
import React from 'react';

import { AuditRuleTabs } from '@/features/audit/adapters/inbound/react/AuditRuleTabs';
import type { AuditRuleResult, PackageCycleDetail } from '@/types/audit';

const cycles: readonly PackageCycleDetail[] = [
  {
    packages: ['app.a', 'app.b', 'app.a'],
    edges: [
      {
        from: 'app.a',
        to: 'app.b',
        via: [
          {
            filePath: 'src/a.ts',
            fileClass: 'A',
            importName: 'app.b.B',
            isIntrinsic: true,
          },
        ],
      },
      {
        from: 'app.b',
        to: 'app.a',
        via: [],
      },
    ],
  },
  {
    packages: ['app.self', 'app.self'],
    edges: [{ from: 'app.self', to: 'app.self', via: [] }],
  },
];

describe('[AuditRuleTabs]', () => {
  it('shows failed cycle status, multiple cycles, and existing import evidence', () => {
    const { container, getByText } = render(
      <AuditRuleTabs cyclicPackages={cycles} rules={[failedRule]} />
    );

    expect(container.querySelector('[role="tablist"]')?.getAttribute('aria-label')).toBe(
      'Audit rules'
    );
    expect(container.querySelectorAll('[role="tab"]').length).toBe(1);
    expect(getByText('Failed')).toBeDefined();
    expect(getByText('app.a → app.b → app.a')).toBeDefined();
    expect(getByText('app.self → app.self')).toBeDefined();
    expect(getByText('src/a.ts')).toBeDefined();
    expect(getByText('app.b.B')).toBeDefined();
  });

  it('shows the explicit satisfied state', () => {
    const { getByText } = render(
      <AuditRuleTabs cyclicPackages={[]} rules={[passedRule]} />
    );

    expect(getByText('Passed')).toBeDefined();
    expect(getByText('No cyclic package dependencies detected.')).toBeDefined();
  });
});

const failedRule: AuditRuleResult = {
  id: 'cyclic-dependencies',
  status: 'failed',
  policy: 'blocking',
  message: 'Detected 2 cyclic package dependencies.',
  details: cycles.map(cycle => cycle.packages.join(' → ')),
  evidence: { cycles },
};

const passedRule: AuditRuleResult = {
  id: 'cyclic-dependencies',
  status: 'passed',
  policy: 'blocking',
  message: 'No cyclic package dependencies detected.',
  details: [],
  evidence: { cycles: [] },
};
