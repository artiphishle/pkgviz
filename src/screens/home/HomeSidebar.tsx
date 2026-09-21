'use client';
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

/*** Composes project tools and persistent graph settings from generated ZORA elements. */
export function HomeSidebar(props: HomeSidebarProps) {
  const [activeTool, setActiveTool] = React.useState('tree');

  /*** Closes the evidence panel without changing the user's cycle visualization choices. */
  const selectTool = (value: string) => {
    if (activeTool === 'rules' && value !== 'rules') {
      props.onCycleInspectionChange(null);
    }
    setActiveTool(value);
  };

  return (
    <aside className="flex min-h-0 w-[18rem] min-w-[18rem] max-w-[18rem] shrink-0 self-stretch flex-col overflow-hidden border-r border-r-neutral-200 bg-neutral-100 md:pt-14 dark:border-r-neutral-800 dark:bg-neutral-950">
      <Surface style={{ height: '100%', overflow: 'hidden' }} variant="subtle">
        <View flex={1} style={{ minHeight: 0, overflow: 'hidden' }}>
          <SidebarToolTabs {...props} activeTool={activeTool} onValueChange={selectTool} />
        </View>
        <SettingsPanel />
      </Surface>
    </aside>
  );
}

/*** Renders Tree, Rules, and Export through the generated ZORA Tabs family. */
function SidebarToolTabs({
  activeTool,
  evaluation,
  cycleSelection,
  inspectedCycleId,
  onCycleInspectionChange,
  onProjectTreeSelect,
  onValueChange,
  projectTree,
  selectedTreeId,
}: SidebarToolTabsProps) {
  const findingCount =
    evaluation?.rules
      .filter(rule => rule.status === 'failed')
      .reduce(
        (count, rule) =>
          count +
          (rule.id === 'cyclic-dependencies'
            ? evaluation.cyclicPackages.length
            : rule.details.length),
        0
      ) ?? 0;
  const hasRuleFindings = findingCount > 0;
  const rulesLabel = `${t('settings.rules')} · ${findingCount} ${t('audit.findings')}`;

  return (
    <Tabs flex={1} minHeight={0} overflow="hidden" value={activeTool} onValueChange={onValueChange}>
      <TabList>
        <Tab label={t('settings.tree')} value="tree" />
        {hasRuleFindings ? <Tab label={rulesLabel} value="rules" /> : null}
        <Tab label={t('settings.export')} value="export" />
      </TabList>
      <TabPanel flex={1} minHeight={0} value="tree">
        <ScrollView flex={1} minHeight={0} testID="sidebar-tree-scroll">
          <ProjectTreePanel
            nodes={projectTree}
            selectedId={selectedTreeId}
            onSelect={onProjectTreeSelect}
          />
        </ScrollView>
      </TabPanel>
      {hasRuleFindings ? (
        <TabPanel flex={1} minHeight={0} value="rules">
          <ScrollView flex={1} minHeight={0} testID="sidebar-rules-scroll">
            {evaluation === null ? null : (
              <AuditRulePanel
                evaluation={evaluation}
                cycleSelection={cycleSelection}
                inspectedCycleId={inspectedCycleId}
                onCycleInspectionChange={onCycleInspectionChange}
              />
            )}
          </ScrollView>
        </TabPanel>
      ) : null}
      <TabPanel flex={1} minHeight={0} value="export">
        <ScrollView flex={1} minHeight={0} testID="sidebar-export-scroll">
          <AuditExportPanel />
        </ScrollView>
      </TabPanel>
    </Tabs>
  );
}

interface HomeSidebarProps {
  readonly inspectedCycleId: string | null;
  readonly evaluation: Audit['evaluation'] | null;
  readonly projectTree: readonly ProjectTreeNode[];
  readonly selectedTreeId: string | null;
  readonly onProjectTreeSelect: (node: ProjectTreeNode) => void;
  readonly cycleSelection: CycleSelection;
  readonly onCycleInspectionChange: (inspection: CycleInspection | null) => void;
}

interface SidebarToolTabsProps extends HomeSidebarProps {
  readonly activeTool: string;
  readonly onValueChange: (value: string) => void;
}
