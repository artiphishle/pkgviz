'use client';
import { AppBar } from '@zora/app-bar';
import { Breadcrumbs } from '@zora/breadcrumbs';
import { Button } from '@zora/button';
import { Card } from '@zora/card';
import { useTheme } from 'next-themes';
import { useState } from 'react';

import { SettingsProvider } from '@/contexts/SettingsContext';
import { useCycleSelection } from '@/features/audit/adapters/inbound/react/useCycleSelection';
import { resolveProjectTreeNavigation } from '@/features/project-tree/application/use-cases/resolveProjectTreeNavigation';
import { findProjectTreeNodeByGraphPackage } from '@/features/project-tree/utils/findProjectTreeNodeByGraphPackage';
import { useThemeMode } from '@/features/theme/adapters/inbound/react/useThemeMode';
import { t } from '@/i18n/i18n';
import { HomeGraph } from '@/screens/home/HomeGraph';
import { HomeSidebar } from '@/screens/home/HomeSidebar';
import { getProjectName } from '@/shared/utils/getProjectName';
import type { Audit } from '@/types/audit';
import type { CycleInspection } from '@/types/auditVisualization';
import type { ProjectOverview } from '@/types/projectAnalysis';
import type { ProjectAnalysisActionResult } from '@/types/projectAnalysisActionResult';
import type { ProjectTreeNode } from '@/types/projectTree';

/*** Renders the PKGViz home screen and composes project navigation, diagnostics, and the graph. */
export default function HomeScreen({ project }: HomeScreenProps) {
  const { setTheme } = useTheme();
  const { mode, mounted: themeMounted } = useThemeMode();
  const [currentPackage, setCurrentPackage] = useState<string>('');
  const packageGraph = project.ok ? project.value.graph : null;
  const projectTree = project.ok ? project.value.tree : [];
  const [selectedTreeId, setSelectedTreeId] = useState<string | null>(null);
  const auditEvaluation = project.ok ? project.value.evaluation : null;
  const projectError = project.ok ? null : project.error;
  const cycleSelection = useCycleSelection(auditEvaluation?.cyclicPackages ?? EMPTY_CYCLES);
  const [cycleInspection, setCycleInspection] = useState<CycleInspection | null>(null);
  const isDark = mode === 'dark';
  const breadcrumbItems = createBreadcrumbItems(currentPackage);

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
            cycleSelection={cycleSelection}
            inspectedCycleId={cycleInspection?.id ?? null}
            onCycleInspectionChange={setCycleInspection}
          />
          {projectError ? (
            <div role="alert" className="flex flex-1 items-center justify-center p-6">
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

const EMPTY_CYCLES: NonNullable<Audit['evaluation']>['cyclicPackages'] = [];

interface HomeScreenProps {
  readonly project: ProjectAnalysisActionResult<ProjectOverview>;
}

/*** Normalizes graph navigation paths to the package-id representation used by Cytoscape. */
function normalizeGraphPackage(path: string): string {
  return path.replaceAll('/', '.').replace(/^\.+|\.+$/g, '');
}

interface BreadcrumbItem {
  readonly id: string;
  readonly label: string;
  readonly disabled?: boolean;
  readonly icon?: { readonly name: string };
}
