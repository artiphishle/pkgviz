import { isStringArray } from '@ankhorage/utility/array';
import { isRecord, readOwnProperty } from '@ankhorage/utility/object';
import { isOptionalString } from '@ankhorage/utility/string';

import { isManifestValue } from './isManifestValue';

const DATA_SCHEMA_TYPES = new Set([
  'array',
  'boolean',
  'integer',
  'null',
  'number',
  'object',
  'string',
]);
const OPERATION_INTENTS = new Set(['action', 'create', 'delete', 'read', 'update']);
const PARAMETER_LOCATIONS = new Set(['body', 'cookie', 'header', 'path', 'query']);

/*** Validate every endpoint in the data endpoint registry. */
export function isDataEndpointRegistry(value: unknown): boolean {
  return (
    isRecord(value) &&
    Object.entries(value).every(
      ([endpointId, endpoint]) =>
        isDataEndpointConfig(endpoint) && isRecord(endpoint) && endpoint.id === endpointId,
    )
  );
}

/*** Validate every schema in the data schema registry. */
export function isDataSchemaRegistry(value: unknown): boolean {
  return isRecord(value) && Object.values(value).every(isDataSchema);
}

/*** Validate credential identity and optional descriptive metadata. */
export function isCredentialRef(value: unknown): boolean {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.kind === 'string' &&
    isOptionalString(value.label) &&
    isOptionalString(value.scope)
  );
}

/*** Validate an adapter reference and its optional authored configuration. */
export function isAdapterRef(value: unknown): boolean {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.kind === 'string' &&
    isOptionalString(value.packageName) &&
    isOptionalString(value.exportName) &&
    (value.config === undefined || isManifestValue(value.config))
  );
}

/*** Validate endpoint identity, operations and optional connection metadata. */
function isDataEndpointConfig(value: unknown): boolean {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.kind === 'string' &&
    isOptionalString(value.name) &&
    isOptionalString(value.description) &&
    isOptionalString(value.baseUrl) &&
    isOptionalString(value.path) &&
    (value.credential === undefined || isCredentialRef(value.credential)) &&
    isRecord(value.operations) &&
    Object.entries(value.operations).every(
      ([operationId, operation]) =>
        isDataOperationConfig(operation) && isRecord(operation) && operation.id === operationId,
    ) &&
    (value.metadata === undefined || isManifestValue(value.metadata))
  );
}

/*** Validate operation protocol, intent, request and response configuration. */
function isDataOperationConfig(value: unknown): boolean {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    isOptionalString(value.endpointId) &&
    isOptionalString(value.name) &&
    isOptionalString(value.description) &&
    typeof value.protocol === 'string' &&
    typeof value.intent === 'string' &&
    OPERATION_INTENTS.has(value.intent) &&
    isOptionalString(value.method) &&
    isOptionalString(value.path) &&
    (value.request === undefined || isDataOperationRequest(value.request)) &&
    (value.response === undefined || isDataOperationResponse(value.response)) &&
    (value.pagination === undefined || isRecord(value.pagination)) &&
    (value.credential === undefined || isCredentialRef(value.credential)) &&
    (value.metadata === undefined || isManifestValue(value.metadata))
  );
}

/*** Validate request schema, parameters and optional content type. */
function isDataOperationRequest(value: unknown): boolean {
  return (
    isRecord(value) &&
    isDataSchemaSlot(value) &&
    isOptionalString(value.contentType) &&
    (value.parameters === undefined ||
      (Array.isArray(value.parameters) && value.parameters.every(isDataOperationParameter)))
  );
}

/*** Validate parameter identity, location, schema and optional default value. */
function isDataOperationParameter(value: unknown): boolean {
  return (
    isRecord(value) &&
    isDataSchemaSlot(value) &&
    typeof value.name === 'string' &&
    typeof value.location === 'string' &&
    PARAMETER_LOCATIONS.has(value.location) &&
    (value.required === undefined || typeof value.required === 'boolean') &&
    isOptionalString(value.description) &&
    (value.default === undefined || isManifestValue(value.default))
  );
}

/*** Validate response status, schema and optional descriptive metadata. */
function isDataOperationResponse(value: unknown): boolean {
  return (
    isRecord(value) &&
    isDataSchemaSlot(value) &&
    (value.status === undefined ||
      typeof value.status === 'string' ||
      typeof value.status === 'number') &&
    isOptionalString(value.contentType) &&
    isOptionalString(value.description)
  );
}

/*** Validate inline schema and schema-reference fields. */
function isDataSchemaSlot(value: Record<string, unknown>): boolean {
  return (
    (value.schema === undefined || isDataSchema(value.schema)) &&
    (value.schemaRef === undefined || isDataSchemaRef(value.schemaRef))
  );
}

/*** Validate supported schema types, constraints and compositions. */
function isDataSchema(value: unknown): boolean {
  if (!isRecord(value) || !isDataSchemaType(value.type)) return false;
  if (!isOptionalSchemaScalars(value)) return false;
  if (!isOptionalSchemaCollections(value)) return false;
  return isOptionalSchemaComposition(value);
}

/*** Validate a supported schema type or an array of supported types. */
function isDataSchemaType(value: unknown): boolean {
  if (value === undefined) return true;
  if (typeof value === 'string') return DATA_SCHEMA_TYPES.has(value);
  return (
    Array.isArray(value) &&
    value.every((entry) => typeof entry === 'string' && DATA_SCHEMA_TYPES.has(entry))
  );
}

/*** Validate optional scalar schema constraints. */
function isOptionalSchemaScalars(value: Record<string, unknown>): boolean {
  return (
    isOptionalString(value.title) &&
    isOptionalString(value.description) &&
    isOptionalString(value.format) &&
    (value.nullable === undefined || typeof value.nullable === 'boolean') &&
    (value.const === undefined || isManifestValue(value.const)) &&
    (value.default === undefined || isManifestValue(value.default)) &&
    (value.enum === undefined ||
      (Array.isArray(value.enum) && value.enum.every(isManifestValue))) &&
    (value.ref === undefined || isDataSchemaRef(value.ref))
  );
}

/*** Validate optional schema properties, items and required fields. */
function isOptionalSchemaCollections(value: Record<string, unknown>): boolean {
  return (
    (value.required === undefined || isStringArray(value.required)) &&
    (value.properties === undefined ||
      (isRecord(value.properties) && Object.values(value.properties).every(isDataSchema))) &&
    (value.additionalProperties === undefined ||
      typeof value.additionalProperties === 'boolean' ||
      isDataSchema(value.additionalProperties)) &&
    (value.items === undefined || isDataSchema(value.items))
  );
}

/*** Validate optional schema alternatives and intersections. */
function isOptionalSchemaComposition(value: Record<string, unknown>): boolean {
  return ['allOf', 'anyOf', 'oneOf'].every((key) => {
    const entry = readOwnProperty(value, key);
    return entry === undefined || (Array.isArray(entry) && entry.every(isDataSchema));
  });
}

/*** Validate a named schema reference. */
function isDataSchemaRef(value: unknown): boolean {
  return isRecord(value) && typeof value.id === 'string';
}
