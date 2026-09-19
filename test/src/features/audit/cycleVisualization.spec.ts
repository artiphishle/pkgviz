import { describe, expect, it } from '@artiphishle/testosterone';

import cytoscape from 'cytoscape';

import { getCycleColor } from '@/features/audit/utils/cycleVisualization';

describe('[getCycleColor]', () => {
  it('returns distinct Cytoscape-compatible error-red cycle colors', () => {
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
      expect(color).toBe('#b91c1c');
      expect(getCycleColor(2)).toBe('#ef4444');
      expect(cy.getElementById('cycle').numericStyle('background-color')).toEqual([185, 28, 28]);
    } finally {
      cy.destroy();
    }
  });
});
