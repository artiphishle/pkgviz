'use client';
import React from 'react';

import { SidebarAccordionSection } from '@/components/sidebar/SidebarAccordionSection';
import { SidebarRow } from '@/components/sidebar/SidebarRow';
import { AuditRuleList } from '@/features/audit/adapters/inbound/react/AuditRuleList';
import { t } from '@/i18n/i18n';
import type { Audit } from '@/types/audit';
import type { CycleHighlight } from '@/types/auditVisualization';

/*** Loads the serializable audit evaluation while keeping known rule categories visible. */
export function AuditRulePanel({ loadAudit, onCycleHighlightsChange }: AuditRulePanelProps) {
  const [evaluation, setEvaluation] = React.useState<Audit['evaluation'] | null>(null);
  const [loadFailed, setLoadFailed] = React.useState(false);

  React.useEffect(() => {
    void loadAudit().then(setEvaluation, () => setLoadFailed(true));
  }, [loadAudit]);

  if (loadFailed) {
    return (
      <>
        <SidebarAccordionSection count={0} title={t('audit.rule.cyclicDependencies')}>
          {null}
        </SidebarAccordionSection>
        <SidebarRow>
          <p role="alert" className="text-xs text-red-700 dark:text-red-300">
            {t('audit.loadError')}
          </p>
        </SidebarRow>
      </>
    );
  }

  if (evaluation === null) {
    return (
      <SidebarAccordionSection
        count={0}
        loading
        title={t('audit.rule.cyclicDependencies')}
      >
        <SidebarRow>
          <p aria-live="polite" className="text-xs text-neutral-500 dark:text-neutral-400">
            {t('audit.loading')}
          </p>
        </SidebarRow>
      </SidebarAccordionSection>
    );
  }

  return (
    <AuditRuleList evaluation={evaluation} onCycleHighlightsChange={onCycleHighlightsChange} />
  );
}

interface AuditRulePanelProps {
  readonly loadAudit: () => Promise<Audit['evaluation']>;
  readonly onCycleHighlightsChange: (highlights: readonly CycleHighlight[]) => void;
}
