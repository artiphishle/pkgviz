import { hasOnlyKeys, isRecord } from '@ankhorage/utility/object';
import { isOptionalString } from '@ankhorage/utility/string';

import {
  isAdapterRef,
  isCredentialRef,
  isDataEndpointRegistry,
  isDataSchemaRegistry,
} from './data';
import { isManifestValue } from './isManifestValue';

const DATABASE_SOURCE_KEYS = [
  'id',
  'kind',
  'name',
  'description',
  'credential',
  'adapter',
  'endpoints',
  'schemas',
  'metadata',
] as const;

/*** Validate the supported data-source entries in the registry. */
export function isDataSourceRegistry(value: unknown): boolean {
  return (
    isRecord(value) &&
    Object.entries(value).every(([id, source]) => isDatabaseDataSource(source) && source.id === id)
  );
}

/*** Validate database adapter identity and supported configuration fields. */
function isDatabaseDataSource(value: unknown): value is Record<string, unknown> {
  return (
    isRecord(value) &&
    hasOnlyKeys(value, DATABASE_SOURCE_KEYS) &&
    typeof value.id === 'string' &&
    value.kind === 'database' &&
    isOptionalString(value.name) &&
    isOptionalString(value.description) &&
    (value.credential === undefined || isCredentialRef(value.credential)) &&
    isRecord(value.adapter) &&
    value.adapter.kind === 'database' &&
    isAdapterRef(value.adapter) &&
    isDataEndpointRegistry(value.endpoints) &&
    (value.schemas === undefined || isDataSchemaRegistry(value.schemas)) &&
    (value.metadata === undefined || isManifestValue(value.metadata))
  );
}
