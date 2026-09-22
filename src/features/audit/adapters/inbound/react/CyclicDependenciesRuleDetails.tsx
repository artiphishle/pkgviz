'use client';
import { Badge } from '@zora/badge';
import { Text } from '@zora/text';
import { View } from '@zora/view';
import { useZoraTheme } from '@zora/ZoraProvider';
import React from 'react';

import { CycleSwitch } from '@/features/audit/adapters/inbound/react/CycleSwitch';
import { createCycleThemeColors } from '@/features/audit/utils/createCycleThemeColors';
import {
  createCycleInspection,
  getCycleColor,
  getCycleId,
} from '@/features/audit/utils/cycleVisualization';
import { t } from '@/i18n/i18n';
import type { PackageCycleDetail } from '@/types/audit';
import type { CycleInspection, CycleSelection } from '@/types/auditVisualization';

/*** Renders cycle findings with ZORA presentation and persistent independent selection. */
export function CyclicDependenciesRuleDetails(props: CyclicDependenciesRuleDetailsProps) {
  const { theme } = useZoraTheme();
  const cycleColors = createCycleThemeColors(theme);

  return (
    <View gap="s" p="m">
      <CycleRuleHeader count={props.cycles.length} />
      <CycleRows {...props} cycleColors={cycleColors} />
    </View>
  );
}

/*** Renders the compact heading for the cyclic-dependencies rule. */
function CycleRuleHeader({ count }: { readonly count: number }) {
  return (
    <View align="center" direction="row" gap="s">
      <Text variant="label" weight="bold">
        {t('audit.rule.cyclicDependencies')}
      </Text>
      <Badge color="danger" size="s">
        {count}
      </Badge>
      <Text emphasis="muted" variant="caption">
        {t('audit.cycles')}
      </Text>
    </View>
  );
}

/*** Maps rule findings into independently selectable and inspectable cycle rows. */
function CycleRows({
  cycles,
  cycleColors,
  cycleSelection,
  inspectedCycleId,
  onCycleInspectionChange,
}: CycleRowsProps) {
  return cycles.map((cycle, index) => {
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
  });
}

/*** Renders one compact cycle switch while the graph owns detailed evidence presentation. */
function CycleRow(props: CycleRowProps) {
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
      <CycleRowAction
        color={props.color}
        inspected={props.inspected}
        label={label}
        packageCount={packageCount}
        route={route}
        onInspect={props.onInspect}
      />
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

/*** Renders the themed inspection trigger and compact cycle summary. */
function CycleRowAction(props: CycleRowActionProps) {
  const { theme } = useZoraTheme();

  return (
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
        ...(props.inspected ? { boxShadow: `inset 3px 0 ${props.color}`, paddingLeft: 6 } : {}),
      }}
      title={props.route}
      onClick={props.onInspect}
    >
      <View gap="xs">
        <View align="center" direction="row" gap="s">
          <Text variant="label" weight="bold">
            {props.label}
          </Text>
          <Badge color="neutral" size="s">
            {props.packageCount} pkg
          </Badge>
        </View>
        <Text emphasis="muted" numberOfLines={1} variant="code">
          {props.route}
        </Text>
      </View>
    </button>
  );
}

interface CyclicDependenciesRuleDetailsProps {
  readonly inspectedCycleId?: string | null;
  readonly cycles: readonly PackageCycleDetail[];
  readonly cycleSelection: CycleSelection;
  readonly onCycleInspectionChange: (inspection: CycleInspection | null) => void;
}

interface CycleRowsProps extends CyclicDependenciesRuleDetailsProps {
  readonly cycleColors: readonly string[];
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

interface CycleRowActionProps {
  readonly color: string;
  readonly inspected: boolean;
  readonly label: string;
  readonly packageCount: number;
  readonly route: string;
  readonly onInspect: () => void;
}
