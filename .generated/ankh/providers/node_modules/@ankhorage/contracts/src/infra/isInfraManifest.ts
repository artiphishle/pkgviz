import { isRecord } from '@ankhorage/utility/object';

import { isApiDefinitionRegistry } from '../appManifest/apis';
import { APP_ENVIRONMENT_IDS } from '../environments';
import { isSerializableValue } from '../serializable';
import type { InfraManifest, InfraModuleSpec } from '../types/infraManifest';
import type { InfraShape } from '../types/infraValidation';
import { isInfraEnvironmentSpec } from './isInfraEnvironmentSpec';
import { isInfraShape } from './isInfraShape';

/*** Validate standalone infrastructure without AppManifest, Deploy or provider package side effects. */
export function isInfraManifest(value: unknown): value is InfraManifest {
  return isInfraShape(value, {
    environments: isEnvironments,
    apis: (apis) => apis === undefined || isApiDefinitionRegistry(apis),
    modules: isModuleRegistry,
  } satisfies InfraShape<InfraManifest>);
}

/*** Local is required; preview and production are optional but never inferred from arbitrary keys. */
function isEnvironments(value: unknown): boolean {
  if (!isRecord(value) || !isInfraEnvironmentSpec(value.local)) return false;
  return Object.entries(value).every(
    ([key, environment]) =>
      APP_ENVIRONMENT_IDS.some((id) => id === key) &&
      ((environment === undefined && key !== 'local') || isInfraEnvironmentSpec(environment)),
  );
}

/*** Validate installed module identity and optional serializable module-owned configuration. */
function isModuleRegistry(value: unknown): boolean {
  return isRecord(value) && Object.values(value).every(isModuleSpec);
}

/*** Validate one module registry entry. */
function isModuleSpec(value: unknown): value is InfraModuleSpec {
  return isInfraShape(value, {
    config: (config) => config === undefined || isSerializableValue(config),
  });
}
