'use client';
import React from 'react';

import { SidebarAccordionSection } from '@/components/sidebar/SidebarAccordionSection';
import { SidebarRow } from '@/components/sidebar/SidebarRow';
import { ToggleSwitch } from '@/components/ToggleSwitch';
import { t } from '@/i18n/i18n';
import type { Audit, AuditRuleResult, PackageCycleDetail } from '@/types/audit';
import type { CycleHighlight, CycleInspection } from '@/types/auditVisualization';

/*** Renders cyclic dependencies as a compact finding list with rule-local controls. */
export function CyclicDependenciesRuleDetails({
  enabled,
  evaluation,
  onCycleHighlightsChange,
  onCycleInspectionChange,
  onEnabledToggle,
}: CyclicDependenciesRuleDetailsProps) {
  const [selectedCycleIds, setSelectedCycleIds] = React.useState<readonly string[]>([]);
  const cycles = evaluation.cyclicPackages;

  return (
    <SidebarAccordionSection
      key={enabled ? 'enabled' : 'disabled'}
      action={
        <ToggleSwitch
          ariaLabel={t('audit.rule.cyclicDependencies')}
          id="switch-cyclic-dependencies-enabled"
          onToggle={onEnabledToggle}
          value={enabled}
        />
      }
      count={cycles.length}
      disabled={!enabled}
      title={t('audit.rule.cyclicDependencies')}
    >
      {cycles.map((cycle, index) => {
        const id = getCycleId(cycle, index);
        const selected = selectedCycleIds.includes(id);

        return (
          <SidebarRow key={id}>
            <CycleRow
              color={getCycleColor(index)}
              cycle={cycle}
              index={index}
              selected={selected}
              onInspect={() => onCycleInspectionChange(createCycleInspection(cycle, index))}
              onSelectedChange={nextSelected => {
                const nextIds = nextSelected
                  ? [...selectedCycleIds, id]
                  : selectedCycleIds.filter(selectedId => selectedId !== id);
                setSelectedCycleIds(nextIds);
                onCycleHighlightsChange(createCycleHighlights(cycles, nextIds));
              }}
            />
          </SidebarRow>
        );
      })}
    </SidebarAccordionSection>
  );
}

/*** Renders one compact cycle selector; full evidence lives in the graph inspector. */
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

/*** Builds stable colored graph highlights for the selected cycle occurrences. */
function createCycleHighlights(
  cycles: readonly PackageCycleDetail[],
  selectedCycleIds: readonly string[]
): readonly CycleHighlight[] {
  return cycles.flatMap((cycle, index) => {
    const id = getCycleId(cycle, index);
    return selectedCycleIds.includes(id) ? [createCycleHighlight(cycle, index)] : [];
  });
}

/*** Creates one stable cycle highlight descriptor. */
function createCycleHighlight(cycle: PackageCycleDetail, index: number): CycleHighlight {
  return { id: getCycleId(cycle, index), color: getCycleColor(index), cycle };
}

/*** Creates the inspector descriptor for one cycle row. */
function createCycleInspection(cycle: PackageCycleDetail, index: number): CycleInspection {
  return {
    ...createCycleHighlight(cycle, index),
    label: t('audit.cycle') + ' ' + (index + 1),
  };
}

/*** Returns a stable distinct color for one cycle while keeping the first cycle PKGViz red. */
function getCycleColor(index: number): string {
  if (index === 0) return '#d80303';
  const hue = Math.round((index * 137.508) % 360);
  return 'hsl(' + hue + ' 68% 45%)';
}

/*** Returns the stable UI identity for one cycle occurrence. */
function getCycleId(cycle: PackageCycleDetail, index: number): string {
  return cycle.packages.join('→') + ':' + index;
}

interface CyclicDependenciesRuleDetailsProps {
  readonly enabled: boolean;
  readonly evaluation: Audit['evaluation'];
  readonly rule: AuditRuleResult;
  readonly onCycleHighlightsChange: (highlights: readonly CycleHighlight[]) => void;
  readonly onCycleInspectionChange: (inspection: CycleInspection | null) => void;
  readonly onEnabledToggle: () => void;
}

interface CycleRowProps {
  readonly color: string;
  readonly cycle: PackageCycleDetail;
  readonly index: number;
  readonly selected: boolean;
  readonly onInspect: () => void;
  readonly onSelectedChange: (selected: boolean) => void;
}
