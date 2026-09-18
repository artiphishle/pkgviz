'use client';
import React from 'react';

import Setting from '@/components/Setting';
import { t } from '@/i18n/i18n';
import type {
  Audit,
  AuditRuleResult,
  CycleEdgeEvidence,
  ImportEvidence,
  PackageCycleDetail,
} from '@/types/audit';
import type { CycleHighlight } from '@/types/auditVisualization';

/*** Renders cyclic-dependency rule controls using the existing sidebar row styling. */
export function CyclicDependenciesRuleDetails({
  evaluation,
  rule,
  onCycleHighlightsChange,
}: CyclicDependenciesRuleDetailsProps) {
  const [enabled, setEnabled] = React.useState(true);
  const [selectedCycleIds, setSelectedCycleIds] = React.useState<readonly string[]>([]);
  const cycles = evaluation.cyclicPackages;
  const failed = rule.status === 'failed';

  return (
    <>
      <RuleToggle
        enabled={enabled}
        failed={failed}
        onEnabledChange={nextEnabled => {
          setEnabled(nextEnabled);
          if (!nextEnabled) {
            setSelectedCycleIds([]);
            onCycleHighlightsChange([]);
          }
        }}
      />
      {enabled &&
        (failed ? (
          <CycleList
            cycles={cycles}
            selectedCycleIds={selectedCycleIds}
            onSelectedCycleIdsChange={nextIds => {
              setSelectedCycleIds(nextIds);
              onCycleHighlightsChange(createCycleHighlights(cycles, nextIds));
            }}
          />
        ) : (
          <Setting>
            <p className="text-xs text-green-700 dark:text-green-300">{rule.message}</p>
          </Setting>
        ))}
    </>
  );
}

/*** Renders the rule checkbox and current pass/fail state. */
function RuleToggle({ enabled, failed, onEnabledChange }: RuleToggleProps) {
  return (
    <Setting>
      <label className="flex cursor-pointer items-center gap-2 text-xs">
        <input
          type="checkbox"
          checked={enabled}
          onChange={event => onEnabledChange(event.currentTarget.checked)}
        />
        <span className="flex-1 font-medium">{t('audit.rule.cyclicDependencies')}</span>
        <span
          className={
            failed ? 'text-red-700 dark:text-red-300' : 'text-green-700 dark:text-green-300'
          }
        >
          {failed ? t('audit.failed') : t('audit.passed')}
        </span>
      </label>
    </Setting>
  );
}

/*** Renders every detected cycle as an independently selectable sidebar row. */
function CycleList({ cycles, selectedCycleIds, onSelectedCycleIdsChange }: CycleListProps) {
  return (
    <>
      <h3>{t('audit.cycles')}</h3>
      {cycles.map((cycle, index) => {
        const id = getCycleId(cycle);
        const selected = selectedCycleIds.includes(id);

        return (
          <Setting key={id}>
            <CycleRow
              color={getCycleColor(index)}
              cycle={cycle}
              index={index}
              selected={selected}
              onSelectedChange={nextSelected => {
                const nextIds = nextSelected
                  ? [...selectedCycleIds, id]
                  : selectedCycleIds.filter(selectedId => selectedId !== id);
                onSelectedCycleIdsChange(nextIds);
              }}
            />
          </Setting>
        );
      })}
    </>
  );
}

/*** Renders one cycle selector, path, and selected evidence. */
function CycleRow({ color, cycle, index, selected, onSelectedChange }: CycleRowProps) {
  return (
    <label className="flex cursor-pointer items-start gap-2 text-xs">
      <input
        type="checkbox"
        checked={selected}
        style={{ accentColor: color }}
        onChange={event => onSelectedChange(event.currentTarget.checked)}
      />
      <span className="min-w-0">
        <span className="flex items-center gap-1 font-medium">
          <span
            aria-hidden="true"
            className="inline-block h-2 w-2 rounded-full"
            style={{ backgroundColor: color }}
          />
          {t('audit.cycle')} {index + 1}
        </span>
        <code className="mt-1 block break-all text-[11px]">{cycle.packages.join(' → ')}</code>
        {selected && <CycleEvidence cycle={cycle} />}
      </span>
    </label>
  );
}

/*** Renders directed edge evidence for a selected cycle. */
function CycleEvidence({ cycle }: { readonly cycle: PackageCycleDetail }) {
  return (
    <ul className="mt-2 space-y-1 text-[11px] text-neutral-500 dark:text-neutral-400">
      {cycle.edges.map(edge => (
        <CycleEdgeEvidenceDetail key={`${edge.from}→${edge.to}`} edge={edge} />
      ))}
    </ul>
  );
}

/*** Renders one directed cycle edge and its available source/import evidence. */
function CycleEdgeEvidenceDetail({ edge }: { readonly edge: CycleEdgeEvidence }) {
  return (
    <li>
      <code>{`${edge.from} → ${edge.to}`}</code>
      {edge.via.map(evidence => (
        <ImportEvidenceDetail
          key={`${evidence.filePath}:${evidence.fileClass}:${evidence.importName}`}
          evidence={evidence}
        />
      ))}
    </li>
  );
}

/*** Renders one source/import proof for a cycle edge. */
function ImportEvidenceDetail({ evidence }: { readonly evidence: ImportEvidence }) {
  return (
    <span className="block break-all pl-2">
      <code>{evidence.filePath}</code>
      <span> {t('audit.imports')} </span>
      <code>{evidence.importName}</code>
    </span>
  );
}

/*** Builds stable colored graph highlights for the currently selected cycle IDs. */
function createCycleHighlights(
  cycles: readonly PackageCycleDetail[],
  selectedCycleIds: readonly string[]
): readonly CycleHighlight[] {
  return cycles.flatMap((cycle, index) => {
    const id = getCycleId(cycle);
    if (!selectedCycleIds.includes(id)) return [];

    return [
      {
        id,
        color: getCycleColor(index),
        cycle,
      },
    ];
  });
}

/*** Returns a stable distinct color for one cycle while keeping the first cycle PKGViz red. */
function getCycleColor(index: number): string {
  if (index === 0) return '#d80303';
  const hue = Math.round((index * 137.508) % 360);
  return `hsl(${hue} 68% 45%)`;
}

/*** Returns the stable UI identity for one directed cycle path. */
function getCycleId(cycle: PackageCycleDetail): string {
  return cycle.packages.join('→');
}

interface CyclicDependenciesRuleDetailsProps {
  readonly evaluation: Audit['evaluation'];
  readonly rule: AuditRuleResult;
  readonly onCycleHighlightsChange: (highlights: readonly CycleHighlight[]) => void;
}

interface RuleToggleProps {
  readonly enabled: boolean;
  readonly failed: boolean;
  readonly onEnabledChange: (enabled: boolean) => void;
}

interface CycleListProps {
  readonly cycles: readonly PackageCycleDetail[];
  readonly selectedCycleIds: readonly string[];
  readonly onSelectedCycleIdsChange: (ids: readonly string[]) => void;
}

interface CycleRowProps {
  readonly color: string;
  readonly cycle: PackageCycleDetail;
  readonly index: number;
  readonly selected: boolean;
  readonly onSelectedChange: (selected: boolean) => void;
}
