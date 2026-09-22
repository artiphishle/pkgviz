export function resolveNumericTokenOverrides(
  family: string,
  overrides: Readonly<Record<string, number>> | undefined,
  requirePositive = false,
): Readonly<Record<string, number>> {
  if (overrides === undefined) return {};

  for (const [token, value] of Object.entries(overrides)) {
    const invalid = !Number.isFinite(value) || (requirePositive ? value <= 0 : value < 0);
    if (invalid) {
      const expectation = requirePositive
        ? 'a finite positive number'
        : 'a finite non-negative number';
      throw new RangeError(`Theme token ${family}.${token} must be ${expectation}.`);
    }
  }

  return { ...overrides };
}
