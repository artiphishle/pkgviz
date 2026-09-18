import { ciCycleProofA } from '@/features/audit/domain/ciCycleProofA';

/*** Temporary CI acceptance helper that creates the reverse side of an intentional package cycle. */
export function ciCycleProofB(): unknown {
  return ciCycleProofA;
}
