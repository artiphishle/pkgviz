import type { GraphViewController, GraphViewLayoutName } from '@zora/graph-view';
import { useRef, useState } from 'react';

/***
 * Mirrors the owner's settled zoom bounds and coordinates intentional layout changes.
 * @performance
 * Viewport events only read cached controller values; ordinary zoom must never compact spacing,
 * measure labels or rerun layout. The explicit Fit button requests the owner's bounded compaction.
 */
export function useGraphViewport(layout: GraphViewLayoutName) {
  const [controller, setController] = useState<GraphViewController | null>(null);
  const controllerRef = useRef<GraphViewController | null>(null);
  const [viewport, setViewport] = useState({ zoom: 1, min: 0.5, max: 2 });
  const previousLayoutRef = useRef(layout);

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

  /*** Fits intentional algorithm changes and refreshes bounds after every settled layout. */
  const handleLayoutComplete = (nextController: GraphViewController) => {
    const layoutChanged = previousLayoutRef.current !== layout;
    previousLayoutRef.current = layout;
    if (layoutChanged) nextController.fit();
    synchronize(nextController);
  };

  return { controller, handleLayoutComplete, handleReady, handleViewportChange, ...viewport };
}
