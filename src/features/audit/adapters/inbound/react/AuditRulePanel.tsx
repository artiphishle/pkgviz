'use client';
import { useEffect, useState } from 'react';

import Setting from '@/components/Setting';
import { AuditRuleList } from '@/features/audit/adapters/inbound/react/AuditRuleList';
import { t } from '@/i18n/i18n';
import type { Audit } from '@/types/audit';
import type { CycleHighlight } from '@/types/auditVisualization';

/*** Loads the serializable audit evaluation and renders the sidebar rule controls. */
export function AuditRulePanel({
  loadAudit,
  onCycleHighlightsChange,
}: AuditRulePanelProps) {
  const [evaluation, setEvaluation] = useState<Audit['evaluation'] | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    void loadAudit().then(setEvaluation, () => setLoadFailed(true));
  }, [loadAudit]);

  if (loadFailed) {
    return (
      <Setting>
        <p role="alert" className="text-xs text-red-700 dark:text-red-300">
          {t('audit.loadError')}
        </p>
      </Setting>
    );
  }

  if (evaluation === null) {
    return (
      <Setting>
        <p aria-live="polite" className="text-xs text-neutral-500 dark:text-neutral-400">
          {t('audit.loading')}
        </p>
      </Setting>
    );
  }

  return (
    <AuditRuleList
      evaluation={evaluation}
      onCycleHighlightsChange={onCycleHighlightsChange}
    />
  );
}

interface AuditRulePanelProps {
  readonly loadAudit: () => Promise<Audit['evaluation']>;
  readonly onCycleHighlightsChange: (highlights: readonly CycleHighlight[]) => void;
}
