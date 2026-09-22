import type { EntityRegistry } from '../collections';
import type { EndpointId, OperationId } from './ids';
import type { CredentialRef } from './refs';
import type { DataSchemaSlot } from './schemas';
import type { DataContractValue } from './values';

export type DataOperationIntent = 'action' | 'create' | 'delete' | 'read' | 'update';

export type DataOperationMethod =
  'DELETE' | 'GET' | 'HEAD' | 'OPTIONS' | 'PATCH' | 'POST' | 'PUT' | (string & {});

export type DataOperationProtocol = 'database' | 'graphql' | 'http' | (string & {});

export type DataOperationParameterLocation = 'body' | 'cookie' | 'header' | 'path' | 'query';

export interface DataOperationParameter extends DataSchemaSlot {
  readonly name: string;
  readonly location: DataOperationParameterLocation;
  readonly required?: boolean;
  readonly description?: string;
  readonly default?: DataContractValue;
}

export interface DataOperationRequest extends DataSchemaSlot {
  readonly parameters?: readonly DataOperationParameter[];
  readonly contentType?: string;
}

export interface DataOperationResponse extends DataSchemaSlot {
  readonly status?: number | string;
  readonly contentType?: string;
  readonly description?: string;
}

export interface DataOperationPagination {
  readonly kind: 'cursor' | 'limit-offset' | 'page' | 'unknown' | (string & {});
  readonly cursorPath?: string;
  readonly limitParameter?: string;
  readonly offsetParameter?: string;
  readonly pageParameter?: string;
  readonly pageSizeParameter?: string;
}

export interface DataOperationConfig {
  readonly id: OperationId;
  readonly endpointId?: EndpointId;
  readonly name?: string;
  readonly description?: string;
  readonly protocol: DataOperationProtocol;
  readonly intent: DataOperationIntent;
  readonly method?: DataOperationMethod;
  readonly path?: string;
  readonly request?: DataOperationRequest;
  readonly response?: DataOperationResponse;
  readonly pagination?: DataOperationPagination;
  readonly credential?: CredentialRef;
  readonly metadata?: DataContractValue;
}

export type DataOperationRegistry = EntityRegistry<OperationId, DataOperationConfig, 'id'>;
