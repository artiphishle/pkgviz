import { ciCycleProofB } from '@/features/dependency-analysis/adapters/outbound/dependency-graph/ciCycleProofB';

/*** Temporary CI acceptance helper that creates one side of an intentional package cycle. */
export function ciCycleProofA(): unknown {
  return ciCycleProofB;
}
