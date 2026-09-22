import { isRecord } from '@ankhorage/utility/object';

export type SerializableValue =
  | string
  | number
  | boolean
  | null
  | readonly SerializableValue[]
  | {
      readonly [key: string]: SerializableValue;
    };

/*** Validate recursively serializable manifest/config values without accepting functions or host objects. */
export function isSerializableValue(value: unknown): value is SerializableValue {
  if (
    value === null ||
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  ) {
    return true;
  }
  if (Array.isArray(value)) return value.every(isSerializableValue);
  return isRecord(value) && Object.values(value).every(isSerializableValue);
}
