import { describe, expect, it, render, resolve } from '@artiphishle/testosterone';
import React from 'react';
import cytoscape from 'cytoscape';
import ZoomInput from '@/components/ZoomInput';

describe('Components', () => {
  it('renders the ZoomInput', async () => {
    process.env.NEXT_PUBLIC_PROJECT_PATH = resolve(process.cwd(), 'examples/java/my-app');

    const cyInstance = cytoscape();
    const { getByText } = await render(<ZoomInput cyInstance={cyInstance} />);

    expect(getByText('Zoom')).toBeDefined();
  });
});
