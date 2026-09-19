import { describe, expect, it } from '@artiphishle/testosterone';

import cytoscape from 'cytoscape';

import { createCycleFocus, getCycleColor } from '@/features/audit/utils/cycleVisualization';
import type { PackageCycleDetail } from '@/types/audit';

describe('[getCycleColor]', () => {
  it('returns visually separated Cytoscape-compatible error-red cycle colors', () => {
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
      expect(getCycleColor(0)).toBe('#dc2626');
      expect(color).toBe('#7f1d1d');
      expect(getCycleColor(2)).toBe('#fb7185');
      expect(cy.getElementById('cycle').numericStyle('background-color')).toEqual([127, 29, 29]);
    } finally {
      cy.destroy();
    }
  });
});

describe('[createCycleFocus]', () => {
  it('uses the narrowest common scope instead of inflating depth from a broad root', () => {
    const cycle: PackageCycleDetail = {
      packages: ['app.feature.deep.a', 'app.feature.deep.b', 'app.feature.deep.a'],
      edges: [],
    };

    expect(createCycleFocus([highlight(cycle)])).toEqual({
      currentPackage: 'app.feature.deep',
      packageDepth: 1,
    });
  });

  it('backs up when the common package is itself part of the cycle', () => {
    const cycle: PackageCycleDetail = {
      packages: ['app.feature', 'app.feature.child', 'app.feature'],
      edges: [],
    };

    expect(createCycleFocus([highlight(cycle)])).toEqual({
      currentPackage: 'app',
      packageDepth: 2,
    });
  });

  it('widens only enough to contain multiple active cycles', () => {
    const firstCycle: PackageCycleDetail = {
      packages: ['app.feature.a', 'app.feature.b', 'app.feature.a'],
      edges: [],
    };
    const secondCycle: PackageCycleDetail = {
      packages: ['app.other.deep.c', 'app.other.deep.d', 'app.other.deep.c'],
      edges: [],
    };

    expect(
      createCycleFocus([highlight(firstCycle, 'first'), highlight(secondCycle, 'second')])
    ).toEqual({
      currentPackage: 'app',
      packageDepth: 3,
    });
  });

  it('does not request a focus when no cycle is selected', () => {
    expect(createCycleFocus([])).toBeNull();
  });
});

/*** Creates one test highlight around a cycle. */
function highlight(cycle: PackageCycleDetail, id = 'cycle') {
  return { id, color: '#dc2626', cycle };
}
