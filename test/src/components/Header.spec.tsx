import { describe,expect,it,resolve, } from '@artiphishle/testosterone';
import React from 'react';
import { render } from '@artiphishle/testosterone/src/react/render';
import Header from '@/components/Header';

describe('Components', () => {
  it('renders the Header', () => {
    process.env.NEXT_PUBLIC_PROJECT_PATH = resolve(process.cwd(), 'examples/java/my-app');

    const { getByText } = render(<Header />);
    expect(getByText('my-app')).toBeDefined();
  });
});
