import { describe, expect, it, render } from '@artiphishle/testosterone';
import React from 'react';

import { AuditRulePanel } from '@/features/audit/adapters/inbound/react/AuditRulePanel';

describe('[AuditRulePanel]', () => {
  it('shows the cyclic-dependencies category before audit findings finish loading', () => {
    const { getByText } = render(
      <AuditRulePanel
        loadAudit={() => new Promise(() => undefined)}
        onCycleHighlightsChange={() => undefined}
      />
    );

    expect(getByText('Cyclic Dependencies')).toBeDefined();
    expect(getByText('Loading audit…')).toBeDefined();
  });
});
