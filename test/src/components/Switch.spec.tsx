import React from 'react';
import { resolve } from 'node:path';
import { describe, it } from 'node:test';
import { expect } from '@artiphishle/testosterone/src/matchers';
import { render } from '@artiphishle/testosterone/src/react/render';
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
