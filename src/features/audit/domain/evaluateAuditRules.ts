import type {
  AuditRuleConfiguration,
  AuditRuleResult,
  CyclicDependenciesEvidence,
  EvaluateAuditRulesInput,
  PackageCycleDetail,
} from '@/types/audit';

/*** Evaluates every enabled PKGViz audit rule against one analysis result. */
export function evaluateAuditRules(input: EvaluateAuditRulesInput): readonly AuditRuleResult[] {
  const mode = findRuleMode(input.configuration.rules, 'cyclic-dependencies');
  if (mode === 'off') return [];

  return [evaluateCyclicDependencies(input.cyclicPackages, mode)];
}

/*** Evaluates cyclic dependencies while applying the configured enforcement mode. */
function evaluateCyclicDependencies(
  cycles: readonly PackageCycleDetail[],
  mode: Exclude<AuditRuleConfiguration['mode'], 'off'>
): AuditRuleResult<CyclicDependenciesEvidence> {
  const failed = cycles.length > 0;

  return {
    id: 'cyclic-dependencies',
    status: failed ? 'failed' : 'passed',
    policy: mode === 'block' ? 'blocking' : 'advisory',
    message: failed
      ? `Detected ${cycles.length} cyclic package dependenc${cycles.length === 1 ? 'y' : 'ies'}.`
      : 'No cyclic package dependencies detected.',
    details: cycles.map(cycle => cycle.packages.join(' → ')),
    evidence: { cycles },
  };
}

/*** Returns the effective mode for one known audit rule. */
function findRuleMode(
  rules: readonly AuditRuleConfiguration[],
  id: AuditRuleConfiguration['id']
): AuditRuleConfiguration['mode'] {
  return rules.find(rule => rule.id === id)?.mode ?? 'off';
}
