import { describe, expect, it } from '@artiphishle/testosterone';

import cytoscape from 'cytoscape';

import { getCycleColor } from '@/features/audit/utils/cycleVisualization';

describe('[getCycleColor]', () => {
  it('returns a Cytoscape-compatible non-primary cycle color', () => {
    const color = getCycleColor(1);
    const cy = cytoscape({
      elements: [{ data: { id: 'cycle' } }],
      headless: true,
      style: [
        {
          selector: 'node',
          style: { 'background-color': color },
        },
      ],
      styleEnabled: true,
    });

    try {
      expect(color).toBe('hsl(138, 68%, 45%)');
      expect(cy.getElementById('cycle').numericStyle('background-color')).toEqual([37, 193, 84]);
    } finally {
      cy.destroy();
    }
  });
});
