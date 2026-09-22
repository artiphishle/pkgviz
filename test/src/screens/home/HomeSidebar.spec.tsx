import { describe, expect, it, render } from '@artiphishle/testosterone';
import { ZoraProvider } from '@zora/ZoraProvider';
import React from 'react';

import { SettingsProvider } from '@/features/settings/adapters/inbound/react/SettingsProvider';
import { HomeSidebar } from '@/screens/home/HomeSidebar';
import type { Audit } from '@/types/audit';

describe('[HomeSidebar]', () => {
  it('omits the Rules tab when the audit has no findings', () => {
    const { container, unmount } = render(
      <ZoraProvider mode="light">
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
      </ZoraProvider>
    );

    expect(container.textContent?.includes('Rules · 0 Findings')).toBe(false);
    unmount();
  });

  it('bounds the tree viewport above persistent graph settings', () => {
    const { container, unmount } = render(
      <ZoraProvider mode="light">
        <SettingsProvider>
          <HomeSidebar
            cycleSelection={{ highlights: [], selectedIds: [], setSelected: () => undefined }}
            evaluation={passedEvaluation}
            inspectedCycleId={null}
            projectTree={[{ graphPackage: 'app', id: 'app', kind: 'directory', label: 'app' }]}
            selectedTreeId={null}
            onCycleInspectionChange={() => undefined}
            onProjectTreeSelect={() => undefined}
          />
        </SettingsProvider>
      </ZoraProvider>
    );
    const getScroll = (name: string) =>
      container.querySelector<HTMLElement>(`[data-testid="sidebar-${name}-scroll"]`);
    const settingsLabel = Array.from(container.querySelectorAll('*')).find(
      element => element.children.length === 0 && element.textContent === 'Layout'
    );
    const panel = getScroll('tree')?.parentElement;
    const shell = panel?.parentElement;

    expect(getScroll('tree')?.textContent).toContain('app');
    expect(panel?.getAttribute('style')).toContain('min-height:0px;flex:1');
    expect(shell?.getAttribute('style')).toContain('overflow-y:hidden');
    expect(settingsLabel?.textContent).toBe('Layout');
    expect(settingsLabel ? getScroll('tree')?.contains(settingsLabel) : undefined).toBe(false);
    expect(settingsLabel ? shell?.contains(settingsLabel) : undefined).toBe(false);
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
