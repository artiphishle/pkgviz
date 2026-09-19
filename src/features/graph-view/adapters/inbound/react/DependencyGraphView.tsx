'use client';

import type { ElementsDefinition, LayoutOptions } from 'cytoscape';
import { useTheme } from 'next-themes';
import React, { useMemo, useState } from 'react';
import {
  GraphView,
  type GraphViewController,
  type GraphViewElementEvent,
  type GraphViewLayoutName,
} from '@zora/graph-view';

import { useSettings } from '@/contexts/SettingsContext';
import { createGraphViewModel } from '@/features/graph-view/adapters/inbound/react/createGraphViewModel';
import { createGraphViewStyles } from '@/features/graph-view/adapters/inbound/react/createGraphViewStyles';
import { GraphZoomControls } from '@/features/graph-view/adapters/inbound/react/GraphZoomControls';
import { useGraphFocus } from '@/features/graph-view/adapters/inbound/react/useGraphFocus';
import { useGraphProjection } from '@/features/graph-view/adapters/inbound/react/useGraphProjection';
import { LAYOUTS } from '@/layouts/constants';
import { getCanvasBg } from '@/layouts/style';
import type { CycleHighlight } from '@/types/auditVisualization';
import type { GraphRevealRequest } from '@/types/projectTree';

const MIN_ZOOM = 0.05;
const MAX_ZOOM = 2;

interface DependencyGraphViewProps {
  readonly currentPackage: string;
  readonly packageGraph: ElementsDefinition;
  readonly setCurrentPackage: (path: string) => void;
  readonly cycleHighlights: readonly CycleHighlight[];
  readonly graphRevealRequest: GraphRevealRequest | null;
  readonly overlay?: React.ReactNode;
}

/*** Renders PKGViz graph policy through the materialized ZORA GraphView runtime. */
export function DependencyGraphView({
  currentPackage,
  packageGraph,
  setCurrentPackage,
  cycleHighlights,
  graphRevealRequest,
  overlay,
}: DependencyGraphViewProps) {
  const settings = useSettings();
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === 'dark' ? 'dark' : 'light';
  const [controller, setController] = useState<GraphViewController | null>(null);
  const [zoom, setZoom] = useState(1);
  const visibleElements = useGraphProjection({
    currentPackage,
    elements: packageGraph,
    setMaxSubPackageDepth: settings.setMaxSubPackageDepth,
    showCompoundNodes: settings.showCompoundNodes,
    showVendorPackages: settings.showVendorPackages,
    subPackageDepth: settings.subPackageDepth,
  });

  useGraphFocus({
    cycleHighlights,
    currentPackage,
    setCurrentPackage,
    setSubPackageDepth: settings.setSubPackageDepth,
    subPackageDepth: settings.subPackageDepth,
    visibleElements,
  });

  const layout = readGraphViewLayout(settings.cytoscapeLayout);
  const model = useMemo(
    () =>
      visibleElements === null
        ? null
        : createGraphViewModel(packageGraph, visibleElements, cycleHighlights),
    [cycleHighlights, packageGraph, visibleElements],
  );
  const styles = useMemo(
    () =>
      visibleElements === null
        ? []
        : createGraphViewStyles(visibleElements, theme, settings.cytoscapeLayout),
    [settings.cytoscapeLayout, theme, visibleElements],
  );
  const layoutOptions = useMemo(
    () => ({ ...LAYOUTS[settings.cytoscapeLayout] }),
    [settings.cytoscapeLayout],
  );

  if (model === null) return null;

  /*** Handles structural graph navigation without touching the rendering engine. */
  const handleNodeEvent = (event: GraphViewElementEvent) => {
    if (event.type !== 'double-press' || !model.parentNodeIds.has(event.id)) return;
    setCurrentPackage(event.id.replace(/\./g, '/'));
  };

  /*** Applies explicit tree reveal after ZORA has completed its canonical layout fit. */
  const handleLayoutComplete = (nextController: GraphViewController) => {
    if (cycleHighlights.length > 0 || graphRevealRequest === null) return;
    nextController.fit({ nodeIds: [graphRevealRequest.packageId], padding: 140 });
  };

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-2 px-8">
      <div className="relative h-[calc(100%-65px)]">
        <GraphView
          nodes={model.nodes}
          edges={model.edges}
          layout={layout}
          layoutOptions={layoutOptions}
          spacingFactor={settings.cytoscapeLayoutSpacing}
          styleRules={styles}
          minZoom={MIN_ZOOM}
          maxZoom={MAX_ZOOM}
          style={{ background: getCanvasBg(theme) }}
          onReady={(nextController) => {
            setController(nextController);
            setZoom(nextController.getViewport().zoom);
          }}
          onLayoutComplete={handleLayoutComplete}
          onNodeEvent={handleNodeEvent}
          onViewportChange={(viewport) => setZoom(viewport.zoom)}
        />
        {overlay}
      </div>
      <GraphZoomControls
        controller={controller}
        minZoom={MIN_ZOOM}
        maxZoom={MAX_ZOOM}
        zoom={zoom}
      />
    </div>
  );
}

/*** Narrows persisted Cytoscape layout names to the layouts supported by ZORA GraphView. */
function readGraphViewLayout(layout: LayoutOptions['name']): GraphViewLayoutName {
  if (layout === 'breadthfirst') return 'breadthfirst';
  if (layout === 'circle') return 'circle';
  if (layout === 'elk') return 'elk';
  if (layout === 'grid') return 'grid';
  return 'concentric';
}
