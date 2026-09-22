import type {
  ColorContrastContext,
  ColorSelectionTarget,
  ColorSwatch,
  ColorSwatchTiePolicy,
  HexColor,
} from '@ankhorage/color-theory';
import {
  getContrastRatio,
  getReadableForeground,
  selectColorSwatchStep,
} from '@ankhorage/color-theory';

import type {
  SurfaceColorSelectionDiagnostic,
  SurfaceContrastDiagnostic,
} from '../../../types/theme';

/** Collect deterministic Color Theory evidence while Surface resolves semantic colors. */
export function createSurfaceColorDiagnosticCollector() {
  return new SurfaceColorDiagnosticCollector();
}

class SurfaceColorDiagnosticCollector {
  readonly selections: SurfaceColorSelectionDiagnostic[] = [];
  readonly contrasts: SurfaceContrastDiagnostic[] = [];

  readonly measureForeground = (
    id: string,
    foreground: HexColor,
    background: HexColor,
    minimumContrast: number,
  ): HexColor => {
    const contrast = getContrastRatio(foreground, background);
    this.contrasts.push({
      id,
      foreground,
      background,
      contrast,
      minimumContrast,
      passes: contrast >= minimumContrast,
    });
    return foreground;
  };

  readonly measureSurface = (
    id: string,
    foreground: HexColor,
    background: HexColor,
    minimumContrast: number,
  ): SurfaceContrastDiagnostic => {
    const contrast = getContrastRatio(foreground, background);
    return {
      id,
      foreground,
      background,
      contrast,
      minimumContrast,
      passes: contrast >= minimumContrast,
    };
  };

  readonly selectColor = (
    id: string,
    swatch: ColorSwatch,
    target: ColorSelectionTarget,
    contexts: readonly ColorContrastContext[],
    tiePolicy: ColorSwatchTiePolicy,
  ): HexColor => {
    const result = selectColorSwatchStep(swatch, target, contexts, tiePolicy);
    this.selections.push({ id, result });
    if (!result.selected) {
      throw new Error(`[surface] No '${id}' swatch step satisfies the required contrast.`);
    }
    return result.selected.hex;
  };

  readonly selectForeground = (
    id: string,
    background: HexColor,
    minimumContrast: number,
  ): HexColor => {
    const selected = getReadableForeground(background);
    this.contrasts.push({
      id,
      foreground: selected.foreground,
      background,
      contrast: selected.contrast,
      minimumContrast,
      passes: selected.contrast >= minimumContrast,
    });
    return selected.foreground;
  };
}
