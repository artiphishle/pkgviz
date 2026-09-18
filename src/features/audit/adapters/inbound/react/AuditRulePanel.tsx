'use client';
import React from 'react';

import { SidebarAccordionSection } from '@/components/sidebar/SidebarAccordionSection';
import { SidebarRow } from '@/components/sidebar/SidebarRow';
import { ToggleSwitch } from '@/components/ToggleSwitch';
import { useSettings } from '@/contexts/SettingsContext';
import { AuditRuleList } from '@/features/audit/adapters/inbound/react/AuditRuleList';
import { t } from '@/i18n/i18n';
import type { Audit } from '@/types/audit';
import type { CycleHighlight, CycleInspection } from '@/types/auditVisualization';

/*** Loads audit findings while keeping the cyclic-dependencies control immediately available. */
export function AuditRulePanel({
  loadAudit,
  onCycleHighlightsChange,
  onCycleInspectionChange,
}: AuditRulePanelProps) {
  const { cyclicDependenciesEnabled, toggleCyclicDependenciesEnabled } = useSettings();
  const { evaluation, loadFailed, retry } = useAuditEvaluation(
    cyclicDependenciesEnabled,
    loadAudit
  );

  const toggleRule = () => {
    if (cyclicDependenciesEnabled) {
      onCycleHighlightsChange([]);
      onCycleInspectionChange(null);
    } else {
      retry();
    }
    toggleCyclicDependenciesEnabled();
  };

  if (evaluation === null) {
    return (
      <PendingCyclicRule
        enabled={cyclicDependenciesEnabled}
        loadFailed={loadFailed}
        onEnabledToggle={toggleRule}
      />
    );
  }

  return (
    <AuditRuleList
      enabled={cyclicDependenciesEnabled}
      evaluation={evaluation}
      onCycleHighlightsChange={onCycleHighlightsChange}
      onCycleInspectionChange={onCycleInspectionChange}
      onEnabledToggle={toggleRule}
    />
  );
}

/*** Loads audit evaluation only while the cyclic-dependencies rule is enabled. */
function useAuditEvaluation(enabled: boolean, loadAudit: AuditRulePanelProps['loadAudit']) {
  const [evaluation, setEvaluation] = React.useState<Audit['evaluation'] | null>(null);
  const [loadFailed, setLoadFailed] = React.useState(false);

  React.useEffect(() => {
    if (!enabled || evaluation !== null || loadFailed) return;
    let active = true;

    void loadAudit().then(
      nextEvaluation => {
        if (active) setEvaluation(nextEvaluation);
      },
      () => {
        if (active) setLoadFailed(true);
      }
    );

    return () => {
      active = false;
    };
  }, [enabled, evaluation, loadAudit, loadFailed]);

  return { evaluation, loadFailed, retry: () => setLoadFailed(false) };
}

/*** Renders the always-present rule header before findings are available. */
function PendingCyclicRule({ enabled, loadFailed, onEnabledToggle }: PendingCyclicRuleProps) {
  return (
    <>
      <SidebarAccordionSection
        action={
          <ToggleSwitch
            ariaLabel={t('audit.rule.cyclicDependencies')}
            id="switch-cyclic-dependencies-enabled"
            onToggle={onEnabledToggle}
            value={enabled}
          />
        }
        count={0}
        disabled={!enabled || loadFailed}
        loading={enabled && !loadFailed}
        title={t('audit.rule.cyclicDependencies')}
      >
        {enabled && !loadFailed ? (
          <SidebarRow>
            <p aria-live="polite" className="text-xs text-neutral-500 dark:text-neutral-400">
              {t('audit.loading')}
            </p>
          </SidebarRow>
        ) : null}
      </SidebarAccordionSection>
      {loadFailed ? <LoadError /> : null}
    </>
  );
}

/*** Renders audit-loading failure feedback without replacing the rule category header. */
function LoadError() {
  return (
    <SidebarRow>
      <p role="alert" className="text-xs text-red-700 dark:text-red-300">
        {t('audit.loadError')}
      </p>
    </SidebarRow>
  );
}

interface AuditRulePanelProps {
  readonly loadAudit: () => Promise<Audit['evaluation']>;
  readonly onCycleHighlightsChange: (highlights: readonly CycleHighlight[]) => void;
  readonly onCycleInspectionChange: (inspection: CycleInspection | null) => void;
}

interface PendingCyclicRuleProps {
  readonly enabled: boolean;
  readonly loadFailed: boolean;
  readonly onEnabledToggle: () => void;
}
