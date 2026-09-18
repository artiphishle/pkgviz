import { describe, expect, it, render } from '@artiphishle/testosterone';
import React from 'react';

import { SidebarTabs } from '@/components/sidebar/SidebarTabs';

describe('[SidebarTabs]', () => {
  it('supports disabled secondary tabs while leaving Export available', () => {
    const { container, getByText } = render(
      <SidebarTabs
        ariaLabel="Sidebar tools"
        value={null}
        onValueChange={() => undefined}
        tabs={[
          { id: 'rules', label: 'Rules', content: <span>Rules content</span>, disabled: true },
          { id: 'export', label: 'Export', content: <span>Export content</span> },
        ]}
      />
    );

    expect(getByText('Rules')).toBeDefined();
    expect(getByText('Export')).toBeDefined();
    const disabledTab = container.querySelector('[role="tab"][data-disabled]');
    expect(disabledTab?.textContent).toBe('Rules');
    expect(container.querySelectorAll('[role="tab"][data-disabled]').length).toBe(1);
  });
});
