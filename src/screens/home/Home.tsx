'use client';
import { toErrorMessage } from '@ankhorage/utility/error';
import { AppBar } from '@zora/app-bar';
import { Breadcrumbs } from '@zora/breadcrumbs';
import { Button } from '@zora/button';
import { Card } from '@zora/card';
import type { ElementsDefinition } from 'cytoscape';
import { useTheme } from 'next-themes';
import { useCallback, useEffect, useState } from 'react';

import { getAuditEvaluationAction } from '@/app/actions/audit.actions';
import { getProjectVisualizationAction } from '@/app/actions/project.actions';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { findProjectTreeNodeByGraphPackage } from '@/features/project-tree/utils/findProjectTreeNodeByGraphPackage';
import { t } from '@/i18n/i18n';
import { HomeGraph } from '@/screens/home/HomeGraph';
import { HomeSidebar } from '@/screens/home/HomeSidebar';
import { getProjectName } from '@/shared/utils/getProjectName';
import type { Audit } from '@/types/audit';
import type { CycleHighlight, CycleInspection } from '@/types/auditVisualization';
import type { GraphRevealRequest, ProjectTreeNode } from '@/types/projectTree';

/*** Renders the PKGViz home screen and composes navigation, diagnostics, and graph state. */
export default function HomeScreen() {
  const { resolvedTheme, setTheme, theme } = useTheme();
  const [themeMounted, setThemeMounted] = useState(false);
  const [currentPackage, setCurrentPackage] = useState<string>('');
  const [packageGraph, setPackageGraph] = useState<ElementsDefinition | null>(null);
  const [projectTree, setProjectTree] = useState<readonly ProjectTreeNode[]>([]);
  const [selectedTreeId, setSelectedTreeId] = useState<string | null>(null);
  const [graphRevealRequest, setGraphRevealRequest] = useState<GraphRevealRequest | null>(null);
  const [auditEvaluation, setAuditEvaluation] = useState<Audit['evaluation'] | null>(null);
  const [projectError, setProjectError] = useState<string | null>(null);
  const [cycleHighlights, setCycleHighlights] = useState<readonly CycleHighlight[]>([]);
  const [cycleInspection, setCycleInspection] = useState<CycleInspection | null>(null);
  const activeTheme = theme === 'system' ? resolvedTheme : theme;
  const isDark = activeTheme === 'dark';
  const mode = isDark ? 'dark' : 'light';
  const breadcrumbItems = createBreadcrumbItems(currentPackage);

  useEffect(() => setThemeMounted(true), []);

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
      <AppBar
        actions={
          themeMounted ? (
            <Button
              leadingIcon={{ name: isDark ? 'sunny-outline' : 'moon-outline' }}
              mode={mode}
              size="s"
              variant="outline"
              onPress={() => setTheme(isDark ? 'light' : 'dark')}
            >
              {isDark ? 'Light' : 'Dark'}
            </Button>
          ) : null
        }
        mode={mode}
        safeAreaTop={false}
      >
        <Breadcrumbs
          compact
          items={breadcrumbItems}
          mode={mode}
          onItemPress={({ id }: { readonly id: string }) => navigateToPackage(id)}
        />
      </AppBar>
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
            <div className="flex flex-1 items-center justify-center p-6">
              <Card
                compact
                description={projectError}
                mode={mode}
                title="Unable to load project"
                tone="outline"
              />
            </div>
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

/*** Creates interactive package breadcrumbs with a stable project and Packages root. */
function createBreadcrumbItems(currentPackage: string): readonly BreadcrumbItem[] {
  const packageSegments = normalizeGraphPackage(currentPackage).split('.').filter(Boolean);
  const packageItems = packageSegments.map((label, index) => ({
    id: packageSegments.slice(0, index + 1).join('.'),
    label,
  }));

  return [
    {
      id: '__project__',
      label: getProjectName(),
      disabled: true,
    },
    {
      id: '',
      label: t('nav.packages'),
      icon: { name: 'home-outline' },
    },
    ...packageItems,
  ];
}

/*** Normalizes graph navigation paths to the package-id representation used by Cytoscape. */
function normalizeGraphPackage(path: string): string {
  return path.replaceAll('/', '.').split('.').filter(Boolean).join('.');
}

interface BreadcrumbItem {
  readonly id: string;
  readonly label: string;
  readonly disabled?: boolean;
  readonly icon?: { readonly name: string };
}
