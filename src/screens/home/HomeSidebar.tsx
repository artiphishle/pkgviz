'use client';
import React from 'react';

import { ExportPanel } from '@/components/ExportPanel';
import { SettingsPanel } from '@/components/SettingsPanel';
import { Sidebar } from '@/components/sidebar/Sidebar';
import { SidebarTabs } from '@/components/sidebar/SidebarTabs';
import { useSettings } from '@/contexts/SettingsContext';
import { AuditRulePanel } from '@/features/audit/adapters/inbound/react/AuditRulePanel';
import { ProjectTreePanel } from '@/features/project-tree/adapters/inbound/react/ProjectTreePanel';
import { t } from '@/i18n/i18n';
import type { Audit } from '@/types/audit';
import type { CycleFocus, CycleHighlight, CycleInspection } from '@/types/auditVisualization';
import type { ProjectTreeNode } from '@/types/projectTree';

/*** Composes Tree, Rules, and Export above persistent graph settings. */
export function HomeSidebar(props: HomeSidebarProps) {
  const [activeTool, setActiveTool] = React.useState<string | null>('tree');
  const { setCytoscapeLayout, setCytoscapeLayoutSpacing, setSubPackageDepth } = useSettings();

  /*** Applies active-cycle focus settings without restoring previous graph state on exit. */
  const focusCycle = (focus: CycleFocus) => {
    setCytoscapeLayout('circle');
    setCytoscapeLayoutSpacing(0.1);
    setSubPackageDepth(focus.packageDepth);
    props.setCurrentPackage(focus.currentPackage);
  };

  /*** Exits diagnostics cleanly when switching away from Rules. */
  const selectTool = (value: string) => {
    if (activeTool === 'rules' && value !== 'rules') {
      props.onCycleHighlightsChange([]);
      props.onCycleInspectionChange(null);
    }
    setActiveTool(value);
  };

  return (
    <Sidebar>
      <SidebarToolTabs
        activeTool={activeTool}
        evaluation={props.evaluation}
        onCycleFocusChange={focusCycle}
        onCycleHighlightsChange={props.onCycleHighlightsChange}
        onCycleInspectionChange={props.onCycleInspectionChange}
        onProjectTreeSelect={props.onProjectTreeSelect}
        onValueChange={selectTool}
        projectTree={props.projectTree}
        selectedTreeId={props.selectedTreeId}
      />
      <SettingsPanel />
    </Sidebar>
  );
}

/*** Renders project-tree navigation together with secondary Rules and Export tools. */
function SidebarToolTabs({
  activeTool,
  evaluation,
  onCycleFocusChange,
  onCycleHighlightsChange,
  onCycleInspectionChange,
  onProjectTreeSelect,
  onValueChange,
  projectTree,
  selectedTreeId,
}: SidebarToolTabsProps) {
  const violatedRuleCount = evaluation?.rules.filter(rule => rule.status === 'failed').length ?? 0;

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
          label: t('settings.rules'),
          badge: violatedRuleCount,
          badgeTone: 'danger',
          disabled: violatedRuleCount === 0,
          content:
            evaluation === null ? null : (
              <AuditRulePanel
                evaluation={evaluation}
                onCycleFocusChange={onCycleFocusChange}
                onCycleHighlightsChange={onCycleHighlightsChange}
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
  readonly evaluation: Audit['evaluation'] | null;
  readonly projectTree: readonly ProjectTreeNode[];
  readonly selectedTreeId: string | null;
  readonly onProjectTreeSelect: (node: ProjectTreeNode) => void;
  readonly onCycleHighlightsChange: (highlights: readonly CycleHighlight[]) => void;
  readonly onCycleInspectionChange: (inspection: CycleInspection | null) => void;
  readonly setCurrentPackage: (path: string) => void;
}

interface SidebarToolTabsProps {
  readonly activeTool: string | null;
  readonly evaluation: Audit['evaluation'] | null;
  readonly onCycleFocusChange: (focus: CycleFocus) => void;
  readonly onCycleHighlightsChange: (highlights: readonly CycleHighlight[]) => void;
  readonly onCycleInspectionChange: (inspection: CycleInspection | null) => void;
  readonly onProjectTreeSelect: (node: ProjectTreeNode) => void;
  readonly onValueChange: (value: string) => void;
  readonly projectTree: readonly ProjectTreeNode[];
  readonly selectedTreeId: string | null;
}
