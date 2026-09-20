'use client';
import { useState } from 'react';

import Breadcrumb from '@/components/Breadcrumb';
import Header from '@/components/Header';
import ProjectLoadError from '@/components/ProjectLoadError';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { useCycleSelection } from '@/features/audit/adapters/inbound/react/useCycleSelection';
import { resolveProjectTreeNavigation } from '@/features/project-tree/application/use-cases/resolveProjectTreeNavigation';
import { findProjectTreeNodeByGraphPackage } from '@/features/project-tree/utils/findProjectTreeNodeByGraphPackage';
import { HomeGraph } from '@/screens/home/HomeGraph';
import { HomeSidebar } from '@/screens/home/HomeSidebar';
import type { Audit } from '@/types/audit';
import type { CycleInspection } from '@/types/auditVisualization';
import type { ProjectOverview } from '@/types/projectAnalysis';
import type { ProjectAnalysisActionResult } from '@/types/projectAnalysisActionResult';
import type { ProjectTreeNode } from '@/types/projectTree';

/*** Renders the PKGViz home screen and composes project navigation, diagnostics, and the graph. */
export default function HomeScreen({ project }: HomeScreenProps) {
  const [currentPackage, setCurrentPackage] = useState<string>('');
  const packageGraph = project.ok ? project.value.graph : null;
  const projectTree = project.ok ? project.value.tree : [];
  const [selectedTreeId, setSelectedTreeId] = useState<string | null>(null);
  const auditEvaluation = project.ok ? project.value.evaluation : null;
  const projectError = project.ok ? null : project.error;
  const cycleSelection = useCycleSelection(auditEvaluation?.cyclicPackages ?? EMPTY_CYCLES);
  const [cycleInspection, setCycleInspection] = useState<CycleInspection | null>(null);

  /*** Navigates graph scope and mirrors the matching package selection in the project tree. */
  const navigateToPackage = (path: string) => {
    const packageName = normalizeGraphPackage(path);
    const matchingTreeNode = findProjectTreeNodeByGraphPackage(projectTree, packageName);
    setCurrentPackage(packageName);
    setSelectedTreeId(matchingTreeNode?.id ?? null);
  };

  /*** Navigates only into packages with graph descendants; selecting a leaf keeps the current view. */
  const selectProjectTreeNode = (node: ProjectTreeNode) => {
    setSelectedTreeId(node.id);
    setCurrentPackage(
      resolveProjectTreeNavigation(
        node,
        packageGraph?.nodes.map(candidate => String(candidate.data.id ?? '')) ?? [],
        currentPackage
      )
    );
  };

  return (
    <>
      <Header title="nav.packages">
        <Breadcrumb path={currentPackage.replace(/\./g, '/')} onNavigate={navigateToPackage} />
      </Header>
      <SettingsProvider>
        <main
          data-testid="main"
          className="flex min-h-0 min-w-0 flex-1 flex-row overflow-hidden dark:bg-[#171717]"
        >
          <HomeSidebar
            evaluation={auditEvaluation}
            projectTree={projectTree}
            selectedTreeId={selectedTreeId}
            onProjectTreeSelect={selectProjectTreeNode}
            cycleSelection={cycleSelection}
            inspectedCycleId={cycleInspection?.id ?? null}
            onCycleInspectionChange={setCycleInspection}
          />
          {projectError ? (
            <ProjectLoadError message={projectError} />
          ) : (
            <HomeGraph
              currentPackage={currentPackage}
              cycleHighlights={cycleSelection.highlights}
              cycleInspection={cycleInspection}
              packageGraph={packageGraph}
              setCurrentPackage={navigateToPackage}
              onCloseInspection={() => setCycleInspection(null)}
            />
          )}
        </main>
      </SettingsProvider>
    </>
  );
}

const EMPTY_CYCLES: NonNullable<Audit['evaluation']>['cyclicPackages'] = [];

interface HomeScreenProps {
  readonly project: ProjectAnalysisActionResult<ProjectOverview>;
}

/*** Normalizes graph navigation paths to the package-id representation used by Cytoscape. */
function normalizeGraphPackage(path: string): string {
  return path.replaceAll('/', '.').replace(/^\.+|\.+$/g, '');
}
