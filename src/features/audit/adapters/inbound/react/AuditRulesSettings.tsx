'use client';

import { CheckIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

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
  const [cyclesOpen, setCyclesOpen] = useState(true);

  useEffect(() => {
    if (controls.loading) {
      setCyclesOpen(true);
      return;
    }
    setCyclesOpen(controls.cycles.length > 0);
  }, [controls.cycles.length, controls.loading]);

  const hasCycles = controls.cycles.length > 0;

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

      {enabled ? (
        <>
          <SidebarAccordion
            title={t('settings.cyclicDependencies')}
            count={controls.loading ? undefined : controls.cycles.length}
            disabled={!controls.loading && !hasCycles}
            open={cyclesOpen}
            onOpenChange={setCyclesOpen}
          >
            {controls.loading ? (
              <Setting>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                  {t('settings.loadingRules')}
                </span>
              </Setting>
            ) : (
              controls.cycles.map(cycle => (
                <CycleRow key={cycle.id} cycle={cycle} onToggle={controls.toggleCycle} />
              ))
            )}
          </SidebarAccordion>

          {!controls.loading && !hasCycles ? (
            <Setting>
              <span className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                <CheckIcon size={12} />
                {t('settings.noCyclicDependencies')}
              </span>
            </Setting>
          ) : null}
        </>
      ) : null}
    </SidebarSection>
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

      {evidence.length > 0 ? (
        <details className="mt-1 pl-8 text-[11px] text-neutral-500 dark:text-neutral-400">
          <summary className="cursor-pointer">{t('settings.evidence')} ({evidence.length})</summary>
          <div className="mt-1 space-y-1">
            {evidence.map((item, index) => (
              <div key={`${item.filePath}-${item.importName}-${index}`} className="break-words">
                {item.filePath} → {item.importName}
              </div>
            ))}
          </div>
        </details>
      ) : null}
    </Setting>
  );
}

interface AuditRulesSettingsProps {
  readonly controls: AuditRuleControlState;
  readonly enabled: boolean;
  readonly onToggleEnabled: () => void;
}

interface CycleRowProps {
  readonly cycle: AuditRuleCycleView;
  readonly onToggle: (cycleId: string) => void;
}
