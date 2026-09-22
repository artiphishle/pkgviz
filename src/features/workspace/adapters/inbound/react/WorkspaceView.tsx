'use client';
import { AppBar } from '@zora/app-bar';
import { Breadcrumbs } from '@zora/breadcrumbs';
import { Button } from '@zora/button';
import { Card } from '@zora/card';
import { useTheme } from 'next-themes';
import { useState } from 'react';

import { useCycleSelection } from '@/features/audit/adapters/inbound/react/useCycleSelection';
import { resolveProjectTreeNavigation } from '@/features/project-tree/application/use-cases/resolveProjectTreeNavigation';
import { findProjectTreeNodeByGraphPackage } from '@/features/project-tree/utils/findProjectTreeNodeByGraphPackage';
import { SettingsProvider } from '@/features/settings/adapters/inbound/react/SettingsProvider';
import { useThemeMode } from '@/features/theme/adapters/inbound/react/useThemeMode';
import { WorkspaceGraph } from '@/features/workspace/adapters/inbound/react/WorkspaceGraph';
import { WorkspaceSidebar } from '@/features/workspace/adapters/inbound/react/WorkspaceSidebar';
import { t } from '@/i18n/i18n';
import type { Audit } from '@/types/audit';
import type { CycleInspection } from '@/types/auditVisualization';
import type { PackageDependencyGraph } from '@/types/dependencyAnalysis';
import type { ProjectTreeNode } from '@/types/projectTree';
import type { WorkspaceLoadResult } from '@/types/workspace';
import { getProjectName } from '@/utils/getProjectName';

/*** Renders the active PKGViz workspace through its feature-owned React adapter. */
export function WorkspaceView({ workspace }: WorkspaceViewProps) {
  const navigation = useWorkspaceNavigation(workspace);

  return (
    <>
      <WorkspaceHeader
        currentPackage={navigation.currentPackage}
        onNavigate={navigation.navigateToPackage}
      />
      <SettingsProvider>
        <WorkspaceBody workspace={workspace} navigation={navigation} />
      </SettingsProvider>
    </>
  );
}

/*** Owns package and tree navigation state shared by workspace graph and tree surfaces. */
function useWorkspaceNavigation(workspace: WorkspaceLoadResult): WorkspaceNavigation {
  const [currentPackage, setCurrentPackage] = useState('');
  const [selectedTreeId, setSelectedTreeId] = useState<string | null>(null);
  const packageGraph = workspace.ok ? workspace.value.packageGraph : null;
  const projectTree = workspace.ok ? workspace.value.tree : [];

  /*** Navigates graph scope and mirrors the matching package selection in the project tree. */
  const navigateToPackage = (path: string) => {
    const packageName = normalizeGraphPackage(path);
    const matchingTreeNode = findProjectTreeNodeByGraphPackage(projectTree, packageName);
    setCurrentPackage(packageName);
    setSelectedTreeId(matchingTreeNode?.id ?? null);
  };

  /*** Navigates only into packages with graph descendants while preserving leaf selection. */
  const selectProjectTreeNode = (node: ProjectTreeNode) => {
    setSelectedTreeId(node.id);
    setCurrentPackage(
      resolveProjectTreeNavigation(
        node,
        packageGraph?.nodes.map(candidate => candidate.id) ?? [],
        currentPackage
      )
    );
  };

  return {
    currentPackage,
    navigateToPackage,
    packageGraph,
    projectTree,
    selectedTreeId,
    selectProjectTreeNode,
  };
}

/*** Renders workspace breadcrumbs and the theme action. */
function WorkspaceHeader(props: WorkspaceHeaderProps) {
  const { setTheme } = useTheme();
  const { mode, mounted } = useThemeMode();
  const isDark = mode === 'dark';

  return (
    <AppBar
      actions={
        mounted ? (
          <Button
            leadingIcon={{ name: isDark ? 'sunny-outline' : 'moon-outline' }}
            size="s"
            variant="outline"
            onPress={() => setTheme(isDark ? 'light' : 'dark')}
          >
            {isDark ? 'Light' : 'Dark'}
          </Button>
        ) : null
      }
      safeAreaTop={false}
    >
      <Breadcrumbs
        compact
        items={createBreadcrumbItems(props.currentPackage)}
        onItemPress={({ id }: { readonly id: string }) => props.onNavigate(id)}
      />
    </AppBar>
  );
}

/*** Renders workspace tools, graph content, cycle inspection, and persistent load errors. */
function WorkspaceBody({ workspace, navigation }: WorkspaceBodyProps) {
  const auditEvaluation = workspace.ok ? workspace.value.evaluation : null;
  const projectError = workspace.ok ? null : workspace.error;
  const cycleSelection = useCycleSelection(auditEvaluation?.cyclicPackages ?? EMPTY_CYCLES);
  const [cycleInspection, setCycleInspection] = useState<CycleInspection | null>(null);

  return (
    <main
      data-testid="main"
      className="flex min-h-0 min-w-0 flex-1 flex-row overflow-hidden dark:bg-[#171717]"
    >
      <WorkspaceSidebar
        evaluation={auditEvaluation}
        projectTree={navigation.projectTree}
        selectedTreeId={navigation.selectedTreeId}
        onProjectTreeSelect={navigation.selectProjectTreeNode}
        cycleSelection={cycleSelection}
        inspectedCycleId={cycleInspection?.id ?? null}
        onCycleInspectionChange={setCycleInspection}
      />
      {projectError === null ? (
        <WorkspaceGraph
          currentPackage={navigation.currentPackage}
          cycleHighlights={cycleSelection.highlights}
          cycleInspection={cycleInspection}
          packageGraph={navigation.packageGraph}
          setCurrentPackage={navigation.navigateToPackage}
          onCloseInspection={() => setCycleInspection(null)}
        />
      ) : (
        <WorkspaceError message={projectError} />
      )}
    </main>
  );
}

/*** Renders the persistent project-load failure state. */
function WorkspaceError({ message }: { readonly message: string }) {
  return (
    <div role="alert" className="flex flex-1 items-center justify-center p-6">
      <Card compact description={message} title="Unable to load project" tone="outline" />
    </div>
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
    { id: '__project__', label: getProjectName(), disabled: true },
    { id: '', label: t('nav.packages'), icon: { name: 'home-outline' } },
    ...packageItems,
  ];
}

/*** Normalizes navigation paths to the package identity representation used by the graph view. */
function normalizeGraphPackage(path: string): string {
  return path.replaceAll('/', '.').replace(/^\.+|\.+$/g, '');
}

const EMPTY_CYCLES: NonNullable<Audit['evaluation']>['cyclicPackages'] = [];

interface WorkspaceViewProps {
  readonly workspace: WorkspaceLoadResult;
}

interface WorkspaceNavigation {
  readonly currentPackage: string;
  readonly navigateToPackage: (path: string) => void;
  readonly packageGraph: PackageDependencyGraph | null;
  readonly projectTree: readonly ProjectTreeNode[];
  readonly selectedTreeId: string | null;
  readonly selectProjectTreeNode: (node: ProjectTreeNode) => void;
}

interface WorkspaceHeaderProps {
  readonly currentPackage: string;
  readonly onNavigate: (path: string) => void;
}

interface WorkspaceBodyProps {
  readonly workspace: WorkspaceLoadResult;
  readonly navigation: WorkspaceNavigation;
}

interface BreadcrumbItem {
  readonly id: string;
  readonly label: string;
  readonly disabled?: boolean;
  readonly icon?: { readonly name: string };
}
