import type { LayoutOptions } from 'cytoscape';
import React, { createContext, type PropsWithChildren, use } from 'react';

import {
  getCytoscapeLayout,
  getCytoscapeLayoutSpacing,
  getShowCompoundNodes,
  getShowVendorPackages,
  getSubPackageDepth,
} from '@/shared/utils/parseEnv';
import { useLocalStorage } from '@/store/useLocalStorage';
import { getRulesEnabled } from '@/utils/settings/getRulesEnabled';

// Settings context
const SettingsContext = createContext<ISettingsContext | null>(null);

/*** Provides persisted graph settings to the application. */
export const SettingsProvider = ({ children }: PropsWithChildren) => {
  const [maxSubPackageDepth, setMaxSubPackageDepth] = useMaxSubPackageDepthSetting();
  const [rulesEnabled, toggleRulesEnabled] = useRulesEnabledSetting();
  const [showCompoundNodes, setShowCompoundNodes] = useLocalStorage<boolean>(
    'showCompoundNodes',
    getShowCompoundNodes()
  );
  const [showVendorPackages, setShowVendorPackages] = useLocalStorage<boolean>(
    'showVendorPackages',
    getShowVendorPackages()
  );
  const [subPackageDepth, setSubPackageDepth] = useLocalStorage<number>(
    'subPackageDepth',
    getSubPackageDepth() || 1
  );
  const [cytoscapeLayout, setCytoscapeLayout] = useLocalStorage<LayoutOptions['name']>(
    'cytoscapeLayout',
    getCytoscapeLayout()
  );
  const [cytoscapeLayoutSpacing, setCytoscapeLayoutSpacing] = useLocalStorage<number>(
    'cytoscapeLayoutSpacing',
    getCytoscapeLayoutSpacing()
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
        rulesEnabled,
        showCompoundNodes,
        showVendorPackages,
        subPackageDepth,
        setCytoscapeLayout,
        setCytoscapeLayoutSpacing,
        setMaxSubPackageDepth,
        setSubPackageDepth,
        toggleRulesEnabled,
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

/*** Owns the persisted audit-rule visualization setting. */
function useRulesEnabledSetting() {
  const [rulesEnabled, setRulesEnabled] = useLocalStorage<boolean>(
    'rulesEnabled',
    getRulesEnabled()
  );
  return [rulesEnabled, () => setRulesEnabled(prev => !prev)] as const;
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
