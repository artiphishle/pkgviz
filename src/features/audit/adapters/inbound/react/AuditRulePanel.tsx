'use client';
import React from 'react';

import { AuditRuleList } from '@/features/audit/adapters/inbound/react/AuditRuleList';
import type { Audit } from '@/types/audit';
import type { CycleHighlight, CycleInspection } from '@/types/auditVisualization';

/*** Renders violated audit rules while the Rules sidebar tab is active. */
export function AuditRulePanel({
  evaluation,
  onCycleHighlightsChange,
  onCycleInspectionChange,
}: AuditRulePanelProps) {
  return (
    <AuditRuleList
      evaluation={evaluation}
      onCycleHighlightsChange={onCycleHighlightsChange}
      onCycleInspectionChange={onCycleInspectionChange}
    />
  );
}

interface AuditRulePanelProps {
  readonly evaluation: Audit['evaluation'];
  readonly onCycleHighlightsChange: (highlights: readonly CycleHighlight[]) => void;
  readonly onCycleInspectionChange: (inspection: CycleInspection | null) => void;
}
