import { describe, expect, it } from '@artiphishle/testosterone';

import { hasBlockingAuditRuleFailure } from '@/features/audit/domain/hasBlockingAuditRuleFailure';
import type { AuditRuleResult } from '@/types/audit';

describe('[hasBlockingAuditRuleFailure]', () => {
  it('returns true only for failed blocking rules', () => {
    const advisoryFailure: AuditRuleResult = {
      id: 'advisory',
      status: 'failed',
      policy: 'advisory',
      message: 'Advisory finding',
      details: [],
      evidence: {},
    };
    const blockingPass: AuditRuleResult = {
      id: 'blocking-pass',
      status: 'passed',
      policy: 'blocking',
      message: 'Passed',
      details: [],
      evidence: {},
    };
    const blockingFailure: AuditRuleResult = {
      id: 'blocking-failure',
      status: 'failed',
      policy: 'blocking',
      message: 'Failed',
      details: [],
      evidence: {},
    };

    expect(hasBlockingAuditRuleFailure([advisoryFailure, blockingPass])).toBe(false);
    expect(hasBlockingAuditRuleFailure([advisoryFailure, blockingFailure])).toBe(true);
  });
});
