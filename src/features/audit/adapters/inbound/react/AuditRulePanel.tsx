'use client';
import React from 'react';

import { AuditRuleList } from '@/features/audit/adapters/inbound/react/AuditRuleList';
import type { Audit } from '@/types/audit';
import type { CycleFocus, CycleHighlight, CycleInspection } from '@/types/auditVisualization';

/*** Renders violated audit rules while the Rules sidebar tab is active. */
export function AuditRulePanel({
  evaluation,
  onCycleFocusChange,
  onCycleHighlightsChange,
  onCycleInspectionChange,
}: AuditRulePanelProps) {
  return (
    <AuditRuleList
      evaluation={evaluation}
      onCycleFocusChange={onCycleFocusChange}
      onCycleHighlightsChange={onCycleHighlightsChange}
      onCycleInspectionChange={onCycleInspectionChange}
    />
  );
}

interface AuditRulePanelProps {
  readonly evaluation: Audit['evaluation'];
  readonly onCycleFocusChange: (focus: CycleFocus) => void;
  readonly onCycleHighlightsChange: (highlights: readonly CycleHighlight[]) => void;
  readonly onCycleInspectionChange: (inspection: CycleInspection | null) => void;
}
