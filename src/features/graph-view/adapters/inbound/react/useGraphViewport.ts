import type { GraphViewController } from '@zora/graph-view';
import { type Dispatch, type SetStateAction, useRef, useState } from 'react';

/***
 * Mirrors owner viewport state without changing graph framing after layout or node movement.
 * @performance Layout completion only refreshes cached bounds. Readable fit and spacing optimization
 * remain an explicit user action so manual node positioning is never overwritten automatically.
 */
export function useGraphViewport() {
  const [controller, setController] = useState<GraphViewController | null>(null);
  const controllerRef = useRef<GraphViewController | null>(null);
  const [viewport, setViewport] = useState({ zoom: 1, min: 0.5, max: 2 });

  /*** Captures the controller before synchronizing the initial viewport. */
  const handleReady = (nextController: GraphViewController) => {
    controllerRef.current = nextController;
    setController(nextController);
    synchronizeGraphViewport(nextController, setViewport);
  };

  /*** Reads the controller synchronously, including events before React commits readiness. */
  const handleViewportChange = () => {
    if (controllerRef.current !== null)
      synchronizeGraphViewport(controllerRef.current, setViewport);
  };

  /*** Refreshes settled owner bounds without fitting or changing manually positioned nodes. */
  const handleLayoutComplete = (nextController: GraphViewController) => {
    synchronizeGraphViewport(nextController, setViewport);
  };

  /*** Runs readable fit and spacing optimization only from explicit user intent. */
  const fitGraph = () => {
    const nextController = controllerRef.current;
    if (nextController === null) return;
    nextController.fit({ optimizeSpacing: true });
    synchronizeGraphViewport(nextController, setViewport);
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

/*** Publishes only changed viewport values, including range changes without a zoom event. */
function synchronizeGraphViewport(
  controller: GraphViewController,
  setViewport: Dispatch<SetStateAction<GraphViewportState>>
) {
  const { zoom } = controller.getViewport();
  const { min, max } = controller.getZoomRange();
  setViewport(previous =>
    previous.zoom === zoom && previous.min === min && previous.max === max
      ? previous
      : { zoom, min, max }
  );
}

interface GraphViewportState {
  readonly zoom: number;
  readonly min: number;
  readonly max: number;
}
