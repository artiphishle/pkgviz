import type { LayoutOptions } from 'cytoscape';
import React, { createContext, use, type PropsWithChildren } from 'react';
import {
  getCytoscapeLayout,
  getCytoscapeLayoutSpacing,
  getShowVendorPackages,
  getSubPackageDepth,
} from '@/contexts/parseEnv';
import { useLocalStorage } from '@/store/useLocalStorage';

// Settings context
const SettingsContext = createContext<ISettingsContext | null>(null);

// Settings provider
export const SettingsProvider = ({ children }: PropsWithChildren) => {
  const [maxSubPackageDepth, setMaxSubPackageDepth] = useLocalStorage<number>(
    'maxSubPackageDepth',
    1
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

  const toggleShowVendorPackages = () => setShowVendorPackages(prev => !prev);

  return (
    <SettingsContext
      value={{
        cytoscapeLayout,
        cytoscapeLayoutSpacing,
        maxSubPackageDepth,
        showVendorPackages,
        subPackageDepth,
        setCytoscapeLayout,
        setCytoscapeLayoutSpacing,
        setMaxSubPackageDepth,
        setSubPackageDepth,
        toggleShowVendorPackages,
      }}
    >
      {children}
    </SettingsContext>
  );
};

// Hook to read/update settings
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
  readonly showVendorPackages: boolean;
  readonly setCytoscapeLayout: (layout: LayoutOptions['name']) => void;
  readonly setCytoscapeLayoutSpacing: (layoutSpacing: number) => void;
  readonly setMaxSubPackageDepth: (depth: number) => void;
  readonly setSubPackageDepth: (depth: number) => void;
  readonly toggleShowVendorPackages: () => void;
}
