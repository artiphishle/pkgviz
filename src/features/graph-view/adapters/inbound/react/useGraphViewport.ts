import type {
  GraphViewController,
  GraphViewEdge,
  GraphViewLayoutName,
  GraphViewNode,
} from '@zora/graph-view';
import { useMemo, useRef, useState } from 'react';

/***
 * Mirrors settled owner bounds and runs one canonical optimized fit for every material graph geometry.
 * @performance
 * Presentation-only updates keep the same geometry signature and therefore preserve the viewport.
 * Controlled spacing acknowledgements are deliberately excluded so optimized fit cannot relayout-loop.
 */
export function useGraphViewport(input: UseGraphViewportInput) {
  const [controller, setController] = useState<GraphViewController | null>(null);
  const controllerRef = useRef<GraphViewController | null>(null);
  const optimizedGeometryRef = useRef<string | null>(null);
  const [viewport, setViewport] = useState({ zoom: 1, min: 0.5, max: 2 });
  const geometrySignature = useMemo(
    () => createGraphGeometrySignature(input),
    [input.edges, input.layout, input.nodes]
  );

  /*** Publishes only changed viewport values, including range changes without a zoom event. */
  const synchronize = (nextController: GraphViewController) => {
    const { zoom } = nextController.getViewport();
    const { min, max } = nextController.getZoomRange();
    setViewport(previous =>
      previous.zoom === zoom && previous.min === min && previous.max === max
        ? previous
        : { zoom, min, max }
    );
  };

  /*** Applies the canonical readable graph optimization and records the geometry it normalized. */
  const optimizeGraph = (nextController: GraphViewController) => {
    optimizedGeometryRef.current = geometrySignature;
    nextController.fit({ optimizeSpacing: true });
    synchronize(nextController);
  };

  /*** Captures the controller before synchronizing the initial viewport. */
  const handleReady = (nextController: GraphViewController) => {
    controllerRef.current = nextController;
    setController(nextController);
    synchronize(nextController);
  };

  /*** Reads the controller synchronously, including events before React commits readiness. */
  const handleViewportChange = () => {
    if (controllerRef.current !== null) synchronize(controllerRef.current);
  };

  /*** Optimizes each newly settled graph geometry once and otherwise only refreshes owner bounds. */
  const handleLayoutComplete = (nextController: GraphViewController) => {
    if (optimizedGeometryRef.current !== geometrySignature) {
      optimizeGraph(nextController);
      return;
    }
    synchronize(nextController);
  };

  /*** Reuses the same canonical optimization path for explicit user-requested Fit. */
  const fitGraph = () => {
    if (controllerRef.current !== null) optimizeGraph(controllerRef.current);
  };

  return {
    controller,
    fitGraph,
    handleLayoutComplete,
    handleReady,
    handleViewportChange,
    ...viewport,
  };
}

/*** Creates a stable geometry identity while intentionally ignoring interaction and paint-only state. */
function createGraphGeometrySignature(input: UseGraphViewportInput): string {
  return JSON.stringify({
    layout: input.layout,
    nodes: input.nodes.map(node => [node.id, node.parentId ?? '', node.label ?? '']),
    edges: input.edges.map(edge => [edge.id ?? '', edge.source, edge.target]),
  });
}

interface UseGraphViewportInput {
  readonly edges: readonly GraphViewEdge[];
  readonly layout: GraphViewLayoutName;
  readonly nodes: readonly GraphViewNode[];
}
