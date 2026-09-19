import { describe, expect, it, render } from '@artiphishle/testosterone';
import React from 'react';

import { Sidebar } from '@/components/sidebar/Sidebar';

describe('[Sidebar]', () => {
  it('keeps a fixed width while constraining flexible content to the viewport', () => {
    const { container, getByText } = render(
      <Sidebar>
        <span>Settings and rules</span>
      </Sidebar>
    );

    const aside = container.querySelector('aside');
    expect(aside?.className.includes('w-[18rem]')).toBe(true);
    expect(aside?.className.includes('min-w-[18rem]')).toBe(true);
    expect(aside?.className.includes('max-w-[18rem]')).toBe(true);
    expect(aside?.className.includes('flex-col')).toBe(true);
    expect(aside?.className.includes('min-h-0')).toBe(true);
    expect(aside?.className.includes('self-stretch')).toBe(true);
    expect(aside?.className.includes('h-full')).toBe(false);
    expect(aside?.className.includes('overflow-hidden')).toBe(true);
    expect(getByText('Settings and rules')).toBeDefined();
  });
});
