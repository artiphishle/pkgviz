import type {
  GeneratedThemeModeColors,
  HexColor,
  SemanticColorReferenceMap,
  SemanticColorToken,
} from '@ankhorage/color-theory';

export type SurfaceSemanticColors = Record<SemanticColorToken, HexColor>;

export function resolveSemanticColors(
  generated: GeneratedThemeModeColors,
  references: SemanticColorReferenceMap,
): SurfaceSemanticColors {
  return Object.fromEntries(
    Object.entries(references).map(([token, ref]) => {
      const swatch = generated.swatches[ref.role];
      if (!swatch) {
        throw new Error(`Missing swatch for role '${ref.role}' (token: '${token}')`);
      }
      return [token, swatch[ref.step]];
    }),
  ) as SurfaceSemanticColors;
}
