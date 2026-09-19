'use client';
import React from 'react';
import { Badge } from '@zora/badge';
import { Button } from '@zora/button';
import { Text } from '@zora/text';
import { View } from '@zora/view';

import { CycleSwitch } from '@/features/audit/adapters/inbound/react/CycleSwitch';
import {
  createCycleHighlights,
  createCycleInspection,
  getCycleColor,
  getCycleId,
} from '@/features/audit/utils/cycleVisualization';
import { t } from '@/i18n/i18n';
import type { PackageCycleDetail } from '@/types/audit';
import type { CycleHighlight, CycleInspection } from '@/types/auditVisualization';
import type { ZoraMode } from '@/types/zora';

/*** Renders one violated cyclic-dependencies rule with ZORA presentation and audit-owned cycle colors. */
export function CyclicDependenciesRuleDetails({
  cycles,
  mode,
  onCycleHighlightsChange,
  onCycleInspectionChange,
}: CyclicDependenciesRuleDetailsProps) {
  const [selectedCycleIds, setSelectedCycleIds] = React.useState<readonly string[]>([]);

  React.useEffect(() => {
    onCycleHighlightsChange(createCycleHighlights(cycles, selectedCycleIds));
  }, [cycles, onCycleHighlightsChange, selectedCycleIds]);

  return (
    <View mode={mode} gap="s" p="m">
      <View mode={mode} align="center" direction="row" gap="s">
        <Text mode={mode} variant="label" weight="bold">
          {t('audit.rule.cyclicDependencies')}
        </Text>
        <Badge color="danger" mode={mode} size="s">
          {cycles.length}
        </Badge>
      </View>
      {cycles.map((cycle, index) => (
        <CycleRow
          color={getCycleColor(index)}
          cycle={cycle}
          index={index}
          key={getCycleId(cycle, index)}
          mode={mode}
          selected={selectedCycleIds.includes(getCycleId(cycle, index))}
          onInspect={() =>
            onCycleInspectionChange(
              createCycleInspection(cycle, index, t('audit.cycle') + ' ' + (index + 1))
            )
          }
          onSelectedChange={selected => {
            const id = getCycleId(cycle, index);
            setSelectedCycleIds(
              selected
                ? [...selectedCycleIds, id]
                : selectedCycleIds.filter(currentId => currentId !== id)
            );
          }}
        />
      ))}
    </View>
  );
}

/*** Renders one compact cycle row while the graph owns the detailed evidence presentation. */
function CycleRow({
  color,
  cycle,
  index,
  mode,
  onInspect,
  onSelectedChange,
  selected,
}: CycleRowProps) {
  const route = cycle.packages.join(' → ');
  const packageCount = new Set(cycle.packages).size;
  const label = t('audit.cycle') + ' ' + (index + 1);

  return (
    <View mode={mode} align="center" direction="row" gap="s">
      <View mode={mode} flex={1} gap="xs">
        <View mode={mode} align="center" direction="row" gap="s">
          <Button mode={mode} size="s" variant="ghost" onPress={onInspect}>
            {label}
          </Button>
          <Badge color="neutral" mode={mode} size="s">
            {packageCount} pkg
          </Badge>
        </View>
        <Text mode={mode} emphasis="muted" numberOfLines={1} variant="code">
          {route}
        </Text>
      </View>
      <CycleSwitch
        ariaLabel={label}
        checkedColor={color}
        id={'switch-audit-cycle-' + index}
        onToggle={() => onSelectedChange(!selected)}
        value={selected}
      />
    </View>
  );
}

interface CyclicDependenciesRuleDetailsProps {
  readonly cycles: readonly PackageCycleDetail[];
  readonly mode: ZoraMode;
  readonly onCycleHighlightsChange: (highlights: readonly CycleHighlight[]) => void;
  readonly onCycleInspectionChange: (inspection: CycleInspection | null) => void;
}

interface CycleRowProps {
  readonly color: string;
  readonly cycle: PackageCycleDetail;
  readonly index: number;
  readonly mode: ZoraMode;
  readonly onInspect: () => void;
  readonly onSelectedChange: (selected: boolean) => void;
  readonly selected: boolean;
}
