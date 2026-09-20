'use client';
import React from 'react';

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

/*** Renders cycle findings with independent highlight switches and toggleable evidence selection. */
export function CyclicDependenciesRuleDetails({
  cycles,
  cycleSelection,
  inspectedCycleId,
  onCycleInspectionChange,
}: CyclicDependenciesRuleDetailsProps) {
  return (
    <SidebarSection
      title={
        <span className="flex items-center gap-2">
          <span>{t('audit.rule.cyclicDependencies')}</span>
          <span className="text-xs font-normal text-neutral-500 dark:text-neutral-400">
            {cycles.length} {t('audit.cycles')}
          </span>
        </span>
      }
    >
      {cycles.map((cycle, index) => (
        <SidebarRow key={getCycleId(cycle)}>
          <CycleRow
            color={getCycleColor(index)}
            cycle={cycle}
            index={index}
            inspected={inspectedCycleId === getCycleId(cycle)}
            selected={cycleSelection.selectedIds.includes(getCycleId(cycle))}
            onInspect={() =>
              onCycleInspectionChange(
                inspectedCycleId === getCycleId(cycle)
                  ? null
                  : createCycleInspection(cycle, index, t('audit.cycle') + ' ' + (index + 1))
              )
            }
            onSelectedChange={selected => {
              cycleSelection.setSelected(getCycleId(cycle), selected);
              if (!selected && inspectedCycleId === getCycleId(cycle))
                onCycleInspectionChange(null);
            }}
          />
        </SidebarRow>
      ))}
    </SidebarSection>
  );
}

/*** Renders one compact cycle switch; full evidence stays in the graph inspector. */
function CycleRow({
  color,
  cycle,
  index,
  inspected,
  onInspect,
  onSelectedChange,
  selected,
}: CycleRowProps) {
  const route = cycle.packages.join(' → ');
  const packageCount = new Set(cycle.packages).size;
  const label = t('audit.cycle') + ' ' + (index + 1);

  return (
    <div
      className="flex items-start gap-2 rounded px-1 py-1"
      style={selected || inspected ? { backgroundColor: color + '1a' } : undefined}
    >
      <button
        type="button"
        onClick={onInspect}
        aria-expanded={inspected}
        className="min-w-0 flex-1 cursor-pointer rounded text-left focus-visible:outline-2 focus-visible:outline-offset-2"
        style={inspected ? { boxShadow: `inset 3px 0 ${color}`, paddingLeft: 6 } : undefined}
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
  readonly inspectedCycleId?: string | null;
  readonly cycles: readonly PackageCycleDetail[];
  readonly cycleSelection: CycleSelection;
  readonly onCycleInspectionChange: (inspection: CycleInspection | null) => void;
}

interface CycleRowProps {
  readonly inspected: boolean;
  readonly color: string;
  readonly cycle: PackageCycleDetail;
  readonly index: number;
  readonly onInspect: () => void;
  readonly onSelectedChange: (selected: boolean) => void;
  readonly selected: boolean;
}
