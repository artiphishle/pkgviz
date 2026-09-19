'use client';
import type { Core, ElementsDefinition } from 'cytoscape';
import { useEffect, useRef } from 'react';

import { createCycleFocus } from '@/features/audit/utils/cycleVisualization';
import type { CycleHighlight } from '@/types/auditVisualization';
import { applyCycleHighlights } from '@/utils/graph/applyCycleHighlights';

/*** Owns cycle highlighting and the one-time projection change needed to expose active cycles. */
export function useGraphFocus(input: UseGraphFocusInput) {
  const handledCycleSignatureRef = useRef<string | null>(null);
  useCycleDiagnosticFocus(input, handledCycleSignatureRef);
}

/*** Applies one cycle-focus transition per active-cycle set without fighting later manual navigation. */
function useCycleDiagnosticFocus(
  input: UseGraphFocusInput,
  handledCycleSignatureRef: { current: string | null }
) {
  const { cy, cycleHighlights, currentPackage, visibleElements } = input;

  useEffect(
    () => runCycleDiagnosticFocus(input, handledCycleSignatureRef),
    [input, handledCycleSignatureRef, cy, cycleHighlights, currentPackage, visibleElements]
  );
}

/*** Runs one cycle-focus effect iteration without changing the viewport directly. */
function runCycleDiagnosticFocus(
  input: UseGraphFocusInput,
  handledCycleSignatureRef: { current: string | null }
) {
  const { cy, cycleHighlights, visibleElements } = input;
  if (cy === null || visibleElements === null || cy.destroyed()) return;
  applyCycleHighlights(cy, cycleHighlights);

  if (cycleHighlights.length === 0) {
    handledCycleSignatureRef.current = null;
    return;
  }

  const signature = getCycleSignature(cycleHighlights);
  if (handledCycleSignatureRef.current === signature) return;
  if (ensureCycleProjection({ ...input, cy })) return;
  handledCycleSignatureRef.current = signature;
}

/*** Returns a stable identity for the current active-cycle set. */
function getCycleSignature(highlights: readonly CycleHighlight[]): string {
  return highlights
    .map(highlight => highlight.id)
    .sort()
    .join('|');
}

/*** Expands only the projection dimensions required to expose every active cycle package. */
function ensureCycleProjection(input: CycleProjectionInput): boolean {
  const activePackageNames = [
    ...new Set(input.cycleHighlights.flatMap(highlight => highlight.cycle.packages)),
  ];
  const visibleNodeIds = new Set(input.cy.nodes().map(node => node.id()));
  if (activePackageNames.every(packageName => visibleNodeIds.has(packageName))) return false;

  const focus = createCycleFocus(input.cycleHighlights);
  if (!focus) return false;

  const normalizedCurrentPackage = input.currentPackage.replace(/\//g, '.');
  const scopeChanged = focus.currentPackage !== normalizedCurrentPackage;
  const depthChanged = focus.packageDepth > input.subPackageDepth;

  if (scopeChanged) input.setCurrentPackage(focus.currentPackage);
  if (depthChanged) input.setSubPackageDepth(focus.packageDepth);
  return scopeChanged || depthChanged;
}

interface UseGraphFocusInput {
  readonly cy: Core | null;
  readonly cycleHighlights: readonly CycleHighlight[];
  readonly currentPackage: string;
  readonly setCurrentPackage: (path: string) => void;
  readonly setSubPackageDepth: (depth: number) => void;
  readonly subPackageDepth: number;
  readonly visibleElements: ElementsDefinition | null;
}

interface CycleProjectionInput extends Omit<UseGraphFocusInput, 'cy' | 'visibleElements'> {
  readonly cy: Core;
}
