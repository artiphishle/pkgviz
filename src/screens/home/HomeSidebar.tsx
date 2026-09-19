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
import type { CycleHighlight, CycleInspection } from '@/types/auditVisualization';
import type { ProjectTreeNode } from '@/types/projectTree';

/*** Composes project tools and persistent graph settings from generated ZORA elements. */
export function HomeSidebar(props: HomeSidebarProps) {
  const { resolvedTheme } = useTheme();
  const mode = resolvedTheme === 'dark' ? 'dark' : 'light';
  const [activeTool, setActiveTool] = React.useState('tree');

  /*** Exits diagnostics cleanly when switching away from Rules. */
  const selectTool = (value: string) => {
    if (activeTool === 'rules' && value !== 'rules') {
      props.onCycleHighlightsChange([]);
      props.onCycleInspectionChange(null);
    }
    setActiveTool(value);
  };

  return (
    <aside className="flex min-h-0 w-[18rem] min-w-[18rem] max-w-[18rem] shrink-0 self-stretch flex-col overflow-y-auto border-r border-r-neutral-200 md:pt-14 dark:border-r-neutral-800">
      <Surface mode={mode} variant="subtle">
        <SidebarToolTabs {...props} activeTool={activeTool} mode={mode} onValueChange={selectTool} />
        <SettingsPanel mode={mode} />
      </Surface>
    </aside>
  );
}

/*** Renders Tree, Rules, and Export through the generated ZORA Tabs family. */
function SidebarToolTabs({
  activeTool,
  evaluation,
  mode,
  onCycleHighlightsChange,
  onCycleInspectionChange,
  onProjectTreeSelect,
  onValueChange,
  projectTree,
  selectedTreeId,
}: SidebarToolTabsProps) {
  const violatedRuleCount = evaluation?.rules.filter(rule => rule.status === 'failed').length ?? 0;
  const rulesLabel =
    violatedRuleCount === 0 ? t('settings.rules') : `${t('settings.rules')} (${violatedRuleCount})`;

  return (
    <Tabs mode={mode} value={activeTool} onValueChange={onValueChange}>
      <TabList>
        <Tab label={t('settings.tree')} value="tree" />
        <Tab disabled={violatedRuleCount === 0} label={rulesLabel} value="rules" />
        <Tab label={t('settings.export')} value="export" />
      </TabList>
      <TabPanel value="tree">
        <View mode={mode} style={{ maxHeight: 224, overflow: 'scroll' }}>
          <ProjectTreePanel
            mode={mode}
            nodes={projectTree}
            selectedId={selectedTreeId}
            onSelect={onProjectTreeSelect}
          />
        </View>
      </TabPanel>
      <TabPanel value="rules">
        <View mode={mode} style={{ maxHeight: 224, overflow: 'scroll' }}>
          {evaluation === null ? null : (
            <AuditRulePanel
              evaluation={evaluation}
              mode={mode}
              onCycleHighlightsChange={onCycleHighlightsChange}
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
  readonly evaluation: Audit['evaluation'] | null;
  readonly projectTree: readonly ProjectTreeNode[];
  readonly selectedTreeId: string | null;
  readonly onProjectTreeSelect: (node: ProjectTreeNode) => void;
  readonly onCycleHighlightsChange: (highlights: readonly CycleHighlight[]) => void;
  readonly onCycleInspectionChange: (inspection: CycleInspection | null) => void;
}

interface SidebarToolTabsProps extends HomeSidebarProps {
  readonly activeTool: string;
  readonly mode: 'dark' | 'light';
  readonly onValueChange: (value: string) => void;
}
