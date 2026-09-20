'use client';

import {
  GraphView,
  type GraphViewController,
  type GraphViewElementEvent,
  type GraphViewLayoutName,
} from '@zora/graph-view';
import type { ElementsDefinition, LayoutOptions } from 'cytoscape';
import { useTheme } from 'next-themes';
import React, { useMemo, useState } from 'react';

import { useSettings } from '@/contexts/SettingsContext';
import { createGraphViewModel } from '@/features/graph-view/adapters/inbound/react/createGraphViewModel';
import { createGraphViewStyles } from '@/features/graph-view/adapters/inbound/react/createGraphViewStyles';
import { GraphZoomControls } from '@/features/graph-view/adapters/inbound/react/GraphZoomControls';
import { useGraphFocus } from '@/features/graph-view/adapters/inbound/react/useGraphFocus';
import { useGraphInteractions } from '@/features/graph-view/adapters/inbound/react/useGraphInteractions';
import { useGraphProjection } from '@/features/graph-view/adapters/inbound/react/useGraphProjection';
import { LAYOUTS } from '@/layouts/constants';
import { getCanvasBg } from '@/layouts/style';
import type { CycleHighlight } from '@/types/auditVisualization';
import type { GraphRevealRequest } from '@/types/projectTree';

const MIN_ZOOM = 0.05;
const MAX_ZOOM = 2;

/*** Renders PKGViz graph policy through the materialized ZORA GraphView runtime. */
export function DependencyGraphView(props: DependencyGraphViewProps) {
  const settings = useSettings();
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === 'dark' ? 'dark' : 'light';
  const visibleElements = useGraphProjection({
    currentPackage: props.currentPackage,
    elements: props.packageGraph,
    revealPackageId: props.graphRevealRequest?.packageId,
    setCurrentPackage: props.setCurrentPackage,
    setMaxSubPackageDepth: settings.setMaxSubPackageDepth,
    showCompoundNodes: settings.showCompoundNodes,
    showVendorPackages: settings.showVendorPackages,
    subPackageDepth: settings.subPackageDepth,
  });

  useGraphFocus({
    cycleHighlights: props.cycleHighlights,
    currentPackage: props.currentPackage,
    setCurrentPackage: props.setCurrentPackage,
    setSubPackageDepth: settings.setSubPackageDepth,
    subPackageDepth: settings.subPackageDepth,
    visibleElements,
  });

  const presentation = useGraphViewPresentation({
    cycleHighlights: props.cycleHighlights,
    layout: settings.cytoscapeLayout,
    packageGraph: props.packageGraph,
    theme,
    visibleElements,
  });
  if (presentation.model === null) return null;

  return (
    <DependencyGraphCanvas
      {...props}
      layout={presentation.layout}
      layoutOptions={presentation.layoutOptions}
      model={presentation.model}
      spacingFactor={settings.cytoscapeLayoutSpacing}
      styles={presentation.styles}
      theme={theme}
    />
  );
}

/***
 * Memoizes GraphView model, style, and layout inputs from the active PKGViz projection.
 * @performance
 * Stable inputs avoid repeated projection work and let the owner distinguish presentation from
 * topology/layout changes. Do not recreate these objects on unrelated renders or add compensating
 * layout effects here. ZORA owns runtime reconciliation; memoization alone is not a correctness gate.
 */
function useGraphViewPresentation(input: GraphViewPresentationInput) {
  const model = useMemo(
    () =>
      input.visibleElements === null
        ? null
        : createGraphViewModel(input.packageGraph, input.visibleElements, input.cycleHighlights),
    [input.cycleHighlights, input.packageGraph, input.visibleElements]
  );
  const styles = useMemo(
    () =>
      input.visibleElements === null
        ? []
        : createGraphViewStyles(input.visibleElements, input.theme, input.layout),
    [input.layout, input.theme, input.visibleElements]
  );
  const layoutOptions = useMemo<Readonly<Record<string, unknown>>>(
    () => ({ ...LAYOUTS[input.layout] }),
    [input.layout]
  );

  return {
    layout: readGraphViewLayout(input.layout),
    layoutOptions,
    model,
    styles,
  };
}

