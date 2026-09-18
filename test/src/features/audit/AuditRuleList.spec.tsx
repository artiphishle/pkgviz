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
  it('opens cyclic findings with a count badge and only cycle-level checkboxes', () => {
    const { container, getByText } = render(
      <AuditRuleList evaluation={failedEvaluation} onCycleHighlightsChange={() => undefined} />
    );

    expect(getByText('Cyclic dependencies')).toBeDefined();
    expect(getByText('2')).toBeDefined();
    expect(getByText('app.a → app.b → app.a')).toBeDefined();
    expect(getByText('app.self → app.self')).toBeDefined();
    expect(container.querySelectorAll('input[type="checkbox"]').length).toBe(2);
  });

  it('disables an empty cyclic-dependencies category without pass/fail decoration', () => {
    const { container, getByText, queryByText } = render(
      <AuditRuleList evaluation={passedEvaluation} onCycleHighlightsChange={() => undefined} />
    );

    const title = getByText('Cyclic dependencies');
    expect(title.closest('button')?.hasAttribute('disabled')).toBe(true);
    expect(queryByText('Passed')).toBeNull();
    expect(queryByText('Failed')).toBeNull();
    expect(container.querySelectorAll('input[type="checkbox"]').length).toBe(0);
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
