'use client';
import type { ComponentType } from 'react';

import Setting from '@/components/Setting';
import { CyclicDependenciesRuleDetails } from '@/features/audit/adapters/inbound/react/CyclicDependenciesRuleDetails';
import { t } from '@/i18n/i18n';
import type { Audit, AuditRuleResult } from '@/types/audit';
import type { CycleHighlight } from '@/types/auditVisualization';

const RULE_RENDERERS: Readonly<Record<string, ComponentType<AuditRuleRendererProps>>> = {
  'cyclic-dependencies': CyclicDependenciesRuleDetails,
};

/*** Renders enabled audit rules through independently registered rule renderers. */
export function AuditRuleList({ evaluation, onCycleHighlightsChange }: AuditRuleListProps) {
  if (evaluation.rules.length === 0) {
    return (
      <Setting>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">{t('audit.noRules')}</p>
      </Setting>
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

/*** Renders a compact fallback row for rules without a dedicated visualization adapter. */
function GenericAuditRuleDetails({ rule }: AuditRuleRendererProps) {
  return (
    <Setting>
      <div className="text-xs">
        <span className="font-medium">{rule.id}</span>
        <span className="ml-2 text-neutral-500 dark:text-neutral-400">{rule.message}</span>
      </div>
    </Setting>
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
