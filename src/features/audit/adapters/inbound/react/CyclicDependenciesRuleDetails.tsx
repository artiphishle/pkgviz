'use client';
import { Badge } from '@zora/badge';
import { ListItem } from '@zora/list';
import { Switch } from '@zora/switch';
import { Text } from '@zora/text';
import { View } from '@zora/view';
import React from 'react';

import { createCycleInspection, getCycleId } from '@/features/audit/utils/cycleVisualization';
import { t } from '@/i18n/i18n';
import type { PackageCycleDetail } from '@/types/audit';
import type { CycleInspection, CycleSelection } from '@/types/auditVisualization';

/*** Renders cycle findings with compact ZORA rows and persistent independent selection. */
export function CyclicDependenciesRuleDetails(props: CyclicDependenciesRuleDetailsProps) {
  return (
    <View gap="s" p="m">
      <View align="center" direction="row" gap="s">
        <Text variant="label" weight="bold">
          {t('audit.rule.cyclicDependencies')}
        </Text>
        <Badge color="danger" size="s">
          {props.cycles.length}
        </Badge>
        <Text emphasis="muted" variant="caption">
          {t('audit.cycles')}
        </Text>
      </View>
      <CycleRows {...props} />
    </View>
  );
}

/*** Maps cycle findings to compact list rows while preserving inspection and selection state. */
function CycleRows({
  cycles,
  cycleSelection,
  inspectedCycleId,
  onCycleInspectionChange,
}: CyclicDependenciesRuleDetailsProps) {
  return (
    <View gap="none">
      {cycles.map((cycle, index) => {
        const cycleId = getCycleId(cycle);
        return (
          <CycleRow
            cycle={cycle}
            index={index}
            inspected={inspectedCycleId === cycleId}
            key={cycleId}
            selected={cycleSelection.selectedIds.includes(cycleId)}
            onInspect={() =>
              onCycleInspectionChange(
                inspectedCycleId === cycleId
                  ? null
                  : createCycleInspection(cycle, index, t('audit.cycle') + ' ' + (index + 1)),
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

/*** Renders one compact single-line cycle row with the selection switch in the trailing slot. */
function CycleRow(props: CycleRowProps) {
  const route = props.cycle.packages.join(' → ');
  const label = `C${props.index + 1}: ${route}`;

  return (
    <ListItem
      compact
      selected={props.inspected}
      testID={`cycle-row-${props.index}`}
      title={label}
      trailing={
        <Switch
          accessibilityLabel={t('audit.cycle') + ' ' + (props.index + 1)}
          checked={props.selected}
          color="danger"
          size="s"
          testID={`cycle-switch-${props.index}`}
          onCheckedChange={props.onSelectedChange}
        />
      }
      onPress={props.onInspect}
    />
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
  readonly cycle: PackageCycleDetail;
  readonly index: number;
  readonly onInspect: () => void;
  readonly onSelectedChange: (selected: boolean) => void;
  readonly selected: boolean;
}
