import type { InfraAdapterDescriptor } from '../types/infraAdapters';
import type { InfraDiagnostic, InfraResult } from '../types/infraLifecycle';
import type { InfraEnvironmentSpec } from '../types/infraManifest';
import { INFRA_ADAPTER_CATALOG } from './constants';
import { isInfraAdapterDescriptor } from './isInfraAdapterDescriptor';

/** Validate supplied installed descriptors without imports or filesystem access; only selected packages matter. */
export function validateInfraAdapterSelection(
  environment: InfraEnvironmentSpec,
  installed: readonly unknown[],
): InfraResult<readonly InfraAdapterDescriptor[]> {
  const ids = new Set([
    environment.deployment.compute.provider,
    environment.deployment.runtime.provider,
    environment.database?.provider,
    environment.objectStorage?.provider,
    environment.auth?.provider,
    environment.authz?.provider,
    environment.secretStore?.provider,
  ]);
  const selected = Object.values(INFRA_ADAPTER_CATALOG).filter((entry) => ids.has(entry.id));
  const descriptors = installed.filter(isInfraAdapterDescriptor);
  const diagnostics: readonly InfraDiagnostic[] = selected.flatMap((entry) => {
    const matches = descriptors.filter((descriptor) => descriptor.id === entry.id);
    return matches.length === 1
      ? []
      : [
          {
            severity: 'error',
            code: 'adapter_unavailable',
            message: `Selected adapter ${entry.id} requires exactly one installed ${entry.package} descriptor matching Contracts config version ${entry.configVersion}; found ${matches.length}.`,
          },
        ];
  });
  return diagnostics.length > 0
    ? { ok: false, diagnostics }
    : {
        ok: true,
        value: descriptors.filter((descriptor) => ids.has(descriptor.id)),
        diagnostics,
      };
}
