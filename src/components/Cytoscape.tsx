'use client';
import type { ElementsDefinition } from 'cytoscape';
import React from 'react';

import { useCytoscape } from '@/components/useCytoscape';
import ZoomInput from '@/components/ZoomInput';
import type { GraphCycleHighlight } from '@/types/graphCycleHighlight';

/*** Renders the interactive dependency graph. */
export function Cytoscape({
  currentPackage,
  cycleHighlights,
  packageGraph,
  setCurrentPackage,
}: CytoscapeProps) {
  const { cyRef, cyInstance } = useCytoscape(
    packageGraph,
    currentPackage,
    setCurrentPackage,
    cycleHighlights
  );

  return (
    <div className="flex flex-col w-full px-8 flex-1 gap-2">
      <div ref={cyRef} className="h-[calc(100%-65px)]" />
      <ZoomInput cyInstance={cyInstance} />
    </div>
  );
}

interface CytoscapeProps {
  readonly currentPackage: string;
  readonly cycleHighlights: readonly GraphCycleHighlight[];
  readonly packageGraph: ElementsDefinition | null;
  readonly setCurrentPackage: (path: string) => void;
}
