'use client';
import React from 'react';

import { SidebarBadge } from '@/components/sidebar/SidebarBadge';
import { SidebarRow } from '@/components/sidebar/SidebarRow';
import { SidebarSection } from '@/components/sidebar/SidebarSection';
import { ToggleSwitch } from '@/components/ToggleSwitch';
import {
  createCycleInspection,
  getCycleColor,
  getCycleId,
} from '@/features/audit/utils/cycleVisualization';
import { t } from '@/i18n/i18n';
import type { PackageCycleDetail } from '@/types/audit';
import type { CycleInspection, CycleSelection } from '@/types/auditVisualization';

/*** Renders one violated cyclic-dependencies rule with every cycle disabled by default. */
export function CyclicDependenciesRuleDetails({
  cycles,
  cycleSelection,
  onCycleInspectionChange,
}: CyclicDependenciesRuleDetailsProps) {
  return (
    <SidebarSection
      title={
        <span className="flex items-center gap-2">
          <span>{t('audit.rule.cyclicDependencies')}</span>
          <SidebarBadge count={cycles.length} tone="danger" />
        </span>
      }
    >
      {cycles.map((cycle, index) => (
        <SidebarRow key={getCycleId(cycle)}>
          <CycleRow
            color={getCycleColor(index)}
            cycle={cycle}
            index={index}
            selected={cycleSelection.selectedIds.includes(getCycleId(cycle))}
            onInspect={() =>
              onCycleInspectionChange(
                createCycleInspection(cycle, index, t('audit.cycle') + ' ' + (index + 1))
              )
            }
            onSelectedChange={selected => cycleSelection.setSelected(getCycleId(cycle), selected)}
          />
        </SidebarRow>
      ))}
    </SidebarSection>
  );
}

/*** Renders one compact cycle switch; full evidence stays in the graph inspector. */
function CycleRow({ color, cycle, index, onInspect, onSelectedChange, selected }: CycleRowProps) {
  const route = cycle.packages.join(' → ');
  const packageCount = new Set(cycle.packages).size;
  const label = t('audit.cycle') + ' ' + (index + 1);

  return (
    <div className="flex cursor-pointer items-start gap-2">
      <button
        type="button"
        onClick={onInspect}
        className="min-w-0 flex-1 cursor-pointer text-left"
        title={route}
      >
        <span className="flex items-center gap-1.5 text-xs font-medium">
          <span>{label}</span>
          <span className="ml-auto shrink-0 text-[10px] font-normal text-neutral-500 dark:text-neutral-400">
            {packageCount} pkg
          </span>
        </span>
        <code className="mt-1 block truncate text-[11px] text-neutral-500 dark:text-neutral-400">
          {route}
        </code>
      </button>
      <ToggleSwitch
        ariaLabel={label}
        checkedColor={color}
        id={'switch-audit-cycle-' + index}
        onToggle={() => onSelectedChange(!selected)}
        value={selected}
      />
    </div>
  );
}

interface CyclicDependenciesRuleDetailsProps {
  readonly cycles: readonly PackageCycleDetail[];
  readonly cycleSelection: CycleSelection;
  readonly onCycleInspectionChange: (inspection: CycleInspection | null) => void;
}

interface CycleRowProps {
  readonly color: string;
  readonly cycle: PackageCycleDetail;
  readonly index: number;
  readonly onInspect: () => void;
  readonly onSelectedChange: (selected: boolean) => void;
  readonly selected: boolean;
}
