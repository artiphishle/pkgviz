'use client';
import type { ElementsDefinition } from 'cytoscape';
import React from 'react';

import Loader from '@/components/Loader';
import { CycleInspector } from '@/features/audit/adapters/inbound/react/CycleInspector';
import { DependencyGraphView } from '@/features/graph-view/adapters/inbound/react/DependencyGraphView';
import type { CycleHighlight, CycleInspection } from '@/types/auditVisualization';

/*** Renders the graph surface together with its optional cycle inspector overlay. */
export function HomeGraph({
  currentPackage,
  cycleHighlights,
  cycleInspection,
  packageGraph,
  setCurrentPackage,
  onCloseInspection,
}: HomeGraphProps) {
  if (!packageGraph) return <Loader />;

  return (
    <DependencyGraphView
      currentPackage={currentPackage}
      setCurrentPackage={setCurrentPackage}
      packageGraph={packageGraph}
      cycleHighlights={cycleHighlights}
      overlay={
        cycleInspection === null ? null : (
          <CycleInspector inspection={cycleInspection} onClose={onCloseInspection} />
        )
      }
    />
  );
}

interface HomeGraphProps {
  readonly currentPackage: string;
  readonly cycleHighlights: readonly CycleHighlight[];
  readonly cycleInspection: CycleInspection | null;
  readonly packageGraph: ElementsDefinition | null;
  readonly setCurrentPackage: (path: string) => void;
  readonly onCloseInspection: () => void;
}
