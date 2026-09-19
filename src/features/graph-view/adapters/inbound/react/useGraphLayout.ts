'use client';
import type { Core, ElementsDefinition, LayoutOptions, Layouts } from 'cytoscape';
import { useCallback, useEffect, useRef, useState } from 'react';

import { LAYOUTS } from '@/layouts/constants';

/*** Owns Cytoscape layout execution and exposes when the current layout has fully settled. */
export function useGraphLayout(input: UseGraphLayoutInput) {
  const { cy, elements, layout, spacing } = input;
  const layoutRef = useRef<Layouts | null>(null);
  const layoutRunningRef = useRef(false);
  const layoutStopHandlerRef = useRef<(() => void) | null>(null);
  const [settledRevision, setSettledRevision] = useState(0);
  const makeLayoutOptions = useCallback(
    (name: LayoutOptions['name']): LayoutOptions & Record<string, unknown> => ({
      ...resolveLayoutOptions(name),
      spacingFactor: spacing,
      nodeDimensionsIncludeLabels: true,
      fit: false,
      animate: false,
      animationDuration: 400,
    }),
    [spacing]
  );

  useEffect(
    () =>
      runGraphLayout({
        cy,
        elements,
        layout,
        layoutRef,
        layoutRunningRef,
        layoutStopHandlerRef,
        makeLayoutOptions,
        onSettled: () => setSettledRevision(revision => revision + 1),
      }),
    [cy, elements, layout, makeLayoutOptions]
  );

  return { layoutRunningRef, settledRevision };
}

/*** Runs one layout generation while preventing stale layout-stop callbacks from surviving it. */
function runGraphLayout(input: RunGraphLayoutInput) {
  const { cy, elements } = input;
  if (cy === null || elements === null || cy.destroyed()) return undefined;

  removeLayoutStopHandler(cy, input.layoutStopHandlerRef);
  stopLayout(input.layoutRef.current);
  input.layoutRef.current = null;
  input.layoutRunningRef.current = true;
  cy.resize();

  const frame = requestAnimationFrame(() => startLayout(input, cy));
  return () => {
    cancelAnimationFrame(frame);
    removeLayoutStopHandler(cy, input.layoutStopHandlerRef);
    stopLayout(input.layoutRef.current);
    input.layoutRef.current = null;
    input.layoutRunningRef.current = false;
  };
}

/*** Starts the current layout and reports only its own terminal layout-stop event. */
function startLayout(input: RunGraphLayoutInput, cy: Core) {
  if (cy.destroyed()) {
    input.layoutRunningRef.current = false;
    return;
  }

  const activeLayout = cy.layout(input.makeLayoutOptions(input.layout));
  input.layoutRef.current = activeLayout;
  const onStop = () => {
    input.layoutStopHandlerRef.current = null;
    input.layoutRef.current = null;
    input.layoutRunningRef.current = false;
    input.onSettled();
  };
  input.layoutStopHandlerRef.current = onStop;
  cy.one('layoutstop', onStop);
  activeLayout.run();
}

/*** Resolves one supported layout without dynamic object-key injection. */
function resolveLayoutOptions(name: LayoutOptions['name']): LayoutOptions {
  if (name === 'breadthfirst') return LAYOUTS.breadthfirst;
  if (name === 'circle') return LAYOUTS.circle;
  if (name === 'elk') return LAYOUTS.elk;
  if (name === 'grid') return LAYOUTS.grid;
  if (name === 'concentric') return LAYOUTS.concentric;
  throw new Error(`Unsupported Cytoscape layout: ${String(name)}`);
}

/*** Removes a pending layout-stop callback before stopping or replacing its layout. */
function removeLayoutStopHandler(cy: Core, handlerRef: { current: (() => void) | null }) {
  const handler = handlerRef.current;
  if (handler === null) return;
  cy.off('layoutstop', handler);
  handlerRef.current = null;
}

/*** Stops a previous Cytoscape layout without leaking adapter-specific disposal failures. */
function stopLayout(layout: Layouts | null) {
  try {
    layout?.stop();
  } catch {
    // Cytoscape may already have disposed the layout with the graph instance.
  }
}

interface UseGraphLayoutInput {
  readonly cy: Core | null;
  readonly elements: ElementsDefinition | null;
  readonly layout: LayoutOptions['name'];
  readonly spacing: number;
}

interface RunGraphLayoutInput extends Omit<UseGraphLayoutInput, 'spacing'> {
  readonly layoutRef: { current: Layouts | null };
  readonly layoutRunningRef: { current: boolean };
  readonly layoutStopHandlerRef: { current: (() => void) | null };
  readonly makeLayoutOptions: (
    name: LayoutOptions['name']
  ) => LayoutOptions & Record<string, unknown>;
  readonly onSettled: () => void;
}
