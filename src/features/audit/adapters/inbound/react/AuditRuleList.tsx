'use client';
import React from 'react';

import { SidebarAccordionSection } from '@/components/sidebar/SidebarAccordionSection';
import { SidebarRow } from '@/components/sidebar/SidebarRow';
import { CyclicDependenciesRuleDetails } from '@/features/audit/adapters/inbound/react/CyclicDependenciesRuleDetails';
import { t } from '@/i18n/i18n';
import type { Audit, AuditRuleResult } from '@/types/audit';
import type { CycleHighlight } from '@/types/auditVisualization';

const RULE_RENDERERS: Readonly<Record<string, React.ComponentType<AuditRuleRendererProps>>> = {
  'cyclic-dependencies': CyclicDependenciesRuleDetails,
};

/*** Renders audit rules through independently registered sidebar category renderers. */
export function AuditRuleList({ evaluation, onCycleHighlightsChange }: AuditRuleListProps) {
  if (evaluation.rules.length === 0) {
    return (
      <SidebarRow>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">{t('audit.noRules')}</p>
      </SidebarRow>
    );
  }

  return (
    <>
      {evaluation.rules.map(rule => {
        const RuleRenderer = RULE_RENDERERS[rule.id] ?? GenericAuditRuleDetails;
        return (
          <RuleRenderer
            key={rule.id}
            evaluation={evaluation}
            rule={rule}
            onCycleHighlightsChange={onCycleHighlightsChange}
          />
        );
      })}
    </>
  );
}

/*** Renders an unknown rule as a generic collapsible sidebar category. */
function GenericAuditRuleDetails({ rule }: AuditRuleRendererProps) {
  const count = rule.details.length;

  return (
    <SidebarAccordionSection count={count} title={rule.id}>
      {rule.details.map(detail => (
        <SidebarRow key={detail}>
          <code className="block break-all text-[11px]">{detail}</code>
        </SidebarRow>
      ))}
    </SidebarAccordionSection>
  );
}

interface AuditRuleRendererProps {
  readonly evaluation: Audit['evaluation'];
  readonly rule: AuditRuleResult;
  readonly onCycleHighlightsChange: (highlights: readonly CycleHighlight[]) => void;
}

interface AuditRuleListProps {
  readonly evaluation: Audit['evaluation'];
  readonly onCycleHighlightsChange: (highlights: readonly CycleHighlight[]) => void;
}
