'use client';
import { Badge } from '@zora/badge';
import { Text } from '@zora/text';
import { View } from '@zora/view';
import { useZoraTheme } from '@zora/ZoraProvider';
import React from 'react';

import { CycleSwitch } from '@/features/audit/adapters/inbound/react/CycleSwitch';
import {
  createCycleInspection,
  getCycleColor,
  getCycleId,
} from '@/features/audit/utils/cycleVisualization';
import { createCycleThemeColors } from '@/features/audit/utils/createCycleThemeColors';
import { t } from '@/i18n/i18n';
import type { PackageCycleDetail } from '@/types/audit';
import type { CycleInspection, CycleSelection } from '@/types/auditVisualization';

/*** Renders cycle findings with ZORA presentation and persistent independent selection. */
export function CyclicDependenciesRuleDetails({
  cycles,
  cycleSelection,
  inspectedCycleId,
  onCycleInspectionChange,
}: CyclicDependenciesRuleDetailsProps) {
  const { theme } = useZoraTheme();
  const cycleColors = createCycleThemeColors(theme);

  return (
    <View gap="s" p="m">
      <View align="center" direction="row" gap="s">
        <Text variant="label" weight="bold">
          {t('audit.rule.cyclicDependencies')}
        </Text>
        <Badge color="danger" size="s">
          {cycles.length}
        </Badge>
        <Text emphasis="muted" variant="caption">
          {t('audit.cycles')}
        </Text>
      </View>
      {cycles.map((cycle, index) => {
        const cycleId = getCycleId(cycle);
        return (
          <CycleRow
            color={getCycleColor(cycleColors, index)}
            cycle={cycle}
            index={index}
            inspected={inspectedCycleId === cycleId}
            key={cycleId}
            selected={cycleSelection.selectedIds.includes(cycleId)}
            onInspect={() =>
              onCycleInspectionChange(
                inspectedCycleId === cycleId
                  ? null
                  : createCycleInspection(
                      cycle,
                      index,
                      t('audit.cycle') + ' ' + (index + 1),
                      cycleColors
                    )
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
  const { theme } = useZoraTheme();
  const route = props.cycle.packages.join(' → ');
  const packageCount = new Set(props.cycle.packages).size;
  const label = t('audit.cycle') + ' ' + (props.index + 1);

  return (
    <View
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
        style={{
          background: 'transparent',
          border: 0,
          borderRadius: theme.radii.s,
          color: 'inherit',
          cursor: 'pointer',
          flex: 1,
          minWidth: 0,
          outlineColor: theme.semantics.border.focus,
          padding: 0,
          textAlign: 'left',
          ...(props.inspected
            ? { boxShadow: `inset 3px 0 ${props.color}`, paddingLeft: 6 }
            : {}),
        }}
        title={route}
        onClick={props.onInspect}
      >
        <View gap="xs">
          <View align="center" direction="row" gap="s">
            <Text variant="label" weight="bold">
              {label}
            </Text>
            <Badge color="neutral" size="s">
              {packageCount} pkg
            </Badge>
          </View>
          <Text emphasis="muted" numberOfLines={1} variant="code">
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
