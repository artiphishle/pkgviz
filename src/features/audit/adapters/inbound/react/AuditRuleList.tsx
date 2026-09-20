'use client';
import React from 'react';

import { SidebarRow } from '@/components/sidebar/SidebarRow';
import { SidebarSection } from '@/components/sidebar/SidebarSection';
import { CyclicDependenciesRuleDetails } from '@/features/audit/adapters/inbound/react/CyclicDependenciesRuleDetails';
import type { Audit, AuditRuleResult } from '@/types/audit';
import type { CycleInspection, CycleSelection } from '@/types/auditVisualization';

/*** Renders only violated audit rules in the active Rules sidebar tab. */
export function AuditRuleList({
  evaluation,
  cycleSelection,
  onCycleInspectionChange,
}: AuditRuleListProps) {
  return (
    <>
      {evaluation.rules
        .filter(rule => rule.status === 'failed')
        .map(rule => (
          <RuleDetails
            key={rule.id}
            evaluation={evaluation}
            rule={rule}
            cycleSelection={cycleSelection}
            onCycleInspectionChange={onCycleInspectionChange}
          />
        ))}
    </>
  );
}

/*** Dispatches one violated rule to its dedicated sidebar renderer. */
function RuleDetails({
  evaluation,
  cycleSelection,
  onCycleInspectionChange,
  rule,
}: RuleDetailsProps) {
  if (rule.id === 'cyclic-dependencies') {
    return (
      <CyclicDependenciesRuleDetails
        cycles={evaluation.cyclicPackages}
        cycleSelection={cycleSelection}
        onCycleInspectionChange={onCycleInspectionChange}
      />
    );
  }

  return (
    <SidebarSection title={rule.id}>
      {rule.details.map((detail, index) => (
        <SidebarRow key={detail + ':' + index}>
          <code className="block truncate text-[11px]" title={detail}>
            {detail}
          </code>
        </SidebarRow>
      ))}
    </SidebarSection>
  );
}

interface AuditRuleListProps {
  readonly evaluation: Audit['evaluation'];
  readonly cycleSelection: CycleSelection;
  readonly onCycleInspectionChange: (inspection: CycleInspection | null) => void;
}

interface RuleDetailsProps extends AuditRuleListProps {
  readonly rule: AuditRuleResult;
}
