import { describe, expect, it, render } from '@artiphishle/testosterone';
import React from 'react';

import { Sidebar } from '@/components/sidebar/Sidebar';

describe('[Sidebar]', () => {
  it('keeps a fixed width while rendering non-tabbed settings content', () => {
    const { container, getByText } = render(
      <Sidebar>
        <span>Settings and rules</span>
      </Sidebar>
    );

    const aside = container.querySelector('aside');
    expect(aside?.className.includes('w-[18rem]')).toBe(true);
    expect(aside?.className.includes('min-w-[18rem]')).toBe(true);
    expect(aside?.className.includes('max-w-[18rem]')).toBe(true);
    expect(getByText('Settings and rules')).toBeDefined();
  });
});
