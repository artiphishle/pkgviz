import type { AppEnvironmentId } from '../environments';

/** Bootstrap credentials cannot depend on the managed secret store being provisioned. */
export interface InfraControlPlaneCredentialRef {
  readonly source: 'control-plane';
  readonly name: string;
}

/** Privileged values are never serialized into manifests, ledgers or normal outputs. */
export interface InfraSecretReference {
  readonly source: 'secret-store';
  readonly projectId: string;
  readonly environment: AppEnvironmentId;
  readonly ref: string;
  readonly key: string;
}
