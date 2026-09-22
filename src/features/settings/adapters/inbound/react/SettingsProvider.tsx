import { useLocalStorage } from 'ankh-hooks/store';
import type { PropsWithChildren } from 'react';

import { SettingsContext } from '@/features/settings/adapters/inbound/react/SettingsContext';
import { readSettingsEnvironment } from '@/features/settings/utils/readSettingsEnvironment';

/*** Provides persisted graph settings to the application. */
export function SettingsProvider({ children }: PropsWithChildren) {
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
  const [cytoscapeLayout, setCytoscapeLayout] = useLocalStorage(
    'cytoscapeLayout',
    environment.cytoscapeLayout
  );
  const [cytoscapeLayoutSpacing, setCytoscapeLayoutSpacing] = useLocalStorage<number>(
    'cytoscapeLayoutSpacing',
    environment.cytoscapeLayoutSpacing
  );

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
        toggleShowCompoundNodes: () => setShowCompoundNodes(previous => !previous),
        toggleShowVendorPackages: () => setShowVendorPackages(previous => !previous),
      }}
    >
      {children}
    </SettingsContext>
  );
}

/*** Owns the persisted maximum package-depth state. */
function useMaxSubPackageDepthSetting() {
  return useLocalStorage<number>('maxSubPackageDepth', 1);
}
