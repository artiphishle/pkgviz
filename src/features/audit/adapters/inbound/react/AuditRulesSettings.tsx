'use client';

import { CheckIcon } from 'lucide-react';
import { useState } from 'react';

import Setting from '@/components/Setting';
import { SidebarAccordion } from '@/components/sidebar/SidebarAccordion';
import { SidebarSection } from '@/components/sidebar/SidebarSection';
import Switch from '@/components/Switch';
import type {
  AuditRuleControlState,
  AuditRuleCycleView,
} from '@/features/audit/adapters/inbound/react/useAuditRuleControls';
import { t } from '@/i18n/i18n';

/*** Renders audit-rule controls as the final category in the existing settings sidebar. */
export function AuditRulesSettings({
  controls,
  enabled,
  onToggleEnabled,
}: AuditRulesSettingsProps) {
  return (
    <SidebarSection title={t('settings.rules')}>
      <Setting>
        <Switch
          id="switch-rules-enabled"
          label={t('settings.rulesEnabled')}
          value={enabled}
          onToggle={onToggleEnabled}
        />
      </Setting>
      {enabled ? <CyclicDependenciesCategory controls={controls} /> : null}
    </SidebarSection>
  );
}

/*** Renders the cyclic-dependencies category with loading, empty, and finding states. */
function CyclicDependenciesCategory({ controls }: CyclicDependenciesCategoryProps) {
  const [userOpen, setUserOpen] = useState<boolean | null>(null);
  const hasCycles = controls.cycles.length > 0;
  const open = controls.loading ? true : hasCycles ? (userOpen ?? true) : false;

  return (
    <>
      <SidebarAccordion
        title={t('settings.cyclicDependencies')}
        count={controls.loading ? undefined : controls.cycles.length}
        disabled={!controls.loading && !hasCycles}
        open={open}
        onOpenChange={setUserOpen}
      >
        <CycleCategoryContent controls={controls} />
      </SidebarAccordion>
      {!controls.loading && !hasCycles ? <EmptyCycleState failed={controls.loadFailed} /> : null}
    </>
  );
}

/*** Renders either the loading row or every concrete selectable cycle row. */
function CycleCategoryContent({ controls }: CyclicDependenciesCategoryProps) {
  if (controls.loading) {
    return (
      <Setting>
        <span className="text-xs text-neutral-500 dark:text-neutral-400">
          {t('settings.loadingRules')}
        </span>
      </Setting>
    );
  }

  return controls.cycles.map(cycle => (
    <CycleRow key={cycle.id} cycle={cycle} onToggle={controls.toggleCycle} />
  ));
}

/*** Renders the disabled no-finding row without adding pass/fail state to the category header. */
function EmptyCycleState({ failed }: EmptyCycleStateProps) {
  return (
    <Setting>
      <span className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
        <CheckIcon size={12} />
        {t(failed ? 'settings.rulesLoadFailed' : 'settings.noCyclicDependencies')}
      </span>
    </Setting>
  );
}

/*** Renders one selectable cycle path with its stable sidebar color and optional evidence. */
function CycleRow({ cycle, onToggle }: CycleRowProps) {
  const evidence = cycle.detail.edges.flatMap(edge => edge.via);

  return (
    <Setting>
      <label className="flex min-w-0 cursor-pointer items-start gap-2 text-xs">
        <input
          type="checkbox"
          checked={cycle.selected}
          onChange={() => onToggle(cycle.id)}
          className="mt-0.5 shrink-0"
        />
        <span
          aria-hidden="true"
          className="mt-1 size-2 shrink-0 rounded-full"
          style={{ backgroundColor: cycle.color }}
        />
        <span className="min-w-0 flex-1 break-words leading-5">
          {cycle.detail.packages.join(' → ')}
        </span>
      </label>
      {evidence.length > 0 ? <CycleEvidence cycle={cycle} /> : null}
    </Setting>
  );
}

/*** Renders import evidence for one cycle without recomputing dependency analysis. */
function CycleEvidence({ cycle }: CycleEvidenceProps) {
  const evidence = cycle.detail.edges.flatMap(edge => edge.via);

  return (
    <details className="mt-1 pl-8 text-[11px] text-neutral-500 dark:text-neutral-400">
      <summary className="cursor-pointer">
        {t('settings.evidence')} ({evidence.length})
      </summary>
      <div className="mt-1 space-y-1">
        {evidence.map((item, index) => (
          <div key={`${item.filePath}-${item.importName}-${index}`} className="break-words">
            {item.filePath} → {item.importName}
          </div>
        ))}
      </div>
    </details>
  );
}

interface AuditRulesSettingsProps {
  readonly controls: AuditRuleControlState;
  readonly enabled: boolean;
  readonly onToggleEnabled: () => void;
}

interface CyclicDependenciesCategoryProps {
  readonly controls: AuditRuleControlState;
}

interface EmptyCycleStateProps {
  readonly failed: boolean;
}

interface CycleRowProps {
  readonly cycle: AuditRuleCycleView;
  readonly onToggle: (cycleId: string) => void;
}

interface CycleEvidenceProps {
  readonly cycle: AuditRuleCycleView;
}
