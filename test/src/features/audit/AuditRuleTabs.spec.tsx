import { describe, expect, it, render } from '@artiphishle/testosterone';
import React from 'react';

import { AuditRuleList } from '@/features/audit/adapters/inbound/react/AuditRuleList';
import type { Audit, AuditRuleResult, PackageCycleDetail } from '@/types/audit';

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

describe('[AuditRuleList]', () => {
  it('lists the rule and every cycle path with sidebar checkboxes', () => {
    const { container, getByText } = render(
      <AuditRuleList
        evaluation={failedEvaluation}
        onCycleHighlightsChange={() => undefined}
      />
    );

    expect(getByText('Cyclic dependencies')).toBeDefined();
    expect(getByText('Failed')).toBeDefined();
    expect(getByText('app.a → app.b → app.a')).toBeDefined();
    expect(getByText('app.self → app.self')).toBeDefined();
    expect(container.querySelectorAll('input[type="checkbox"]').length).toBe(3);
  });

  it('shows the explicit satisfied state', () => {
    const { getByText } = render(
      <AuditRuleList
        evaluation={passedEvaluation}
        onCycleHighlightsChange={() => undefined}
      />
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

const failedEvaluation: Audit['evaluation'] = {
  cyclicPackages: cycles,
  rules: [failedRule],
};

const passedEvaluation: Audit['evaluation'] = {
  cyclicPackages: [],
  rules: [passedRule],
};
