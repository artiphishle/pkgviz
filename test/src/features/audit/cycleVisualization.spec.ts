import { describe, expect, it } from '@artiphishle/testosterone';

import cytoscape from 'cytoscape';

import {
  createCycleFocus,
  getCycleColor,
} from '@/features/audit/utils/cycleVisualization';
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
  it('preserves the current scope when it already contains the active cycle', () => {
    const cycle: PackageCycleDetail = {
      packages: ['app.feature.a', 'app.feature.b', 'app.feature.a'],
      edges: [],
    };

    expect(createCycleFocus([highlight(cycle)], 'app.feature')).toEqual({
      currentPackage: 'app.feature',
      packageDepth: 1,
    });
  });

  it('only increases the required depth inside an already valid broader scope', () => {
    const cycle: PackageCycleDetail = {
      packages: ['app.feature.a', 'app.feature.b', 'app.feature.a'],
      edges: [],
    };

    expect(createCycleFocus([highlight(cycle)], 'app')).toEqual({
      currentPackage: 'app',
      packageDepth: 2,
    });
  });

  it('widens an incompatible scope only to the common active-cycle ancestor', () => {
    const cycle: PackageCycleDetail = {
      packages: ['app.feature.a', 'app.feature.b', 'app.feature.a'],
      edges: [],
    };

    expect(createCycleFocus([highlight(cycle)], 'other')).toEqual({
      currentPackage: 'app.feature',
      packageDepth: 1,
    });
  });

  it('backs up when the scope package is itself part of the cycle', () => {
    const cycle: PackageCycleDetail = {
      packages: ['app.feature', 'app.feature.child', 'app.feature'],
      edges: [],
    };

    expect(createCycleFocus([highlight(cycle)], 'app.feature')).toEqual({
      currentPackage: 'app',
      packageDepth: 2,
    });
  });

  it('does not request a focus when no cycle is selected', () => {
    expect(createCycleFocus([], '')).toBeNull();
  });
});

/*** Creates one test highlight around a cycle. */
function highlight(cycle: PackageCycleDetail) {
  return { id: 'cycle', color: '#dc2626', cycle };
}
