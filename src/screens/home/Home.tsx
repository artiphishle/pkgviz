'use client';
import type { ElementsDefinition } from 'cytoscape';

import React, { useEffect, useState } from 'react';
import Main from '@/components/Main';
import Header from '@/components/Header';
import Breadcrumb from '@/components/Breadcrumb';
import { useLocalStorage } from '@/store/useLocalStorage';
import { getJson } from '@/utils/getJson';
import Loader from '@/components/Loader';

const API_GET_GRAPH = '/api/fs/getGraph';

export default function HomeScreen() {
  const [currentPackage, setCurrentPackage] = useLocalStorage<string>('currentPackage', '');
  const [packageGraph, setPackageGraph] = useState<ElementsDefinition | null>(null);

  useEffect(() => {
    if (packageGraph) return;

    (async function init() {
      const graph = await getJson<ElementsDefinition>(API_GET_GRAPH);
      setPackageGraph(graph);
    })();
  }, [packageGraph]);

  if (!packageGraph) return <Loader />;

  return (
    <>
      <Header title="nav.packages">
        <Breadcrumb
          path={currentPackage.replace(/\./g, '/')}
          onNavigate={(path: string) => {
            return setCurrentPackage(path.replace(/\//g, '.'));
          }}
        />
      </Header>
      <Main
        currentPackage={currentPackage}
        setCurrentPackage={setCurrentPackage}
        packageGraph={packageGraph}
      />
    </>
  );
}
