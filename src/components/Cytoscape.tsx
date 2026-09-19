'use client';
import type { ElementsDefinition } from 'cytoscape';
import React from 'react';

import { useCytoscape } from '@/features/graph-view/adapters/inbound/react/useCytoscape';
import ZoomInput from '@/components/ZoomInput';
import type { CycleHighlight } from '@/types/auditVisualization';
import type { GraphRevealRequest } from '@/types/projectTree';

/*** Renders the interactive dependency graph and optional inspection overlay. */
export function Cytoscape({
  currentPackage,
  packageGraph,
  setCurrentPackage,
  cycleHighlights,
  graphRevealRequest,
  overlay,
}: CytoscapeProps) {
  const { cyRef, cyInstance } = useCytoscape(
    packageGraph,
    currentPackage,
    setCurrentPackage,
    cycleHighlights,
    graphRevealRequest
  );

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-2 px-8">
      <div className="relative h-[calc(100%-65px)]">
        <div ref={cyRef} className="h-full" />
        {overlay}
      </div>
      <ZoomInput cyInstance={cyInstance} />
    </div>
  );
}

interface CytoscapeProps {
  readonly currentPackage: string;
  readonly packageGraph: ElementsDefinition | null;
  readonly setCurrentPackage: (path: string) => void;
  readonly cycleHighlights: readonly CycleHighlight[];
  readonly graphRevealRequest: GraphRevealRequest | null;
  readonly overlay?: React.ReactNode;
}
