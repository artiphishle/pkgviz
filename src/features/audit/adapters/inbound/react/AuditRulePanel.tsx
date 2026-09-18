'use client';
import { useEffect, useState } from 'react';

import { AuditRuleTabs } from '@/features/audit/adapters/inbound/react/AuditRuleTabs';
import { t } from '@/i18n/i18n';
import type { Audit } from '@/types/audit';

/*** Loads the existing audit result and renders inspectable rule details. */
export function AuditRulePanel({ loadAudit }: AuditRulePanelProps) {
  const [audit, setAudit] = useState<Audit | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    void loadAudit().then(setAudit, () => setLoadFailed(true));
  }, [loadAudit]);

  if (loadFailed) {
    return (
      <p role="alert" className="text-xs text-red-700 dark:text-red-300">
        {t('audit.loadError')}
      </p>
    );
  }

  if (audit === null) {
    return (
      <p aria-live="polite" className="text-xs text-neutral-500 dark:text-neutral-400">
        {t('audit.loading')}
      </p>
    );
  }

  return (
    <AuditRuleTabs
      cyclicPackages={audit.evaluation.cyclicPackages}
      rules={audit.evaluation.rules}
    />
  );
}

interface AuditRulePanelProps {
  readonly loadAudit: () => Promise<Audit>;
}
