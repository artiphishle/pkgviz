import { describe, expect, it, render, resolve } from '@artiphishle/testosterone';
import React from 'react';
import Switch from '@/components/Switch';

describe('Components', () => {
  it('renders the Switch', async () => {
    process.env.NEXT_PUBLIC_PROJECT_PATH = resolve(process.cwd(), 'examples/java/my-app');

    const { getByText } = await render(
      <Switch id="test" label="Test Switch" value={false} onToggle={() => {}} />
    );

    expect(getByText('Test Switch')).toBeDefined();
  });
});
