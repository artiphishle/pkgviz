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

  it('lets active tab content consume the remaining sidebar height', () => {
    const { container } = render(
      <SidebarTabs
        ariaLabel="Sidebar tools"
        value="tree"
        onValueChange={() => undefined}
        tabs={[{ id: 'tree', label: 'Tree', content: <span>Tree content</span> }]}
      />
    );

    const root = container.querySelector('[data-orientation="horizontal"]');
    const content = container.querySelector('[role="tabpanel"]');
    expect(root?.className.includes('flex-1')).toBe(true);
    expect(root?.className.includes('min-h-0')).toBe(true);
    expect(content?.className.includes('flex-1')).toBe(true);
    expect(content?.className.includes('overflow-y-auto')).toBe(true);
  });
});
