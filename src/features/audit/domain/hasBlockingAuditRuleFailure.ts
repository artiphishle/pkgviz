import type { AuditRuleResult } from '@/types/audit';

/*** Reports whether any blocking audit rule failed. */
export function hasBlockingAuditRuleFailure(results: readonly AuditRuleResult[]): boolean {
  return results.some(result => result.policy === 'blocking' && result.status === 'failed');
}
