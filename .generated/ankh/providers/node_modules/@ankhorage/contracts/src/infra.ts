/** Canonical standalone infrastructure contracts, catalog and side-effect-free validation. */
export { INFRA_ADAPTER_CATALOG, INFRA_RUNTIME_COMPATIBILITY } from './infra/constants';
export { isInfraAdapterDescriptor } from './infra/isInfraAdapterDescriptor';
export { isInfraAuthSpec } from './infra/isInfraAuthSpec';
export { isInfraDeploymentSpec } from './infra/isInfraDeploymentSpec';
export { isInfraEnvironmentSpec } from './infra/isInfraEnvironmentSpec';
export { isInfraManifest } from './infra/isInfraManifest';
export { isInfraWorkloadSpec } from './infra/isInfraWorkloadSpec';
export { parseInfraManifest } from './infra/parseInfraManifest';
export { validateInfraAdapterSelection } from './infra/validateInfraAdapterSelection';
export type * from './types/infraAdapters';
export type * from './types/infraLifecycle';
export type * from './types/infraManifest';
export type * from './types/infraSecrets';
export type * from './types/infraTargets';
export type * from './types/infraWorkload';
