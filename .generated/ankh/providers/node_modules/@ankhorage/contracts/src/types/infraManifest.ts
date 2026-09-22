import type { AuthFlowConfig, AuthOAuthConfig } from '../auth';
import type { EntityRegistry, SerializableSet, ValueMap } from '../collections';
import type { ApiDefinitionRegistry, DataContractValue } from '../data';
import type { AppEnvironmentId } from '../environments';
import type { INFRA_ADAPTER_CATALOG, INFRA_RUNTIME_COMPATIBILITY } from '../infra/constants';
import type { AuthProfileSpec, AuthScope, AuthSignInSpec, AuthSignUpSpec } from '../types';
import type { InfraControlPlaneCredentialRef } from './infraSecrets';
import type { InfraWorkloadRegistry } from './infraWorkload';

export type InfraAdapterId = keyof typeof INFRA_ADAPTER_CATALOG;
export type InfraCapability =
  (typeof INFRA_ADAPTER_CATALOG)[InfraAdapterId]['capabilities'][number];
export type InfraProviderFor<C extends InfraCapability> = {
  [P in InfraAdapterId]: C extends (typeof INFRA_ADAPTER_CATALOG)[P]['capabilities'][number]
    ? P
    : never;
}[InfraAdapterId];
export type InfraComputeProviderId = InfraProviderFor<'compute'>;
export type InfraRuntimeProviderId = keyof typeof INFRA_RUNTIME_COMPATIBILITY;

/** Non-secret provider configuration; credentials are resolved only at the execution boundary. */
export interface InfraComputeConfigMap {
  readonly local: { readonly workingDirectory?: string };
  readonly hetzner: {
    readonly location: string;
    readonly serverType?: string;
    readonly image?: string;
    readonly credentials?: InfraControlPlaneCredentialRef;
    readonly ssh?: {
      readonly user?: string;
      readonly port?: number;
      readonly credentials?: InfraControlPlaneCredentialRef;
    };
  };
}

export interface InfraRuntimeConfigMap {
  readonly minikube: {
    readonly profile?: string;
    readonly driver?: 'docker' | 'podman';
    readonly cpus?: number;
    readonly memoryMiB?: number;
  };
  readonly k3s: {
    readonly version?: string;
    readonly topology?: { readonly servers: number; readonly agents: number };
  };
  readonly 'docker-compose': { readonly projectName?: string };
}

export type InfraComputeSelection<P extends InfraComputeProviderId = InfraComputeProviderId> = {
  [K in P]: { readonly provider: K } & InfraComputeConfigMap[K];
}[P];
export type InfraRuntimeSelection<P extends InfraRuntimeProviderId = InfraRuntimeProviderId> = {
  [K in P]: { readonly provider: K } & InfraRuntimeConfigMap[K];
}[P];

/** A discriminated union derived from the runtime catalog, never a Cartesian product. */
export type InfraDeploymentSpec = {
  [R in InfraRuntimeProviderId]: {
    readonly compute: InfraComputeSelection<(typeof INFRA_RUNTIME_COMPATIBILITY)[R][number]>;
    readonly runtime: InfraRuntimeSelection<R>;
  };
}[InfraRuntimeProviderId];

/** Portable S3-compatible persistence target; privileged values stay behind one credential ref. */
export interface InfraS3PersistenceTarget {
  readonly endpoint: string;
  readonly region: string;
  readonly bucket: string;
  readonly credentials: InfraControlPlaneCredentialRef;
  readonly forcePathStyle?: boolean;
}

/** Scheduled database protection intent; the selected database provider owns its concrete engine. */
export interface InfraScheduledDatabaseBackupSpec {
  readonly mode: 'scheduled';
  readonly target: InfraS3PersistenceTarget;
  readonly intervalHours?: number;
}

