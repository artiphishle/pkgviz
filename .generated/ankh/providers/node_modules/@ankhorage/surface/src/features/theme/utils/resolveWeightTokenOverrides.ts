import type { FontWeight } from '../../../types/theme';

const WEIGHT_TOKEN_KEYS = new Set<string>([
  'thin',
  'extraLight',
  'light',
  'regular',
  'medium',
  'semiBold',
  'bold',
  'extraBold',
  'black',
]);
const FONT_WEIGHT_VALUES = new Set<string>([
  '100',
  '200',
  '300',
  '400',
  '500',
  '600',
  '700',
  '800',
  '900',
  'bold',
  'normal',
]);

export function resolveWeightTokenOverrides(
  overrides: Readonly<Record<string, string>> | undefined,
): Readonly<Record<string, FontWeight>> {
  if (overrides === undefined) return {};

  return Object.fromEntries(
    Object.entries(overrides).map(([token, value]) => {
      if (!WEIGHT_TOKEN_KEYS.has(token)) {
        throw new RangeError(`Unknown typography weight token: ${token}.`);
      }
      if (!isFontWeight(value)) {
        throw new RangeError(`Invalid font weight for typography.weights.${token}: ${value}.`);
      }
      return [token, value] as const;
    }),
  );
}

function isFontWeight(value: string): value is FontWeight {
  return FONT_WEIGHT_VALUES.has(value);
}
