'use client';

import { useEffect, useMemo, useState } from 'react';

import { getAuditEvaluationAction } from '@/features/audit/adapters/inbound/next/getAuditEvaluationAction';
import type { AuditEvaluation, PackageCycleDetail } from '@/types/audit';
import type { GraphCycleHighlight } from '@/types/graphCycleHighlight';

const CYCLE_COLORS = ['#d80303', '#2563eb', '#16a34a', '#9333ea', '#ea580c', '#0891b2'] as const;

/*** Loads audit findings and owns client-only cycle selection and inspection state. */
export function useAuditRuleControls(enabled: boolean): AuditRuleControlState {
  const [evaluation, setEvaluation] = useState<AuditEvaluation | null>(null);
  const [inspectedCycleId, setInspectedCycleId] = useState<string | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [selectedCycleIds, setSelectedCycleIds] = useState<readonly string[]>([]);

  useEffect(() => {
    if (!enabled || evaluation !== null || loadFailed) return;

    let cancelled = false;
    void getAuditEvaluationAction()
      .then(result => {
        if (!cancelled) setEvaluation(result);
      })
      .catch(() => {
        if (!cancelled) setLoadFailed(true);
      });

    return () => {
      cancelled = true;
    };
  }, [enabled, evaluation, loadFailed]);

  const cycles = useMemo(
    () =>
      (evaluation?.cyclicPackages ?? []).map((detail, index) =>
        createCycleView(detail, index, selectedCycleIds)
      ),
    [evaluation, selectedCycleIds]
  );
  const highlights = useMemo(
    () => (enabled ? cycles.filter(cycle => cycle.selected).map(createHighlight) : []),
    [cycles, enabled]
  );
  const inspectedCycle = enabled
    ? (cycles.find(cycle => cycle.id === inspectedCycleId) ?? null)
    : null;

  /*** Clears selected and inspected cycles when the rule is disabled. */
  const clearActiveCycles = () => {
    setSelectedCycleIds([]);
    setInspectedCycleId(null);
  };

  /*** Toggles one concrete cycle without affecting graph settings or other selected cycles. */
  const toggleCycle = (cycleId: string) => {
    setSelectedCycleIds(current =>
      current.includes(cycleId) ? current.filter(id => id !== cycleId) : [...current, cycleId]
    );
  };

  return {
    clearActiveCycles,
    closeInspector: () => setInspectedCycleId(null),
    cycles,
    highlights,
    inspectCycle: setInspectedCycleId,
    inspectedCycle,
    loadFailed,
    loading: enabled && evaluation === null && !loadFailed,
    toggleCycle,
  };
}

/*** Builds stable UI identity, labels, and color from deterministic audit cycle ordering. */
function createCycleView(
  detail: PackageCycleDetail,
  index: number,
  selectedCycleIds: readonly string[]
): AuditRuleCycleView {
  const id = `cycle-${index}-${detail.packages.join('>')}`;
  return {
    id,
    color: CYCLE_COLORS[index % CYCLE_COLORS.length],
    detail,
    label: `Cycle ${index + 1}`,
    packageCount: new Set(detail.packages).size,
    path: detail.packages.join(' → '),
    selected: selectedCycleIds.includes(id),
  };
}

/*** Maps selected audit evidence to the generic graph-emphasis contract. */
function createHighlight(cycle: AuditRuleCycleView): GraphCycleHighlight {
  return {
    id: cycle.id,
    color: cycle.color,
    nodeIds: [...new Set(cycle.detail.packages)],
    edges: cycle.detail.edges.map((edge, index) => ({
      source: edge.from,
      step: index + 1,
      target: edge.to,
    })),
  };
}

export interface AuditRuleControlState {
  readonly clearActiveCycles: () => void;
  readonly closeInspector: () => void;
  readonly cycles: readonly AuditRuleCycleView[];
  readonly highlights: readonly GraphCycleHighlight[];
  readonly inspectCycle: (cycleId: string) => void;
  readonly inspectedCycle: AuditRuleCycleView | null;
  readonly loadFailed: boolean;
  readonly loading: boolean;
  readonly toggleCycle: (cycleId: string) => void;
}

export interface AuditRuleCycleView {
  readonly id: string;
  readonly color: string;
  readonly detail: PackageCycleDetail;
  readonly label: string;
  readonly packageCount: number;
  readonly path: string;
  readonly selected: boolean;
}
