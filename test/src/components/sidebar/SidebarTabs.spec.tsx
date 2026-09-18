import { describe, expect, it, render } from '@artiphishle/testosterone';
import React from 'react';

import { SidebarTabs } from '@/components/sidebar/SidebarTabs';

describe('[SidebarTabs]', () => {
  it('supports disabled secondary tabs while leaving Export available', () => {
    const { getByText } = render(
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

    expect(getByText('Rules').closest('button')?.hasAttribute('disabled')).toBe(true);
    expect(getByText('Export').closest('button')?.hasAttribute('disabled')).toBe(false);
  });
});
