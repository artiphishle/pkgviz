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
      <CyclicDependenciesCategory
        controls={controls}
        enabled={enabled}
        onToggleEnabled={onToggleEnabled}
      />
    </SidebarSection>
  );
}

/*** Renders the cyclic-dependencies rule header, switch, and compact cycle rows. */
function CyclicDependenciesCategory({
  controls,
  enabled,
  onToggleEnabled,
}: CyclicDependenciesCategoryProps) {
  const [userOpen, setUserOpen] = useState<boolean | null>(null);
  const hasCycles = controls.cycles.length > 0;
  const open = enabled && (controls.loading ? true : hasCycles ? (userOpen ?? true) : false);

  return (
    <>
      <SidebarAccordion
        action={
          <Switch
            id="switch-cyclic-dependencies"
            ariaLabel={t('settings.enableCyclicDependencies')}
            value={enabled}
            onToggle={onToggleEnabled}
          />
        }
        title={t('settings.cyclicDependencies')}
        count={controls.loading ? undefined : controls.cycles.length}
        disabled={!enabled || (!controls.loading && !hasCycles)}
        open={open}
        onOpenChange={setUserOpen}
      >
        <CycleCategoryContent controls={controls} />
      </SidebarAccordion>
      {enabled && !controls.loading && !hasCycles ? (
        <EmptyCycleState failed={controls.loadFailed} />
      ) : null}
    </>
  );
}

/*** Renders loading feedback or the compact set of concrete cycle controls. */
function CycleCategoryContent({ controls }: CycleCategoryContentProps) {
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
    <CycleRow
      key={cycle.id}
      cycle={cycle}
      onInspect={controls.inspectCycle}
      onToggle={controls.toggleCycle}
    />
  ));
}

/*** Renders the no-finding or load-error state below the disabled rule accordion. */
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

/*** Renders one compact cycle control row; detailed evidence stays in the graph inspector. */
function CycleRow({ cycle, onInspect, onToggle }: CycleRowProps) {
  return (
    <Setting>
      <div className="flex min-w-0 items-start gap-2">
        <input
          aria-label={`${cycle.label} ${t('settings.selectCycle')}`}
          type="checkbox"
          checked={cycle.selected}
          onChange={() => onToggle(cycle.id)}
          className="mt-1 shrink-0"
        />
        <span
          aria-hidden="true"
          className="mt-1.5 size-2 shrink-0 rounded-full"
          style={{ backgroundColor: cycle.color }}
        />
        <button
          type="button"
          onClick={() => onInspect(cycle.id)}
          className="min-w-0 flex-1 text-left"
        >
          <span className="flex items-center justify-between gap-2 text-xs">
            <span className="truncate font-medium">{cycle.label}</span>
            <span className="shrink-0 text-[10px] text-neutral-500 dark:text-neutral-400">
              {cycle.packageCount} {t('settings.packages')}
            </span>
          </span>
          <span className="block truncate text-[11px] leading-4 text-neutral-500 dark:text-neutral-400">
            {cycle.path}
          </span>
        </button>
      </div>
    </Setting>
  );
}

interface AuditRulesSettingsProps {
  readonly controls: AuditRuleControlState;
  readonly enabled: boolean;
  readonly onToggleEnabled: () => void;
}

type CyclicDependenciesCategoryProps = AuditRulesSettingsProps;

interface CycleCategoryContentProps {
  readonly controls: AuditRuleControlState;
}

interface EmptyCycleStateProps {
  readonly failed: boolean;
}

interface CycleRowProps {
  readonly cycle: AuditRuleCycleView;
  readonly onInspect: (cycleId: string) => void;
  readonly onToggle: (cycleId: string) => void;
}
