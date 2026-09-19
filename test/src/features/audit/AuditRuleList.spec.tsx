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
      { from: 'app.b', to: 'app.a', via: [] },
    ],
  },
  {
    packages: ['app.self', 'app.self'],
    edges: [{ from: 'app.self', to: 'app.self', via: [] }],
  },
];

describe('[AuditRuleList]', () => {
  it('shows violated cycles compactly with right-aligned disabled switches by default', () => {
    const { container, getByText } = render(
      <AuditRuleList
        evaluation={failedEvaluation}
        onCycleFocusChange={() => undefined}
        onCycleHighlightsChange={() => undefined}
        onCycleInspectionChange={() => undefined}
      />
    );

    expect(getByText('Cyclic Dependencies')).toBeDefined();
    expect(getByText('2')).toBeDefined();
    expect(getByText('app.a → app.b → app.a')).toBeDefined();
    expect(getByText('app.self → app.self')).toBeDefined();

    const switches = Array.from(
      container.querySelectorAll<HTMLButtonElement>('button[role="switch"]')
    );
    expect(switches.length).toBe(2);
    expect(switches.every(control => control.getAttribute('aria-checked') === 'false')).toBe(true);
    expect(switches.every(control => control.parentElement?.lastElementChild === control)).toBe(true);
    expect(container.textContent?.includes('src/a.ts')).toBe(false);
  });

  it('does not render satisfied rules in the Rules tab', () => {
    const { container } = render(
      <AuditRuleList
        evaluation={passedEvaluation}
        onCycleFocusChange={() => undefined}
        onCycleHighlightsChange={() => undefined}
        onCycleInspectionChange={() => undefined}
      />
    );

    expect(container.textContent).toBe('');
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
