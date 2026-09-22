/*** Resolve a theme token key through its map while preserving raw values. */
type ResolvedToken<TMap, TValue> = TValue extends keyof TMap ? TMap[TValue] : TValue;

/*** Resolve a mapped theme token or return the supplied raw value unchanged. */
export function resolveToken<
  TMap extends Record<string | number, unknown>,
  TValue extends string | number | undefined,
>(map: TMap, value: TValue): ResolvedToken<TMap, TValue> {
  if (value === undefined) return undefined as ResolvedToken<TMap, TValue>;

  if (Object.prototype.hasOwnProperty.call(map, value)) {
    return map[value as keyof TMap] as ResolvedToken<TMap, TValue>;
  }

  return value as ResolvedToken<TMap, TValue>;
}
