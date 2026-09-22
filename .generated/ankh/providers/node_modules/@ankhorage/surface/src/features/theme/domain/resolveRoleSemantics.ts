import type { ColorSwatch, HexColor } from '@ankhorage/color-theory';

import type { RoleSemantics } from '../../../types/theme';
import { SURFACE_COLOR_POLICY } from '../constants';

interface ResolveRoleSemanticsInput {
  base?: HexColor;
  disabledBg: HexColor;
  disabledText: HexColor;
  hover?: HexColor;
  id: string;
  isDark: boolean;
  measureForeground: (
    id: string,
    foreground: HexColor,
    background: HexColor,
    minimumContrast: number,
  ) => HexColor;
  onSurfaceText: HexColor;
  outline: HexColor;
  selectForeground: (id: string, background: HexColor, minimumContrast: number) => HexColor;
  swatch: ColorSwatch;
}

interface RoleStateColors {
  base: HexColor;
  hover: HexColor;
  softActive: HexColor;
  softBg: HexColor;
  softHover: HexColor;
  strong: HexColor;
}

/** Resolve every filled role state together with its measured foreground. */
export function resolveRoleSemantics({
  base,
  disabledBg,
  disabledText,
  hover,
  id,
  isDark,
  measureForeground,
  onSurfaceText,
  outline,
  selectForeground,
  swatch,
}: ResolveRoleSemanticsInput): RoleSemantics {
  const states = resolveRoleStateColors(swatch, isDark, base, hover);

  return {
    ...states,
    outline,
    onSurfaceText,
    onSolidText: selectForeground(`${id}.base`, states.base, SURFACE_COLOR_POLICY.textContrast),
    onHoverText: selectForeground(`${id}.hover`, states.hover, SURFACE_COLOR_POLICY.textContrast),
    onStrongText: selectForeground(
      `${id}.strong`,
      states.strong,
      SURFACE_COLOR_POLICY.textContrast,
    ),
    onSoftText: selectForeground(`${id}.soft`, states.softBg, SURFACE_COLOR_POLICY.textContrast),
    onSoftHoverText: selectForeground(
      `${id}.softHover`,
      states.softHover,
      SURFACE_COLOR_POLICY.textContrast,
    ),
    onSoftActiveText: selectForeground(
      `${id}.softActive`,
      states.softActive,
      SURFACE_COLOR_POLICY.textContrast,
    ),
    disabledBg,
    onDisabledText: measureForeground(
      `${id}.disabled`,
      disabledText,
      disabledBg,
      SURFACE_COLOR_POLICY.disabledContrast,
    ),
  };
}

function resolveRoleStateColors(
  swatch: ColorSwatch,
  isDark: boolean,
  base?: HexColor,
  hover?: HexColor,
): RoleStateColors {
  return {
    base: base ?? swatch[500],
    hover: hover ?? (isDark ? swatch[400] : swatch[600]),
    strong: isDark ? swatch[300] : swatch[700],
    softBg: isDark ? swatch[900] : swatch[100],
    softHover: isDark ? swatch[800] : swatch[200],
    softActive: isDark ? swatch[700] : swatch[300],
  };
}
