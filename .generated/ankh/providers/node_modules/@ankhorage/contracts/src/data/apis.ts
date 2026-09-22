import type { EntityRegistry } from '../collections';
import type { DataEndpointRegistry } from './endpoints';
import type { ApiId } from './ids';
import type { CredentialRef } from './refs';
import type { DataSchemaRegistry } from './schemas';
import type { DataContractValue } from './values';

export type ApiOrigin = 'external' | 'internal';
export type ApiProtocol = 'graphql' | 'rest';

export interface ApiBaseDefinition {
  readonly id: ApiId;
  readonly origin: ApiOrigin;
  readonly protocol: ApiProtocol;
  readonly name?: string;
  readonly description?: string;
  readonly credential?: CredentialRef;
  readonly endpoints: DataEndpointRegistry;
  readonly schemas?: DataSchemaRegistry;
  readonly metadata?: DataContractValue;
}

export interface OpenApiDocumentRef {
  readonly url?: string;
  readonly documentId?: string;
  readonly version?: string;
}

export interface ExternalRestApiDefinition extends ApiBaseDefinition {
  readonly origin: 'external';
  readonly protocol: 'rest';
  readonly baseUrl: string;
  readonly openApi?: OpenApiDocumentRef;
}

export interface GraphQlIntrospectionConfig {
  readonly enabled: boolean;
  readonly schemaVersion?: string;
}

export interface ExternalGraphQlApiDefinition extends ApiBaseDefinition {
  readonly origin: 'external';
  readonly protocol: 'graphql';
  readonly endpointUrl: string;
  readonly introspection?: GraphQlIntrospectionConfig;
}

/**
 * Consumer-facing identity for an Ankhorage-owned API.
 *
 * Internal API generation/execution is intentionally not part of the current
 * contract. `basePath` reserves the portable API-facing location only; later
 * infrastructure/runtime packages may implement it without changing bindings.
 */
export interface InternalRestApiDefinition extends ApiBaseDefinition {
  readonly origin: 'internal';
  readonly protocol: 'rest';
  readonly basePath: string;
}

export type ApiDefinition =
  ExternalGraphQlApiDefinition | ExternalRestApiDefinition | InternalRestApiDefinition;

export type ApiDefinitionRegistry = EntityRegistry<ApiId, ApiDefinition, 'id'>;
