import { describe, expect, it, render } from '@artiphishle/testosterone';
import React, { act, useState } from 'react';
import { createRoot } from 'react-dom/client';

import { useGraphFocus } from '@/features/graph-view/adapters/inbound/react/useGraphFocus';
import { useGraphProjection } from '@/features/graph-view/adapters/inbound/react/useGraphProjection';
import type { CycleHighlight } from '@/types/auditVisualization';

describe('[cycle projection workflow]', () => {
  it('settles ancestor/descendant cycles without fighting automatic package navigation', async () => {
    const ancestor = 'io.reflectoring.coderadar';
    const descendant = ancestor + '.analyzer.service';
    const elements = {
      nodes: [ancestor, ancestor + '.analyzer', descendant, ancestor + '.query'].map(id => ({
        data: { id },
      })),
      edges: [{ data: { source: ancestor, target: descendant, weight: 1 } }],
    };
    const active: readonly CycleHighlight[] = [
      {
        id: 'ancestor-cycle',
        color: 'red',
        cycle: { packages: [ancestor, descendant, ancestor], edges: [] },
      },
    ];
    const transitions: string[] = [];
    const host = render(<div />);
    const root = createRoot(host.container);

    function Harness({ highlights }: { highlights: readonly CycleHighlight[] }) {
      const [currentPackage, setCurrentPackage] = useState(ancestor);
      const [subPackageDepth, setSubPackageDepth] = useState(1);
      const [, setMaxSubPackageDepth] = useState(1);
      const navigate = (scope: string) => {
        transitions.push(scope);
        if (transitions.length > 10) throw new Error('Projection did not settle');
        setCurrentPackage(scope);
      };
      const visibleElements = useGraphProjection({
        currentPackage,
        elements,
        subPackageDepth,
        preservePackageScope: highlights.length > 0,
        setCurrentPackage: navigate,
        setMaxSubPackageDepth,
        showCompoundNodes: false,
        showVendorPackages: true,
      });
      useGraphFocus({
        currentPackage,
        cycleHighlights: highlights,
        setCurrentPackage: navigate,
        setSubPackageDepth,
        subPackageDepth,
        visibleElements,
      });
      return (
        <output data-scope={currentPackage}>
          {visibleElements?.nodes.map(node => node.data.id).join('|')}
        </output>
      );
    }

    try {
      await act(async () => root.render(<Harness highlights={[]} />));
      await act(async () => root.render(<Harness highlights={active} />));
      expect(host.container.querySelector('output')?.getAttribute('data-scope')).toBe(
        'io.reflectoring'
      );
      expect(host.container.querySelector('output')?.textContent?.split('|')).toContain(ancestor);
      expect(host.container.querySelector('output')?.textContent?.split('|')).toContain(descendant);
      expect(transitions).toEqual(['io.reflectoring']);
      await act(async () => root.render(<Harness highlights={active} />));
      expect(transitions).toEqual(['io.reflectoring']);
      await act(async () => root.render(<Harness highlights={[]} />));
      expect(transitions).toEqual(['io.reflectoring', ancestor]);
      await act(async () => root.render(<Harness highlights={active} />));
      expect(transitions).toEqual(['io.reflectoring', ancestor, 'io.reflectoring']);
    } finally {
      await act(async () => root.unmount());
      host.unmount();
    }
  });
});
