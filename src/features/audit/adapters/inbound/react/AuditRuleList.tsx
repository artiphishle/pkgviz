'use client';
import React from 'react';
import { Text } from '@zora/text';
import { View } from '@zora/view';

import { CyclicDependenciesRuleDetails } from '@/features/audit/adapters/inbound/react/CyclicDependenciesRuleDetails';
import type { Audit, AuditRuleResult } from '@/types/audit';
import type { CycleHighlight, CycleInspection } from '@/types/auditVisualization';
import type { ZoraMode } from '@/types/zora';

/*** Renders only violated audit rules using generated ZORA presentation elements. */
export function AuditRuleList({
  evaluation,
  mode,
  onCycleHighlightsChange,
  onCycleInspectionChange,
}: AuditRuleListProps) {
  return (
    <View mode={mode} gap="l">
      {evaluation.rules
        .filter(rule => rule.status === 'failed')
        .map(rule => (
          <RuleDetails
            key={rule.id}
            evaluation={evaluation}
            mode={mode}
            rule={rule}
            onCycleHighlightsChange={onCycleHighlightsChange}
            onCycleInspectionChange={onCycleInspectionChange}
          />
        ))}
    </View>
  );
}

/*** Dispatches one violated rule to its dedicated renderer or generic ZORA fallback. */
function RuleDetails({
  evaluation,
  mode,
  onCycleHighlightsChange,
  onCycleInspectionChange,
  rule,
}: RuleDetailsProps) {
  if (rule.id === 'cyclic-dependencies') {
    return (
      <CyclicDependenciesRuleDetails
        cycles={evaluation.cyclicPackages}
        mode={mode}
        onCycleHighlightsChange={onCycleHighlightsChange}
        onCycleInspectionChange={onCycleInspectionChange}
      />
    );
  }

  return (
    <View mode={mode} gap="xs" p="m">
      <Text mode={mode} variant="label" weight="bold">
        {rule.id}
      </Text>
      {rule.details.map((detail, index) => (
        <Text key={detail + ':' + index} mode={mode} numberOfLines={1} variant="code">
          {detail}
        </Text>
      ))}
    </View>
  );
}

interface AuditRuleListProps {
  readonly evaluation: Audit['evaluation'];
  readonly mode: ZoraMode;
  readonly onCycleHighlightsChange: (highlights: readonly CycleHighlight[]) => void;
  readonly onCycleInspectionChange: (inspection: CycleInspection | null) => void;
}

interface RuleDetailsProps extends AuditRuleListProps {
  readonly rule: AuditRuleResult;
}
