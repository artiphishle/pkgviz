import type { EntityRegistry, SerializableSet, ValueMap } from '../collections';
import type { InfraControlPlaneCredentialRef, InfraSecretReference } from './infraSecrets';

export interface InfraWorkloadArtifact {
  readonly kind: 'image';
  /** Prebuilt image, optionally pinned by digest. No registry/build provider requirement. */
  readonly image: string;
}

export type InfraWorkloadScalarValue =
  | { readonly kind: 'literal'; readonly value: string }
  | { readonly kind: 'secret'; readonly reference: InfraSecretReference }
  | {
      readonly kind: 'credential';
      readonly reference: InfraControlPlaneCredentialRef;
      readonly key: string;
    }
  | { readonly kind: 'output'; readonly resourceId: string; readonly output: string };

export type InfraWorkloadValue =
  | InfraWorkloadScalarValue
  | {
      readonly kind: 'template';
      /** Ordered scalar segments materialized into one value only at the runtime boundary. */
      readonly segments: readonly InfraWorkloadScalarValue[];
    };

export interface InfraWorkloadPort {
  readonly port: number;
  readonly protocol?: 'tcp' | 'udp';
  /** Exact external listener port requested for a public single-replica workload. */
  readonly publishedPort?: number;
}

export type InfraWorkloadHealthSpec = {
  readonly intervalSeconds?: number;
  readonly timeoutSeconds?: number;
  readonly failureThreshold?: number;
} & (
  | { readonly kind: 'http'; readonly port: number; readonly path: string }
  | { readonly kind: 'tcp'; readonly port: number }
  | { readonly kind: 'command'; readonly command: readonly string[] }
);

export interface InfraWorkloadResourceSpec {
  readonly cpuMillis?: number;
  readonly memoryMiB?: number;
}

export interface InfraWorkloadVolumeSpec {
  readonly id: string;
  readonly mountPath: string;
  readonly sizeGiB: number;
  /** Seed a newly created empty volume from the image contents at mountPath before workload start. */
  readonly seed?: 'image';
  /** Persistence survives down and is retained by default on destroy. */
  readonly retention: 'retain' | 'delete-on-destroy';
}

export type InfraWorkloadId = string;
export type InfraWorkloadPortRegistry = EntityRegistry<string, InfraWorkloadPort>;
export type InfraWorkloadFileMap = ValueMap<string, InfraWorkloadValue>;
export type InfraWorkloadVolumeRegistry = EntityRegistry<string, InfraWorkloadVolumeSpec, 'id'>;

export interface InfraWorkloadSpec {
  readonly id: InfraWorkloadId;
  readonly artifact: InfraWorkloadArtifact;
  readonly command?: readonly string[];
  readonly args?: readonly string[];
  readonly ports?: InfraWorkloadPortRegistry;
  readonly environment?: ValueMap<string, InfraWorkloadValue>;
  readonly files?: InfraWorkloadFileMap;
  readonly health?: InfraWorkloadHealthSpec;
  readonly resources?: InfraWorkloadResourceSpec;
  readonly persistence?: InfraWorkloadVolumeRegistry;
  readonly exposure?: 'internal' | 'public';
  readonly replicas?: number;
  /** IDs in the composed desired-state graph; the orchestrator validates missing/cyclic edges. */
  readonly dependsOn?: SerializableSet;
}

export type InfraWorkloadRegistry = EntityRegistry<InfraWorkloadId, InfraWorkloadSpec, 'id'>;
