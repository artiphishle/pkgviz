import type { LayoutOptions } from 'cytoscape';
import React, { createContext, type PropsWithChildren, use } from 'react';

import {
  getCytoscapeLayout,
  getCytoscapeLayoutSpacing,
  getRulesEnabled,
  getShowCompoundNodes,
  getShowVendorPackages,
  getSubPackageDepth,
} from '@/shared/utils/parseEnv';
import { useLocalStorage } from '@/store/useLocalStorage';

const SettingsContext = createContext<ISettingsContext | null>(null);

/*** Provides persisted graph settings to the application. */
export const SettingsProvider = ({ children }: PropsWithChildren) => {
  const value = useSettingsValue();
  return <SettingsContext value={value}>{children}</SettingsContext>;
};

/*** Returns the current graph settings context. */
export function useSettings() {
  const context = use(SettingsContext);
  if (!context) throw new Error('useSettings() must be used within a SettingsProvider');
  return context;
}

/*** Creates the persisted settings value while keeping provider composition small. */
function useSettingsValue(): ISettingsContext {
  const [maxSubPackageDepth, setMaxSubPackageDepth] = useLocalStorage<number>(
    'maxSubPackageDepth',
    1
  );
  const [rulesEnabled, setRulesEnabled] = useLocalStorage('rulesEnabled', getRulesEnabled());
  const [showCompoundNodes, setShowCompoundNodes] = useLocalStorage(
    'showCompoundNodes',
    getShowCompoundNodes()
  );
  const [showVendorPackages, setShowVendorPackages] = useLocalStorage(
    'showVendorPackages',
    getShowVendorPackages()
  );
  const [subPackageDepth, setSubPackageDepth] = useLocalStorage(
    'subPackageDepth',
    getSubPackageDepth() || 1
  );
  const [cytoscapeLayout, setCytoscapeLayout] = useLocalStorage<LayoutOptions['name']>(
    'cytoscapeLayout',
    getCytoscapeLayout()
  );
  const [cytoscapeLayoutSpacing, setCytoscapeLayoutSpacing] = useLocalStorage(
    'cytoscapeLayoutSpacing',
    getCytoscapeLayoutSpacing()
  );

  return {
    cytoscapeLayout,
    cytoscapeLayoutSpacing,
    maxSubPackageDepth,
    rulesEnabled,
    showCompoundNodes,
    showVendorPackages,
    subPackageDepth,
    setCytoscapeLayout,
    setCytoscapeLayoutSpacing,
    setMaxSubPackageDepth,
    setSubPackageDepth,
    toggleRulesEnabled: () => setRulesEnabled(previous => !previous),
    toggleShowCompoundNodes: () => setShowCompoundNodes(previous => !previous),
    toggleShowVendorPackages: () => setShowVendorPackages(previous => !previous),
  };
}

interface ISettingsContext {
  readonly cytoscapeLayout: LayoutOptions['name'];
  readonly cytoscapeLayoutSpacing: number;
  readonly maxSubPackageDepth: number;
  readonly rulesEnabled: boolean;
  readonly subPackageDepth: number;
  readonly showCompoundNodes: boolean;
  readonly showVendorPackages: boolean;
  readonly setCytoscapeLayout: (layout: LayoutOptions['name']) => void;
  readonly setCytoscapeLayoutSpacing: (layoutSpacing: number) => void;
  readonly setMaxSubPackageDepth: (depth: number) => void;
  readonly setSubPackageDepth: (depth: number) => void;
  readonly toggleRulesEnabled: () => void;
  readonly toggleShowCompoundNodes: () => void;
  readonly toggleShowVendorPackages: () => void;
}