/*** Owns GraphView controller callbacks and renders the viewport plus zoom controls. */
function DependencyGraphCanvas(props: DependencyGraphCanvasProps) {
  const viewport = useGraphViewport(props);
  const interactions = useGraphInteractions(props.model.nodes, props.model.edges);

  /*** Handles structural graph navigation without touching the rendering engine. */
  const handleNodeEvent = (event: GraphViewElementEvent) => {
    interactions.handleNodeEvent(event);
    if (event.type !== 'double-press' || !props.model.parentNodeIds.has(event.id)) return;
    props.setCurrentPackage(event.id);
  };

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-2 overflow-hidden px-8">
      <div className="relative min-h-0 flex-1 overflow-hidden">
        <GraphView
          edges={interactions.edges}
          layout={props.layout}
          layoutOptions={props.layoutOptions}
          maxZoom={MAX_ZOOM}
          minZoom={MIN_ZOOM}
          nodes={interactions.nodes}
          onLayoutComplete={viewport.handleLayoutComplete}
          onNodeEvent={handleNodeEvent}
          onReady={viewport.handleReady}
          onViewportChange={nextViewport => viewport.setZoom(nextViewport.zoom)}
          spacingFactor={props.spacingFactor}
          style={{ background: getCanvasBg(props.theme) }}
          styleRules={props.styles}
        />
        {props.overlay}
      </div>
      <GraphZoomControls
        controller={viewport.controller}
        maxZoom={MAX_ZOOM}
        minZoom={MIN_ZOOM}
        zoom={viewport.zoom}
      />
    </div>
  );
}

/*** Coordinates controller readiness and one-shot package or algorithm viewport requests. */
function useGraphViewport(props: DependencyGraphCanvasProps) {
  const [controller, setController] = useState<GraphViewController | null>(null);
  const [zoom, setZoom] = useState(1);
  const handledRevealRequestRef = React.useRef<string | null>(null);
  const previousLayoutRef = React.useRef(props.layout);

  React.useEffect(() => {
    if (props.graphRevealRequest === null) handledRevealRequestRef.current = null;
  }, [props.graphRevealRequest]);

  /*** Fits explicit reveals once and recenters after an intentional layout-algorithm change. */
  const handleLayoutComplete = (nextController: GraphViewController) => {
    const layoutChanged = previousLayoutRef.current !== props.layout;
    previousLayoutRef.current = props.layout;
    const revealRequest = props.graphRevealRequest;
    if (
      props.cycleHighlights.length === 0 &&
      revealRequest !== null &&
      handledRevealRequestRef.current !== revealRequest.treeNodeId
    ) {
      handledRevealRequestRef.current = revealRequest.treeNodeId;
      nextController.fit({ nodeIds: [revealRequest.packageId], padding: 140 });
      return;
    }
    if (layoutChanged) nextController.fit();
  };

  /*** Captures the ready controller and its initial fitted zoom. */
  const handleReady = (nextController: GraphViewController) => {
    setController(nextController);
    setZoom(nextController.getViewport().zoom);
  };

  return { controller, handleLayoutComplete, handleReady, setZoom, zoom };
}

/*** Narrows persisted Cytoscape layout names to the layouts supported by ZORA GraphView. */
function readGraphViewLayout(layout: LayoutOptions['name']): GraphViewLayoutName {
  if (layout === 'breadthfirst') return 'breadthfirst';
  if (layout === 'circle') return 'circle';
  if (layout === 'elk') return 'elk';
  if (layout === 'grid') return 'grid';
  return 'concentric';
}

interface DependencyGraphViewProps {
  readonly currentPackage: string;
  readonly packageGraph: ElementsDefinition;
  readonly setCurrentPackage: (path: string) => void;
  readonly cycleHighlights: readonly CycleHighlight[];
  readonly graphRevealRequest: GraphRevealRequest | null;
  readonly overlay?: React.ReactNode;
}

interface GraphViewPresentationInput {
  readonly cycleHighlights: readonly CycleHighlight[];
  readonly layout: LayoutOptions['name'];
  readonly packageGraph: ElementsDefinition;
  readonly theme: 'dark' | 'light';
  readonly visibleElements: ElementsDefinition | null;
}

interface DependencyGraphCanvasProps extends DependencyGraphViewProps {
  readonly layout: GraphViewLayoutName;
  readonly layoutOptions: Readonly<Record<string, unknown>>;
  readonly model: NonNullable<ReturnType<typeof createGraphViewModel>>;
  readonly spacingFactor: number;
  readonly styles: ReturnType<typeof createGraphViewStyles>;
  readonly theme: 'dark' | 'light';
}
