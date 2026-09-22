'use client';
import { Badge } from '@zora/badge';
import { ScrollView } from '@zora/scroll-view';
import { Surface } from '@zora/surface';
import { Tab, TabList, TabPanel, Tabs } from '@zora/tabs';
import { View } from '@zora/view';
import React from 'react';

import { AuditExportPanel } from '@/features/audit/adapters/inbound/react/AuditExportPanel';
import { AuditRulePanel } from '@/features/audit/adapters/inbound/react/AuditRulePanel';
import { ProjectTreePanel } from '@/features/project-tree/adapters/inbound/react/ProjectTreePanel';
import { SettingsPanel } from '@/features/settings/adapters/inbound/react/SettingsPanel';
import { t } from '@/i18n/i18n';
import type { Audit } from '@/types/audit';
import type { CycleInspection, CycleSelection } from '@/types/auditVisualization';
import type { ProjectTreeNode } from '@/types/projectTree';

/*** Composes workspace tools and persistent graph settings from generated ZORA elements. */
export function WorkspaceSidebar(props: WorkspaceSidebarProps) {
  const [activeTool, setActiveTool] = React.useState('tree');

  /*** Closes cycle evidence when leaving the Rules tool and updates the active tab. */
  const selectTool = (value: string) => {
    if (activeTool === 'rules' && value !== 'rules') props.onCycleInspectionChange(null);
    setActiveTool(value);
  };

  return (
    <aside className="flex min-h-0 w-[18rem] min-w-[18rem] max-w-[18rem] shrink-0 self-stretch flex-col overflow-hidden border-r border-r-neutral-200 bg-neutral-100 md:pt-14 dark:border-r-neutral-800 dark:bg-neutral-950">
      <Surface style={{ height: '100%', overflow: 'hidden' }} variant="subtle">
        <View flex={1} style={{ minHeight: 0, overflow: 'hidden' }}>
          <WorkspaceToolTabs {...props} activeTool={activeTool} onValueChange={selectTool} />
        </View>
        <SettingsPanel />
      </Surface>
    </aside>
  );
}

/*** Renders the workspace tool selector and delegates panel content. */
function WorkspaceToolTabs(props: WorkspaceToolTabsProps) {
  const findingCount = countRuleFindings(props.evaluation);
  const hasRuleFindings = findingCount > 0;

  return (
    <Tabs
      flex={1}
      minHeight={0}
      overflow="hidden"
      value={props.activeTool}
      onValueChange={props.onValueChange}
    >
      <TabList fill>
        <Tab label={t('settings.tree')} value="tree" />
        {hasRuleFindings ? (
          <Tab
            label={t('settings.rules')}
            trailing={
              <Badge color="danger" size="s">
                {findingCount}
              </Badge>
            }
            value="rules"
          />
        ) : null}
        <Tab label={t('settings.export')} value="export" />
      </TabList>
      <WorkspaceTabPanels {...props} hasRuleFindings={hasRuleFindings} />
    </Tabs>
  );
}

/*** Renders Tree, Rules, and Export panel bodies inside the workspace tabs. */
function WorkspaceTabPanels(props: WorkspaceTabPanelsProps) {
  return (
    <>
      <TabPanel flex={1} minHeight={0} value="tree">
        <ScrollView flex={1} minHeight={0} testID="sidebar-tree-scroll">
          <ProjectTreePanel
            nodes={props.projectTree}
            selectedId={props.selectedTreeId}
            onSelect={props.onProjectTreeSelect}
          />
        </ScrollView>
      </TabPanel>
      {props.hasRuleFindings ? <WorkspaceRulesPanel {...props} /> : null}
      <TabPanel flex={1} minHeight={0} value="export">
        <ScrollView flex={1} minHeight={0} testID="sidebar-export-scroll">
          <AuditExportPanel />
        </ScrollView>
      </TabPanel>
    </>
  );
}

/*** Renders audit-rule findings and cycle inspection controls for the Rules tab. */
function WorkspaceRulesPanel(props: WorkspaceSidebarProps) {
  return (
    <TabPanel flex={1} minHeight={0} value="rules">
      <ScrollView flex={1} minHeight={0} testID="sidebar-rules-scroll">
        {props.evaluation === null ? null : (
          <AuditRulePanel
            evaluation={props.evaluation}
            cycleSelection={props.cycleSelection}
            inspectedCycleId={props.inspectedCycleId}
            onCycleInspectionChange={props.onCycleInspectionChange}
          />
        )}
      </ScrollView>
    </TabPanel>
  );
}

/*** Counts concrete audit findings represented by the workspace Rules tool. */
function countRuleFindings(evaluation: Audit['evaluation'] | null): number {
  return (
    evaluation?.rules
      .filter(rule => rule.status === 'failed')
      .reduce(
        (count, rule) =>
          count +
          (rule.id === 'cyclic-dependencies'
            ? evaluation.cyclicPackages.length
            : rule.details.length),
        0
      ) ?? 0
  );
}

interface WorkspaceSidebarProps {
  readonly inspectedCycleId: string | null;
  readonly evaluation: Audit['evaluation'] | null;
  readonly projectTree: readonly ProjectTreeNode[];
  readonly selectedTreeId: string | null;
  readonly onProjectTreeSelect: (node: ProjectTreeNode) => void;
  readonly cycleSelection: CycleSelection;
  readonly onCycleInspectionChange: (inspection: CycleInspection | null) => void;
}

interface WorkspaceToolTabsProps extends WorkspaceSidebarProps {
  readonly activeTool: string;
  readonly onValueChange: (value: string) => void;
}

interface WorkspaceTabPanelsProps extends WorkspaceToolTabsProps {
  readonly hasRuleFindings: boolean;
}
