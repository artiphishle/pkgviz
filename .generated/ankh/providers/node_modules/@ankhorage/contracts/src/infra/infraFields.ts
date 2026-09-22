import { isStringArray } from '@ankhorage/utility/array';
import { isNonEmptyString } from '@ankhorage/utility/string';

/*** Primitive field rules for portable Infra configuration, shared by its exact-shape validators. */
export const infraFields = {
  optionalText: (value: unknown): boolean => value === undefined || isNonEmptyString(value),
  strings: (value: unknown): boolean => isStringArray(value) && value.every(isNonEmptyString),
  optionalStrings: (value: unknown): boolean =>
    value === undefined || (isStringArray(value) && value.every(isNonEmptyString)),
  positiveInteger: (value: unknown): boolean =>
    typeof value === 'number' && Number.isSafeInteger(value) && value > 0,
  nonnegativeInteger: (value: unknown): boolean =>
    typeof value === 'number' && Number.isSafeInteger(value) && value >= 0,
  optionalPositiveInteger: (value: unknown): boolean =>
    value === undefined || (typeof value === 'number' && Number.isSafeInteger(value) && value > 0),
  optionalNonnegativeInteger: (value: unknown): boolean =>
    value === undefined || (typeof value === 'number' && Number.isSafeInteger(value) && value >= 0),
  port: (value: unknown): boolean =>
    typeof value === 'number' && Number.isInteger(value) && value > 0 && value <= 65535,
  optionalPort: (value: unknown): boolean =>
    value === undefined ||
    (typeof value === 'number' && Number.isInteger(value) && value > 0 && value <= 65535),
};
