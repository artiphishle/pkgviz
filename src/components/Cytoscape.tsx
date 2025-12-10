'use client';
import type { ElementsDefinition } from 'cytoscape';

import React from 'react';
import { useCytoscape } from '@/components/useCytoscape';
import ZoomInput from '@/components/ZoomInput';

export function Cytoscape({ currentPackage, packageGraph, setCurrentPackage }: CytoscapeProps) {
  const { cyRef, cyInstance } = useCytoscape(packageGraph, currentPackage, setCurrentPackage);

  return (
    <div className="flex flex-col w-full px-8 flex-1 gap-2">
      <div ref={cyRef} className="h-[calc(100%-65px)]" />
      <ZoomInput cyInstance={cyInstance} />
    </div>
  );
}

interface CytoscapeProps {
  readonly currentPackage: string;
  readonly packageGraph: ElementsDefinition | null;
  readonly setCurrentPackage: (path: string) => void;
}
