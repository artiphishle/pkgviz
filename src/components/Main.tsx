'use client';
import type { ElementsDefinition } from 'cytoscape';

import React from 'react';
import { Cytoscape } from '@/components/Cytoscape';
import Settings from '@/components/Settings';
import { SettingsProvider } from '@/contexts/SettingsContext';

export default function Main({ currentPackage, packageGraph, setCurrentPackage }: MainProps) {
  return (
    <main data-testid="main" className="p-4 flex flex-col md:flex-row flex-1 dark:bg-[#171717]">
      <SettingsProvider>
        <Settings />
        <Cytoscape
          currentPackage={currentPackage}
          setCurrentPackage={setCurrentPackage}
          packageGraph={packageGraph}
        />
      </SettingsProvider>
    </main>
  );
}

interface MainProps {
  readonly currentPackage: string;
  readonly packageGraph: ElementsDefinition | null;
  readonly setCurrentPackage: (path: string) => void;
}
