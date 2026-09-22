import type { ThemeTypographyHeadingOverrides } from '@ankhorage/contracts';

import type { ThemeTokens } from '../../../types/theme';

type HeadingTokens = ThemeTokens['typography']['headings'];
type HeadingToken = HeadingTokens[1];
type HeadingWeight = HeadingToken['weight'];

const HEADING_KEYS = new Set<string>(['1', '2', '3', '4', '5', '6']);
const HEADING_WEIGHTS = new Set<string>(['regular', 'medium', 'semiBold', 'bold']);

export function resolveHeadingTokenOverrides(
  defaults: HeadingTokens,
  overrides: Readonly<Record<string, ThemeTypographyHeadingOverrides>> | undefined,
): HeadingTokens {
  validateHeadingKeys(overrides);
  return {
    1: resolveHeading('1', defaults[1], overrides?.['1']),
    2: resolveHeading('2', defaults[2], overrides?.['2']),
    3: resolveHeading('3', defaults[3], overrides?.['3']),
    4: resolveHeading('4', defaults[4], overrides?.['4']),
    5: resolveHeading('5', defaults[5], overrides?.['5']),
    6: resolveHeading('6', defaults[6], overrides?.['6']),
  };
}

function validateHeadingKeys(
  overrides: Readonly<Record<string, ThemeTypographyHeadingOverrides>> | undefined,
): void {
  for (const key of Object.keys(overrides ?? {})) {
    if (!HEADING_KEYS.has(key)) throw new RangeError(`Unknown typography heading token: ${key}.`);
  }
}

function resolveHeading(
  key: string,
  fallback: HeadingToken,
  override: ThemeTypographyHeadingOverrides | undefined,
): HeadingToken {
  const size = override?.size ?? fallback.size;
  const lineHeight = override?.lineHeight ?? fallback.lineHeight;
  const weight = override?.weight ?? fallback.weight;
  if (!Number.isFinite(size) || size <= 0) {
    throw new RangeError(
      `Theme token typography.headings.${key}.size must be a finite positive number.`,
    );
  }
  if (!Number.isFinite(lineHeight) || lineHeight <= 0) {
    throw new RangeError(
      `Theme token typography.headings.${key}.lineHeight must be a finite positive number.`,
    );
  }
  if (!isHeadingWeight(weight)) {
    throw new RangeError(`Invalid heading weight for typography.headings.${key}: ${weight}.`);
  }
  return { size, lineHeight, weight };
}

function isHeadingWeight(value: string): value is HeadingWeight {
  return HEADING_WEIGHTS.has(value);
}
