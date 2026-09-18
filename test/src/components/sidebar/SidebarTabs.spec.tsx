import { describe, expect, it, render } from '@artiphishle/testosterone';
import React from 'react';

import { SidebarTabs } from '@/components/sidebar/SidebarTabs';

describe('[SidebarTabs]', () => {
  it('keeps mutually exclusive sidebar views available as a reusable primitive', () => {
    const { getByText } = render(
      <SidebarTabs
        tabs={[
          { id: 'one', label: 'One', content: <span>First</span> },
          { id: 'two', label: 'Two', content: <span>Second</span> },
        ]}
      />
    );

    expect(getByText('One')).toBeDefined();
    expect(getByText('Two')).toBeDefined();
    expect(getByText('First')).toBeDefined();
  });
});
