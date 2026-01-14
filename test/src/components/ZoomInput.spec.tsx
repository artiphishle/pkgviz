import { describe,expect,it,resolve, } from '@artiphishle/testosterone';
import React from 'react';
import { render } from '@artiphishle/testosterone/src/react/render';
import cytoscape from 'cytoscape';
import ZoomInput from '@/components/ZoomInput';

describe('Components', () => {
  it('renders the ZoomInput', () => {
    process.env.NEXT_PUBLIC_PROJECT_PATH = resolve(process.cwd(), 'examples/java/my-app');

    const cyInstance = cytoscape();
    const { getByText } = render(<ZoomInput cyInstance={cyInstance} />);

    expect(getByText('Zoom')).toBeDefined();
  });
});
