'use client';
import { Surface } from '@zora/surface';
import { Tab, TabList, TabPanel, Tabs } from '@zora/tabs';
import { View } from '@zora/view';
import { useTheme } from 'next-themes';
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
  const { resolvedTheme } = useTheme();
  const mode = resolvedTheme === 'dark' ? 'dark' : 'light';
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
      <Surface mode={mode} style={{ height: '100%', overflow: 'hidden' }} variant="subtle">
        <View mode={mode} flex={1} style={{ minHeight: 0, overflow: 'hidden' }}>
          <SidebarToolTabs
            {...props}
            activeTool={activeTool}
            mode={mode}
            onValueChange={selectTool}
          />
        </View>
        <SettingsPanel mode={mode} />
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
  mode,
  onCycleInspectionChange,
  onProjectTreeSelect,
  onValueChange,
  projectTree,
  selectedTreeId,
}: SidebarToolTabsProps) {
  const violatedRuleCount = evaluation?.rules.filter(rule => rule.status === 'failed').length ?? 0;
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
  const rulesLabel = `${t('settings.rules')} · ${findingCount} ${t('audit.findings')}`;

  return (
    <Tabs mode={mode} value={activeTool} onValueChange={onValueChange}>
      <TabList>
        <Tab label={t('settings.tree')} value="tree" />
        <Tab disabled={violatedRuleCount === 0} label={rulesLabel} value="rules" />
        <Tab label={t('settings.export')} value="export" />
      </TabList>
      <TabPanel value="tree">
        <View mode={mode} style={{ maxHeight: '100%', overflow: 'auto' }}>
          <ProjectTreePanel
            mode={mode}
            nodes={projectTree}
            selectedId={selectedTreeId}
            onSelect={onProjectTreeSelect}
          />
        </View>
      </TabPanel>
      <TabPanel value="rules">
        <View mode={mode} style={{ maxHeight: '100%', overflow: 'auto' }}>
          {evaluation === null ? null : (
            <AuditRulePanel
              evaluation={evaluation}
              cycleSelection={cycleSelection}
              inspectedCycleId={inspectedCycleId}
              mode={mode}
              onCycleInspectionChange={onCycleInspectionChange}
            />
          )}
        </View>
      </TabPanel>
      <TabPanel value="export">
        <AuditExportPanel mode={mode} />
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
  readonly mode: 'dark' | 'light';
  readonly onValueChange: (value: string) => void;
}
