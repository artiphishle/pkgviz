'use client';
import { Text } from '@zora/text';
import { View } from '@zora/view';
import React from 'react';

import { CyclicDependenciesRuleDetails } from '@/features/audit/adapters/inbound/react/CyclicDependenciesRuleDetails';
import type { Audit, AuditRuleResult } from '@/types/audit';
import type { CycleInspection, CycleSelection } from '@/types/auditVisualization';

/*** Renders only violated audit rules using generated ZORA presentation elements. */
export function AuditRuleList({
  evaluation,
  cycleSelection,
  inspectedCycleId,
  onCycleInspectionChange,
}: AuditRuleListProps) {
  return (
    <View gap="l">
      {evaluation.rules
        .filter(rule => rule.status === 'failed')
        .map(rule => (
          <RuleDetails
            key={rule.id}
            evaluation={evaluation}
            rule={rule}
            cycleSelection={cycleSelection}
            inspectedCycleId={inspectedCycleId}
            onCycleInspectionChange={onCycleInspectionChange}
          />
        ))}
    </View>
  );
}

/*** Dispatches one violated rule to its dedicated renderer or generic ZORA fallback. */
function RuleDetails({
  evaluation,
  cycleSelection,
  inspectedCycleId,
  onCycleInspectionChange,
  rule,
}: RuleDetailsProps) {
  if (rule.id === 'cyclic-dependencies') {
    return (
      <CyclicDependenciesRuleDetails
        cycles={evaluation.cyclicPackages}
        cycleSelection={cycleSelection}
        inspectedCycleId={inspectedCycleId}
        onCycleInspectionChange={onCycleInspectionChange}
      />
    );
  }

  return (
    <View gap="xs" p="m">
      <Text variant="label" weight="bold">
        {rule.id}
      </Text>
      {rule.details.map((detail, index) => (
        <Text key={detail + ':' + index} numberOfLines={1} variant="code">
          {detail}
        </Text>
      ))}
    </View>
  );
}

interface AuditRuleListProps {
  readonly inspectedCycleId?: string | null;
  readonly evaluation: Audit['evaluation'];
  readonly cycleSelection: CycleSelection;
  readonly onCycleInspectionChange: (inspection: CycleInspection | null) => void;
}

interface RuleDetailsProps extends AuditRuleListProps {
  readonly rule: AuditRuleResult;
}
