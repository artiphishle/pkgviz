import { describe,expect,it,resolve, } from '@artiphishle/testosterone';
import React from 'react';
import { render } from '@artiphishle/testosterone/src/react/render';
import Breadcrumb from '@/components/Breadcrumb';

describe('Components', () => {
  it('renders the Breadcrumb', () => {
    process.env.NEXT_PUBLIC_PROJECT_PATH = resolve(process.cwd(), 'examples/java/my-app');

    const { getByText } = render(<Breadcrumb path="/myapp" onNavigate={() => {}} />);
    expect(getByText('myapp')).toBeDefined();
  });
});
