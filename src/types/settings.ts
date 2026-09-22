import type { LayoutOptions } from 'cytoscape';

export interface SettingsContextValue {
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
