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

/*** Memoizes GraphView model, style, and layout inputs from the active PKGViz projection. */
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
  const [controller, setController] = useState<GraphViewController | null>(null);
  const [zoom, setZoom] = useState(1);

  /*** Handles structural graph navigation without touching the rendering engine. */
  const handleNodeEvent = (event: GraphViewElementEvent) => {
    if (event.type !== 'double-press' || !props.model.parentNodeIds.has(event.id)) return;
    props.setCurrentPackage(event.id.replace(/\./g, '/'));
  };

  /*** Applies explicit tree reveal after ZORA has completed its canonical layout fit. */
  const handleLayoutComplete = (nextController: GraphViewController) => {
    if (props.cycleHighlights.length > 0 || props.graphRevealRequest === null) return;
    nextController.fit({ nodeIds: [props.graphRevealRequest.packageId], padding: 140 });
  };

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-2 px-8">
      <div className="relative h-[calc(100%-65px)]">
        <GraphView
          edges={props.model.edges}
          layout={props.layout}
          layoutOptions={props.layoutOptions}
          maxZoom={MAX_ZOOM}
          minZoom={MIN_ZOOM}
          nodes={props.model.nodes}
          onLayoutComplete={handleLayoutComplete}
          onNodeEvent={handleNodeEvent}
          onReady={nextController => {
            setController(nextController);
            setZoom(nextController.getViewport().zoom);
          }}
          onViewportChange={viewport => setZoom(viewport.zoom)}
          spacingFactor={props.spacingFactor}
          style={{ background: getCanvasBg(props.theme) }}
          styleRules={props.styles}
        />
        {props.overlay}
      </div>
      <GraphZoomControls controller={controller} maxZoom={MAX_ZOOM} minZoom={MIN_ZOOM} zoom={zoom} />
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
