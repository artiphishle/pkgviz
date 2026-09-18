'use client';
import React from 'react';

import { SidebarAccordionSection } from '@/components/sidebar/SidebarAccordionSection';
import { SidebarRow } from '@/components/sidebar/SidebarRow';
import { CyclicDependenciesRuleDetails } from '@/features/audit/adapters/inbound/react/CyclicDependenciesRuleDetails';
import { t } from '@/i18n/i18n';
import type { Audit, AuditRuleResult } from '@/types/audit';
import type { CycleHighlight, CycleInspection } from '@/types/auditVisualization';

const RULE_RENDERERS: Readonly<Record<string, React.ComponentType<AuditRuleRendererProps>>> = {
  'cyclic-dependencies': CyclicDependenciesRuleDetails,
};

/*** Renders audit rules through independently registered sidebar category renderers. */
export function AuditRuleList(props: AuditRuleListProps) {
  if (props.evaluation.rules.length === 0) {
    return (
      <SidebarRow>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">{t('audit.noRules')}</p>
      </SidebarRow>
    );
  }

  return (
    <>
      {props.evaluation.rules.map(rule => {
        const RuleRenderer = RULE_RENDERERS[rule.id] ?? GenericAuditRuleDetails;
        return <RuleRenderer {...props} key={rule.id + ':' + props.enabled} rule={rule} />;
      })}
    </>
  );
}

/*** Renders an unknown rule as a compact generic collapsible category. */
function GenericAuditRuleDetails({ rule }: AuditRuleRendererProps) {
  const count = rule.details.length;

  return (
    <SidebarAccordionSection count={count} title={rule.id}>
      {rule.details.map((detail, index) => (
        <SidebarRow key={detail + ':' + index}>
          <code className="block truncate text-[11px]" title={detail}>
            {detail}
          </code>
        </SidebarRow>
      ))}
    </SidebarAccordionSection>
  );
}

interface AuditRuleRendererProps extends AuditRuleListProps {
  readonly rule: AuditRuleResult;
}

interface AuditRuleListProps {
  readonly enabled: boolean;
  readonly evaluation: Audit['evaluation'];
  readonly onCycleHighlightsChange: (highlights: readonly CycleHighlight[]) => void;
  readonly onCycleInspectionChange: (inspection: CycleInspection | null) => void;
  readonly onEnabledToggle: () => void;
}
