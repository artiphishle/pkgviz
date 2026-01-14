import React from 'react';
import { describe, expect, it, render, resolve } from '@artiphishle/testosterone';
import Breadcrumb from '@/components/Breadcrumb';

describe('Components', () => {
  it('renders the Breadcrumb', async () => {
    process.env.NEXT_PUBLIC_PROJECT_PATH = resolve(process.cwd(), 'examples/java/my-app');

    const { getByText } = await render(<Breadcrumb path="/myapp" onNavigate={() => {}} />);

    expect(getByText('myapp')).toBeDefined();
  });
});
