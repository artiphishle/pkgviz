import type {
  AuditRuleResult,
  CyclicDependenciesEvidence,
  EvaluateAuditRulesInput,
  PackageCycleDetail,
} from '@/types/audit';

/*** Evaluates every configured PKGViz audit rule against one analysis result. */
export function evaluateAuditRules(input: EvaluateAuditRulesInput): readonly AuditRuleResult[] {
  return [evaluateCyclicDependencies(input.cyclicPackages)];
}

/*** Evaluates the blocking cyclic-dependencies policy while retaining structured cycle evidence. */
function evaluateCyclicDependencies(
  cycles: readonly PackageCycleDetail[]
): AuditRuleResult<CyclicDependenciesEvidence> {
  const failed = cycles.length > 0;

  return {
    id: 'cyclic-dependencies',
    status: failed ? 'failed' : 'passed',
    policy: 'blocking',
    message: failed
      ? `Detected ${cycles.length} cyclic package dependenc${cycles.length === 1 ? 'y' : 'ies'}.`
      : 'No cyclic package dependencies detected.',
    details: cycles.map(cycle => cycle.packages.join(' → ')),
    evidence: { cycles },
  };
}
