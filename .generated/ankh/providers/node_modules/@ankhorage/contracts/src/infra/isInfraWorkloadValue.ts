import { isRecord } from '@ankhorage/utility/object';
import { isNonEmptyString } from '@ankhorage/utility/string';

import { APP_ENVIRONMENT_IDS } from '../environments';
import type { InfraWorkloadScalarValue } from '../types/infraWorkload';
import { isInfraCredentialRef } from './isInfraCredentialRef';
import { isInfraShape } from './isInfraShape';

/*** Workload values explicitly distinguish public literals, output dependencies and secret references. */
export function isInfraWorkloadValue(value: unknown): boolean {
  return (
    isInfraWorkloadScalarValue(value) ||
    isInfraShape(value, {
      kind: (kind) => kind === 'template',
      segments: (segments) =>
        Array.isArray(segments) &&
        segments.length > 0 &&
        segments.every(isInfraWorkloadScalarValue),
    })
  );
}

/*** Validate one non-composite workload value segment. */
function isInfraWorkloadScalarValue(value: unknown): value is InfraWorkloadScalarValue {
  if (!isRecord(value)) return false;
  switch (value.kind) {
    case 'literal':
      return isInfraShape(value, {
        kind: (kind) => kind === 'literal',
        value: (field) => typeof field === 'string',
      });
    case 'output':
      return isInfraShape(value, {
        kind: (kind) => kind === 'output',
        resourceId: isNonEmptyString,
        output: isNonEmptyString,
      });
    case 'secret':
      return isInfraShape(value, {
        kind: (kind) => kind === 'secret',
        reference: isSecretReference,
      });
    case 'credential':
      return isInfraShape(value, {
        kind: (kind) => kind === 'credential',
        reference: isInfraCredentialRef,
        key: isNonEmptyString,
      });
    default:
      return false;
  }
}

/*** Managed secret references contain identity only, never privileged payloads. */
function isSecretReference(value: unknown): boolean {
  return isInfraShape(value, {
    source: (source) => source === 'secret-store',
    projectId: isNonEmptyString,
    environment: (environment) => APP_ENVIRONMENT_IDS.some((id) => id === environment),
    ref: isNonEmptyString,
    key: isNonEmptyString,
  });
}
