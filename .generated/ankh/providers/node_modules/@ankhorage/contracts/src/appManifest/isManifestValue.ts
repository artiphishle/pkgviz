import { isSerializableValue } from '../serializable';

/*** Validate authored values through the canonical serializable-value contract. */
export function isManifestValue(value: unknown): boolean {
  return isSerializableValue(value);
}
