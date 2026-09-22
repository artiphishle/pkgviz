'use client';
import { ActivityIndicator } from '@zora/activity-indicator';
import { View } from '@zora/view';
import React from 'react';

import { CycleInspector } from '@/features/audit/adapters/inbound/react/CycleInspector';
import { DependencyGraphView } from '@/features/graph-view/adapters/inbound/react/DependencyGraphView';
import type { CycleHighlight, CycleInspection } from '@/types/auditVisualization';
import type { PackageDependencyGraph } from '@/types/dependencyAnalysis';

/*** Renders the workspace graph together with its optional cycle inspector overlay. */
export function WorkspaceGraph({
  currentPackage,
  cycleHighlights,
  cycleInspection,
  packageGraph,
  setCurrentPackage,
  onCloseInspection,
}: WorkspaceGraphProps) {
  if (packageGraph === null) {
    return (
      <View align="center" flex={1} justify="center">
        <ActivityIndicator testID="loader" />
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
          <CycleInspector inspection={cycleInspection} onClose={onCloseInspection} />
        )
      }
    />
  );
}

interface WorkspaceGraphProps {
  readonly currentPackage: string;
  readonly cycleHighlights: readonly CycleHighlight[];
  readonly cycleInspection: CycleInspection | null;
  readonly packageGraph: PackageDependencyGraph | null;
  readonly setCurrentPackage: (path: string) => void;
  readonly onCloseInspection: () => void;
}
