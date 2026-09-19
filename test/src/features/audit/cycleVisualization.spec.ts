import { describe, expect, it } from '@artiphishle/testosterone';

import cytoscape from 'cytoscape';

import {
  createCycleFocus,
  getCycleColor,
  getCycleId,
} from '@/features/audit/utils/cycleVisualization';
import type { PackageCycleDetail } from '@/types/audit';

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

describe('[createCycleFocus]', () => {
  it('uses the deepest common package and least depth for one cycle', () => {
    const cycle: PackageCycleDetail = {
      packages: ['app.feature.a', 'app.feature.b', 'app.feature.a'],
      edges: [],
    };

    expect(createCycleFocus([cycle], [getCycleId(cycle, 0)])).toEqual({
      currentPackage: 'app.feature',
      packageDepth: 1,
    });
  });

  it('backs up when the common package is itself part of the cycle', () => {
    const cycle: PackageCycleDetail = {
      packages: ['app.feature', 'app.feature.child', 'app.feature'],
      edges: [],
    };

    expect(createCycleFocus([cycle], [getCycleId(cycle, 0)])).toEqual({
      currentPackage: 'app',
      packageDepth: 2,
    });
  });

  it('widens focus just enough for multiple selected cycles', () => {
    const firstCycle: PackageCycleDetail = {
      packages: ['app.feature.a', 'app.feature.b', 'app.feature.a'],
      edges: [],
    };
    const secondCycle: PackageCycleDetail = {
      packages: ['app.other.deep.c', 'app.other.deep.d', 'app.other.deep.c'],
      edges: [],
    };

    expect(
      createCycleFocus(
        [firstCycle, secondCycle],
        [getCycleId(firstCycle, 0), getCycleId(secondCycle, 1)]
      )
    ).toEqual({
      currentPackage: 'app',
      packageDepth: 3,
    });
  });

  it('does not request a focus when no cycle is selected', () => {
    expect(createCycleFocus([], [])).toBeNull();
  });
});
