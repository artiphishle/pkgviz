import React from 'react';
import { resolve } from 'node:path';
import { describe, it } from 'node:test';
import { expect } from '@artiphishle/testosterone/src/matchers';
import { render } from '@artiphishle/testosterone/src/react/render';
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
