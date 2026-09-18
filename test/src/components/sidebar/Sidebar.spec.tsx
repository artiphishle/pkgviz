import { describe, expect, it, render } from '@artiphishle/testosterone';
import React from 'react';

import { Sidebar } from '@/components/sidebar/Sidebar';

describe('[Sidebar]', () => {
  it('renders accessible Settings and Rules tabs inside a fixed-width sidebar', () => {
    const { container, getByText } = render(
      <Sidebar settings={<span>Settings content</span>} rules={<span>Rules content</span>} />
    );

    const aside = container.querySelector('aside');
    expect(aside?.className.includes('w-[18rem]')).toBe(true);
    expect(aside?.className.includes('min-w-[18rem]')).toBe(true);
    expect(aside?.className.includes('max-w-[18rem]')).toBe(true);
    expect(getByText('Settings')).toBeDefined();
    expect(getByText('Rules')).toBeDefined();
  });
});
