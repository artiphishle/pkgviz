import { hasOnlyKeys, isRecord } from '@ankhorage/utility/object';
import { isNonEmptyString } from '@ankhorage/utility/string';

import type { StructureDescriptor, StructureLiteralValue, StructureScalarType } from './types';

/*** Validate one standalone structural descriptor without resolving external/local references. */
export function isStructureDescriptor(value: unknown): value is StructureDescriptor {
  return isDescriptor(value, new Set());
}

/*** Validate one descriptor recursively while rejecting cyclic inline object graphs. */
function isDescriptor(value: unknown, ancestors: Set<object>): value is StructureDescriptor {
  if (!isRecord(value) || typeof value.kind !== 'string' || ancestors.has(value)) return false;
  ancestors.add(value);
  const valid = validateDescriptorKind(value, ancestors);
  ancestors.delete(value);
  return valid;
}

/*** Dispatch descriptor validation by its explicit structural kind. */
function validateDescriptorKind(value: Record<string, unknown>, ancestors: Set<object>): boolean {
  switch (value.kind) {
    case 'scalar':
      return isScalarDescriptor(value);
    case 'enum':
      return isEnumDescriptor(value);
    case 'object':
      return isObjectDescriptor(value, ancestors);
    case 'entity-registry':
      return isEntityRegistryDescriptor(value, ancestors);
    case 'value-map':
      return isValueMapDescriptor(value, ancestors);
    case 'set':
      return isSetDescriptor(value, ancestors);
    case 'ordered-list':
      return isOrderedListDescriptor(value, ancestors);
    case 'union':
      return isUnionDescriptor(value, ancestors);
    case 'ref':
      return isReferenceDescriptor(value);
    default:
      return false;
  }
}

/*** Validate a scalar descriptor and its closed primitive vocabulary. */
function isScalarDescriptor(value: Record<string, unknown>): boolean {
  return (
    hasOnlyKeys(value, ['kind', 'type']) &&
    typeof value.type === 'string' &&
    SCALAR_TYPES.has(value.type as StructureScalarType)
  );
}

/*** Validate a non-empty finite scalar literal set without duplicate members. */
function isEnumDescriptor(value: Record<string, unknown>): boolean {
  if (!hasOnlyKeys(value, ['kind', 'values']) || !Array.isArray(value.values)) return false;
  if (value.values.length === 0 || !value.values.every(isStructureLiteralValue)) return false;
  const identities = value.values.map(structureLiteralIdentity);
  return new Set(identities).size === identities.length;
}

/*** Validate a fixed-field object descriptor. */
function isObjectDescriptor(value: Record<string, unknown>, ancestors: Set<object>): boolean {
  return (
    hasOnlyKeys(value, ['kind', 'fields']) &&
    isRecord(value.fields) &&
    Object.values(value.fields).every((field) => isObjectField(field, ancestors))
  );
}

/*** Validate one object field and its optionality marker. */
function isObjectField(value: unknown, ancestors: Set<object>): boolean {
  return (
    isRecord(value) &&
    hasOnlyKeys(value, ['value', 'optional']) &&
    (value.optional === undefined || typeof value.optional === 'boolean') &&
    isDescriptor(value.value, ancestors)
  );
}

/*** Validate a stable keyed entity collection descriptor. */
function isEntityRegistryDescriptor(
  value: Record<string, unknown>,
  ancestors: Set<object>,
): boolean {
  return (
    hasOnlyKeys(value, ['kind', 'key', 'value', 'identityField']) &&
    isStringKeyDescriptor(value.key, ancestors) &&
    isDescriptor(value.value, ancestors) &&
    (value.identityField === undefined || isNonEmptyString(value.identityField))
  );
}

/*** Validate a keyed property/configuration map descriptor. */
function isValueMapDescriptor(value: Record<string, unknown>, ancestors: Set<object>): boolean {
  return (
    hasOnlyKeys(value, ['kind', 'key', 'value']) &&
    isStringKeyDescriptor(value.key, ancestors) &&
    isDescriptor(value.value, ancestors)
  );
}

/*** Validate an unordered string-membership descriptor. */
function isSetDescriptor(value: Record<string, unknown>, ancestors: Set<object>): boolean {
  return hasOnlyKeys(value, ['kind', 'member']) && isStringKeyDescriptor(value.member, ancestors);
}

/*** Validate a semantically ordered list descriptor. */
function isOrderedListDescriptor(value: Record<string, unknown>, ancestors: Set<object>): boolean {
  return hasOnlyKeys(value, ['kind', 'item']) && isDescriptor(value.item, ancestors);
}

/*** Validate a union descriptor with at least two valid variants. */
function isUnionDescriptor(value: Record<string, unknown>, ancestors: Set<object>): boolean {
  return (
    hasOnlyKeys(value, ['kind', 'variants', 'discriminator']) &&
    Array.isArray(value.variants) &&
    value.variants.length >= 2 &&
    value.variants.every((variant) => isDescriptor(variant, ancestors)) &&
    (value.discriminator === undefined || isNonEmptyString(value.discriminator))
  );
}

/*** Validate a local or package-qualified descriptor reference. */
function isReferenceDescriptor(value: Record<string, unknown>): boolean {
  return (
    hasOnlyKeys(value, ['kind', 'id', 'packageName']) &&
    isNonEmptyString(value.id) &&
    (value.packageName === undefined || isNonEmptyString(value.packageName))
  );
}

/*** Validate a descriptor that can represent a JSON object key or set member string. */
function isStringKeyDescriptor(value: unknown, ancestors: Set<object>): boolean {
  if (!isDescriptor(value, ancestors)) return false;
  if (value.kind === 'ref') return true;
  if (value.kind === 'scalar') return value.type === 'string';
  return value.kind === 'enum' && value.values.every((member) => typeof member === 'string');
}

/*** Validate one serializable scalar literal used by finite enum descriptors. */
function isStructureLiteralValue(value: unknown): value is StructureLiteralValue {
  return (
    value === null ||
    typeof value === 'boolean' ||
    (typeof value === 'number' && Number.isFinite(value)) ||
    typeof value === 'string'
  );
}

/*** Produce an unambiguous identity for one scalar enum member. */
function structureLiteralIdentity(value: StructureLiteralValue): string {
  return value === null ? 'null' : `${typeof value}:${String(value)}`;
}

const SCALAR_TYPES = new Set<StructureScalarType>([
  'boolean',
  'integer',
  'null',
  'number',
  'string',
]);
