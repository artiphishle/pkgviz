'use client';
import { Badge } from '@zora/badge';
import { Text } from '@zora/text';
import { View } from '@zora/view';
import React from 'react';

import { CycleSwitch } from '@/features/audit/adapters/inbound/react/CycleSwitch';
import {
  createCycleInspection,
  getCycleColor,
  getCycleId,
} from '@/features/audit/utils/cycleVisualization';
import { t } from '@/i18n/i18n';
import type { PackageCycleDetail } from '@/types/audit';
import type { CycleInspection, CycleSelection } from '@/types/auditVisualization';
import type { ZoraMode } from '@/types/zora';

/*** Renders cycle findings with ZORA presentation and persistent independent selection. */
export function CyclicDependenciesRuleDetails({
  cycles,
  cycleSelection,
  inspectedCycleId,
  mode,
  onCycleInspectionChange,
}: CyclicDependenciesRuleDetailsProps) {
  return (
    <View mode={mode} gap="s" p="m">
      <View mode={mode} align="center" direction="row" gap="s">
        <Text mode={mode} variant="label" weight="bold">
          {t('audit.rule.cyclicDependencies')}
        </Text>
        <Badge color="danger" mode={mode} size="s">
          {cycles.length}
        </Badge>
        <Text mode={mode} emphasis="muted" variant="caption">
          {t('audit.cycles')}
        </Text>
      </View>
      {cycles.map((cycle, index) => {
        const cycleId = getCycleId(cycle);
        return (
          <CycleRow
            color={getCycleColor(index)}
            cycle={cycle}
            index={index}
            inspected={inspectedCycleId === cycleId}
            key={cycleId}
            mode={mode}
            selected={cycleSelection.selectedIds.includes(cycleId)}
            onInspect={() =>
              onCycleInspectionChange(
                inspectedCycleId === cycleId
                  ? null
                  : createCycleInspection(cycle, index, t('audit.cycle') + ' ' + (index + 1))
              )
            }
            onSelectedChange={selected => {
              cycleSelection.setSelected(cycleId, selected);
              if (!selected && inspectedCycleId === cycleId) onCycleInspectionChange(null);
            }}
          />
        );
      })}
    </View>
  );
}

/*** Renders one compact cycle switch while the graph owns detailed evidence presentation. */
function CycleRow(props: CycleRowProps) {
  const route = props.cycle.packages.join(' → ');
  const packageCount = new Set(props.cycle.packages).size;
  const label = t('audit.cycle') + ' ' + (props.index + 1);

  return (
    <View
      mode={props.mode}
      align="center"
      direction="row"
      gap="s"
      style={
        props.selected || props.inspected ? { backgroundColor: props.color + '1a' } : undefined
      }
    >
      <button
        type="button"
        aria-expanded={props.inspected}
        className="min-w-0 flex-1 cursor-pointer rounded text-left focus-visible:outline-2 focus-visible:outline-offset-2"
        style={
          props.inspected ? { boxShadow: `inset 3px 0 ${props.color}`, paddingLeft: 6 } : undefined
        }
        title={route}
        onClick={props.onInspect}
      >
        <View mode={props.mode} gap="xs">
          <View mode={props.mode} align="center" direction="row" gap="s">
            <Text mode={props.mode} variant="label" weight="bold">
              {label}
            </Text>
            <Badge color="neutral" mode={props.mode} size="s">
              {packageCount} pkg
            </Badge>
          </View>
          <Text mode={props.mode} emphasis="muted" numberOfLines={1} variant="code">
            {route}
          </Text>
        </View>
      </button>
      <CycleSwitch
        ariaLabel={label}
        checkedColor={props.color}
        id={'switch-audit-cycle-' + props.index}
        onToggle={() => props.onSelectedChange(!props.selected)}
        value={props.selected}
      />
    </View>
  );
}

interface CyclicDependenciesRuleDetailsProps {
  readonly inspectedCycleId?: string | null;
  readonly cycles: readonly PackageCycleDetail[];
  readonly cycleSelection: CycleSelection;
  readonly mode: ZoraMode;
  readonly onCycleInspectionChange: (inspection: CycleInspection | null) => void;
}

interface CycleRowProps {
  readonly inspected: boolean;
  readonly color: string;
  readonly cycle: PackageCycleDetail;
  readonly index: number;
  readonly mode: ZoraMode;
  readonly onInspect: () => void;
  readonly onSelectedChange: (selected: boolean) => void;
  readonly selected: boolean;
}
