import type { ViewStyle } from 'react-native';

import { resolveResponsive } from '../core/responsive/resolve';
import type { Breakpoint } from '../core/responsive/types';
import { resolveToken } from '../features/theme/utils/resolveToken';
import type { ColorValue, ViewStyleProps } from '../types/layout';
import type { SurfaceTheme } from '../types/theme';
import { resolveSpacing } from './resolveSpacing';

/*** Resolves responsive Surface View style props into one React Native view style. */
export function resolveViewStyles(
  theme: SurfaceTheme,
  breakpoint: Breakpoint,
  props: ViewStyleProps,
): ViewStyle {
  return {
    elevation: 0,
    ...resolveSpacingStyles(theme, breakpoint, props),
    ...resolveVisualStyles(theme, breakpoint, props),
    ...resolveDimensionStyles(theme, breakpoint, props),
    ...resolveLayoutStyles(breakpoint, props),
  };
}

/*** Resolves padding, margin, and gap styles from responsive spacing props. */
function resolveSpacingStyles(
  theme: SurfaceTheme,
  breakpoint: Breakpoint,
  props: ViewStyleProps,
): ViewStyle {
  return {
    padding: resolveSpacing(theme, resolveResponsive(props.p, breakpoint)),
    paddingHorizontal: resolveSpacing(theme, resolveResponsive(props.px, breakpoint)),
    paddingVertical: resolveSpacing(theme, resolveResponsive(props.py, breakpoint)),
    paddingTop: resolveSpacing(theme, resolveResponsive(props.pt, breakpoint)),
    paddingBottom: resolveSpacing(theme, resolveResponsive(props.pb, breakpoint)),
    paddingLeft: resolveSpacing(theme, resolveResponsive(props.pl, breakpoint)),
    paddingRight: resolveSpacing(theme, resolveResponsive(props.pr, breakpoint)),
    margin: resolveSpacing(theme, resolveResponsive(props.m, breakpoint)),
    marginHorizontal: resolveSpacing(theme, resolveResponsive(props.mx, breakpoint)),
    marginVertical: resolveSpacing(theme, resolveResponsive(props.my, breakpoint)),
    marginTop: resolveSpacing(theme, resolveResponsive(props.mt, breakpoint)),
    marginBottom: resolveSpacing(theme, resolveResponsive(props.mb, breakpoint)),
    marginLeft: resolveSpacing(theme, resolveResponsive(props.ml, breakpoint)),
    marginRight: resolveSpacing(theme, resolveResponsive(props.mr, breakpoint)),
    gap: resolveSpacing(theme, resolveResponsive(props.gap, breakpoint)),
    rowGap: resolveSpacing(theme, resolveResponsive(props.rowGap, breakpoint)),
    columnGap: resolveSpacing(theme, resolveResponsive(props.columnGap, breakpoint)),
  };
}

/*** Resolves background, radius, and border styles. */
function resolveVisualStyles(
  theme: SurfaceTheme,
  breakpoint: Breakpoint,
  props: ViewStyleProps,
): ViewStyle {
  return {
    backgroundColor: resolveColor(theme, resolveResponsive(props.bg, breakpoint)),
    borderRadius: resolveRadius(theme, resolveResponsive(props.radius, breakpoint)),
    borderWidth: resolveResponsive(props.borderWidth, breakpoint),
    borderColor: resolveColor(theme, resolveResponsive(props.borderColor, breakpoint)),
  };
}

/*** Resolves responsive dimension props through spacing tokens. */
function resolveDimensionStyles(
  theme: SurfaceTheme,
  breakpoint: Breakpoint,
  props: ViewStyleProps,
): ViewStyle {
  return {
    width: resolveDimension(
      theme,
      resolveResponsive(props.width, breakpoint),
    ) as ViewStyle['width'],
    height: resolveDimension(
      theme,
      resolveResponsive(props.height, breakpoint),
    ) as ViewStyle['height'],
    minWidth: resolveDimension(
      theme,
      resolveResponsive(props.minWidth, breakpoint),
    ) as ViewStyle['minWidth'],
    maxWidth: resolveDimension(
      theme,
      resolveResponsive(props.maxWidth, breakpoint),
    ) as ViewStyle['maxWidth'],
    minHeight: resolveDimension(
      theme,
      resolveResponsive(props.minHeight, breakpoint),
    ) as ViewStyle['minHeight'],
    maxHeight: resolveDimension(
      theme,
      resolveResponsive(props.maxHeight, breakpoint),
    ) as ViewStyle['maxHeight'],
  };
}

/*** Resolves responsive flex, positioning, and visibility styles. */
function resolveLayoutStyles(breakpoint: Breakpoint, props: ViewStyleProps): ViewStyle {
  return {
    flex: resolveResponsive(props.flex, breakpoint),
    flexGrow: resolveResponsive(props.flexGrow, breakpoint),
    flexShrink: resolveResponsive(props.flexShrink, breakpoint),
    flexBasis: resolveResponsive(props.flexBasis, breakpoint) as ViewStyle['flexBasis'],
    flexDirection: resolveResponsive(props.direction, breakpoint),
    alignItems: resolveResponsive(props.align, breakpoint),
    justifyContent: resolveResponsive(props.justify, breakpoint),
    flexWrap: resolveResponsive(props.wrap, breakpoint),
    alignSelf: resolveResponsive(props.alignSelf, breakpoint),
    position: resolveResponsive(props.position, breakpoint),
    top: resolveResponsive(props.top, breakpoint),
    bottom: resolveResponsive(props.bottom, breakpoint),
    left: resolveResponsive(props.left, breakpoint),
    right: resolveResponsive(props.right, breakpoint),
    overflow: resolveResponsive(props.overflow, breakpoint),
    zIndex: resolveResponsive(props.zIndex, breakpoint),
    opacity: resolveResponsive(props.opacity, breakpoint),
  };
}

/*** Resolves a Surface radius token or raw number. */
function resolveRadius(
  theme: SurfaceTheme,
  value: number | keyof SurfaceTheme['radii'] | undefined,
): number | undefined {
  return resolveToken(theme.radii, value);
}

/*** Resolves a Surface color token while preserving arbitrary color strings. */
function resolveColor(theme: SurfaceTheme, value: ColorValue | undefined): string | undefined {
  return resolveToken(theme.colors, value);
}

/*** Resolves spacing-token dimensions while preserving raw dimension strings. */
function resolveDimension(
  theme: SurfaceTheme,
  value: number | string | undefined,
): number | string | undefined {
  return resolveToken(theme.spacing, value);
}
