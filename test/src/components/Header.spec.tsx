import { describe, expect, it, render, resolve } from '@artiphishle/testosterone';
import React from 'react';
import Header from '@/components/Header';

describe('Components', () => {
  it('renders the Header', async () => {
    process.env.NEXT_PUBLIC_PROJECT_PATH = resolve(process.cwd(), 'examples/java/my-app');

    const { getByText } = await render(<Header />);
    expect(getByText('my-app')).toBeDefined();
  });
});
