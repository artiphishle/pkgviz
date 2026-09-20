import React from 'react';
import { describe, expect, it, render } from '@artiphishle/testosterone';

import Breadcrumb from '@/components/Breadcrumb';

describe('[Breadcrumb]', () => {
  it('renders no empty breadcrumb segment for the root path', () => {
    const { container } = render(<Breadcrumb path="" onNavigate={() => undefined} />);

    expect(container.querySelectorAll('a').length).toBe(1);
  });

  it('ignores leading separators and renders only real package segments', () => {
    const { container, getByText } = render(
      <Breadcrumb path="/myapp/feature" onNavigate={() => undefined} />
    );

    expect(getByText('myapp')).toBeDefined();
    expect(getByText('feature')).toBeDefined();
    expect(container.querySelectorAll('a').length).toBe(3);
  });
});
