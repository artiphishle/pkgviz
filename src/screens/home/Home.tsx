'use client';
import { toErrorMessage } from '@ankhorage/utility/error';
import type { ElementsDefinition } from 'cytoscape';
import { useCallback, useEffect, useState } from 'react';

import { getAuditEvaluationAction } from '@/app/actions/audit.actions';
import { getProjectVisualizationAction } from '@/app/actions/project.actions';
import Breadcrumb from '@/components/Breadcrumb';
import Header from '@/components/Header';
import ProjectLoadError from '@/components/ProjectLoadError';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { findProjectTreeNodeByGraphPackage } from '@/features/project-tree/utils/findProjectTreeNodeByGraphPackage';
import { HomeGraph } from '@/screens/home/HomeGraph';
import { HomeSidebar } from '@/screens/home/HomeSidebar';
import type { Audit } from '@/types/audit';
import type { CycleHighlight, CycleInspection } from '@/types/auditVisualization';
import type { GraphRevealRequest, ProjectTreeNode } from '@/types/projectTree';

/*** Renders the PKGViz home screen and composes project navigation, diagnostics, and the graph. */
export default function HomeScreen() {
  const [currentPackage, setCurrentPackage] = useState<string>('');
  const [packageGraph, setPackageGraph] = useState<ElementsDefinition | null>(null);
  const [projectTree, setProjectTree] = useState<readonly ProjectTreeNode[]>([]);
  const [selectedTreeId, setSelectedTreeId] = useState<string | null>(null);
  const [graphRevealRequest, setGraphRevealRequest] = useState<GraphRevealRequest | null>(null);
  const [auditEvaluation, setAuditEvaluation] = useState<Audit['evaluation'] | null>(null);
  const [projectError, setProjectError] = useState<string | null>(null);
  const [cycleHighlights, setCycleHighlights] = useState<readonly CycleHighlight[]>([]);
  const [cycleInspection, setCycleInspection] = useState<CycleInspection | null>(null);

  useEffect(() => {
    let cancelled = false;

    void getProjectVisualizationAction()
      .then(result => {
        if (cancelled) return;
        if (result.ok) {
          setPackageGraph(result.value.graph);
          setProjectTree(result.value.tree);
        } else {
          setProjectError(result.error);
        }
      })
      .catch(error => {
        if (!cancelled) setProjectError(toErrorMessage(error, 'Unable to load project graph.'));
      });

    void getAuditEvaluationAction()
      .then(result => {
        if (cancelled) return;
        if (result.ok) {
          setAuditEvaluation(result.value);
        } else {
          setProjectError(result.error);
        }
      })
      .catch(error => {
        if (!cancelled) setProjectError(toErrorMessage(error, 'Unable to load project audit.'));
      });

    return () => {
      cancelled = true;
    };
  }, []);

  /*** Navigates graph scope and mirrors the matching package selection in the project tree. */
  const navigateToPackage = (path: string) => {
    const packageName = normalizeGraphPackage(path);
    const matchingTreeNode = findProjectTreeNodeByGraphPackage(projectTree, packageName);
    setGraphRevealRequest(null);
    setCurrentPackage(packageName);
    setSelectedTreeId(matchingTreeNode?.id ?? null);
  };

  /*** Selects a project-tree node and navigates the graph to the same package scope. */
  const selectProjectTreeNode = (node: ProjectTreeNode) => {
    setSelectedTreeId(node.id);
    if (!node.graphPackage) return;

    const packageName = normalizeGraphPackage(node.graphPackage);
    setCurrentPackage(packageName);
    setGraphRevealRequest({
      packageId: packageName,
      treeNodeId: node.id,
    });
  };

  /*** Activates cycle diagnostics without retaining stale tree-driven viewport focus. */
  const updateCycleHighlights = useCallback((highlights: readonly CycleHighlight[]) => {
    if (highlights.length > 0) setGraphRevealRequest(null);
    setCycleHighlights(highlights);
  }, []);

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
            onCycleHighlightsChange={updateCycleHighlights}
            onCycleInspectionChange={setCycleInspection}
          />
          {projectError ? (
            <ProjectLoadError message={projectError} />
          ) : (
            <HomeGraph
              currentPackage={currentPackage}
              cycleHighlights={cycleHighlights}
              cycleInspection={cycleInspection}
              graphRevealRequest={graphRevealRequest}
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

/*** Normalizes graph navigation paths to the package-id representation used by Cytoscape. */
function normalizeGraphPackage(path: string): string {
  return path.replaceAll('/', '.').replace(/^\.+|\.+$/g, '');
}
