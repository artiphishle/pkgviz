'use client';
import { ActivityIndicator } from '@zora/activity-indicator';
import { View } from '@zora/view';
import type { ElementsDefinition } from 'cytoscape';
import React from 'react';

import { CycleInspector } from '@/features/audit/adapters/inbound/react/CycleInspector';
import { DependencyGraphView } from '@/features/graph-view/adapters/inbound/react/DependencyGraphView';
import { useThemeMode } from '@/features/theme/adapters/inbound/react/useThemeMode';
import type { CycleHighlight, CycleInspection } from '@/types/auditVisualization';

/*** Renders the graph surface together with its optional cycle inspector overlay. */
export function HomeGraph({
  currentPackage,
  cycleHighlights,
  cycleInspection,
  packageGraph,
  setCurrentPackage,
  onCloseInspection,
}: HomeGraphProps) {
  const { mode } = useThemeMode();

  if (!packageGraph) {
    return (
      <View mode={mode} align="center" flex={1} justify="center">
        <ActivityIndicator mode={mode} testID="loader" />
      </View>
    );
  }

  return (
    <DependencyGraphView
      currentPackage={currentPackage}
      setCurrentPackage={setCurrentPackage}
      packageGraph={packageGraph}
      cycleHighlights={cycleHighlights}
      overlay={
        cycleInspection === null ? null : (
          <CycleInspector inspection={cycleInspection} mode={mode} onClose={onCloseInspection} />
        )
      }
    />
  );
}

interface HomeGraphProps {
  readonly currentPackage: string;
  readonly cycleHighlights: readonly CycleHighlight[];
  readonly cycleInspection: CycleInspection | null;
  readonly packageGraph: ElementsDefinition | null;
  readonly setCurrentPackage: (path: string) => void;
  readonly onCloseInspection: () => void;
}
