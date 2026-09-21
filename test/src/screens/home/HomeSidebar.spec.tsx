import { describe, expect, it, render } from '@artiphishle/testosterone';
import React from 'react';

import { SettingsProvider } from '@/contexts/SettingsContext';
import { HomeSidebar } from '@/screens/home/HomeSidebar';
import type { Audit } from '@/types/audit';

describe('[HomeSidebar]', () => {
  it('omits the Rules tab when the audit has no findings', () => {
    const { container, unmount } = render(
      <SettingsProvider>
        <HomeSidebar
          cycleSelection={{ highlights: [], selectedIds: [], setSelected: () => undefined }}
          evaluation={passedEvaluation}
          inspectedCycleId={null}
          projectTree={[]}
          selectedTreeId={null}
          onCycleInspectionChange={() => undefined}
          onProjectTreeSelect={() => undefined}
        />
      </SettingsProvider>
    );

    expect(container.textContent?.includes('Rules · 0 Findings')).toBe(false);
    unmount();
  });
});

const passedEvaluation: Audit['evaluation'] = {
  cyclicPackages: [],
  rules: [
    {
      id: 'cyclic-dependencies',
      status: 'passed',
      policy: 'blocking',
      message: 'No cyclic dependencies detected.',
      details: [],
      evidence: {},
    },
  ],
};
