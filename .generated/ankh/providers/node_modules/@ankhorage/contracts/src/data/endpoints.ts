import type { EntityRegistry } from '../collections';
import type { EndpointId } from './ids';
import type { DataOperationRegistry } from './operations';
import type { CredentialRef } from './refs';
import type { DataContractValue } from './values';

export type DataEndpointKind = 'database' | 'graphql' | 'http' | (string & {});

export interface DataEndpointConfig {
  readonly id: EndpointId;
  readonly kind: DataEndpointKind;
  readonly name?: string;
  readonly description?: string;
  readonly baseUrl?: string;
  readonly path?: string;
  readonly credential?: CredentialRef;
  readonly operations: DataOperationRegistry;
  readonly metadata?: DataContractValue;
}

export type DataEndpointRegistry = EntityRegistry<EndpointId, DataEndpointConfig, 'id'>;
