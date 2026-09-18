import type { ParsedDirectory } from '@/shared/types';
import type { ParserSelection } from '@/types/parserSelection';

type AuditRulePolicy = 'advisory' | 'blocking';
type AuditRuleStatus = 'failed' | 'passed';

export interface ImportEvidence {
  readonly filePath: string;
  readonly fileClass: string;
  readonly importName: string;
  readonly isIntrinsic?: boolean;
}

export interface CycleEdgeEvidence {
  readonly from: string;
  readonly to: string;
  readonly via: readonly ImportEvidence[];
}

export interface PackageCycleDetail {
  readonly packages: readonly string[];
  readonly edges: readonly CycleEdgeEvidence[];
}

export interface AuditRuleResult<TEvidence = unknown> {
  readonly id: string;
  readonly status: AuditRuleStatus;
  readonly policy: AuditRulePolicy;
  readonly message: string;
  readonly details: readonly string[];
  readonly evidence: TEvidence;
}

export interface CyclicDependenciesEvidence {
  readonly cycles: readonly PackageCycleDetail[];
}

interface AuditEvaluation {
  readonly cyclicPackages: readonly PackageCycleDetail[];
  readonly rules: readonly AuditRuleResult[];
}

interface AuditMeta {
  readonly timeEnd: number;
  readonly timeStart: number;
  readonly language: ParserSelection;
  readonly projectName: string;
}

export interface Audit {
  readonly evaluation: AuditEvaluation;
  readonly meta: AuditMeta;
  readonly files: ParsedDirectory;
}

export interface EvaluateAuditRulesInput {
  readonly cyclicPackages: readonly PackageCycleDetail[];
}
