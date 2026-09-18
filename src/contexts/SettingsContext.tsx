import { useLocalStorage } from 'ankh-hooks';
import type { LayoutOptions } from 'cytoscape';
import React, { createContext, type PropsWithChildren, use } from 'react';

import { readSettingsEnvironment } from '@/features/settings/utils/readSettingsEnvironment';

// Settings context
const SettingsContext = createContext<ISettingsContext | null>(null);

/*** Provides persisted graph settings to the application. */
export const SettingsProvider = ({ children }: PropsWithChildren) => {
  const environment = readSettingsEnvironment();
  const [maxSubPackageDepth, setMaxSubPackageDepth] = useMaxSubPackageDepthSetting();
  const [showCompoundNodes, setShowCompoundNodes] = useLocalStorage<boolean>(
    'showCompoundNodes',
    environment.showCompoundNodes
  );
  const [showVendorPackages, setShowVendorPackages] = useLocalStorage<boolean>(
    'showVendorPackages',
    environment.showVendorPackages
  );
  const [subPackageDepth, setSubPackageDepth] = useLocalStorage<number>(
    'subPackageDepth',
    environment.subPackageDepth
  );
  const [cytoscapeLayout, setCytoscapeLayout] = useLocalStorage<LayoutOptions['name']>(
    'cytoscapeLayout',
    environment.cytoscapeLayout
  );
  const [cytoscapeLayoutSpacing, setCytoscapeLayoutSpacing] = useLocalStorage<number>(
    'cytoscapeLayoutSpacing',
    environment.cytoscapeLayoutSpacing
  );

  /*** Toggles vendor package visibility. */
  const toggleShowVendorPackages = () => setShowVendorPackages(prev => !prev);
  /*** Toggles compound node visibility. */
  const toggleShowCompoundNodes = () => setShowCompoundNodes(prev => !prev);

  return (
    <SettingsContext
      value={{
        cytoscapeLayout,
        cytoscapeLayoutSpacing,
        maxSubPackageDepth,
        showCompoundNodes,
        showVendorPackages,
        subPackageDepth,
        setCytoscapeLayout,
        setCytoscapeLayoutSpacing,
        setMaxSubPackageDepth,
        setSubPackageDepth,
        toggleShowCompoundNodes,
        toggleShowVendorPackages,
      }}
    >
      {children}
    </SettingsContext>
  );
};

/*** Owns the persisted maximum package-depth state. */
function useMaxSubPackageDepthSetting() {
  return useLocalStorage<number>('maxSubPackageDepth', 1);
}

/*** Returns the current graph settings context. */
export function useSettings() {
  const context = use(SettingsContext);
  if (!context) throw new Error('useSettings() must be used within a SettingsProvider');
  return context;
}

interface ISettingsContext {
  readonly cytoscapeLayout: LayoutOptions['name'];
  readonly cytoscapeLayoutSpacing: number;
  readonly maxSubPackageDepth: number;
  readonly subPackageDepth: number;
  readonly showCompoundNodes: boolean;
  readonly showVendorPackages: boolean;
  readonly setCytoscapeLayout: (layout: LayoutOptions['name']) => void;
  readonly setCytoscapeLayoutSpacing: (layoutSpacing: number) => void;
  readonly setMaxSubPackageDepth: (depth: number) => void;
  readonly setSubPackageDepth: (depth: number) => void;
  readonly toggleShowCompoundNodes: () => void;
  readonly toggleShowVendorPackages: () => void;
}