export interface InfraDatabaseConfigMap {
  readonly supabase: {
    readonly tier?: 'dev' | 'prod';
    readonly backup?: InfraScheduledDatabaseBackupSpec;
  };
}
export interface InfraObjectStorageConfigMap {
  readonly supabase: {
    readonly buckets?: SerializableSet;
    readonly backend?: InfraS3PersistenceTarget;
  };
  readonly r2: {
    readonly buckets?: SerializableSet;
    readonly accountId?: string;
    readonly credentials?: InfraControlPlaneCredentialRef;
  };
}
export interface InfraAuthConfigMap {
  readonly supabase: {
    readonly scope?: AuthScope;
    readonly flow?: AuthFlowConfig;
    readonly signIn?: AuthSignInSpec;
    readonly signUp?: AuthSignUpSpec;
    readonly oauth?: AuthOAuthConfig;
    readonly profile?: AuthProfileSpec;
  };
}
export interface InfraAuthzConfigMap {
  readonly cerbos: {
    readonly kind: 'RBAC' | 'ABAC';
    readonly policies?: ValueMap<string, string>;
  };
}
export interface InfraSecretStoreConfigMap {
  readonly 'supabase-vault': { readonly schema?: string };
}

export type InfraDatabaseSpec = {
  [P in InfraProviderFor<'database'>]: { readonly provider: P } & InfraDatabaseConfigMap[P];
}[InfraProviderFor<'database'>];
export type InfraObjectStorageSpec = {
  [P in InfraProviderFor<'objectStorage'>]: {
    readonly provider: P;
  } & InfraObjectStorageConfigMap[P];
}[InfraProviderFor<'objectStorage'>];
export type InfraAuthSpec = {
  [P in InfraProviderFor<'auth'>]: { readonly provider: P } & InfraAuthConfigMap[P];
}[InfraProviderFor<'auth'>];
export type InfraAuthzSpec = {
  [P in InfraProviderFor<'authz'>]: { readonly provider: P } & InfraAuthzConfigMap[P];
}[InfraProviderFor<'authz'>];
export type InfraSecretStoreSpec = {
  [P in InfraProviderFor<'secretStore'>]: { readonly provider: P } & InfraSecretStoreConfigMap[P];
}[InfraProviderFor<'secretStore'>];

export interface InfraNetworkingTlsSpec {
  /** First production slice: runtime-managed ACME using the HTTP-01 challenge. */
  readonly mode: 'acme-http-01';
  /** ACME registration and expiry-notification contact. */
  readonly contactEmail: string;
}

export interface InfraNetworkingSpec {
  /** Public DNS name intent, not automatic DNS/CDN vendor provisioning. */
  readonly domain?: string;
  /** Absolute HTTP(S) origin used by workloads that must know their external URL at startup. */
  readonly publicBaseUrl?: string;
  /** Runtime-neutral automatic TLS intent; the selected runtime owns concrete ingress configuration. */
  readonly tls?: InfraNetworkingTlsSpec;
}

export interface InfraEnvironmentSpec {
  readonly deployment: InfraDeploymentSpec;
  readonly database?: InfraDatabaseSpec;
  readonly objectStorage?: InfraObjectStorageSpec;
  readonly auth?: InfraAuthSpec;
  readonly authz?: InfraAuthzSpec;
  readonly secretStore?: InfraSecretStoreSpec;
  readonly networking?: InfraNetworkingSpec;
  readonly workloads?: InfraWorkloadRegistry;
}

export type InfraModuleId = string;

export interface InfraModuleSpec {
  readonly config?: DataContractValue;
}

export type InfraModuleRegistry = EntityRegistry<InfraModuleId, InfraModuleSpec>;

export interface InfraManifest {
  readonly environments: Readonly<
    Record<'local', InfraEnvironmentSpec> &
      Partial<Record<Exclude<AppEnvironmentId, 'local'>, InfraEnvironmentSpec>>
  >;
  readonly apis?: ApiDefinitionRegistry;
  readonly modules: InfraModuleRegistry;
}
