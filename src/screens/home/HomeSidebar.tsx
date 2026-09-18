'use client';
import React from 'react';

import { ExportPanel } from '@/components/ExportPanel';
import { SettingsPanel } from '@/components/SettingsPanel';
import { Sidebar } from '@/components/sidebar/Sidebar';
import { SidebarTabs } from '@/components/sidebar/SidebarTabs';
import { AuditRulePanel } from '@/features/audit/adapters/inbound/react/AuditRulePanel';
import { t } from '@/i18n/i18n';
import type { Audit } from '@/types/audit';
import type { CycleHighlight, CycleInspection } from '@/types/auditVisualization';

/*** Composes secondary Rules/Export tools above persistent graph settings. */
export function HomeSidebar({
  evaluation,
  onCycleHighlightsChange,
  onCycleInspectionChange,
}: HomeSidebarProps) {
  const [activeTool, setActiveTool] = React.useState<string | null>(null);
  const violatedRuleCount =
    evaluation?.rules.filter(rule => rule.status === 'failed').length ?? 0;

  /*** Exits diagnostics cleanly when switching away from Rules. */
  const selectTool = (value: string) => {
    if (activeTool === 'rules' && value !== 'rules') {
      onCycleHighlightsChange([]);
      onCycleInspectionChange(null);
    }
    setActiveTool(value);
  };

  return (
    <Sidebar>
      <SidebarTabs
        ariaLabel={t('sidebar.tools')}
        value={activeTool}
        onValueChange={selectTool}
        tabs={[
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
                  onCycleHighlightsChange={onCycleHighlightsChange}
                  onCycleInspectionChange={onCycleInspectionChange}
                />
              ),
          },
          {
            id: 'export',
            label: t('settings.export'),
            content: <ExportPanel />,
          },
        ]}
      />
      <SettingsPanel />
    </Sidebar>
  );
}

interface HomeSidebarProps {
  readonly evaluation: Audit['evaluation'] | null;
  readonly onCycleHighlightsChange: (highlights: readonly CycleHighlight[]) => void;
  readonly onCycleInspectionChange: (inspection: CycleInspection | null) => void;
}
