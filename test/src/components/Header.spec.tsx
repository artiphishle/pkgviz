import React from 'react';
import { resolve } from 'node:path';
import { describe, it } from 'node:test';
import { expect } from '@artiphishle/testosterone/src/matchers';
import { render } from '@artiphishle/testosterone/src/react/render';
import Header from '@/components/Header';

describe('Components', () => {
  it('renders the Header', async () => {
    process.env.NEXT_PUBLIC_PROJECT_PATH = resolve(process.cwd(), 'examples/java/my-app');

    const { getByText } = await render(<Header />);
    expect(getByText('my-app')).toBeDefined();
  });
});
