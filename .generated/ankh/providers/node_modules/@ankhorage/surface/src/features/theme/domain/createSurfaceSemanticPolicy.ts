import type {
  ColorContrastContext,
  ColorSelectionTarget,
  ColorSwatch,
  ColorSwatchTiePolicy,
  HexColor,
  SemanticColorToken,
} from '@ankhorage/color-theory';
import { parseHexColorOrThrow } from '@ankhorage/color-theory';

import type {
  ContentSemantics,
  NeutralSemantics,
  SurfaceContrastDiagnostic,
  SurfaceSemantics,
} from '../../../types/theme';
import { SURFACE_COLOR_POLICY } from '../constants';

type ResolvedSemanticColors = Record<SemanticColorToken, HexColor>;

interface SurfaceSemanticMeasurements {
  measureForeground: (
    id: string,
    foreground: HexColor,
    background: HexColor,
    minimumContrast: number,
  ) => HexColor;
  measureSurface: (
    id: string,
    foreground: HexColor,
    background: HexColor,
    minimumContrast: number,
  ) => SurfaceContrastDiagnostic;
}

/** Create the canonical Surface policy for selecting and measuring semantic colors. */
export function createSurfaceSemanticPolicy(
  resolved: ResolvedSemanticColors,
  isDark: boolean,
  measurements: SurfaceSemanticMeasurements,
) {
  return new SurfaceSemanticPolicy(resolved, isDark, measurements);
}

class SurfaceSemanticPolicy {
  readonly adjacentSurfaceContexts: readonly ColorContrastContext[];
  readonly textSurfaceContexts: readonly ColorContrastContext[];
  readonly tiePolicy: ColorSwatchTiePolicy;

  constructor(
    private readonly resolved: ResolvedSemanticColors,
    private readonly isDark: boolean,
    private readonly measurements: SurfaceSemanticMeasurements,
  ) {
    this.adjacentSurfaceContexts = this.createSurfaceContexts(SURFACE_COLOR_POLICY.uiContrast);
    this.textSurfaceContexts = this.createSurfaceContexts(SURFACE_COLOR_POLICY.textContrast);
    this.tiePolicy = isDark ? 'lower-step' : 'higher-step';
  }

  buildNeutral(neutralSwatch: ColorSwatch): NeutralSemantics {
    return {
      bg: this.resolved.background,
      bgSubtle: this.resolved.surface,
      surface: this.resolved.surface,
      surfaceHover: this.isDark ? neutralSwatch[800] : neutralSwatch[200],
      surfaceActive: this.isDark ? neutralSwatch[700] : neutralSwatch[300],
      border: this.resolved.border,
      borderStrong: this.isDark ? neutralSwatch[600] : neutralSwatch[300],
      divider: this.resolved.divider,
      text: this.resolved.text,
      textMuted: this.resolved.textMuted,
      textSubtle: this.isDark ? neutralSwatch[300] : neutralSwatch[600],
      disabledBg: this.resolved.disabledBg,
      disabledText: this.resolved.disabledText,
    };
  }

  buildSurface(inverse: HexColor): SurfaceSemantics {
    return {
      default: this.resolved.surface,
      subtle: this.resolved.background,
      raised: this.resolved.surfaceRaised,
      sunken: this.resolved.background,
      overlay: this.resolved.surfaceRaised,
      scrim: '#0000008f',
      disabled: this.resolved.disabledBg,
      inverse,
    };
  }

  measureContent(content: ContentSemantics, surface: SurfaceSemantics): void {
    const pairs = [
      [
        'content.default/background',
        content.default,
        surface.sunken,
        SURFACE_COLOR_POLICY.textContrast,
      ],
      [
        'content.default/surface',
        content.default,
        surface.default,
        SURFACE_COLOR_POLICY.textContrast,
      ],
      ['content.muted/surface', content.muted, surface.default, SURFACE_COLOR_POLICY.textContrast],
      [
        'content.subtle/surface',
        content.subtle,
        surface.default,
        SURFACE_COLOR_POLICY.textContrast,
      ],
      [
        'content.disabled/disabled',
        content.disabled,
        surface.disabled,
        SURFACE_COLOR_POLICY.disabledContrast,
      ],
      [
        'content.inverse/inverse',
        content.inverse,
        surface.inverse,
        SURFACE_COLOR_POLICY.textContrast,
      ],
    ] as const;
    for (const [id, foreground, background, minimumContrast] of pairs) {
      this.measurements.measureForeground(
        id,
        parseHexColorOrThrow(foreground),
        parseHexColorOrThrow(background),
        minimumContrast,
      );
    }
  }

  measureSurfaceSeparation(surface: SurfaceSemantics): SurfaceContrastDiagnostic[] {
    return [
      this.measureSurface('surface.default', surface.default),
      this.measureSurface('surface.raised', surface.raised),
      this.measureSurface('surface.disabled', surface.disabled),
    ];
  }

  neutralTarget(): ColorSelectionTarget {
    return { lightness: this.isDark ? 0.65 : 0.55, chroma: 0.02 };
  }

  roleTarget(): ColorSelectionTarget {
    return { lightness: this.isDark ? 0.65 : 0.5, chroma: 0.15 };
  }

  strongNeutralTarget(): ColorSelectionTarget {
    return { lightness: this.isDark ? 0.8 : 0.4, chroma: 0.02 };
  }

  textTarget(): ColorSelectionTarget {
    return { lightness: this.isDark ? 0.75 : 0.45, chroma: 0.15 };
  }

  private createSurfaceContexts(minimumContrast: number): readonly ColorContrastContext[] {
    return [
      { id: 'background', against: this.resolved.background, minimumContrast },
      { id: 'surface', against: this.resolved.surface, minimumContrast },
    ];
  }

  private measureSurface(id: string, foreground: string): SurfaceContrastDiagnostic {
    return this.measurements.measureSurface(
      id,
      parseHexColorOrThrow(foreground),
      this.resolved.background,
      SURFACE_COLOR_POLICY.surfaceSeparation,
    );
  }
}
