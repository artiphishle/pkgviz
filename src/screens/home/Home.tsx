'use client';
import type { ElementsDefinition } from 'cytoscape';

import React, { useEffect, useState } from 'react';
import { API_GET_GRAPH } from '@/app/api/constants';
import Breadcrumb from '@/components/Breadcrumb';
import Header from '@/components/Header';
import Loader from '@/components/Loader';
import Settings from '@/components/Settings';
import { Cytoscape } from '@/components/Cytoscape';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { getJson } from '@/utils/getJson';

export default function HomeScreen() {
  const [currentPackage, setCurrentPackage] = useState<string>('');
  const [packageGraph, setPackageGraph] = useState<ElementsDefinition | null>(null);

  /** @todo Don't generate the graph on every page reload */
  useEffect(() => {
    if (!packageGraph) getJson<ElementsDefinition>(API_GET_GRAPH).then(setPackageGraph);
  }, [packageGraph]);

  return (
    <>
      <Header title="nav.packages">
        <Breadcrumb
          path={currentPackage.replace(/\./g, '/')}
          onNavigate={(path: string) => setCurrentPackage(path.replace(/\//g, '.'))}
        />
      </Header>

      <SettingsProvider>
        <main data-testid="main" className="flex flex-1 flex-row dark:bg-[#171717]">
          <Settings />
          {packageGraph ? (
            <Cytoscape
              currentPackage={currentPackage}
              setCurrentPackage={setCurrentPackage}
              packageGraph={packageGraph}
            />
          ) : (
            <Loader />
          )}
        </main>
      </SettingsProvider>
    </>
  );
}
