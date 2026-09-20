'use client';
import React from 'react';

import { AuditRuleList } from '@/features/audit/adapters/inbound/react/AuditRuleList';
import type { Audit } from '@/types/audit';
import type { CycleInspection, CycleSelection } from '@/types/auditVisualization';

/*** Renders violated audit rules while the Rules sidebar tab is active. */
export function AuditRulePanel({
  evaluation,
  cycleSelection,
  onCycleInspectionChange,
}: AuditRulePanelProps) {
  return (
    <AuditRuleList
      evaluation={evaluation}
      cycleSelection={cycleSelection}
      onCycleInspectionChange={onCycleInspectionChange}
    />
  );
}

interface AuditRulePanelProps {
  readonly evaluation: Audit['evaluation'];
  readonly cycleSelection: CycleSelection;
  readonly onCycleInspectionChange: (inspection: CycleInspection | null) => void;
}
