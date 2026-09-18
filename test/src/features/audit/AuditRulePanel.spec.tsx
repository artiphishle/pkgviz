import { describe, expect, it, render } from '@artiphishle/testosterone';
import React from 'react';

import { SettingsProvider } from '@/contexts/SettingsContext';
import { AuditRulePanel } from '@/features/audit/adapters/inbound/react/AuditRulePanel';

describe('[AuditRulePanel]', () => {
  it('shows the cyclic-dependencies category and switch before findings finish loading', () => {
    window.localStorage.clear();

    const { container, getByText } = render(
      <SettingsProvider>
        <AuditRulePanel
          loadAudit={() => new Promise(() => undefined)}
          onCycleHighlightsChange={() => undefined}
          onCycleInspectionChange={() => undefined}
        />
      </SettingsProvider>
    );

    expect(getByText('Cyclic Dependencies')).toBeDefined();
    expect(getByText('Loading audit…')).toBeDefined();
    expect(container.querySelectorAll('[role="switch"]').length).toBe(1);
  });
});
