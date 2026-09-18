'use client';
import React from 'react';

import { SidebarBadge } from '@/components/sidebar/SidebarBadge';
import { SidebarRow } from '@/components/sidebar/SidebarRow';
import { SidebarSection } from '@/components/sidebar/SidebarSection';
import {
  createCycleHighlights,
  createCycleInspection,
  getCycleColor,
  getCycleId,
} from '@/features/audit/utils/cycleVisualization';
import { t } from '@/i18n/i18n';
import type { PackageCycleDetail } from '@/types/audit';
import type { CycleHighlight, CycleInspection } from '@/types/auditVisualization';

/*** Renders one violated cyclic-dependencies rule with every cycle enabled by default. */
export function CyclicDependenciesRuleDetails({
  cycles,
  onCycleHighlightsChange,
  onCycleInspectionChange,
}: CyclicDependenciesRuleDetailsProps) {
  const [selectedCycleIds, setSelectedCycleIds] = React.useState<readonly string[]>(
    () => cycles.map(getCycleId)
  );

  React.useEffect(() => {
    onCycleHighlightsChange(createCycleHighlights(cycles, selectedCycleIds));
  }, [cycles, onCycleHighlightsChange, selectedCycleIds]);

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
        <SidebarRow key={getCycleId(cycle, index)}>
          <CycleRow
            color={getCycleColor(index)}
            cycle={cycle}
            index={index}
            selected={selectedCycleIds.includes(getCycleId(cycle, index))}
            onInspect={() =>
              onCycleInspectionChange(
                createCycleInspection(cycle, index, t('audit.cycle') + ' ' + (index + 1))
              )
            }
            onSelectedChange={selected => {
              const id = getCycleId(cycle, index);
              setSelectedCycleIds(current =>
                selected ? [...current, id] : current.filter(currentId => currentId !== id)
              );
            }}
          />
        </SidebarRow>
      ))}
    </SidebarSection>
  );
}

/*** Renders one compact cycle selector; full evidence stays in the graph inspector. */
function CycleRow({ color, cycle, index, onInspect, onSelectedChange, selected }: CycleRowProps) {
  const route = cycle.packages.join(' → ');
  const packageCount = new Set(cycle.packages).size;

  return (
    <div className="flex items-start gap-2">
      <input
        type="checkbox"
        aria-label={t('audit.cycle') + ' ' + (index + 1)}
        checked={selected}
        className="mt-1 shrink-0"
        style={{ accentColor: color }}
        onChange={event => onSelectedChange(event.currentTarget.checked)}
      />
      <button type="button" onClick={onInspect} className="min-w-0 flex-1 text-left" title={route}>
        <span className="flex items-center gap-1.5 text-xs font-medium">
          <span
            aria-hidden="true"
            className="inline-block h-2 w-2 shrink-0 rounded-full"
            style={{ backgroundColor: color }}
          />
          <span>
            {t('audit.cycle')} {index + 1}
          </span>
          <span className="ml-auto shrink-0 text-[10px] font-normal text-neutral-500 dark:text-neutral-400">
            {packageCount} pkg
          </span>
        </span>
        <code className="mt-1 block truncate text-[11px] text-neutral-500 dark:text-neutral-400">
          {route}
        </code>
      </button>
    </div>
  );
}

interface CyclicDependenciesRuleDetailsProps {
  readonly cycles: readonly PackageCycleDetail[];
  readonly onCycleHighlightsChange: (highlights: readonly CycleHighlight[]) => void;
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
