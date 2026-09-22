import { hasOnlyKeys, isRecord } from '@ankhorage/utility/object';

/*** Validate an exact Infra object shape, rejecting unknown and superseded configuration keys. */
export function isInfraShape(
  value: unknown,
  fields: Readonly<Record<string, (field: unknown) => boolean>>,
): boolean {
  if (!isRecord(value)) return false;
  const entries = Object.entries(fields);
  return (
    hasOnlyKeys(value, Object.keys(fields)) &&
    entries.every(([key, validate]) =>
      validate(Object.hasOwn(value, key) ? Reflect.get(value, key) : undefined),
    )
  );
}
