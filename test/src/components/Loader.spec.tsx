import React from 'react';
import { describe, expect, it, render, resolve } from '@artiphishle/testosterone';
import Loader from '@/components/Loader';

describe('Components', () => {
  it('renders the Loader', () => {
    process.env.NEXT_PUBLIC_PROJECT_PATH = resolve(process.cwd(), 'examples/java/my-app');

    const { getByTestId } = render(<Loader />);
    expect(getByTestId('loader')).toBeDefined();
  });
});
