import type { AdapterId, CredentialId } from './ids';
import type { DataContractValue } from './values';

export type CredentialKind = 'apiKey' | 'basic' | 'bearer' | 'custom' | 'oauth2';

export interface CredentialRef {
  readonly id: CredentialId;
  readonly kind: CredentialKind | (string & {});
  readonly label?: string;
  readonly scope?: string;
}

export type AdapterKind = 'auth' | 'database' | 'storage' | 'transport' | (string & {});

export interface AdapterRef {
  readonly id: AdapterId;
  readonly kind: AdapterKind;
  readonly packageName?: string;
  readonly exportName?: string;
  readonly config?: DataContractValue;
}

export interface DatabaseAdapterRef extends AdapterRef {
  readonly kind: 'database';
}
