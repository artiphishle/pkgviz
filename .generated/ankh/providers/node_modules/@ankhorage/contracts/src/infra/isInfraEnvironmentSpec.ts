import { isRecord } from '@ankhorage/utility/object';
import { isNonEmptyString } from '@ankhorage/utility/string';

import { isSerializableSet } from '../collections';
import type {
  InfraEnvironmentSpec,
  InfraObjectStorageSpec,
  InfraS3PersistenceTarget,
  InfraScheduledDatabaseBackupSpec,
} from '../types/infraManifest';
import type { InfraShape } from '../types/infraValidation';
import { INFRA_ADAPTER_CATALOG } from './constants';
import { infraFields } from './infraFields';
import { isInfraAuthSpec } from './isInfraAuthSpec';
import { isInfraCredentialRef } from './isInfraCredentialRef';
import { isInfraDeploymentSpec } from './isInfraDeploymentSpec';
import { isInfraShape } from './isInfraShape';
import { isInfraWorkloadSpec } from './isInfraWorkloadSpec';

/*** Validate sibling capabilities and their required relationships within one environment. */
export function isInfraEnvironmentSpec(value: unknown): value is InfraEnvironmentSpec {
  return (
    isEnvironmentShape(value) &&
    hasServiceDependencies(value) &&
    hasNetworkingRelationships(value) &&
    hasUniquePublishedPorts(value)
  );
}

/*** Check all environment field shapes before inspecting canonical dependency metadata. */
function isEnvironmentShape(value: unknown): value is InfraEnvironmentSpec {
  return isInfraShape(value, {
    deployment: isInfraDeploymentSpec,
    database: (database) =>
      database === undefined ||
      isInfraShape(database, {
        provider: (provider) => provider === 'supabase',
        tier: (tier) => tier === undefined || tier === 'dev' || tier === 'prod',
        backup: (backup) => backup === undefined || isScheduledDatabaseBackup(backup),
      }),
    objectStorage: (storage) => storage === undefined || isObjectStorage(storage),
    auth: (auth) => auth === undefined || isInfraAuthSpec(auth),
    authz: (authz) =>
      authz === undefined ||
      isInfraShape(authz, {
        provider: (provider) => provider === 'cerbos',
        kind: (kind) => kind === 'ABAC' || kind === 'RBAC',
        policies: (policies) => policies === undefined || isPolicyFiles(policies),
      }),
    secretStore: (store) =>
      store === undefined ||
      isInfraShape(store, {
        provider: (provider) => provider === 'supabase-vault',
        schema: infraFields.optionalText,
      }),
    networking: (networking) =>
      networking === undefined ||
      isInfraShape(networking, {
        domain: infraFields.optionalText,
        publicBaseUrl: (publicBaseUrl) =>
          publicBaseUrl === undefined || isPublicHttpOrigin(publicBaseUrl),
        tls: (tls) =>
          tls === undefined ||
          isInfraShape(tls, {
            mode: (mode) => mode === 'acme-http-01',
            contactEmail: isNonEmptyString,
          }),
      }),
    workloads: (workloads) => workloads === undefined || isWorkloads(workloads),
  } satisfies InfraShape<InfraEnvironmentSpec>);
}

/*** Public workload configuration uses one canonical absolute HTTP(S) origin without path state. */
function isPublicHttpOrigin(value: unknown): boolean {
  if (!isNonEmptyString(value)) return false;
  try {
    const url = new URL(value);
    return (url.protocol === 'http:' || url.protocol === 'https:') && url.origin === value;
  } catch {
    return false;
  }
}

/*** Automatic TLS requires one matching HTTPS origin and public DNS hostname. */
function hasNetworkingRelationships(value: InfraEnvironmentSpec): boolean {
  const { networking } = value;
  if (networking?.tls === undefined) return true;
  if (networking.domain === undefined || networking.publicBaseUrl === undefined) return false;
  const url = new URL(networking.publicBaseUrl);
  return url.protocol === 'https:' && url.hostname === networking.domain;
}

