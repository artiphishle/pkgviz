import { describe, expect, it } from '@artiphishle/testosterone';

import type { StylesheetStyle } from 'cytoscape';

import { getStyle } from '@/layouts/style';

describe('[getStyle]', () => {
  it('uses edge routing that can render lifted self-loops', () => {
    const styles = getStyle(
      {
        nodes: [{ data: { id: 'app' } }],
        edges: [{ data: { source: 'app', target: 'app', weight: 1 } }],
      },
      'light'
    );

    const edgeStyle = styles.find(
      (style): style is StylesheetStyle => 'style' in style && style.selector === 'edge'
    );

    const curveStyle =
      edgeStyle && 'curve-style' in edgeStyle.style ? edgeStyle.style['curve-style'] : undefined;

    expect(curveStyle).toBe('bezier');
  });
});
