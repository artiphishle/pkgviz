import type { EntityRegistry } from '../collections';
import type { DataEndpointRegistry } from './endpoints';
import type { DataSourceId } from './ids';
import type { CredentialRef, DatabaseAdapterRef } from './refs';
import type { DataSchemaRegistry } from './schemas';
import type { DataContractValue } from './values';

export type DataSourceKind = 'database';

export interface DatabaseDataSourceConfig {
  readonly id: DataSourceId;
  readonly kind: 'database';
  readonly name?: string;
  readonly description?: string;
  readonly credential?: CredentialRef;
  readonly adapter: DatabaseAdapterRef;
  readonly endpoints: DataEndpointRegistry;
  readonly schemas?: DataSchemaRegistry;
  readonly metadata?: DataContractValue;
}

export type DataSourceConfig = DatabaseDataSourceConfig;
export type DataSourceRegistry = EntityRegistry<DataSourceId, DataSourceConfig, 'id'>;