/*** Validate portable, unique Cerbos policy files without host paths or traversal. */
function isPolicyFiles(value: unknown): boolean {
  return (
    isRecord(value) &&
    Object.entries(value).every(
      ([path, content]) =>
        isNonEmptyString(path) &&
        !path.startsWith('/') &&
        !path.split('/').includes('..') &&
        isNonEmptyString(content),
    )
  );
}

/*** Validate provider-neutral scheduled database backup intent. */
function isScheduledDatabaseBackup(value: unknown): value is InfraScheduledDatabaseBackupSpec {
  return isInfraShape(value, {
    mode: (mode) => mode === 'scheduled',
    target: isS3PersistenceTarget,
    intervalHours: (interval) =>
      interval === undefined ||
      (typeof interval === 'number' && Number.isInteger(interval) && interval > 0),
  });
}

/*** Validate one portable S3-compatible persistence target without resolving credentials. */
function isS3PersistenceTarget(value: unknown): value is InfraS3PersistenceTarget {
  return isInfraShape(value, {
    endpoint: isPublicHttpOrigin,
    region: isNonEmptyString,
    bucket: isNonEmptyString,
    credentials: isInfraCredentialRef,
    forcePathStyle: (forcePathStyle) =>
      forcePathStyle === undefined || typeof forcePathStyle === 'boolean',
  });
}

/*** Object storage can vary independently from database/auth; there is no implicit auto provider. */
function isObjectStorage(value: unknown): boolean {
  if (!isRecord(value)) return false;
  const common = {
    provider: (provider: unknown) => provider === value.provider,
    buckets: (buckets: unknown) => buckets === undefined || isSerializableSet(buckets),
  };
  if (value.provider === 'supabase') {
    return isInfraShape(value, {
      ...common,
      provider: (provider) => provider === 'supabase',
      backend: (backend) => backend === undefined || isS3PersistenceTarget(backend),
    } satisfies InfraShape<Extract<InfraObjectStorageSpec, { readonly provider: 'supabase' }>>);
  }
  return isInfraShape(value, {
    ...common,
    provider: (provider) => provider === 'r2',
    accountId: infraFields.optionalText,
    credentials: (credentials) => credentials === undefined || isInfraCredentialRef(credentials),
  } satisfies InfraShape<Extract<InfraObjectStorageSpec, { readonly provider: 'r2' }>>);
}

/*** Duplicate desired workload identities cannot be reconciled safely. */
function isWorkloads(value: unknown): boolean {
  return (
    isRecord(value) &&
    Object.entries(value).every(
      ([workloadId, workload]) => isInfraWorkloadSpec(workload) && workload.id === workloadId,
    )
  );
}

/*** Prevent two workloads in one environment from claiming the same external listener. */
function hasUniquePublishedPorts(value: InfraEnvironmentSpec): boolean {
  const ports = Object.values(value.workloads ?? {}).flatMap((workload) =>
    Object.values(workload.ports ?? {}).flatMap(({ publishedPort }) =>
      publishedPort === undefined ? [] : [publishedPort],
    ),
  );
  return new Set(ports).size === ports.length;
}

/*** Check catalog dependencies against selected sibling capabilities and runtime capabilities. */
function hasServiceDependencies(value: InfraEnvironmentSpec): boolean {
  const selections = [
    value.database,
    value.auth,
    value.authz,
    value.objectStorage,
    value.secretStore,
  ];
  const runtime = Object.values(INFRA_ADAPTER_CATALOG).find(
    (entry) => entry.id === value.deployment.runtime.provider,
  );
  const capabilities = new Set<string>([
    'compute',
    ...(runtime?.capabilities ?? []),
    ...Object.entries(value)
      .filter(([, selection]) => selection !== undefined)
      .map(([capability]) => capability),
  ]);
  return Object.values(INFRA_ADAPTER_CATALOG)
    .filter((entry) => selections.some((selection) => selection?.provider === entry.id))
    .every((entry) => entry.dependencies.every((dependency) => capabilities.has(dependency)));
}
