import { describe,expect,it,resolve, } from '@artiphishle/testosterone';
import React from 'react';
import { render } from '@artiphishle/testosterone/src/react/render';
import Switch from '@/components/Switch';

describe('Components', () => {
  it('renders the Switch', () => {
    process.env.NEXT_PUBLIC_PROJECT_PATH = resolve(process.cwd(), 'examples/java/my-app');

    const { getByText } = render(
      <Switch id="test" label="Test Switch" value={false} onToggle={() => {}} />
    );

    expect(getByText('Test Switch')).toBeDefined();
  });
});
