'use client';
import React from 'react';

import { ExportPanel } from '@/components/ExportPanel';
import { SettingsPanel } from '@/components/SettingsPanel';
import { Sidebar } from '@/components/sidebar/Sidebar';
import { SidebarTabs } from '@/components/sidebar/SidebarTabs';
import { AuditRulePanel } from '@/features/audit/adapters/inbound/react/AuditRulePanel';
import { ProjectTreePanel } from '@/features/project-tree/adapters/inbound/react/ProjectTreePanel';
import { t } from '@/i18n/i18n';
import type { Audit } from '@/types/audit';
import type { CycleInspection, CycleSelection } from '@/types/auditVisualization';
import type { ProjectTreeNode } from '@/types/projectTree';

/*** Composes Tree, Rules, and Export above persistent graph settings. */
export function HomeSidebar(props: HomeSidebarProps) {
  const [activeTool, setActiveTool] = React.useState<string | null>('tree');

  /*** Closes the evidence panel without changing the user's cycle visualization choices. */
  const selectTool = (value: string) => {
    if (activeTool === 'rules' && value !== 'rules') {
      props.onCycleInspectionChange(null);
    }
    setActiveTool(value);
  };

  return (
    <Sidebar>
      <SidebarToolTabs
        activeTool={activeTool}
        evaluation={props.evaluation}
        cycleSelection={props.cycleSelection}
        inspectedCycleId={props.inspectedCycleId}
        onCycleInspectionChange={props.onCycleInspectionChange}
        onProjectTreeSelect={props.onProjectTreeSelect}
        onValueChange={selectTool}
        projectTree={props.projectTree}
        selectedTreeId={props.selectedTreeId}
      />
      <div className="shrink-0">
        <SettingsPanel />
      </div>
    </Sidebar>
  );
}

/*** Renders project-tree navigation together with secondary Rules and Export tools. */
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

  return (
    <SidebarTabs
      ariaLabel={t('sidebar.tools')}
      value={activeTool}
      onValueChange={onValueChange}
      tabs={[
        {
          id: 'tree',
          label: t('settings.tree'),
          content: (
            <ProjectTreePanel
              nodes={projectTree}
              selectedId={selectedTreeId}
              onSelect={onProjectTreeSelect}
            />
          ),
        },
        {
          id: 'rules',
          label: `${t('settings.rules')} · ${findingCount} ${t('audit.findings')}`,
          disabled: violatedRuleCount === 0,
          content:
            evaluation === null ? null : (
              <AuditRulePanel
                evaluation={evaluation}
                cycleSelection={cycleSelection}
                inspectedCycleId={inspectedCycleId}
                onCycleInspectionChange={onCycleInspectionChange}
              />
            ),
        },
        { id: 'export', label: t('settings.export'), content: <ExportPanel /> },
      ]}
    />
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

interface SidebarToolTabsProps {
  readonly inspectedCycleId: string | null;
  readonly activeTool: string | null;
  readonly evaluation: Audit['evaluation'] | null;
  readonly cycleSelection: CycleSelection;
  readonly onCycleInspectionChange: (inspection: CycleInspection | null) => void;
  readonly onProjectTreeSelect: (node: ProjectTreeNode) => void;
  readonly onValueChange: (value: string) => void;
  readonly projectTree: readonly ProjectTreeNode[];
  readonly selectedTreeId: string | null;
}
